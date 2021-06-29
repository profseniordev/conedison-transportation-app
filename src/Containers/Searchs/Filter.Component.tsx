import * as React from 'react';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Divider, withStyles } from '@material-ui/core';
import DatePicker from '../../components/Picker/DatePicker';
import './style.scss';
import CETSearchRadiusComponent from '../Components/Controls/SearchRadius.Component';
import CETextInputComponent from '../Components/Controls/TextInput.Component';
import { JOB_STATUSES, JobType } from '../../Constants/job';
import search from '../../Images/search.png';
import './searchstyle.scss';
import * as CeIcon from '../../Utils/Icon';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import LocationsAsyncSearch from '../Components/Controls/LocationsAsyncSearch';
import MunicipalitiesAsyncSearch from '../Components/Controls/MunicipalitiesAsyncSearch';
import { SupervisorsAsyncSearch } from '../Components/Controls/SupervisorsAsyncSearch';
import { WorkerAsyncSearch } from '../Components/Controls/WorkerAsyncSearch';
import { RequestorAsyncSearch } from '../Components/Controls/RequestorAsyncSearch';
import { actions } from '../../Services';
import { MUNICIPALITY } from '../../Constants/job';

interface Props {
  hasJobType?: boolean;
  hasJobStatus?: boolean;
  hasRequestDate?: boolean;
  hasDepartment?: boolean;
  hasRequestor?: boolean;
  hasWorker?: boolean;
  hasAddress?: boolean;
  hasFieldSupervisor?: boolean;
  hasBorough?: boolean;
  hasNumber?: boolean;
  hasFilter?: boolean;
  hasSort?: boolean;
  showFilter?: boolean;
  showSearch?: boolean;
  onFilter?: Function;
  onFilterPress?: (event) => void;
  search: (params: any) => void;
  onFilterByLocation?: (location, radius, radiusType) => void;
  updateTimesheetsFilter?: (value) => void;
}
const initialSearch = {
  jobType: [],
  jobStatus: [0, 1],
  schedules_needed: null,
  late_workers: null,
  unassigned: null,
  requestDate: {
    from: null,
    to: null,
  },
  location: null,
  municipality: null,
  requestor: null,
  supervisor: null,
  department: null,
  worker: null,
  search: null,
  radius: '',
  radiusType: null,
  structure: '',
  purchase: '',
  worker_number: '',
  page: 0,
};

const styles = (theme) => ({
  formControlLabel: {
    marginBottom: 0,
    '& .PrivateSwitchBase-root-2': {
      padding: 5,
    },
    '& .MuiCheckbox-colorSecondary.Mui-checked': {
      color: '#0099d8',
    },
  },
});

export class FilterComponent extends React.Component<any> {
  state: any;
  constructor(props) {
    super(props);
    this.state = {
      supervisor: null,
      search: { ...initialSearch },
      initSearch: true,
      showSort: false,
      showFilter: props.showFilter,
      showSearch: props.showSearch
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.initSearch) {
      return {
        search: { ...initialSearch, ...props.search_options },
        initSearch: false,
      };
    }
    return null;
  }

  toggleFilterView = () => {
    this.setState((state: any) => ({ showFilter: !state.showFilter }));
  };

  clearFilters = () => {
    this.setState({
      search: { ...initialSearch },
      supervisor: null,
    });
    this.onFilterChanged({ ...initialSearch });
    this.forceUpdate();
  };

  onFilterChanged = (filters?: any) => {
    if (filters) {
      this.props.search(filters);
      this.props.onFilter()
    } else {
      this.props.search(this.state.search);
      this.props.onFilter()
    }
  };

  handleResetJobType = () => {
    if (this.state.search.jobType.length > 0) {
      this.setState(
        (state: any) => ({
          search: {
            ...state.search,
            jobType: [],
          },
        }),
        this.onFilterChanged
      );
    } else {
      this.setState(
        (state: any) => ({
          search: {
            ...state.search,
            jobType: [JobType.Parking, JobType.Flagging, JobType.Signage],
          },
        }),
        this.onFilterChanged
      );
    }
  };

