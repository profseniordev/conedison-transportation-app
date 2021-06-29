import React from 'react';
import '../../Components/Calendars/style.scss';
import { CalendarItem } from './CalendarItem';
import PrevIcon from '../../../Images/chevron-right-13.png';
import NextIcon from '../../../Images/chevron-right-12.png';
import { CalendarType } from './CalendarType';
import { AddWorkerSlideComponent } from './WorkerAdd';
import * as CeIcon from '../../../Utils/Icon';
import { JobItem } from '../../../Models/jobItem';
import { AssignWorker } from '../../../Models';
import moment from 'moment';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { actions } from '../../../Services';
import { toast } from 'react-toastify';

export class JobAssign extends React.Component<any, any> {
  currentDate: Date;
  jobId: number;
  job: JobItem;
  listNameOfDay: Array<string>;
  nameOfDay: string = 'SUN,MON,TUE,WED,THU,FRI,SAT';
  nameOfMonth: string =
    'January,February,March,Aprial,May,June,July,August,Steptember,October,November,December';
  nameOfMonthList: Array<any>;
  action_css = 'calendar-action';

  calendarRows: Array<Array<CalendarItem>>;
  nextMonth: number = 0;
  isToggleModal: boolean;
  showWorkers: boolean;
  showWorkerAdd: boolean;
  showApointJobAdd: boolean;
  showApointJob: boolean;
  selectedDate: CalendarItem;
  workers = this.props.workers;

  static defaultProps = {
    workers: [],
    job: JobItem,
    buttonTitle: 'Edit job',
  };

  state = {
    dayWorkers: [],

    workers: [],
    processing: false,
  };

  closeModal() {
    this.isToggleModal = false;
    this.setState({ change: true });
  }

  componentDidMount = () => {
    this.verifyDate();
  };

  closeSide() {
    this.showWorkers = false;
    this.showApointJobAdd = false;
    this.showApointJob = false;
    this.showWorkerAdd = false;
    this.setState({ change: true });
  }

  onAddRaised(item: any) {
    if (this.props.typeOfCalendar === CalendarType.Worker) {
      this.showApointJobAdd = true;
    } else {
      this.selectedDate = item;
      this.showWorkerAdd = true;
    }
    this.setState({ change: true });
  }

  constructor(props) {
    super(props);
    this.currentDate = new Date();
    this.jobId = this.props.job.id;
    // this.job = jobStore.jobsTemp[this.jobId];
    if (!this.job) {
      this.job = new JobItem();
      this.job.workers = [];
    }
    this.listNameOfDay = this.nameOfDay.split(',');
    this.nameOfMonthList = this.nameOfMonth.split(',');
    this.onChangeMonth(0);
  }

  merge = (workers, _workers) =>
    _workers.reduce((workers, worker) => {
      if (!workers) {
        return [worker];
      }

      if (!worker.id) {
        return [...workers, { ...worker, id: _.uniqueId() }];
      }

      if (workers.some((_worker) => _worker.id === worker.id)) {
        return workers.map((_worker) => {
          if (_worker.id === worker.id) {
            return {
              ..._worker,
              ...worker,
            };
          }
          return _worker;
        });
      }

      return workers;
    }, workers);

  removeWorker = (worker: AssignWorker) => {
    this.job.workers = this.job.workers.filter(
      (_worker) =>
        !(
          (_worker.id === worker.id || worker.id == null) &&
          _worker.startDate === worker.startDate &&
          _worker.startTime === worker.startTime
        )
    );
    this.workers = this.workers.filter(
      (_worker) =>
        !(
          (_worker.id === worker.id || worker.id == null) &&
          _worker.startDate === worker.startDate &&
          _worker.startTime === worker.startTime
        )
    );
    this.props.onAssign(this.workers);
    // jobStore.updateJobItem(this.jobId, this.job);
    this.setState({ change: true });
    this.onChangeMonth(0);
  };

  getWorkersByDate = (date: string | number) => {
    const workers = this.workers.filter((worker) => {
      return moment(worker.startDate).isSame(moment(date, 'YYYYMMDD'), 'D');
    });
    return workers;
  };

  onChangeMonth(month: number) {
    this.calendarRows = [];
    let x = new Date();
    if (month !== 0) {
      x = this.currentDate;
    }
    this.currentDate = new Date(x.getFullYear(), x.getMonth() + month, 1);

    for (let i = 0; i < 6; i++) {
      const calendars = new Array<CalendarItem>();
      let check = false;
      for (let j = 0; j < this.listNameOfDay.length; j++) {
        const firstDayOfMonth = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          1
        );
        const diff = i * 7 + j + 1 - firstDayOfMonth.getDay();
        const cell = new Date(firstDayOfMonth.setDate(diff));
        const id =
          cell.getFullYear() +
          ('0' + (cell.getMonth() + 1)).substr(-2) +
          ('0' + cell.getDate()).substr(-2);
        if (cell.getMonth() === this.currentDate.getMonth())
          calendars.push({
            id,
            date: cell.getDate(),
            workers: this.getWorkersByDate(id),
          } as CalendarItem);
        else {
          if (
            cell.getMonth() > this.currentDate.getMonth() &&
            cell.getFullYear() >= this.currentDate.getFullYear()
          )
            check = true;
          calendars.push({
            disable: true,
          } as CalendarItem);
        }
      }
      this.calendarRows.push(calendars);
      if (check) break;
    }

