import React from 'react';
import { AssignWorker } from '../../../Models';
import { LocationItem } from '../../../Models/locationItem';
import * as CeIcon from '../../../Utils/Icon';
import { AssignWorkersValidation } from '../../Workers/WorkerValidation';
import { CalendarItem } from '../../Components/Calendars/CalendarItem';
import './addworkerslide.scss';
import { observer } from 'mobx-react';
import { JobListItem } from '../../../Models/jobListItem';
import AddWorkerItem from './AddWorkerItem';

interface Props {
  showed: boolean;
  closeSlide: Function;
  selectedDate?: CalendarItem;
  getWorkers?: Function;
  updateWorkers?: Function;
  removeWorker?: Function;
  locations?: Array<LocationItem>;
  job?: JobListItem;
}

@observer
export class AddWorkerSlideComponent extends React.Component<Props> {
  state = {
    workers: [],
    errors: null,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.showed !== nextProps.showed) {
      if (nextProps.showed) {
        let workers = [];
        if (nextProps.selectedDate && nextProps.selectedDate.workers.length) {
          workers = [...nextProps.selectedDate.workers];
        } else {
          workers.push(
            new AssignWorker({
              endDate: nextProps.job.endTime
                ? new Date(nextProps.job.endTime)
                : null,
            })
          );
        }
        this.setState({ workers: workers });
      }
    }
  }

  removeWorker = (index: number) => {
    const { workers } = this.state;
    const _workers = workers.filter((worker, id) => id !== index);
    this.setState({ workers: _workers });
    this.props.removeWorker(workers[index]);
  };

  transformErrors = (errors) => {
    if (!errors || !errors.inner) return {};
    return errors.inner.reduce((errors: any, error) => {
      errors[error.path] = error.message;
      return errors;
    }, {});
  };

  save = async () => {
    const { workers } = this.state;
    try {
      await AssignWorkersValidation.validate(workers, {
        abortEarly: false,
      });
      this.setState({ errors: null });
      if (this.props.updateWorkers) {
        const _workers = workers.map((worker: any) => {
          return {
            ...worker,
            workerId: worker.id,
          };
        });
        this.props.updateWorkers(_workers);
        this.props.closeSlide();
      }
    } catch (error) {
      this.setState({ errors: this.transformErrors(error) });
    }
  };

  addNewWorker = () => {
    const { job } = this.props;
    const workers = [
      ...this.state.workers,
      new AssignWorker({
        endDate: job.endTime ? new Date(job.endTime) : null,
      }),
    ];
    this.setState({ workers: workers });
  };

  handleChangeField = (index, name, value) => {
    let { workers } = this.state;
    workers[index] = {
      ...workers[index],
      [name]: value,
    };
    this.setState({ workers: workers });
  };

  public render() {
    const { job, showed, selectedDate } = this.props;
    const { workers, errors } = this.state;

    return (
      <div className={`slide-container ${this.props.showed ? 'showed' : ''}`}>
        <div className="slide-content">
          <div className="slide-header d-flex align-items-center justify-content-between">
            <div className="slide-title">Add worker</div>
            <div className="cursor-pointer p-1">
              <CeIcon.Close
                onClick={() => {
                  this.props.closeSlide();
                }}
              />
            </div>
          </div>
          <div className="slide-body">
            {showed &&
              selectedDate &&
              workers.map((assignWorker, index) => (
                <AddWorkerItem
                  assignWorker={assignWorker}
                  index={index}
                  lastIndex={index === workers.length - 1}
                  removeWorker={this.removeWorker}
                  handleChangeField={this.handleChangeField}
                  selectedDate={selectedDate}
                  job={job}
                  errors={errors}
                />
              ))}

            <div className="worker-action">
              <div className="ce-assign-worker-record">
                <span
                  className="btn ce-btn-confirm cursor-pointer"
                  onClick={this.addNewWorker}
                >
                  <span>Add Another Worker</span>
                </span>
              </div>
              <div className="ce-assign-worker-record">
                <button
                  className="btn ce-btn-success cursor-pointer"
                  type={'button'}
                  onClick={this.save}
                >
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
