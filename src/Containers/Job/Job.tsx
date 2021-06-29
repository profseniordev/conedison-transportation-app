import * as React from 'react';
import FilterComponent from '../Searchs/Filter.Component';
import JobItemSchedule from './JobItemSchedule';
import './Job.scss';
import authStore from '../../Stores/authStore';
import { actions } from '../../Services';
import { connect } from 'react-redux';
import UpdatePODialog from './dialogs/UpdatePODialog';
import history from '../../history';
import Button from '@material-ui/core/Button';
import VerticalBorder from '../../components/Border/VerticalBorder';
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from '@material-ui/lab/Pagination';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Search from '../../components/Search/Search';
import { toast } from 'react-toastify';

class Job extends React.Component<any> {
  state: any;
  jobList: boolean;
  isToggleModal: boolean;
  ref: any;

  constructor(props) {
    super(props);
    this.state = {
      searchParams: { page: 0 },
      initSearch: true,
      page: 0,
      per_page: 10,
      po: 100101,
      total_height: 0,
      confirmedSelectedRows: [],
      unconfirmedSelectedRows: [],
      showUpdatePODialog: false,
      unconfirmedItemsCountPerPage: 1,
      confirmedItemsCountPerPage: 1,
      showFilter: true,
    };
    this.ref = React.createRef<HTMLDivElement>();
  }

  componentDidMount(): void {
    const total_height = document.getElementById('root').clientHeight;
    this.setState({ total_height });
  }

  static getDerivedStateFromProps(props, state) {
    if (state.initSearch) {
      return {
        searchParams: { ...state.searchParams, ...props.search_options },
        initSearch: false,
      };
    }
    return null;
  }

  showModal = () => {
    if (
      this.state.confirmedSelectedRows.length === 0 &&
      this.state.unconfirmedSelectedRows.length === 0
    ) {
      alert('Please select any job');
      return;
    }
    this.setState({
      showUpdatePODialog: true,
    });
  };

  createJob = () => {
    history.push('/job/create');
  };

  closeModal = () => {
    this.setState({
      showUpdatePODialog: false,
    });
  };

  search = async (params: any, keepPage = false) => {
    const searchParams = { ...params, ...(!keepPage && { page: 0 }) };
    this.setState({ searchParams, page: 0 });

    this.props.updateFilters(searchParams);
  };

  changedPage = (page: number) => {
    this.setState({
      searchParams: { ...this.state.searchParams, page: page },
      page: page,
    });
    this.props.updateFilters({ ...this.state.searchParams, page: page });
  };