  handleChangeJobType = (name) => (event) => {
    const checked = event.target.checked;
    if (name === 'all') {
      this.setState(
        (state: any) => ({
          search: {
            ...state.search,
            jobType: checked
              ? [JobType.Parking, JobType.Flagging, JobType.Signage]
              : [],
          },
        }),
        this.onFilterChanged
      );
      return;
    }
    this.setState(
      (state: any) => ({
        search: {
          ...state.search,
          jobType: checked
            ? [...state.search.jobType, name]
            : state.search.jobType.filter((type) => type !== name),
        },
      }),
      this.onFilterChanged
    );
  };

  handleResetJobStatus = () => {
    if (this.state.search.jobStatus.length > 0) {
      this.setState(
        (state: any) => ({
          search: {
            ...state.search,
            jobStatus: [],
          },
        }),
        this.onFilterChanged
      );
    } else {
      this.setState(
        (state: any) => ({
          search: {
            ...state.search,
            jobStatus: [
              JOB_STATUSES.New,
              JOB_STATUSES.InProgress,
              JOB_STATUSES.Completed,
              JOB_STATUSES.Billed,
              JOB_STATUSES.Paid,
              JOB_STATUSES.Cancelled,
              JOB_STATUSES.CancelledBillable,
            ],
          },
        }),
        this.onFilterChanged
      );
    }
  };

  handleChangeJobStatus = (name) => (event) => {
    const checked = event.target.checked;
    if (name === 'all') {
      this.setState(
        (state: any) => ({
          search: {
            ...state.search,
            jobStatus: checked
              ? [
                  JOB_STATUSES.New,
                  JOB_STATUSES.InProgress,
                  JOB_STATUSES.Completed,
                  JOB_STATUSES.Billed,
                  JOB_STATUSES.Paid,
                  JOB_STATUSES.Cancelled,
                  JOB_STATUSES.CancelledBillable,
                ]
              : [],
          },
        }),
        this.onFilterChanged
      );
      return;
    }

    this.setState(
      (state: any) => ({
        search: {
          ...state.search,
          jobStatus: checked
            ? [...state.search.jobStatus, name]
            : state.search.jobStatus.filter((type) => type !== name),
        },
      }),
      this.onFilterChanged
    );
  };

  handleChangeFilter = (name, value, fields = {}) => {
    this.setState(
      (state: any) => ({
        search: {
          ...state.search,
          [name]: value,
          ...fields,
        },
      }),
      () => {
        if (name === 'location' || name === 'radius' || name === 'radiusType') {
          if (
            this.state.search.location &&
            this.state.search.radius &&
            !isNaN(Number(this.state.search.radius)) &&
            this.state.search.radiusType
          ) {
            if (this.props.onFilterByLocation) {
              this.props.onFilterByLocation(
                this.state.search.location,
                Number(this.state.search.radius),
                this.state.search.radiusType
              );
            } else {
              this.props.onFilterByLocation(null, null, null);
            }
          }
        } else {
          this.onFilterChanged();
        }
      }
    );
  };

  handleChangeInput = (event) => {
    const {
      currentTarget: { name, value },
    } = event;
    this.handleChangeFilter(name, value);
  };

  onKeyUpSearch = (event) => {
    if (event.keyCode === 13) {
      const {
        currentTarget: { name, value },
      } = event;
      this.handleChangeFilter(name, value);
    }
  };