    this.verifyDate();
  }

  verifyDate = () => {
    this.calendarRows = this.calendarRows.map((week) =>
      week.map((day) => {
        const workers = this.getWorkersByDate(day.id);
        day.workers = [...workers];
        return day;
      })
    );

    this.forceUpdate();
  };

  calendarCellJob() {
    const cells = new Array<any>();
    this.calendarRows.forEach((row, index) => {
      cells.push(
        <div className="calendar-grid-row">
          {row.map((item, index) => {
            if (item.disable)
              return <div className={`calendar-grid-cell `}></div>;

            const date = moment();
            const current = moment(item.id, 'YYYYMMDD');

            const isCurrent = date.isSame(current, 'D') ? 'marked-current' : '';
            const isStart = current.isSame(
              moment(this.props.job.requestTime),
              'D'
            )
              ? 'marked-start'
              : '';
            return (
              <div className={`calendar-grid-cell ${isCurrent} ${isStart}`}>
                {!item.disable && (
                  <>
                    <span className="calendar-cell-title">{item.date}</span>
                    <div className="calendar-cell-worker">
                      {item.workers.length > 0 && (
                        <span
                          className="btn btn-calendar-worker"
                          onClick={(e) => {
                            this.onAddRaised(item);
                          }}
                        >
                          {' '}
                          <span>{item.workers.length} Workers</span>
                        </span>
                      )}
                    </div>
                    {!this.props.isRequestor && (
                      <div className="calendar-cell-action">
                        <span
                          className={this.action_css}
                          onClick={(e) => {
                            this.onAddRaised(item);
                          }}
                        >
                          {' '}
                          <CeIcon.PlusCricleIcon />
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    });

    return cells;
  }

  updateWorkers = (workers) => {
    this.workers = this.merge(this.workers, workers);
    this.props.onAssign(this.workers);
    this.verifyDate();
  };

  save = () => {
    this.setState({ processing: true });
    this.props
      .updateJob(this.props.job.id, {
        workers: JSON.stringify(this.workers),
      })
      .then(() => {
        this.setState({ processing: false });
        toast.info(
          <span
            dangerouslySetInnerHTML={{ __html: 'Schedule was saved' }}
          ></span>
        );
      });
  };

  render() {
    return (
      <div className="ce-assign-worker-screen ce-pd-20">
        <div
          className="ce-calendar ce-calendar-wrapper"
          style={{
            overflowY: 'scroll',
            maxHeight: this.props.total_height - 250,
          }}
        >
          <div className="ce-calendar-header-wrapper">
            <div>
              <span>Assign Worker</span>
            </div>
            <div className="ce-calendar-header d-flex align-items-center mb-3">
              <span
                className="btn btn-today mr-2"
                onClick={() => {
                  this.onChangeMonth(0);
                  this.setState({ change: true });
                }}
              >
                Today
              </span>
              <span
                className="ce-btn mr-3"
                onClick={() => {
                  this.onChangeMonth(-1);
                  this.setState({ change: true });
                }}
              >
                <img src={PrevIcon} alt="" />
              </span>

              {`${
                this.nameOfMonthList[this.currentDate.getMonth()]
              } ${this.currentDate.getFullYear()}`}

              <span
                className="ce-btn ml-3"
                onClick={() => {
                  this.onChangeMonth(1);
                  this.setState({ change: true });
                }}
              >
                <img src={NextIcon} alt="" />
              </span>
              {!this.props.isRequestor && (
                <div className="ce-flex-right">
                  <button
                    className={`btn btn-success assign-work-save cursor-pointer`}
                    onClick={this.save}
                    disabled={this.state.processing}
                    style={{ width: 170, marginLeft: 20, marginTop: 0 }}
                  >
                    {this.state.processing ? 'Loading' : this.props.buttonTitle}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="ce-calendar-content">
            <div className="calendar-grid-row">
              {this.listNameOfDay.map((item, index) => (
                <div className="calendar-grid-header-cell">
                  <label>{item}</label>
                </div>
              ))}
            </div>
            <div className="calendar-grid">{this.calendarCellJob()}</div>
          </div>

          <AddWorkerSlideComponent
            showed={this.showWorkerAdd}
            selectedDate={this.selectedDate}
            updateWorkers={this.updateWorkers}
            removeWorker={this.removeWorker}
            getWorkers={this.getWorkersByDate}
            closeSlide={() => this.closeSide()}
            locations={this.props.job.locations}
            job={this.props.job}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isRequestor: false, //state.app.user ? [1].some((r) => state.app.user.roles.includes(r)) : false,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateJob: (job_id, data) =>
      dispatch(actions.JobsActions.updateJob(job_id, data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobAssign);
