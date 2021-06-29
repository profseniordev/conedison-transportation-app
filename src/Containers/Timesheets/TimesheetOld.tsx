import React from 'react';
import { PagingComponent } from '../Components';
//import {actions, userService} from '../../Services';
import { actions } from '../../Services';
import InvoicIcon from '../../Images/icon_Invoices.png';
import FileDownloadIcon from '../../Images/file-download-solid.png';
import CETSearchInput from '../Components/Controls/SearchInput.Component';
import { observer } from 'mobx-react';
import { formatDate, FORMATES } from '../../Utils/Date';
import { JOB_STATUSES } from '../../Constants/job';
import {
  PAID_STATUSES,
  PAID_ONLY_STATUSES,
  VERIFIED_STATUSES,
} from '../../Constants/timesheet';
import Select from 'react-select';
import { WorkerAsyncSearch } from '../Components/Controls/WorkerAsyncSearch';
import authStore from '../../Stores/authStore';
import { timesheetAPI } from '../../Services/API';
import './Timesheet.scss';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import { TextField } from '@material-ui/core';

const statuses = [
  {
    value: JOB_STATUSES.New,
    label: JOB_STATUSES[JOB_STATUSES.New],
  },
  {
    value: JOB_STATUSES.InProgress,
    label: JOB_STATUSES[JOB_STATUSES.InProgress],
  },
  {
    value: JOB_STATUSES.Completed,
    label: JOB_STATUSES[JOB_STATUSES.Completed],
  },
  {
    value: JOB_STATUSES.Billed,
    label: JOB_STATUSES[JOB_STATUSES.Billed],
  },
  {
    value: JOB_STATUSES.Cancelled,
    label: JOB_STATUSES[JOB_STATUSES.Cancelled],
  },
  {
    value: JOB_STATUSES.Paid,
    label: JOB_STATUSES[JOB_STATUSES.Paid],
  },
];

@observer
class Timesheets extends React.Component<any, any> {
  divElement = null;
  isToggleModal: boolean;
  details = {} as any;
  state = {
    searchParams: {
      startDate: null,
      finishDate: null,
    },
    selected: [],
    withSearch: true,
    total_height: 0,
    page: 1,
  };

  showModal() {
    this.isToggleModal = true;
    this.setState({ change: true });
  }
  closeModal() {
    this.isToggleModal = false;
    this.setState({ change: true });
  }

  handleChangeField(name) {
    return (event) => {
      const {
        currentTarget: { value },
      } = event;
      return this.props.setFieldValue(name, value);
    };
  }

  handleChangePaidStatus = (event) => {
    this.setState(
      (state: any) => ({
        searchParams: {
          ...state.searchParams,
          paidStatus: event ? event.map((e) => e.value) : [],
        },
      }),
      this.loadTimesheetsWithDelay
    );
  };

  renderPaidTypes = (item) => {
    return (
      <div>
        {item.paid ? (
          <span className="badge badge-secondary p-2 mr-2 mt-1">Paid</span>
        ) : null}
        {item.workerPaid ? (
          <span className="badge badge-secondary p-2 mr-2 mt-1">
            Worker Paid
          </span>
        ) : null}
        {item.invoiced ? (
          <span className="badge badge-secondary p-2 mr-2 mt-1">Invoiced</span>
        ) : null}
      </div>
    );
  };

  renderVerifiedStatus = (item) => {
    return (
      <div>
        {item.isVerified ? (
          <span className="badge badge-secondary p-2 mr-2 mt-1">Verified</span>
        ) : (
          <span className="badge badge-secondary p-2 mr-2 mt-1">
            Unverified
          </span>
        )}
      </div>
    );
  };

  handleDateTimeChange = (name, date) => {
    this.props.updateFilters({
      [name]: date,
    });
    this.setState(
      (state: any) => ({
        searchParams: {
          ...state.searchParams,
          [name]: date,
        },
      }),
      this.loadTimesheetsWithDelay
      //this.props.updateFilters(this.state.searchParams)
    );
  };

  handleChangeSelectSearchParams = (name) => {
    return (item) => {
      this.setState(
        (state: any) => ({
          searchParams: {
            ...state.searchParams,
            [name]: item ? item.value : '',
          },
        }),
        this.loadTimesheetsWithDelay
        //this.props.updateFilters(this.state.searchParams)
      );
    };
  };

  handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    //alert(value);
    this.setState(
      (state: any) => ({
        searchParams: { ...state.searchParams, [name]: value },
      }),
      this.loadTimesheetsWithDelay
      //this.props.updateFilters(this.state.searchParams)
    );
  };

  loadTimesheetsWithDelay = (type: string = null) => {
    // Set page 1 if starting search
    if (!type) {
      const { searchParams } = this.state;
      if ('page' in searchParams) {
        this.setState((prevState) => ({
          searchParams: {
            // object that we want to update
            ...prevState.searchParams, // keep all other key-value pairs
            page: 1, // update the value of specific key
          },
        }));
      }
    }
    this.props.updateFilters(this.state.searchParams);
    //if (this.timer) clearTimeout(this.timer);
    // this.timer = setTimeout(this.loadTimesheets, 700);
  };

  componentDidMount = () => {
    const total_height = this.divElement.clientHeight;
    this.setState({ total_height });
    // if (this.props.match.params.id)
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    if (jobId) {
      this.props.updateFilters({
        jobId,
        page: 1,
      });
    } else {
      this.props.retrieve();
      //console.log('componentDidMount', this.props.timesheets)
    }
    //this.setState({loading: false});
  };

  // loadTimesheets = (params: any = this.state.searchParams) => {
  //   mainStore.loadTimeSheets(params);
  // };

  onPaginationChange = (page: number) => {
    this.setState({ loading: true });
    this.setState(
      (state: any) => ({
        searchParams: { ...state.searchParams, page: page },
      }),
      this.loadTimesheetsWithDelay
      //this.props.updateFilters(this.state.searchParams)
    );
    //this.props.updateFilters({page});
    //this.props.dispatch(actions.TimesheetsActions.loadExactPage({page: page}));
  };

  handleSubmit = (...props) => {
    this.props.handleSubmit(...props);
    this.closeModal();
  };

  downloadPdf = async (id: string) => {
    const response = await timesheetAPI.downloadPdf(id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'timesheet.pdf');
    document.body.appendChild(link);
    link.click();
  };

  render() {
    const timesheets = this.props.timesheets.results;
    const table_height = this.state.total_height;
    const thNoBorderLeft = {
      borderLeft: 'none',
      width: '40px',
    };
    const thNoBorderRight = {
      borderRight: 'none',
    };
    const actionStyle = {
      display: 'flex',
    };
    const but = {
      border: '1px solid #dee2e6',
      backgroundColor: 'white',
      float: 'right',
    };
    return (
      <div
        className="container-fluid timesheet-list-page"
        ref={(divElement) => {
          this.divElement = divElement;
        }}
      >
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">Timesheets</div>
          <div className="row w-100 ml-5 justify-content-end">
            <div className="mt-1 mx-3" style={{ width: 225 }}>
              <Select
                isClearable
                options={VERIFIED_STATUSES}
                placeholder={'Verified Status'}
                onChange={(item) =>
                  this.handleChangeSearchParams({
                    target: {
                      name: 'verifiedStatus',
                      value: item ? item.value : null,
                    },
                  })
                }
                bl
              />
            </div>
            <div className="mt-1 mx-3" style={{ width: 193 }}>
              <Select
                isClearable
                options={PAID_ONLY_STATUSES}
                placeholder={'Paid Status'}
                onChange={this.handleChangeSelectSearchParams('paidOnlyStatus')}
              />
            </div>

            <div className="mt-1 mx-3" style={{ width: 170 }}>
              <Select
                isClearable
                options={statuses}
                placeholder={'Job Status'}
                onChange={this.handleChangeSelectSearchParams('jobStatus')}
              />
            </div>
            <div className="col-auto mt-sm-1 mt-md-0">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.props.history.push(`/timesheets/create`)}
              >
                Create Timesheet
              </button>
            </div>
          </div>
        </div>
        {this.props.loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 4 }}></div>
        )}
        <div
          className="table-invoices"
          style={{
            overflowY: 'scroll',
            maxHeight: `${table_height}px`,
            overflowX: 'hidden',
          }}
        >
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                {/* <th className="th-search">
                  <CheckboxComponent
                    onChange={this.toggleAll}
                    className="mb-0"
                    checked={
                      this.state.selected.length === mainStore.timesheets.length
                    }
                    id="all"
                    classNameIcon="m-auto"
                  />
                </th> */}
                <th className="th-search">
                  <span></span>
                  {this.state.withSearch ? (
                    <div className="customDatePickerWidth">
                      <TextField
                        label="Start Date/Time"
                        type="datetime-local"
                        variant={'outlined'}
                        value={this.state.searchParams.startDate}
                        onChange={(date) =>
                          this.handleDateTimeChange(
                            'startDate',
                            date.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                  ) : null}
                </th>
                <th className="th-search">
                  {this.state.withSearch ? (
                    <div className="customDatePickerWidth">
                      <TextField
                        label="Finish Date/Time"
                        type="datetime-local"
                        variant={'outlined'}
                        value={this.state.searchParams.finishDate}
                        onChange={(date) =>
                          this.handleDateTimeChange(
                            'finishDate',
                            date.target.value
                          )
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                  ) : null}
                </th>
                <th className="th-search" style={{ width: 72 }}>
                  <span>Total Hours</span>
                  {this.state.withSearch ? (
                    <CETSearchInput
                      name="totalHours"
                      onChange={this.handleChangeSearchParams}
                    />
                  ) : null}
                </th>
                <th className="th-search">
                  <span>Subcontractor</span>
                  {this.state.withSearch ? (
                    <CETSearchInput
                      name="subcontractorName"
                      onChange={this.handleChangeSearchParams}
                    />
                  ) : null}
                </th>
                <th className="th-search" style={{ minWidth: 170 }}>
                  <span>Worker</span>
                  {this.state.withSearch ? (
                    <div style={{ marginTop: 13 }}>
                      <WorkerAsyncSearch
                        searchParams={{ onlyTimesheetRelated: true }}
                        onSelect={(item) =>
                          this.handleChangeSearchParams({
                            target: {
                              name: 'worker',
                              value: item ? item.value.id : null,
                            },
                          })
                        }
                      />
                    </div>
                  ) : null}
                </th>
                <th className="th-search">
                  <span>Confirmation #</span>
                  {this.state.withSearch ? (
                    <CETSearchInput
                      name="confirmation"
                      onChange={this.handleChangeSearchParams}
                    />
                  ) : null}
                </th>
                <th className="th-search">
                  <span>PO #</span>
                  {this.state.withSearch ? (
                    <div style={{ width: 73 }}>
                      <CETSearchInput
                        name="po"
                        onChange={this.handleChangeSearchParams}
                      />
                    </div>
                  ) : null}
                </th>
                <th className="th-search" style={{ minWidth: 220 }}>
                  <span>Paid Status</span>
                  {this.state.withSearch ? (
                    <div style={{ marginTop: 13 }}>
                      <Select
                        isClearable
                        isMulti
                        options={PAID_STATUSES}
                        placeholder={'Paid Status'}
                        onChange={this.handleChangePaidStatus}
                      />
                    </div>
                  ) : null}
                </th>
                <th>Verified Status</th>
                {/* <th className="th-search">
                  <span>Straight Hours</span>
                  {this.state.withSearch ? (
                    <CETSearchInput
                      name="straight_hr"
                      onChange={this.handleChangeSearchParams}
                    />
                  ) : null}
                </th>
                <th className="th-search">
                  <span>OverTime Hours</span>
                  {this.state.withSearch ? (
                    <CETSearchInput
                      name="overtime_hr"
                      onChange={this.handleChangeSearchParams}
                    />
                  ) : null}
                </th> */}
                <th
                  style={{ ...thNoBorderRight, width: 80 }}
                  className="th-search"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
            // style={
            //   !Array.isArray(mainStore.timesheets) ||
            //   !mainStore.timesheets.length
            //     ? { minHeight: 100, display: 'flex' }
            //     : {}
            // }
            >
              {Array.isArray(timesheets) &&
                timesheets.map((item, index) => (
                  <tr
                    className="cursor-pointer"
                    onClick={() =>
                      this.props.history.push(`/timesheets/${item.id}/edit`)
                    }
                    key={`timesheet${index}`}
                  >
                    {/* <td>
                      <CheckboxComponent
                        onChange={() => this.toggleTimesheet(item.id)}
                        className="mb-0"
                        checked={this.state.selected.includes(item.id)}
                        id={`item${index}`}
                        classNameIcon="m-auto"
                      />
                    </td> */}
                    <td>{formatDate(item.startDate, FORMATES.datetime)}</td>
                    <td>{formatDate(item.finishDate, FORMATES.datetime)}</td>
                    <td>{item.totalHours}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        {item.subcontractor ? item.subcontractorName : ''}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-worker mr-3">
                          <img
                            alt="avatar"
                            className="avatar"
                            src={item.worker_avatar}
                          />
                        </div>{' '}
                        {item.worker_name}
                      </div>
                    </td>
                    <td>{item.confirmationNumber}</td>
                    <td>{item.po}</td>
                    <td>{this.renderPaidTypes(item)}</td>
                    <td>{this.renderVerifiedStatus(item)}</td>
                    <td style={thNoBorderRight}>
                      <div className="ce-align-flex">
                        <div className="d-flex">
                          <div>
                            <img
                              className="mr-3 pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                this.downloadPdf(item.id);
                              }}
                              src={FileDownloadIcon}
                              alt=""
                            />
                          </div>
                          <div>
                            {authStore.canDoTimesheetAction() && (
                              <a href="/invoices?create=true">
                                <img
                                  src={InvoicIcon}
                                  alt=""
                                  style={{ cursor: 'pointer' }}
                                />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-invoices">
          <PagingComponent
            totalItemsCount={this.props.timesheets.total}
            onChangePage={this.onPaginationChange}
            itemsCountPerPage={this.props.timesheets.per_page}
            pageRangeDisplayed={10}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    timesheets: state.timesheets.timesheets,
    loading: state.timesheets.processing,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    retrieve: () => dispatch(actions.TimesheetsActions.retrieve()),
    updateFilters: (search_options) =>
      dispatch(actions.TimesheetsActions.updateFilters(search_options)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Timesheets);
