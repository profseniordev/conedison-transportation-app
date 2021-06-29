import {Marker} from 'react-google-maps';
import moment from 'moment';
import React from 'react';
import {JOB_STATUSES} from '../../Constants/job';
import {JobWorker} from '../../Models/jobListItem';
import {jobAPI} from '../../Services/API';
import jobStore from '../../Stores/jobStore';
import * as CEIcon from '../../Utils/Icon';
import * as CeIcon from '../../Utils/Icon';
import CEModal from '../Components/Modal/Modal.Component';
import qs from 'query-string';
//import JobHistoryComponent from './JobHistory';
import History from '../Components/History/History';
import JobMenuItemComponent from './JobMenuItem';
import JobAssign from './JobWorkers/JobAssign';
import MapContainer from '../Components/Map/MapContainer';
import {Location} from '../../Models/jobItem';
import WorkerGroup from './RerouteWorker/WorkerGroup';
import './JobDetails.scss';
import {actions} from '../../Services';
import {connect} from 'react-redux';
import history from '../../history';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';
import CompleteJob from '../Dispatch/dialog/completeJob/CompleteJob';
import PreviewImage from '../Components/ImageUpload/PreviewImage';
import SimpleReactLightbox, {SRLWrapper} from 'simple-react-lightbox';
import Tooltip from '@material-ui/core/Tooltip';
import CancelJob from './dialogs/CancelJob';
import LocationImg from '../../Assets/location.png';

enum TabContent {
  TabDetails = 1,
  TabSchedule,
  TabHistory,
}

const MIN_TRACKING_HOURS = 4;

class JobDetailsComponent extends React.Component<any, any> {
  tab = TabContent.TabDetails;
  previewImage: string;
  isToggleModal: boolean;
  isToggleModals: boolean;
  isInProgressModal: boolean;
  isToggleInfoModal: boolean;
  map: any;
  trackingHours = MIN_TRACKING_HOURS;

  constructor(props) {
    super(props);
    this.state = {
      zoom: 11,
      workerId: '',
      total_height: 0,
      open_complete_job: false,
      completed: false,
      isInProgressModal: false,
    };
  }

  handleCloseCompleteJobModal = () => {
    this.setState({ open_complete_job: false });
  };
  completeJob = () => {
    this.setState({
      open_complete_job: true,
    });
  };

  componentDidUpdate = (prevProps) => {
    const params = qs.parse(this.props.location.search);
    if(this.props.match.params.id !== prevProps.match.params.id){
      if (!params.workerId) {
        this.props.retrieveJob(this.props.match.params.id);
      } else {
        this.props.retrieveJob(this.props.match.params.id, {
          workerId: params.workerId,
        });
      }
    }
  }

  setComplete = () => {
    this.setState({ completed: true });
  };

  componentDidMount = () => {
    this.fetchNewData();

    const total_height = document.getElementById('root').clientHeight;
    this.setState({ total_height });
  };

  componentWillUnmount = () => {
    this.props.clearJob();
  };

  fetchNewData = async () => {
    const params = qs.parse(this.props.location.search);
    if (!params.workerId) {
      this.props.retrieveJob(this.props.match.params.id);
    } else {
      this.props.retrieveJob(this.props.match.params.id, {
        workerId: params.workerId,
      });
    }
  };

  showFullImage(url) {
    this.previewImage = url;
    this.setState({ change: true });
  }

  closeFullImage = () => {
    this.previewImage = '';
    this.setState({ change: true });
  };

  changeTab(tab) {
    this.tab = tab;
    this.setState({ change: true });
  }

  showCancelJob(show) {
    this.isToggleModal = show;
    this.isToggleModals = show;
    this.setState({ change: true });
  }

  showModal(show) {
    //this.isInProgressModal = show;
    this.setState({isInProgressModal: show});
    /*console.log(this.props.job.workers)
    if (show && this.props.job.jobStatus === JOB_STATUSES.InProgress) {
      this.trackingHours = this.props.job.workers.reduce((sum, worker) => {
        if (worker.workerStatus === "review_finished") {
          return sum + worker.totalHours;
        } else {
          return worker.totalHours > 4 ? sum + worker.totalHours : sum + 4;
        }
      }, 0);
    }
    this.setState({ change: true });*/
  }

