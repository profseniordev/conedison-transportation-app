import React from 'react';
// import { Link } from 'react-router-dom';
import { JobType, JOB_STATUSES, NOTIFIABLE_TYPES } from '../../Constants/job';
import { JobListItem } from '../../Models/jobListItem';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import moment from 'moment';
import WorkerGroup from './RerouteWorker/WorkerGroup';
import notificationStore from '../../Stores/notificationStore';
import { actions } from '../../Services';
import { connect } from 'react-redux';
import history from '../../history';
import {Tooltip} from '@material-ui/core';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './JobItemShedule.scss';
import { requestorLetter } from '../../Constants/letter';
// import Box from '@material-ui/core/Box';
// import Typography from '@material-ui/core/Typography';
// import { title } from 'process';
// import VerticalBorder from '../../components/Border/VerticalBorder';

class JobItemSchedule extends React.Component<any> {
  static defaultProps = {
    selectable: true,
  };

  state: any;

  jobStatus: string[];
  constructor(props: any) {
    super(props);
    this.jobStatus = [
      JOB_STATUSES[1],
      JOB_STATUSES[2],
      JOB_STATUSES[3],
      JOB_STATUSES[4],
      JOB_STATUSES[5],
    ];
    this.state = {
      selectedWorkers: [],
      isToggleModal: false,
      newLocations: [],
      images: [],
      complete_job_processing: false,
    };
  }

  gotoDetails = () => {
    history.push(`/job/${this.props.job.id}`);
  };

  filterWorkerByLocation = (locations = [], workers = []) => {
    if (this.props.rerouteable) {
      let result = [];
      let temp = [...workers];
      // Filter worker by job location
      for (let j = 0; j < locations.length; j++) {
        const wks = temp.filter(
          (item) =>
            item.location &&
            locations[j].address &&
            item.location.address === locations[j].address
        );
        temp = temp.filter(
          (item) =>
            item.location &&
            locations[j].address &&
            item.location.address !== locations[j].address
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
    }
  };

  handleCompleteJob = (event) => {
    this.setState({ complete_job_processing: true });
    this.props
      .updateJob(this.props.job.id, { jobStatus: JOB_STATUSES.Completed })
      .then(() => {
        this.setState({ complete_job_processing: false });
      });
    event.stopPropagation();
  };

  render() {
    const { job } = this.props;
    const notifcation = notificationStore.notification;
    let status = job.jobStatus;
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
          if ((notifcation.notifiableRecord as JobListItem).id === job.id) {
            status = Number(
              (notifcation.notifiableRecord as JobListItem).jobStatus
            );
          }
          break;
        default:
          break;
      }
    }

    return (
      <div className="box-item-body hover-item-body cursor-pointer radius">
        <div>
          <div className="job-item border-bottom d-flex justify-content-between align-items-center header-item" onClick={this.gotoDetails}>
            <div className="d-flex align-items-center">
              <CheckboxComponent
                onChange={this.props.onCheckboxChange}
                checked={this.props.checked}
                id={`job-checkbox-${job.id}`}
                hasTitle={`${JobType[job.jobType]} #${job.id}`}
                color='#333333'
               />
              {/*<FormControlLabel
                control={
                  <Checkbox
                    icon={<CircleUnchecked />}
                    checkedIcon={<CircleCheckedFilled />}
                    onChange={this.props.onCheckboxChange}
                    checked={this.props.checked}
                    id={`job-checkbox-${job.id}`}
                    color="default"
                  />
                }
                label={
                  <div className="title">
                    {JobType[job.jobType]} #{job.confirmationNumber}
                  </div>
                }
              />*/}
              {/*<div className="d-flex align-items-center">
                <span className={`mr-2 circle-${JOB_STATUSES[status || 0].toLowerCase()}`}/>
                {JOB_STATUSES[status || 0]} - {JobType[job.jobType]}
              </div>*/}
            </div>
            <div className="d-flex">
              <div className="text-right">
                {/*<Link className="goto-job-detail" to={`/job/${job.id}`}>
                  <div>{job.confirmationNumber}</div>
                </Link>*/}
                {/*<div className="text-time-job">{moment(job.requestTime).format('MM/DD/YY HH:mm')}</div>*/}
                <div className="job-status">{JOB_STATUSES[status || 0].match(/[A-Z][a-z]+|[0-9]+/g).join(" ")}</div>
              </div>
            </div>
          </div>
          <div
            className="job-item flex-mobile border-bottom d-flex align-items-center job-details"
            onClick={this.gotoDetails}
          >
            <div className="text-left job-info">
              <div className="label" style={{ textTransform: 'capitalize' }}>
                Request Time & date
              </div>
              <div className="text-14-500">
                {moment(job.requestTime).format('MM/DD/YY HH:mm')}
              </div>
            </div>

            <div className="text-left job-info">
              <div className="label" style={{ textTransform: 'capitalize' }}>
                Supervisor
              </div>
              <div className="text-14-500">
                {job.supervisorName ? job.supervisorName : '—'}
              </div>
            </div>

            <div className="text-left job-info">
              <div className="label" style={{ textTransform: 'capitalize' }}>
                Department
              </div>
              <div className="text-14-500">{job.departmentName}</div>
            </div>

            <div className="text-left job-info">
              <div className="label" style={{ textTransform: 'capitalize' }}>
                Requestor
              </div>
              <div className="text-14-500">
                <a
                  href={requestorLetter(job.requestorEmail, job.requestorName, job.confirmationNumber, job.locations)}
                >
                  {job.requestorName}
                </a>
              </div>
            </div>

            <div className="w-100 job-info-right job-max-workers">
              <div className="label" style={{ textTransform: 'capitalize' }}>
                Max Workers
              </div>
              <div className="text-14-500">{job.maxWorkers}</div>
            </div>
            <Tooltip title={job.po ? job.po : ""} arrow aria-label="po">
              <div className="w-100 job-info-right">
                <div className="label">PO#</div>
                <div className="text-14-500">{job.po && job.po.length > 12 ? `${job.po.slice(0,11)}...` : job.po}{'\u00A0'}</div>
              </div>
            </Tooltip>
          </div>
        </div>

        {this.props.rerouteable && (
          <WorkerGroup
            groups={this.filterWorkerByLocation(job.locations, job.workers)}
            jobId={this.props.job.id}
            hasSeen={this.props.job.hasSeen}
            onSaveSuccess={this.props.search}
            jobDetail={this.props.job}
            selectRow={()=>{}}
            //updateJobWorkers={this.props.updateJobWorkers}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateJob: (job_id, data) =>
      dispatch(actions.JobsActions.updateJob(job_id, data)),
    updateJobWorkers: (job_id, worker) =>
      dispatch(actions.JobsActions.updateJobWorkers(job_id, worker)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobItemSchedule);