  updatePOS = (po_number, requisition) => {
    let job_ids = [
      ...this.state.confirmedSelectedRows,
      ...this.state.unconfirmedSelectedRows,
    ];
    this.props.updatePOS(job_ids, po_number, requisition).then(() => {
      this.setState({
        showUpdatePODialog: false,
        unconfirmedSelectedRows: [],
        confirmedSelectedRows: [],
      });
    }).catch((error) => {
      let msg = error.error;
      if(msg.includes('SQL')) {
        msg = 'Error! Your data is invalid. The maximum limit is 30 characters or numbers.';
      }
      toast.error(msg, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  handleSelectConfirmedRow = (job_id) => {
    let current_list = this.state.confirmedSelectedRows;
    if (current_list.includes(job_id)) {
      let index = current_list.indexOf(job_id);
      current_list.splice(index, 1);
    } else {
      current_list.push(job_id);
    }
    this.setState({
      confirmedSelectedRows: current_list,
    });
  };

  handleSelectUnconfirmedRow = (job_id) => {
    let current_list = this.state.unconfirmedSelectedRows;
    if (current_list.includes(job_id)) {
      let index = current_list.indexOf(job_id);
      current_list.splice(index, 1);
    } else {
      current_list.push(job_id);
    }
    this.setState({
      unconfirmedSelectedRows: current_list,
    });
  };
  toggleFilter = () => {
    this.setState((state: any) => ({ showFilter: !state.showFilter }));
  };

  confirmJobs = async () => {
    if (this.state.unconfirmedSelectedRows.length === 0) {
      alert('Please select any job');
      return;
    }
    if (this.props.confirm_jobs_processing) {
      return;
    }
    this.props.confirmJobs(this.state.unconfirmedSelectedRows).then(() => {
      this.setState({ unconfirmedSelectedRows: [] });
    });
  };
  onPaginationChangeUnconfirmedJobs = (page: number) => {
    this.setState({ unconfirmedItemsCountPerPage: page });
  };

  onPaginationChangeConfirmedJobs = (event, page: number) => {
    this.setState({ confirmedItemsCountPerPage: page });
    if(this.ref.current) {this.ref.current.scrollTop = 0;}
  };

  handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({ per_page: event.target.value as string });
  };

  render() {
    const props = this.props;
    const jobs = props.jobs;
    const table_height = this.state.total_height - 200;
    const filter_max_height = this.state.total_height - 75;

    const hasSupervisor = this.props.is_supervisor;

    let jobs_pagination = [];
    jobs.forEach((job, index) => {
      if (
        this.state.confirmedItemsCountPerPage > 1
          ? index >=
            (this.state.confirmedItemsCountPerPage - 1) * this.state.per_page
          : index >= this.state.confirmedItemsCountPerPage - 1
      ) {
        if (
          index <
          this.state.confirmedItemsCountPerPage * this.state.per_page
        ) {
          jobs_pagination.push(job);
        }
      }
    });

    return (
      <div className="d-flex App-content" id={'jobs-grid'}>
        <div
          className=" border-right position-relative"
          style={{          
            maxHeight: `${filter_max_height}px`,
            minWidth: `${!this.state.showFilter ? 'auto' : 350}`,
          }}
        >
          {this.state.showFilter && (
            <FilterComponent
              hasDepartment={true}
              hasRequestDate={true}
              hasJobStatus={true}
              hasWorker={true}
              hasRequestor={true}
              hasFieldSupervisor={hasSupervisor}
              showFilter
              showSearch={false}         
              hasSort
              numberMonth={1}
              //  search={this.search}
              onFilter={(_) => {
                this.jobList = true;
                this.setState({ confirmedItemsCountPerPage: 1 }, () => console.log(this.state.confirmedItemsCountPerPage));
              }}
            />
          )}
          <div
            className="position-fixed filter-container bg-white border-right border-bottom"
            style={{ left: `${!this.state.showFilter ? '6px' : '354px'}` }}
          >
            <div
              className="btn border-0 filter-toggle filter-mob"
              onClick={this.toggleFilter}
            >
              |||
            </div>
          </div>
        </div>
        <div className=" col-right job-list-page">
          {this.props.processing ? (
            <LinearProgress />
          ) : (
            <div style={{ height: 4 }}></div>
          )}

          <div
            className="row buttons-row align-items-center"
            style={{ height: 'fit-content' }}
          >
            <Search
              updateFilters={this.search}
              placeholder={'Search ...'}
              instant={true}
              search_value={this.state.searchParams.search}
            />
            {authStore.canDoJobAction() && (
              <>
                <React.Fragment>
                  <Button
                    variant="outlined"
                    classes={{ root: 'new-buttons dark' }}
                    style={{ overflow: 'hidden', marginRight: 10, width: '233px' }}
                    onClick={this.showModal}
                    disableRipple
                  >
                    Update PO# / Requisition#
                  </Button>
                  <div>
                    <VerticalBorder styles={{ margin: '0' }} />
                  </div>
                  <Button
                    variant="outlined"
                    classes={{ root: 'new-buttons blue' }}
                    style={{
                      overflow: 'hidden',
                      marginRight: 10,
                    }}
                    onClick={this.createJob}
                    disableRipple
                  >
                    Create Job
                  </Button>
                </React.Fragment>
              </>
            )}
          </div>

          <UpdatePODialog
            open={this.state.showUpdatePODialog}
            close={this.closeModal}
            updatePOS={this.updatePOS}
          />

          <div
            className={'jobs-table'}
            style={{
              overflowY: 'scroll',
              maxHeight: `${table_height - 35}px`,
              overflowX: 'hidden',
              width: '100%',
              paddingTop: '10px',
            }}
            ref={this.ref}
          >
            {jobs_pagination.map((job, index) => (
              <JobItemSchedule
                rerouteable
                job={job}
                index={0}
                key={index}
                checked={this.state.unconfirmedSelectedRows.includes(job.id)}
                onCheckboxChange={(_) =>
                  this.handleSelectUnconfirmedRow(job.id)
                }
                search={(_) => this.search(this.state.searchParams, true)}
              />
            ))}
          </div>
          {/*<div className="pagination-invoices pagination-confirmed-jobs">*/}
          <div className="pagination-job-list">
            <div className="d-flex">
              <p className="text-pagination">Per Page:</p>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={this.state.per_page}
                onChange={this.handleChange}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
            </div>
            <p className="text-pagination">{`PAGE ${
              this.state.confirmedItemsCountPerPage
            } OF ${Math.ceil(this.props.total / this.state.per_page)}`}</p>
            <Pagination
              showFirstButton
              showLastButton
              page={this.state.confirmedItemsCountPerPage}
              count={Math.max(
                0,
                Math.ceil(this.props.total / this.state.per_page)
              )}
              onChange={this.onPaginationChangeConfirmedJobs}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    processing: state.jobs.processing,
    total: state.jobs.jobs ? state.jobs.jobs.total : 0,
    jobs: state.jobs.jobs.results,
    stats: state.jobs.stats,
    confirm_jobs_processing: state.jobs.confirm_jobs_processing,
    can_see_unconfirmed_jobs: state.app.user
      ? [5, 6, 7, 8].some((r) => state.app.user.roles.includes(r))
      : false,
    is_supervisor: state.app.user
      ? [3].some((r) => state.app.user.roles.includes(r))
      : false,
    search_options: state.jobs.search_options,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateFilters: (search_options) => dispatch(actions.JobsActions.updateFilters(search_options)),
    confirmJobs: (job_ids) => dispatch(actions.JobsActions.confirmJobs(job_ids)),
    updatePOS: (job_ids, po_number, requisition) => dispatch(actions.JobsActions.updatePOS(job_ids, po_number, requisition)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Job);
