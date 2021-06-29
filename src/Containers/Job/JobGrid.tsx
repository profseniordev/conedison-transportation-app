import * as React from 'react';
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import FilterComponent from '../Searchs/Filter.Component';
import './Job.scss';
import { actions } from '../../Services';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';


const JobGridTable = React.lazy(() => import('./JobGridTable'));

class JobGrid extends React.Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      searchParams: { page: 0 },
      page: 0,
      po: 100101,
      selectedRows: [],
      confirmedSelectedRows: [],
      unconfirmedSelectedRows: [],
      showFilter: true,
      total_height: 0,
      selectedRow: null,
    };
  }

  componentDidMount = () => {
    const total_height = document.getElementById('root').clientHeight;
    this.setState({ total_height });
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    //console.log(this.state, nextState)
    if( !nextState.selectedRow || this.state.selectedRow === null ) 
     return true;
    else 
      return false;
  }

  selectRow = (selected) => {
    this.setState({selectedRow: selected});
  }

  search = async (params: any, keepPage = false) => {
    const searchParams = { ...params, ...(!keepPage && { page: 0 }) };
    this.setState({ searchParams });
    this.props.updateFilters(searchParams);
  };

  toggleFilter = () => {
    this.setState((state: any) => ({ showFilter: !state.showFilter }));
  };

  render() {
    const hasSupervisor = this.props.is_supervisor;
    const filter_max_height = this.state.total_height - 75;
    return (
      <>
      {this.props.processing ? <LinearProgress /> : <div style={{ height: 5 }}></div>}
      <div className="d-flex App-content" id={'jobs-grid'}>
        <div
          className=" border-right position-relative"
          style={{
            flexBasis: `${!this.state.showFilter ? '0px' : ''}`,
            transition: 'flex-basis 500ms ease-in-out',
            overflowY: 'visible',
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
              //search={this.search}
              onFilter={(_) => {
                // this.jobList = true;
                // this.setState({ change: true });
              }}
              numberMonth={1}
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
        {this.state.total_height > 0 && (
          <>
          <React.Suspense
            fallback={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
                <CircularProgress color="primary" size={60} />
              </div>
            }
          >
            <JobGridTable total_height={this.state.total_height} jobs={this.props.jobs} selectRow={this.selectRow}/>
          </React.Suspense>
          </>
        )}
      </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    jobs: state.jobs.jobs.results,
    processing: state.jobs.processing,
    is_supervisor: state.app.user
      ? [3].some((r) => state.app.user.roles.includes(r))
      : false,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getJobs: () => dispatch(actions.JobsActions.retrieve()),
    confirmJobs: (job_ids) =>
      dispatch(actions.JobsActions.confirmJobs(job_ids)),
    sortASAP: () => dispatch(actions.JobsActions.sortASAP()),
    updateFilters: (search_options) =>
      dispatch(actions.JobsActions.updateFilters(search_options))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobGrid);