  renderHeader = () => {
    return (
      <div className="left-item search-box__wrapper">
        <div className="left-item-body d-flex">
          <div className="form-control-search mr-2 w-100">
            <img src={search} alt="" />
            <input
              className="ce-form-control "
              placeholder="Search"
              name="search"
              onChange={(e) => this.handleChangeInput(e)}
              value={this.state.search.search ? this.state.search.search : ''}
              onBlur={this.handleChangeInput}
              onKeyUp={this.onKeyUpSearch}
            />
          </div>

          <div className="btn-group">
            {this.props.hasFilter ? (
              <Tooltip title="Filter" aria-label="filter" arrow>
                <button
                  onClick={this.toggleFilterView}
                  className={`btn border d-flex align-items-center p-relative ${
                    this.state.showFilter ? 'sort-active' : ''
                  }`}
                  type="button"
                >
                  {this.state.showFilter ? (
                    <CeIcon.FilterWhiteIcon />
                  ) : (
                    <CeIcon.FilterIcon />
                  )}
                </button>
              </Tooltip>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  renderBody = () => {
    const { classes } = this.props;

    return (
      <div className="filter-box" style={{overflowX: 'hidden'}}>
        <div className="left-item">
          <div className="filter-box__wrapper job-type mb-2">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="filter-box__label">Job Type</span>
              <span
                onClick={this.handleResetJobType}
                style={{
                  cursor: 'pointer',
                  color: '#2F80ED',
                  borderBottom: '1px solid #2F80ED',
                  fontSize: 12,
                }}
              >
                {this.state.search.jobType.length
                  ? 'Reset Selected'
                  : 'Select All'}
              </span>
            </div>
            <div className="left-item-body">
              {/* <FormControlLabel
                className={classes.formControlLabel}
                control={
                  <Checkbox
                    name="all"
                    checked={this.state.search.jobType.length === 3}
                    onChange={this.handleChangeJobType('all')}
                  />
                }
                label="All"
              /> */}

              <div className="filter-box__checkboxes-group">
                <FormGroup>
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={
                      <Checkbox
                        checked={this.state.search.jobType.includes(
                          JobType.Parking
                        )}
                        onChange={this.handleChangeJobType(JobType.Parking)}
                        name="parking"
                      />
                    }
                    label="Parking"
                  />
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={
                      <Checkbox
                        checked={this.state.search.jobType.includes(
                          JobType.Flagging
                        )}
                        onChange={this.handleChangeJobType(JobType.Flagging)}
                        name="flagging"
                      />
                    }
                    label="Flagging"
                  />
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={
                      <Checkbox
                        checked={this.state.search.jobType.includes(
                          JobType.Signage
                        )}
                        onChange={this.handleChangeJobType(JobType.Signage)}
                        name="signage"
                      />
                    }
                    label="Signage"
                  />
                </FormGroup>
              </div>
            </div>
          </div>
          <Divider />

          {this.props.hasJobStatus && (
            <div className="filter-box__wrapper job-status">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="filter-box__label">Job Status</span>
                <span
                  onClick={this.handleResetJobStatus}
                  style={{
                    cursor: 'pointer',
                    color: '#2F80ED',
                    borderBottom: '1px solid #2F80ED',
                    fontSize: 12,
                  }}
                >
                  {this.state.search.jobStatus.length
                    ? 'Reset Selected'
                    : 'Select All'}
                </span>
              </div>
              <div className="left-item-body">
                {/* <div className="header ">
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={
                      <Checkbox
                        name="all"
                        checked={this.state.search.jobStatus.length === 6}
                        onChange={this.handleChangeJobStatus('all')}
                      />
                    }
                    label="All"
                  />
                </div> */}
                <div className="filter-box__checkboxes-group">
                  <div className=" ">
                    <FormGroup>
                      <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                          <Checkbox
                            checked={this.state.search.jobStatus.includes(
                              JOB_STATUSES.New
                            )}
                            onChange={this.handleChangeJobStatus(
                              JOB_STATUSES.New
                            )}
                            name="new"
                          />
                        }
                        label="New"
                      />
                      <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                          <Checkbox
                            checked={this.state.search.jobStatus.includes(
                              JOB_STATUSES.InProgress
                            )}
                            onChange={this.handleChangeJobStatus(
                              JOB_STATUSES.InProgress
                            )}
                            name="inprogress"
                          />
                        }
                        label="InProgress"
                      />
                      <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                          <Checkbox
                            checked={this.state.search.jobStatus.includes(
                              JOB_STATUSES.Completed
                            )}
                            onChange={this.handleChangeJobStatus(
                              JOB_STATUSES.Completed
                            )}
                            name="completed"
                          />
                        }
                        label="Completed"
                      />
                      <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                          <Checkbox
                            checked={this.state.search.jobStatus.includes(
                              JOB_STATUSES.Cancelled
                            )}
                            onChange={this.handleChangeJobStatus(
                              JOB_STATUSES.Cancelled
                            )}
                            name="cancelledJobs"
                          />
                        }
                        label="Cancelled"
                      />
                    <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                          <Checkbox
                            checked={this.state.search.jobStatus.includes(
                              JOB_STATUSES.CancelledBillable
                            )}
                            onChange={this.handleChangeJobStatus(
                              JOB_STATUSES.CancelledBillable
                            )}
                            name="cancelledBillable"
                          />
                        }
                        label="Cancelled Billable"
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Divider />

          {this.props.hasRequestDate && (
            <div className="filter-box__wrapper request-date">
              <div className="left-item-header">
                <span className="filter-box__label_small">Request Date</span>
              </div>
              <div className="left-item-body d-flex my-2">
                <div className="request-date-content" style={{position: 'relative'}}>
                  <DatePicker
                  numberMonth={this.props.numberMonth}
                    updated={(date) => {
                      this.handleChangeFilter('requestDate', {
                        // ...this.state.search.requestDate,
                        from: date.from_datetime,
                        to: date.to_datetime,
                      });
                    }}
                    from_datetime={this.state.search.requestDate.from}
                    to_datetime={this.state.search.requestDate.to}
                  />
                </div>
              </div>
            </div>
          )}
          <Divider />

          {this.props.hasDepartment && (
            <div className="filter-box__wrapper">
              <div className="left-item-header">
                <span className="filter-box__label_small">Department</span>
              </div>
              <div>
                <DepartmentAsyncSearch
                  current_value={
                    this.state.search.department
                      ? {
                          label: this.state.search.department.name,
                          value: this.state.search.department,
                        }
                      : ''
                  }
                  onSelect={(item) =>
                    this.handleChangeFilter(
                      'department',
                      item ? item.value : null
                      // item ? Number(item.value.id) : null
                    )
                  }
                />
              </div>
            </div>
          )}
          {this.props.hasRequestor && (
            <div className="filter-box__wrapper">
              <div className="left-item-header ">
                <span className="filter-box__label_small">Requester</span>
              </div>
              <div>
                <RequestorAsyncSearch
                  isClearable
                  current_value={
                    this.state.search.requestor
                      ? {
                          label: this.state.search.requestor.name,
                          value: this.state.search.requestor,
                        }
                      : ''
                  }
                  onSelect={(item) => {
                    this.handleChangeFilter(
                      'requestor',
                      item ? item.value : null
                      // item ? item.value.id : null
                    );
                  }}
                />
              </div>
            </div>
          )}
            <div className="filter-box__wrapper">
              <div className="left-item-header ">
                <span className="filter-box__label_small">Supervisor</span>
              </div>
              <div>
                <SupervisorsAsyncSearch
                  isClearable
                  current_value={
                    this.state.supervisor
                      ? {
                          label: this.state.supervisor.name,
                          value: this.state.supervisor,
                        }
                      : null
                  }
                  onSelect={(item) => {
                    this.handleChangeFilter(
                      'supervisor',
                      //item ? item.value : null
                       item ? item.value.id : null
                    );
                    this.setState({supervisor: item ? item.value : null})
                  }}
                />
              </div>
            </div>
          {this.props.hasFieldSupervisor && (
            <div className="filter-box__wrapper field-supervisor">
              <div className="left-item-header">
                <span className="filter-box__label_small">
                  Field Supervisor
                </span>
              </div>
              <div className="left-item-body">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.search.field_supervisor}
                      onChange={(event) =>{
                        this.handleChangeFilter(
                          'field_supervisor',
                          event.target.checked
                        );
                        this.props.updateTimesheetsFilter({
                         
                         'field_supervisor': event.target.checked
                       
                        });
                      }}
                      name="unassigned"
                    />
                  }
                  label="View All Dept Jobs"
                />
              </div>
            </div>
          )}
          {this.props.hasWorker && (
            <div className="filter-box__wrapper">
              <div className="left-item-header">
                <span className="filter-box__label_small">Worker</span>
              </div>
              <div>
                <WorkerAsyncSearch
                  current_value={
                    this.state.search.worker
                      ? {
                          label: this.state.search.worker.name,
                          value: this.state.search.worker,
                        }
                      : ''
                  }
                  onSelect={(item) =>
                    this.handleChangeFilter(
                      'worker',
                      item ? item.value : null
                    )
                  }
                />
              </div>
            </div>
          )}
          {this.props.hasAddress && (
            <div className="filter-box__wrapper">
              <div className="left-item-header">
                <span className="filter-box__label_small">Address</span>
              </div>
              <div className="left-item-body">
                <LocationsAsyncSearch
                  current_value={
                    this.state.search.location
                      ? {
                          label: this.state.search.location.address,
                          value: this.state.search.location,
                        }
                      : ''
                  }
                  onSelect={(item) =>
                    this.handleChangeFilter(
                      'location',
                      item ? item.value : null
                    )
                  }
                />
              </div>
              <div className="left-item-body">
                <CETSearchRadiusComponent
                  onChange={(value) => this.handleChangeFilter('radius', value)}
                  onChangeType={(value) =>
                    this.handleChangeFilter('radiusType', value)
                  }
                  value={this.state.search.radius}
                  title="Search Radius"
                />
              </div>
            </div>
          )}
          {this.props.hasBorough && (
            <div className="filter-box__wrapper">
              <div className="left-item-header">
                <span className="filter-box__label_small">Municipality</span>
              </div>
              <div className="left-item-body d-flex">
                <div className="d-block w-100">
                  <MunicipalitiesAsyncSearch
                    isMulti
                    value={this.state.search.municipality ? this.state.search.municipality.forEach(m => MUNICIPALITY[m+1]) : null}
                    onSelect={(item: any) =>{
                      this.handleChangeFilter(
                        'municipality',
                        item ? item.map(i => i.value) : null
                      )
                    }
                    }
                  />
                </div>
              </div>
            </div>
          )}
          {this.props.hasNumber && (
           <>
           <div className="filter-box__wrapper">
              <div className="left-item-body">
              <div className="left-item-header">
                <span className="filter-box__label_small">Numbers</span>
              </div>
              </div>
              </div>
              <div className="filter-box__wrapper">
              <div className="left-item-body">
                <CETextInputComponent
                  onChange={this.handleChangeInput}
                  name={'structure'}
                  className="ce-pd-bottom-20"
                  title="Structure Number"
                  value={this.state.search.structure}
                />
                </div>
                </div>
                <div className="filter-box__wrapper">
              
                <CETextInputComponent
                  onChange={this.handleChangeInput}
                  name={'purchase'}
                  className="ce-pd-bottom-20"
                  title="Purchase Order Number"
                  value={this.state.search.purchase}
                />
                
                </div>
                <div className="filter-box__wrapper">
              <div className="left-item-body">
                <CETextInputComponent
                  onChange={this.handleChangeInput}
                  name={'worker_number'}
                  className="ce-pd-bottom-20"
                  title="Worker Request Number"
                  value={this.state.search.worker_number}
                />
                </div>
                </div>
              </>
           
          )}

          <div className="filter-box__wrapper">
           
              <button
                className="btn filter-button"
                onClick={this.clearFilters}
                style={{ width: '100%' }}
              >
                Clear filters
              </button>
            
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={'jobs-filter'}>
        {this.state.showSearch && (
          <div>
            {this.renderHeader()}
            <Divider />
          </div>
        )}

        <div className={this.state.showFilter ? '' : 'hidden'}>
          {this.renderBody()}
        </div>

        <div
          className={`d-inline-block w-100 ${
            this.state.showFilter ? 'hidden' : ''
          }`}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    search_options: state.jobs.search_options,
  };
}

function mapDispatchToProps(dispatch) {
  return{
    dispatch,
    search: (search_opt) => dispatch(actions.JobsActions.updateFilters(search_opt)),
    updateTimesheetsFilter: (search_opt) => dispatch(actions.TimesheetsActions.updateFilters(search_opt)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FilterComponent));