  getEditJobPermission = () => {
    let today = Date.parse(new Date().toString());

    if((this.props.job.jobStatus !== JOB_STATUSES.Cancelled && this.props.job.jobStatus !== JOB_STATUSES.CancelledBillable)){
      if(this.props.permissions.includes('edit_all_jobs')){
        return true;
      } else if (this.props.permissions.includes('edit_job_info')) {
      //else if (this.props.permissions.includes('edit_job_info') && Math.floor(((Date.parse(this.props.job.requestTime.toString())-today) / (1000 * 60 * 60)) % 24) >= 1 ){
        return true;
      } else {
        return false;
      }
    } else {
      return this.props.permissions.includes('edit_cancelled_job');
    }
  } 

  getCancelJobPermission = () => {
    /**(this.props.job.jobStatus !== JOB_STATUSES.Cancelled && this.props.job.jobStatus !== JOB_STATUSES.CancelledBillable)
                 && (this.props.permissions.includes('cancel_requested_jobs') || this.props.permissions.includes('cancel_all_jobs') ) */
    if(this.props.job.jobStatus !== JOB_STATUSES.Cancelled ){
      if(this.props.permissions.includes('cancel_all_jobs')) {
        return true;
      } else if (this.props.job.jobStatus !== JOB_STATUSES.CancelledBillable && this.props.permissions.includes('cancel_requested_jobs')) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } 


  showInfoModal(show) {
    this.isToggleInfoModal = show;
    this.setState({ change: true });
  }

  onZoomChanged = () => {
    this.setState({ zoom: 11 });
  };

  renderPoint = (jobItem) => {
    return jobItem.locations.map((location: Location, idx) => (
      <Marker
        key={String(idx + location.lat)}
        position={{
          lat: location.lat,
          lng: location.lng,
        }}
      ></Marker>
    ));
  };

  filterWorkerByLocation = (locations = [], workers = []) => {
    let result = [];
    let temp = [...workers];
    if (!this.state.workerId) {
      // Filter worker by job location
      for (let j = 0; j < locations.length; j++) {
        const wks = temp.filter(
          (item) =>
            item.location &&
            locations[j] &&
            item.location.id === locations[j].id
        );
        temp = temp.filter(
          (item) =>
            item.location &&
            locations[j] &&
            item.location.id !== locations[j].id
        );
        result.push({ location: locations[j], workers: wks });
      }

      // Filter worker without location
      const wokerWithoutLocation = temp.filter(
        (item) => !item.location.address
      );
      if (wokerWithoutLocation.length > 0) {
        result.push({
          location: { location: '' },
          workers: wokerWithoutLocation,
        });
        temp = temp.filter((item) => item.location.address);
      }

      // Filter worker with same location
      for (let i = 0; i < temp.length; i++) {
        const wks = temp.filter(
          (item) => item.location.address === temp[i].location.address
        );
        if (wks.length > 1) {
          result.push({ location: temp[i].location, workers: wks });
          temp = temp.filter(
            (item) => item.location.address !== temp[i].location.address
          );
        }
      }
      for (let i = 0; i < temp.length; i++) {
        result.push({ location: temp[i].location, workers: [temp[i]] });
      }
      return result;
    } else {
      // Filter worker without location
      const wokerWithoutLocation = temp.filter(
        (item) => !item.location.address
      );
      if (wokerWithoutLocation.length > 0) {
        result.push({
          location: { location: '' },
          workers: wokerWithoutLocation,
        });
        temp = temp.filter((item) => item.location.address);
      }

      // Filter worker with same location
      for (let i = 0; i < temp.length; i++) {
        const wks = temp.filter(
          (item) => item.location.address === temp[i].location.address
        );
        if (wks.length > 1) {
          result.push({ location: temp[i].location, workers: wks });
          temp = temp.filter(
            (item) => item.location.address !== temp[i].location.address
          );
        }
      }
      for (let i = 0; i < temp.length; i++) {
        result.push({ location: temp[i].location, workers: [temp[i]] });
      }
      return result;
    }
  };

  downloadPdf = async () => {
    const response = await jobAPI.downloadPdf(this.props.match.params.id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'jobsDetail.pdf');
    document.body.appendChild(link);
    link.click();
  };

  downloadHistoryPdf = async () => {
    const response = await jobAPI.downloadHistoryPdf(this.props.job.id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'jobsHistory.pdf');
    document.body.appendChild(link);
    link.click();
  };

  confirmJob = async () => {
    this.props.confirmJobs([this.props.match.params.id]);
  };

  editJob = () => {
    history.push(`/job/${this.props.match.params.id}/edit`);
  };

  viewShifts = () => {
    history.push(`/dispatch?search=id:${this.props.match.params.id}`);
  };

  copyJob = () => {
    history.push(`/job/${this.props.match.params.id}/copy`);
  };

  viewTimeSheets = () => {
    history.push(`/timesheets?jobId=${this.props.match.params.id}`);
  };

  renderMenu() {
    const editPerms = this.getEditJobPermission();
    const cancelPerms = this.getCancelJobPermission();
    //console.log(perms);
    const disabledCancel = !(this.props.permissions.includes('cancel_requested_jobs') || this.props.permissions.includes('cancel_all_jobs'));
    const disabledComplete = !this.props.can_complete_jobs;

    let can_complete_job = this.props.job && this.props.job.workers && this.props.job.workers.length > 0;
    for (let i = 0; this.props.job && this.props.job.workers && i < this.props.job.workers.length; i++) {
      let worker = this.props.job.workers[i];
      if (
        [
          'assigned',
          'en_route',
          'on_location',
          'secured',
          'cannot_secure',
          'crew_arrived',
          'review',
        ].indexOf(worker.workerStatus) !== -1
      ) {
        can_complete_job = false;
      }
    }

    return (
      <ul className="nav d-flex justify-content-between">
        <div className="d-flex">
          <li
            className={`nav-item ${
              this.tab === TabContent.TabDetails ? 'active' : ''
            }`}
            onClick={() => this.changeTab(TabContent.TabDetails)}
          >
            <span className="nav-link">Job Details</span>
          </li>
          <li
            className={`nav-item ${
              this.tab === TabContent.TabHistory ? 'active' : ''
            }`}
            onClick={() => this.changeTab(TabContent.TabHistory)}
          >
            <span className="nav-link">History</span>
          </li>
        </div>
            <div className="nav-action-mobile">
              <div className="d-flex align-items-center">
                {this.props.permissions.includes('download_job') && 
                <span
                  className="mr-3 ce-mr-20 download-link nav-link"
                  onClick={this.downloadPdf}
                >
                  <CeIcon.DownloadInvoiceIcon className="ce-mr-10" />
                  Download Job
                </span>
                }
                {this.props.permissions.includes('copy_job') && 
                <span
                  className="nav-link"
                  onClick={this.copyJob}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa fa-copy mr-1" />
                  Copy Job
                </span>
              }
                {editPerms
                   && (
                  <span
                    className="nav-link"
                    onClick={this.editJob}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fa fa-pencil mr-1" />
                    Edit Job
                  </span>
                )}
                {this.props.permissions.includes('view_shifts') && (
                  <span
                    className="nav-link cursor-pointer"
                    onClick={this.viewShifts}
                  >
                    <i className="fa fa-pencil mr-1" />
                    View shifts
                  </span>
                )}
                {cancelPerms
                  &&(
                  <span
                    className={`nav-link cursor-pointer ${
                      disabledCancel ? 'button-disabled' : ''
                    }`}
                    onClick={() =>
                      !disabledCancel ? this.showModal(true) : undefined
                    }
                  >
                    <i className="fa fa-times mr-1" />
                    Cancel Job
                  </span>
                )}
                { this.props.permissions.includes('complete_job') && <>
                {this.props.job.jobStatus !== JOB_STATUSES.Completed && this.props.job.jobStatus !== JOB_STATUSES.Cancelled && this.props.job.jobStatus !== JOB_STATUSES.CancelledBillable &&
                  !this.state.completed && (
                    <Tooltip
                      title={
                        can_complete_job
                          ? ''
                          : 'Please complete all shifts before completing job'
                      }
                      placement={'top'}
                    >
                      <span
                        className={`nav-link ${
                          disabledComplete ? 'button-disabled' : ''
                        }`}
                        onClick={() =>
                          can_complete_job ? this.completeJob() : undefined
                        }
                        style={{
                          cursor: can_complete_job ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <AssignmentTurnedIn
                          fontSize="small"
                          style={{ fill: ': #6f7780' }}
                        />
                        Complete Job
                      </span>
                    </Tooltip>
                  )}
                  </>
                  }
              </div>
            </div>
      </ul>
    );
  }

  renderComponentJobDetails() {
    const max_height = this.state.total_height - 170;

    return (
      <div
        className="box-item"
        style={{
          overflowY: 'scroll',
          maxHeight: max_height,
        }}
      >
        <div className="box-item-body">
          <div className="job-item d-flex justify-content-between align-items-start">
            <div className="w-18">
              <div className=" label">Requestor</div>
              <div>{this.props.job.requestorName}</div>
              {this.props.job.requestorObj && (
                <>
                  <p
                    className="showNameEmail"
                    style={{ margin: 0 }}
                    title={this.props.job.requestorObj.phoneNumber || ''}
                  >
                    {this.props.job.requestorObj.phoneNumber || ''}
                  </p>
                  <p
                    className="showNameEmail"
                    style={{ margin: 0 }}
                    title={this.props.job.requestorObj.email || ''}
                  >
                    {this.props.job.requestorObj.email || ''}
                  </p>
                </>
              )}
            </div>
            <div className="w-18">
              <div className="label">Supervisor</div>
              <div>{this.props.job.supervisorName}</div>
              {this.props.job.supervisorObj && (
                <>
                  <p
                    className="showNameEmail"
                    style={{ margin: 0 }}
                    title={this.props.job.supervisorObj.phoneNumber || ''}
                  >
                    {this.props.job.supervisorObj.phoneNumber || ''}
                  </p>
                  <p
                    className="showNameEmail"
                    style={{ margin: 0 }}
                    title={this.props.job.supervisorObj.email || ''}
                  >
                    {this.props.job.supervisorObj.email || ''}
                  </p>
                </>
              )}
            </div>

            <div className="w-18">
              <div className="label">CC User</div>
              {this.props.job.ccUser && this.props.job.ccUser.length
                ? this.props.job.ccUser.map((user, i) => {
                    return (
                      <div key={i}>
                        <div>{user.firstName + ' ' + user.lastName}</div>
                        <p
                          className="showNameEmail"
                          style={{ margin: 0 }}
                          title={user.phoneNumber || ''}
                        >
                          {user.phoneNumber || ''}
                        </p>
                        <p
                          className="showNameEmail"
                          style={{ margin: 0 }}
                          title={user.email || ''}
                        >
                          {user.email || ''}
                        </p>
                      </div>
                    );
                  })
                : null}
            </div>

            <div className="w-18">
              <div className="label">Municipality</div>
              <div>
                {this.props.job.municipality
                  ? this.props.job.municipality.label
                  : `---`}
              </div>
            </div>
            <div className="w-18">
              <div className="label">Department</div>
              <div>{this.props.job.departmentName}</div>
            </div>
            <div className="w-10">
              <div className="label">Section</div>
              <div>{this.props.job.section}</div>
            </div>
          </div>
        </div>
        <div className="box-item-body">
          <div className="job-item d-flex justify-content-between align-items-center">
            <div className="w-20">
              <div className="label">Confirmation #</div>
              <div>{this.props.job.id}</div>
            </div>
            <div className="w-20">
              <div className="label">PO #</div>
              <div>{this.props.job.po}</div>
            </div>
            <div className="w-20">
              <div className="label">Feeder #</div>
              <div>{this.props.job.feeder}</div>
            </div>
            <div className="w-20">
              <div className="label">POET #</div>
              <div>{this.props.job.poet}</div>
            </div>
          </div>

          <div className="job-item d-flex justify-content-between align-items-center">
            <div className="w-20">
              <div className="label">Work Request #</div>
              <div>{this.props.job.wr || `---`}</div>
            </div>
            <div className="w-20">
              <div className="label">Requisition #</div>
              <div>{this.props.job.requisition || `---`}</div>
            </div>
            <div className="w-20">
              <div className="label">Max Workers</div>
              <div>{this.props.job.maxWorkers || `---`}</div>
            </div>
            <div className="w-20">
              <div className="label">Receipt #</div>
              <div>{this.props.job.receipt || `---`}</div>
            </div>
          </div>
        </div>

        <div className="box-item-body" style={{ background: '#F3F3F3' }}>
          {this.props.job &&
            this.props.job.locations &&
            this.props.job.workers && (
              <WorkerGroup
                groups={this.filterWorkerByLocation(
                  this.props.job.locations,
                  this.props.job.workers
                )}
                jobId={this.props.job.id}
                onSaveSuccess={this.fetchNewData}
                jobDetail={this.props.job}
                selectRow={()=>{}}
               // updateJobWorkers={this.props.updateJobWorkers}
              />
            )}
        </div>
        <div className="mb-10 d-flex justify-content-between flex-mobile here2">
          <div className="col-split-2">
            <div className="box-item-body">
              <div className="job-item job-item-comment">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="w-50">
                    <div className="label">Request Date/Time</div>
                    <div>
                      {moment(this.props.job.requestTime).format(
                        'MM/DD/YY HH:mm'
                      )}
                    </div>
                  </div>
                  <div className="w-50">
                    <div className="label">Total Hours</div>
                    <div>{this.props.job.totalHours}</div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="w-50">
                    <div className="label">Regular Hours</div>
                    <div>{this.props.job.regularHours | 0}h</div>
                  </div>
                  <div className="w-50">
                    <div className="label">Overtime Hours</div>
                    <div>{this.props.job.overtimeHours | 0}h</div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="w-50">
                    <div className="label">Holiday Hours</div>
                    <div>{this.props.job.holidayHours | 0}h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-split-2">
            <div className="box-item-body">
              <div className="job-item job-item-comment">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="w-50">
                    <div className="label">Billed</div>
                    <div>
                      {this.props.job.jobStatus === JOB_STATUSES.Billed
                        ? `Yes`
                        : `No`}
                    </div>
                  </div>
                  <div className="w-50">
                    {this.props.job.total_count_timesheets === 0 ? (
                      <div className="label">No current timesheets</div>
                    ) : (
                      <div className="label">
                        {this.props.job.total_count_timesheets} Timesheet(s)
                        Received
                      </div>
                    )}
                    <div>
                      <Button
                        variant={'outlined'}
                        onClick={this.viewTimeSheets}
                        disabled={this.props.job.total_count_timesheets === 0}
                      >
                        View Timesheets
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="label">Comments</div>
                  <div>{this.props.job.comment}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between flex-mobile">
          <div className="col-split-2">
            <div className="box-item-body">
              {this.state.workerId ? (
                <div className="p-4">
                  <div style={{ height: 180, width: '100%' }}>
                    <MapContainer
                      onZoomChanged={this.onZoomChanged}
                      zoom={this.state.zoom}
                      defaultZoom={this.state.zoom}
                      reference={(map) => (this.map = map)}
                      jobLocation={this.props.job.locations[0]}
                    >
                      {this.renderPoint(this.props.job)}
                    </MapContainer>
                  </div>
                </div>
              ) : (
                <div className="job-item d-flex justify-content-between">
                  <div>
                    {this.props.job && this.props.job.locations.map((location, index) => (
                      <div
                        key={index}
                        className="mb-2 d-flex align-items-center"
                      >
                        <CEIcon.MapMarkerAltSolidIcon className="mr-2" />
                        <span>
                          {location.address}
                          {location.structure ? (
                            <>
                              <span className="label">
                                {' - STRUCTURE: ' + location.structure}
                              </span>
                            </>
                          ) : (
                            ''
                          )}{' '}
                          <br />
                          {location.note}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="google-map-in-job-details ml-2">
                    <div className="col-right no-margin p-0">
                      <div style={{ height: 180, width: '100%' }} onClick={()=> history.push(`/map/${this.props.job.id}`)}>
                        <Tooltip title="See on the Map" aria-label="add" arrow>
                          <img 
                            src={LocationImg}
                            width={200}
                            height={170}
                          />
                        </Tooltip>
                        {/*<MapContainer
                          onZoomChanged={this.onZoomChanged}
                          zoom={this.state.zoom}
                          defaultZoom={this.state.zoom}
                          reference={(map) => (this.map = map)}
                          jobLocation={this.props.job.locations[0]}
                        >
                          {this.renderPoint(this.props.job)}
                        </MapContainer>*/}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-split-2">
            <div className="box-item-body">
              <div className="job-item d-flex">
                  <SimpleReactLightbox>
                    <SRLWrapper>
                      <div className="mb-2 d-flex align-items-center">
                        {this.props.job.locations.map(location=>location.images).flat().map((image, ind) => (
                          <div key={ind}>
                            <PreviewImage url={image} />
                          </div>
                        ))}
                      </div>
                    </SRLWrapper>
                  </SimpleReactLightbox>      
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  updateWorkers = async () => {
    this.props
      .updateJob(this.props.job.id, {
        workers: this.props.job.workers,
      })
      .then(() => {
        this.isToggleInfoModal = true;
        this.setState({ change: true });
      });
  };

  assignWorkers = (workers: JobWorker[]) => {
    jobStore.assignWorkersToDetailJob([...workers]);
  };

  renderContent(tab) {
    switch (tab) {
      case TabContent.TabDetails:
        return this.renderComponentJobDetails();
      case TabContent.TabSchedule:
        return (
          <JobAssign
            total_height={this.state.total_height}
            job={this.props.job}
            workers={this.props.job.workers}
            onAssign={this.assignWorkers}
            onSave={this.updateWorkers}
            disabled={
              (this.props.job.jobStatus === JOB_STATUSES.InProgress ||
                this.props.job.jobStatus === JOB_STATUSES.Cancelled ||
                this.props.job.jobStatus === JOB_STATUSES.Completed) &&
              !this.props.permissions('do_all')
            }
            buttonTitle={'Save Changes'}
          />
        );
      case TabContent.TabHistory:
        return (
          <History
            changesLog={this.props.job.changesLog}
            total_height={this.state.total_height}
            canDownload={true}
            downloadHistoryPdf={this.downloadHistoryPdf}
          >
            {' '}
          </History>
        );
    }
  }

  handleIsInProgressModal = (show) => {
    this.setState({isInProgressModal: show});
  }

  render() {
    const job = this.props.job;
    if (job == null) {
      return (
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
      );
    }

    return (
      <div className="d-flex App-content job-details-page">
        <div className="col-left">
          <JobMenuItemComponent />
        </div>
        <div className="col-right p-4">
          {this.renderMenu()}
          <div className="border-menu mb-3"></div>
          {this.renderContent(this.tab)}
        </div>
        <CancelJob 
          job={this.props.job}
          isInProgressModal = {this.state.isInProgressModal}
          handleIsInProgressModal = {this.handleIsInProgressModal}
        />
        <CEModal
          show={this.isToggleInfoModal}
          onClose={() => this.showInfoModal(false)}
          size="ce-modal-content"
        >
          <div className="modal-header">
            <span> Worker Schedule Updated Successfully!</span>
            <div className="ce-flex-right">
              <span
                className="pull-right"
                onClick={() => {
                  this.showInfoModal(false);
                }}
              >
                <CEIcon.Close />
              </span>
            </div>
          </div>
        </CEModal>
        <CompleteJob
          open={this.state.open_complete_job}
          onClose={this.handleCloseCompleteJobModal}
          job_id={job.id}
          setComplete={this.setComplete}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    confirm_jobs_processing: state.jobs.confirm_jobs_processing,
    job: state.jobs.job,
    permissions: state.app.permissions,
    can_complete_jobs: state.app.user
      ? [2, 5, 6, 8].some((r) => state.app.user.roles.includes(r))
      : false,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    confirmJobs: (job_ids) =>
      dispatch(actions.JobsActions.confirmJobs(job_ids)),
    retrieveJob: (job_id, workerId = '') =>
      dispatch(actions.JobsActions.retrieveJob(job_id, workerId)),
    updateJob: (job_id, data) =>
      dispatch(actions.JobsActions.updateJob(job_id, data)),
    updateJobWorkers: (job_id, worker) =>
      dispatch(actions.JobsActions.updateJobWorkers(job_id, worker)),
    clearJob: () => dispatch(actions.JobsActions.clearJob()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobDetailsComponent);
