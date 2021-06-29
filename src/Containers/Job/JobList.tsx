import { createBrowserHistory } from 'history';
import * as React from 'react';
import { JobItem } from '../../Models/jobItem';
import './joblist.scss';
import { JobListItem } from '../../Models/jobListItem';
import { JobType, JOB_STATUSES, NOTIFIABLE_TYPES } from '../../Constants/job';
import moment from 'moment';
import authStore from '../../Stores/authStore';
import notificationStore from '../../Stores/notificationStore';
import { connect } from 'react-redux';
import { actions } from '../../Services';
import history from '../../history';
import LinearProgress from '@material-ui/core/LinearProgress';
 
interface Props {
  jobs?: JobListItem[];
  items?: Array<JobItem>;
  onJobFocus: (po: number) => void;
  selectJob: (job: JobListItem) => void;
  onJobBlur: () => void;
  active: number;
  footer?: any;
  isSelected?: Boolean;
  selectedJobId?: JobListItem;
}

class JobListComponent extends React.Component<any> {
  // constructor(props: any) {
  //   super(props);
  // }

  state: any = {
    selectedJobId: null,
  };

  timer = null;

  componentDidUpdate = (prevProps) => {
    if (this.props.selectedJobId && this.props.selectedJobId !== prevProps.selectedJobId) {
      this.setState({
        selectedJobId: this.props.selectedJobId,
      });
    }
  }

  onSingleClick = (job: JobListItem, fromMap: boolean) => {
      this.props.selectJob(job);
    if (this.props.isSelected !== undefined && this.props.isSelected === false)
      this.setState({
        selectedJobId: null,
      });
    else {
      this.setState({
        selectedJobId: job.id,
      });
      if (fromMap) {
        const element = document.getElementById(job.id);
        if (!this._isInViewport(element)) {
          element.scrollIntoView();
        }
      }
    }
  };

  onDoubleClick = (job: JobListItem) => {
    createBrowserHistory({ forceRefresh: true }).push(`/job/${job.id}`);
  };

  onClick = (job: JobListItem, type = 'single', fromMap = false) => {
    if (this.timer) clearTimeout(this.timer);
    if (type === 'single') {
      this.timer = setTimeout(() => this.onSingleClick(job, fromMap), 300);
    } else {
      this.onDoubleClick(job);
    }
  };
  _isInViewport = (element: any) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  createJob = () => {
    history.push('/job/create');
  };

  public render() {
    const jobs = this.props.jobs;

   /* if (this.props.processing) {
      return (
        <div
        >
          <LinearProgress color="primary" />
        </div>
      );
    }*/

    const notifcation = notificationStore.notification;
    let jobIndex = null;
    let updatedJob = null;

    if (notifcation) {
      switch (notifcation.notifiableType) {
        case NOTIFIABLE_TYPES.CREATE_JOB:
        case NOTIFIABLE_TYPES.CANCEL_JOB:
        case NOTIFIABLE_TYPES.ASSIGN_JOB:
        case NOTIFIABLE_TYPES.WORKER_EN_ROUTE:
        case NOTIFIABLE_TYPES.WORKER_ON_LOCATION:
        case NOTIFIABLE_TYPES.WORKER_SECURED_SITE:
        case NOTIFIABLE_TYPES.WORKER_UPLOAD_AN_IMAGE:
        case NOTIFIABLE_TYPES.WORKER_ENDED_SHIFT:
        case NOTIFIABLE_TYPES.EDIT_JOB:
        case NOTIFIABLE_TYPES.PO_NUMBER_HAS_BEEN_ADDED:
          jobIndex = jobs.findIndex(
            (item) =>
              item.id === (notifcation.notifiableRecord as JobListItem).id
          );
          updatedJob = notifcation.notifiableRecord as JobListItem;
          break;
        default:
          break;
      }
    }

    return (
      <>
      {this.props.processing ? <LinearProgress color="primary" /> : null}
      <div className="job-list-box">
        <div className="left-item">
          <div className="left-item-wrap">
            <div className="left-item-child">
              {Array.isArray(jobs) &&
                jobs.map((job, index) => (
                  <div
                    id={job.id}
                    key={job.id}
                    onDoubleClick={() => this.onClick(job, 'double')}
                    onClick={() => this.onClick(job)}
                    onMouseLeave={this.props.onJobBlur}
                    onMouseEnter={() => this.props.onJobFocus(job.po)}
                    className={`job-item ${
                      this.state.selectedJobId === job.id ? 'job-active' : ''
                    }`}
                  >
                    <button className="job-component">
                      <div className="header">
                        <div className="header-title">
                          <span className="title">{JobType[job.jobType]}</span>
                          <div
                            className={`circle-${JOB_STATUSES[
                              index !== jobIndex || updatedJob == null
                                ? job.jobStatus
                                : updatedJob.jobStatus
                            ].toLowerCase()}`}
                          />
                          <span>
                            {
                              JOB_STATUSES[
                                index !== jobIndex || updatedJob == null
                                  ? job.jobStatus
                                  : updatedJob.jobStatus
                              ].match(/[A-Z][a-z]+|[0-9]+/g).join(" ")
                            }
                          </span>
                        </div>
                        <a style={{ color: '#3a3c3e' }} href={`/job/${job.id}`}>
                          {job.uid}
                        </a>
                      </div>

                      <div className="content">
                        <div
                          style={{
                            display: 'flex',
                            textAlign: 'left',
                            flexDirection: 'column',
                          }}
                        >
                          <div className="">
                            {Array.isArray(job.locations)
                              ? job.locations
                                  .map((loc) => loc.address)
                                  .join(', ')
                              : null}
                          </div>
                          <div>
                            <span className="request-date-time-title">
                              Request Date/Time
                            </span>
                            <div className="request-date-time">
                              <span>
                                {moment(job.requestTime).format(
                                  'DD MMM YY  HH:mm'
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="job-worker ml-3">
                          {Array.isArray(job.workers) ? (
                            <div
                              className="worker-box"
                              style={{ zIndex: job.workers.length }}
                            >
                              <div className="worker-box-round">
                                <span className="worker-total">
                                  {' '}
                                  {job.workers.length}
                                </span>
                              </div>
                            </div>
                          ) : null}
                          {Array.isArray(job.workers) &&
                            job.workers.map((JobWorker, i) => (
                              <div
                                className="worker-box"
                                style={{ zIndex: job.workers.length - (i + 1) }}
                                key={i}
                              >
                                <img
                                  className="worker-img  avatar"
                                  alt="avatar"
                                  src={`${process.env.REACT_APP_API_ENDPOINT}${JobWorker.worker.avatar}`}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              {this.props.footer}
            </div>
          </div>
          {authStore.canDoJobAction() && (
            <div className="left-item-body bottom-btn">
              <div
                className={`create-job ${
                  window.navigator.platform === 'MacIntel' ? 'os-offset' : ''
                }`}
              >
                <span
                  onClick={this.createJob}
                  className="create-job-button cursor-pointer"
                >
                  Create Job
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    processing: state.jobs.processing,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getJobs: () => dispatch(actions.JobsActions.retrieve()),
    confirmJobs: (job_ids) =>
      dispatch(actions.JobsActions.confirmJobs(job_ids)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobListComponent);
