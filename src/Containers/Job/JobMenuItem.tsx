import * as React from 'react';
import './jobmenuitem.scss';
import AlertIcon from '../../Images/alert-circle.png';
import * as CeIcon from '../../Utils/Icon';
import CEModal from '../Components/Modal/Modal.Component';
import {
  JobType,
  // NOTIFIABLE_TYPES
} from '../../Constants/job';
import {
  JobWorker,
  JobLocation,
  //  JobListItem
} from '../../Models/jobListItem';
// import notificationStore from '../../Stores/notificationStore';
import { connect } from 'react-redux';

class JobMenuItemComponent extends React.Component<any> {
  isToggleModal: boolean;
  isRoute: boolean;
  selectedWorker: any;
  hasWorker: boolean;
  hasTimeSheet: boolean;
  hasLocation: boolean;

  constructor(props) {
    super(props);
    this.hasWorker = true;
    this.hasTimeSheet = true;
    this.hasLocation = true;
  }

  closeOnRoute = () => {
    this.isRoute = false;
    this.setState({ change: true });
  };

  closeModal = () => {
    this.isToggleModal = false;
    this.setState({ change: true });
  };

  public render() {
    const { job } = this.props;
    if (!this.props.job) {
      return null;
    }
    // const notifcation = notificationStore.notification;
    // let status = this.props.job.jobStatus;
    // if (notifcation) {
    //   switch (notifcation.notifiableType) {
    //     case NOTIFIABLE_TYPES.CREATE_JOB:
    //     case NOTIFIABLE_TYPES.CANCEL_JOB:
    //     case NOTIFIABLE_TYPES.ASSIGN_JOB:
    //     case NOTIFIABLE_TYPES.WORKER_EN_ROUTE:
    //     case NOTIFIABLE_TYPES.WORKER_ON_LOCATION:
    //     case NOTIFIABLE_TYPES.WORKER_SECURED_SITE:
    //     case NOTIFIABLE_TYPES.WORKER_UPLOAD_AN_IMAGE:
    //     case NOTIFIABLE_TYPES.WORKER_ENDED_SHIFT:
    //     case NOTIFIABLE_TYPES.EDIT_JOB:
    //     case NOTIFIABLE_TYPES.PO_NUMBER_HAS_BEEN_ADDED:
    //       if (
    //         (notifcation.notifiableRecord as JobListItem).id ===
    //         this.props.job.id
    //       ) {
    //         status = Number(
    //           (notifcation.notifiableRecord as JobListItem).jobStatus
    //         );
    //       }
    //       break;
    //     default:
    //       break;
    //   }
    // }

    return (
      <div className="left-item">
        <div className="left-item-body">
          <div className="job-menu-item">
            <div className="menu-header">
              <div className="header-title">
                <span className="title">{JobType[this.props.job.jobType]}</span>
                <div
                  className={`circle-status circle-${
                    job.status ? job.status.toString().toLowerCase() : ''
                  }`}
                ></div>
                <span className="cursor-pointer m_title">{job.status}</span>
              </div>
              {/*<span>{this.props.job.uid}</span>*/}
            </div>
            <div className="content">
              <div className="job-worker">
                <div className="left-item-header text-uppercase">
                  <div className="header">
                    <span>Workers</span>
                    <div>
                      <span className="mr-3">
                        {Array.isArray(this.props.job.workers)
                          ? this.props.job.workers.length
                          : null}
                      </span>
                      {this.hasWorker ? (
                        <CeIcon.ChevronUpIcon
                          onClick={() => {
                            this.hasWorker = !this.hasWorker;
                            this.setState({ change: true });
                          }}
                          className="cursor-pointer"
                        />
                      ) : (
                        <CeIcon.ChevronDownIcon
                          onClick={() => {
                            this.hasWorker = !this.hasWorker;
                            this.setState({ change: true });
                          }}
                          className="cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                </div>
                {this.hasWorker && (
                  <div className="job-worker-list">
                    {Array.isArray(this.props.job.workers) &&
                      this.props.job.workers.map(
                        (jobWorker: JobWorker, index) => (
                          <div className="job-worker-list-item" key={index}>
                            <div className="worker">
                              <img
                                alt="avatar"
                                className="worker-img avatar"
                                src={`${jobWorker.worker.avatar}`}
                              />
                              <div>
                                <div
                                  className="ce-title"
                                  style={{ width: 120 }}
                                >
                                  <span>{jobWorker.worker.name}</span>
                                </div>
                                <div className="ce-sub-tilte">
                                  {jobWorker.assignerName && (
                                    <span>
                                      Appointed by {jobWorker.assignerName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/*<div className="job-worker-icon" data-tip="OnLocation">
                          <CeIcon.EndRouteIcon
                            onClick={() => {
                              this.selectedWorker = jobWorker;
                              this.isRoute = true;
                              this.setState({ change: true });
                            }}
                            className="worker-img-status cursor-pointer"
                          />
                        </div>*/}
                          </div>
                        )
                      )}
                  </div>
                )}
              </div>
              <div className="job-time-sheet">
                <div className="left-item-header text-uppercase">
                  <div className="header">
                    <span>TIMESHEETS</span>
                    <div>
                      <span className="mr-3">
                        {Array.isArray(this.props.job.timesheets)
                          ? this.props.job.timesheets.length
                          : 0}
                      </span>
                      {this.hasTimeSheet ? (
                        <CeIcon.ChevronUpIcon
                          className="cursor-pointer"
                          onClick={() => {
                            this.hasTimeSheet = !this.hasTimeSheet;
                            this.setState({ change: true });
                          }}
                        />
                      ) : (
                        <CeIcon.ChevronDownIcon
                          className="cursor-pointer"
                          onClick={() => {
                            this.hasTimeSheet = !this.hasTimeSheet;
                            this.setState({ change: true });
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {this.hasTimeSheet && (
                  <div className="job-worker-list">
                    <div className="job-worker-list-item">
                      <span>
                        <div>Paid</div>
                      </span>
                      <span>
                        <div>{this.props.job.total_timesheets_paid}</div>
                      </span>
                    </div>

                    <div className="job-worker-list-item">
                      <span>
                        <div>Unpaid</div>
                      </span>
                      <span>
                        <div>{this.props.job.total_timesheets_unpaid}</div>
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="job-location">
                <div className="left-item-header text-uppercase">
                  <div className="header">
                    <span>LOCATIONS</span>
                    {this.props.job.locations && (
                      <div>
                        <span className="mr-3">
                          {this.props.job.locations.length}
                        </span>
                        {this.hasLocation ? (
                          <CeIcon.ChevronUpIcon
                            className="cursor-pointer"
                            onClick={() => {
                              this.hasLocation = !this.hasLocation;
                              this.setState({ change: true });
                            }}
                          />
                        ) : (
                          <CeIcon.ChevronDownIcon
                            className="cursor-pointer"
                            onClick={() => {
                              this.hasLocation = !this.hasLocation;
                              this.setState({ change: true });
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {this.hasLocation && (
                  <div className="job-worker-list">
                    {this.props.job.locations &&
                      this.props.job.locations.map(
                        (location: JobLocation, index) => (
                          <div className="job-worker-list-item" key={index}>
                            <span>{location.address}</span>
                          </div>
                        )
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <CEModal
          show={this.isToggleModal}
          onClose={() => this.closeModal()}
          className="ce-route-modal-alert"
          size="ce-modal-content"
        >
          <div>
            <div className="ce-flex-right">
              <span
                className="pull-right"
                onClick={() => {
                  this.closeModal();
                }}
              >
                <CeIcon.Close />
              </span>
            </div>
            <div className="text-center">
              <div>
                <img src={AlertIcon} alt="" />
              </div>
              <div className="m-3 title-alert">
                <label>This job has already started,</label>
                <label>cancelling would invoke a 4 Hour Minimum</label>
              </div>
              <div className="group-button d-flex justify-content-between mx-2 mt-30 mb-25">
                <span
                  className="btn ce-btn-modal-cancel"
                  onClick={() => {
                    this.closeModal();
                  }}
                >
                  <span>Don't Cancel</span>
                </span>
                <span
                  className="btn ce-btn-modal-cancel"
                  onClick={() => {
                    this.closeModal();
                  }}
                >
                  <span>Cancel Without Min</span>
                </span>
                <span
                  className="btn ce-btn-modal-save"
                  onClick={() => {
                    // this.onListWorkers(true)
                  }}
                >
                  <span>Accept Late Cancel</span>
                </span>
              </div>
            </div>
          </div>
        </CEModal>
        <CEModal
          show={this.isRoute}
          onClose={() => this.closeOnRoute()}
          className="ce-route-modal"
          size="ce-modal-content"
        >
          <div className="ce-align-flex">
            {this.selectedWorker && (
              <div className="worker ce-flex">
                <img
                  className="worker-img avatar mr-3"
                  src={this.selectedWorker.thumbnail}
                  alt=""
                />
                <div>
                  <div className="ce-title">
                    <span>{this.selectedWorker.name}</span>
                  </div>
                  <div className="ce-sub-tilte">
                    <span>Appointed by {this.selectedWorker.assignerName}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="ce-flex-right">
              <span
                className="pull-right"
                onClick={() => {
                  this.closeOnRoute();
                }}
              >
                <CeIcon.Close />
              </span>
            </div>
          </div>

          <div className="route-container">
            <div className="router-container-in d-flex w-100">
              <div className="state-container">
                <div className="state-icon">
                  <CeIcon.OnrouteIcon className="cursor-pointer" />
                  <div className="route-dot"></div>
                </div>
                <div className="state-text">
                  <span className="text-bold">EnRoute</span>
                  <span className="text-time"></span>
                  <span className="text-time"></span>
                </div>
              </div>
              <div className="state-container">
                <div className="state-icon">
                  <CeIcon.EndRouteIcon className="cursor-pointer" />

                  <div className="route-dot"></div>
                </div>
                <div className="state-text">
                  <span className="text-bold">OnLocation</span>
                  <span className="text-time"></span>
                  <span className="text-time"></span>
                </div>
              </div>
              <div className="state-container">
                <div className="state-icon">
                  <CeIcon.ShieldCircelIcon
                    fill="#C3C3C3"
                    className="cursor-pointer"
                  />
                  <div className="route-dot"></div>
                </div>
                <div className="state-text">
                  <div className="ce-flex ce-mr-10">
                    {/*<CeIcon.CheckCircleIcon className="ce-mr-10"/>*/}
                    <span className="text-medium">Secured</span>
                  </div>
                  {/* <span>06/15/2019</span>
                            <span>09:00</span> */}
                </div>
              </div>
            </div>

            <div className="state-container-end">
              <div className="state-icon">
                <CeIcon.LeavingIcon className="cursor-pointer" />
              </div>
              <div className="state-text">
                <div className="ce-flex ce-mr-10">
                  {/*<CeIcon.CheckCircleIcon className="ce-mr-10"/>*/}
                  <span className="text-medium">Leaving</span>
                </div>
                {/* <span>06/15/2019</span><span>09:00</span> */}
              </div>
            </div>
          </div>
        </CEModal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    job: state.jobs.job,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    //   updateJobStatus: (job_id, options) => dispatch(actions.JobsActions.updateJobStatus(job_id, options))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobMenuItemComponent);
