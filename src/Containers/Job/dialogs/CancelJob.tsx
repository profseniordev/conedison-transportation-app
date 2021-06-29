import React from 'react';
import {Dialog, DialogActions, DialogTitle} from '@material-ui/core';
import { JOB_STATUSES } from '../../../Constants/job';
import Button from '../../../components/Button/Button';
import CancelJobReason from '../../Dispatch/dialog/CancelJobReason/CancelJobReason';
import '../JobDetails.scss';
import { connect } from 'react-redux';
import { JobType } from '../../../Constants/job';
import moment from 'moment';

const MIN_TRACKING_HOURS = 0;
interface Props {
    job: any;
    isInProgressModal: boolean;
    handleIsInProgressModal: Function;
    permissions: any;
};
class  CancelJob extends React.Component<Props, any>  {
  trackingHours = 0;
  isToggleModal: boolean;
  isToggleModals: boolean;

  constructor(props){
    super(props);
    this.state = {
      status: ''
    }
  }

  componentDidUpdate(prevProps) {
    //if (this.props.job.id !== prevProps.job.id) {
      this.getTrackingHours();
    //}
  }

  componentDidMount() {
    this.getTrackingHours();
    this.setState({change: true});
  }

  getTrackingHours = () => {
    if (this.props.job.jobStatus === JOB_STATUSES.InProgress || this.props.job.status === 'in_progress' || this.props.job.jobStatus === JOB_STATUSES.Completed) {
      this.trackingHours = this.props.job.workers.reduce((sum, worker) => {
        let start_at;
        if(worker.start_at)
          start_at = worker.start_at;
        else 
          start_at = worker.startDate;
        //console.log('diff', moment(worker.startDate).diff(moment(new Date()), 'hours'), moment(worker.start_at).diff(moment(new Date()), 'hours'),worker.startDate, worker.start_at, start_at);
        if (worker.status !== "pending" && moment(start_at).diff(moment(new Date()), 'hours') < 1 ) {
          if ((worker.workerStatus === "review_finished" || worker.status === "review_finished" || worker.workerStatus === "review" || worker.status === "review" ) 
              && (this.props.job.type !=="Flagging" || this.props.job.jobType !== JobType.Flagging )) {
            return sum + parseFloat(worker.totalHours);
          } else {
            if(parseFloat(worker.totalHours) > 4) {
              return sum + parseFloat(worker.totalHours)
            } else if(this.props.job.type ==="Flagging" || this.props.job.jobType === JobType.Flagging) {
              return sum + 4;
            } else {
              return sum;
            }
          } 
        } else {
          return sum;
        }
      }, 0);
    }
  }

  showCancelJob(show, status) {
    this.isToggleModal = show;
    this.setState({ change: true, status: status});
  } 
  
  showModal(show) {
    this.props.handleIsInProgressModal(show);
  }
    
  render() {
    //if (this.props.job.jobStatus === JOB_STATUSES.InProgress || this.props.job.status === 'in_progress' || this.props.job.jobStatus === JOB_STATUSES.Completed || (this.props.permissions.includes('cancel_all_jobs') && this.props.job.jobStatus === JOB_STATUSES.CancelledBillable)){
    if(this.props.job.jobStatus !== JOB_STATUSES.New || this.props.job.status !== 'new') {
      if(this.props.permissions.includes('can_cancel_without_charging')){
        return (
            <React.Fragment>
              <Dialog
                  onClose={() => this.showModal(false)}
                  open={this.props.isInProgressModal}
                  maxWidth="lg"
                
                >
                <DialogTitle className={'cancel-title'}>
                  This job has already started, cancelling would invoke a {this.trackingHours.toFixed(2)} Hour.  Would you like to:
                </DialogTitle>
                <DialogActions
                    className={'action-button-group d-flex space-between'}
                >
                  <Button //cancell-billable
                    disabled={this.props.job.jobStatus === JOB_STATUSES.CancelledBillable || this.props.job.status === 'cancel_billable'}
                    color={'gray'}
                    width={'170px'}
                    borderRadius={'20px'}
                    textTransform={false}
                    onClick={() => {
                      this.showCancelJob(true, 'cancel_billable');
                      this.showModal(false);
                    }}
                  >
                    Accept Late Cancel
                  </Button>
                  <Button //cancell
                    color={'gray'}
                    //width={'170px'}
                    borderRadius={'20px'}
                    textTransform={false}
                    onClick={() => {
                      this.showCancelJob(true, 'cancel');
                      this.showModal(false);
                    }}
                  >
                    Cancel w/out Charging
                  </Button>
                  <Button
                    color={'dark'}
                    width={'170px'}
                    borderRadius={'20px'}
                    textTransform={false}
                    onClick={() => this.showModal(false)}
                  >
                    Don’t Cancel
                  </Button>
                </DialogActions>
              </Dialog>
              <CancelJobReason
                open={this.isToggleModal}
                onClose={() => this.showCancelJob(false, '')}
                job_id={this.props.job.id}
                status={this.state.status}
              /> 
            </React.Fragment>
        )
      } else {
        return (
          <React.Fragment>
            <Dialog
              onClose={() => this.showModal(false)}
              open={this.props.isInProgressModal}
            >
              <DialogTitle className={'cancel-title'}>
                The Job has already started, if you close it now, you will be
                charged for {this.trackingHours.toFixed(2)} hours
              </DialogTitle>
              <DialogActions
                className={'action-button-group d-flex space-between'}
              >
                <Button
                  color={'gray'}
                  width={'158px'}
                  borderRadius={'20px'}
                  textTransform={false}
                  onClick={() => this.showModal(false)}
                >
                  Don't Cancel
                </Button>
                <Button
                  color={'dark'}
                  width={'158px'}
                  borderRadius={'20px'}
                  textTransform={false}
                  onClick={() => {
                    this.showCancelJob(true, 'cancel_billable');
                    this.showModal(false);
                  }}
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
            <CancelJobReason
              open={this.isToggleModal}
              onClose={() => this.showCancelJob(false, '')}
              job_id={this.props.job.id}
              status={this.state.status}
            />
          </React.Fragment>);
        }
      } else {
        return (
          <CancelJobReason
            open={this.props.isInProgressModal}
            onClose={() => this.showModal(false)}
            job_id={this.props.job.id}
          />
        );
      }
    }
  }

  function mapStateToProps(state) {
    return {  
      permissions: state.app.permissions,
    };
  }

  export default connect(mapStateToProps, null)(CancelJob);