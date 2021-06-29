import React from 'react';
import CheckboxComponent from '../../Components/Controls/Checkbox.Component';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import TimesheetsTable from './TimesheetsTable';
import moment from 'moment';
import { connect } from 'react-redux';
import { actions } from '../../../Services';
import {Tooltip} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MarkAsBilled from '../dialog/MarkAsBilled';
import { JobType } from '../../../Constants/job';

const jobStatusBtn = {
  timesheets_pending_approval: {
    currentStatus: 'Timesheets pending for approval',
    nextStatus: 'timesheets_verified',
    currentLbl: 'Approve for Billing',
    disableDisputedBtn: true,
    showConedApprBtn: false,
  },

  timesheets_verified: {
    currentStatus: 'Timesheets verified; pending Con-Ed approval',
    nextStatus: 'coned_approved',
    currentLbl: 'ConEd Approve',
    disableDisputedBtn: false,
    showConedApprBtn: false,
  },


  coned_approved: {
    currentStatus: ' Con-Ed Approved',
    nextStatus: 'ready_for_invoicing',
    //nextStatus: 'billed',
    currentLbl: 'Mark as Ready for Invoicing',
    //currentLbl: 'Mark as Billed',
    disableDisputedBtn: true,
    showConedApprBtn: false,
  },

  ready_for_invoicing: {
    currentStatus: 'Ready for invoicing',
    //nextStatus: 'billed',
    nextStatus: null,
    currentLbl: 'Mark as Billed',
    disableDisputedBtn: true,
    showConedApprBtn: false,
  },

  billed: {
    currentStatus: 'Billed',
    nextStatus: null,
    currentLbl: 'Billed',
    disableDisputedBtn: true,
    showConedApprBtn: false,
  },

  coned_disputed: {
    currentStatus: ' Con-Ed Disputed',
    nextStatus: 'timesheets_verified',
    currentLbl: 'Approve for Billing',
    disableDisputedBtn: false,
    showConedApprBtn: false,
  },

  mark_as_billed: {
    currentStatus: null,
    nextStatus: 'billed',
    currentLbl: 'Mark as Billed',
    disableDisputedBtn: true,
    showConedApprBtn: false,
  },

}
class BillingInfoRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timesheetsPendingVerification: 0,
      showDetails: false,
      po_number: this.props.job.po,
      locationsArray: [], 
      openModal: false
    };
    //this.ShowDetailsClick = this.ShowDetailsClick.bind(this);
  }


  ShowDetailsClick = () => {
    //let button = !this.state.showDetails;
    this.setState({ showDetails: !this.state.showDetails });
  };

  handleClickAway = () => {
    this.setState({ showDetails: false });
  };


  chengeJobStatus = (id, status) => {
    this.props.updateStatus(id, {status: status});
  }

  getLocationsArray = (timesheets) => {
    let locations = [];
    if(timesheets.length > 0 )
      locations = timesheets.map(t => t.location_id);
    locations = locations.filter(x => x !== null);
    this.setState({locationsArray: locations});
  }

  openMarkAsBilledModal = () => {
    this.setState({openModal: true});
  }

  closeMarkAsBilledModal = () => {
    this.setState({openModal: false});
  }

  render() {
    const { job } = this.props;

    const topMenu = (
      <div className="d-flex justify-content-between align-items-center pl-4 pr-4 pb-2 height-57">
        <div className="d-flex justify-content-between align-items-center ">
          <CheckboxComponent
            onChange={this.props.onCheckboxChange}
            checked={this.props.checked}
            id={`job-checkbox-${job.id}`}
            className="title-project mb-0 mr-3"
            //  id={`job-checkbox-${job.id}`}
            //        hasTitle={job.title}
          />
          <div>{JobType[job.type_id]} #{job.id} (Location: {job.locations.join(', #')})</div>
        </div>
        <div className='d-flex justify-content-between align-items-center'>
          <div style={{marginRight: 20}}>{jobStatusBtn[job.billing_status].currentStatus}</div>
          {jobStatusBtn[job.billing_status].nextStatus !== null &&
            <div className='d-flex justify-content-between'>
              {jobStatusBtn[job.billing_status].showConedApprBtn && 
                <button className="btn btn-primary " 
                        style={{width: 233, marginRight: 23}}
                        disabled={(job.unverifiedCount !== 0 || job.timesheets.length===0 )}
                        onClick={() => this.chengeJobStatus(job.id, jobStatusBtn.timesheets_verified.nextStatus)}>
                  {jobStatusBtn.timesheets_verified.currentLbl}
                </button>
              }
            <Tooltip title={(job.unverifiedCount !== 0 || job.timesheets.length===0 ) ? 'Please verify all timesheets before approving': ''} aria-label={'arrow ' + job.id} arrow>
              <div>
                <button className="btn btn-primary " 
                        style={{width: 233}}
                        disabled={(job.unverifiedCount !== 0 || job.timesheets.length===0 )}
                        onClick={() => this.chengeJobStatus(job.id, jobStatusBtn[job.billing_status].nextStatus)}>
                  {jobStatusBtn[job.billing_status].currentLbl}
                </button>
              </div>
            </Tooltip>
            <div>
                <button className="btn btn-primary " 
                        style={{width: 233, marginLeft: 15}}
                        onClick={() => this.openMarkAsBilledModal()}
                        //onClick={() => this.chengeJobStatus(job.id, jobStatusBtn['mark_as_billed'].nextStatus)}
                        >
                  {jobStatusBtn['mark_as_billed'].currentLbl}
                </button>
              </div>
          </div>}
        </div>
      </div>
    );
    const buttonMenu = (
     <div>
        <div className="d-flex justify-content-between align-items-center pl-4 pr-4 pb-3  mt-3 cursor-pointer"
             onClick={this.ShowDetailsClick}>
          {job.unverifiedCount > 0 ? (
            <div className="d-flex ">
              <div className="sad-mood mr-2" />
              <div className="sad">
                {' '}
                {job.unverifiedCount} timesheets pending verification
              </div>
            </div>
          ) : (
            <div className="d-flex ">
              <div className="good-mood mr-2" />
              <div className="good"> All Timesheets Verified </div>
            </div>
          )}
          <div className="  d-flex">
            {this.state.showDetails ? (
              <div className=" d-flex">
                <div className="show-details cursor-pointer">Hide details</div>
                <ArrowDropUpIcon
                  fontSize="small"
                  style={{ color: '#2F80ED' }}
                />
              </div>
            ) : (
              <div className="d-flex">
                <div className="show-details cursor-pointer">Show details</div>
                <ArrowDropDownIcon
                  fontSize="small"
                  style={{ color: '#2F80ED' }}
                />
              </div>
            )}
          </div>
        </div>
        {this.state.showDetails && (
          <TimesheetsTable 
            timesheets={job.timesheets} 
            jobId={job.id} 
            cancelledJob={job.status === 'cancelled' || job.status === 'cancelled_billable'}
            jobStatus={job.billing_status}
            disableDisputedBtn={jobStatusBtn[job.billing_status].disableDisputedBtn}/>
        )}
      </div>
    );
    return (
      <>
      <ClickAwayListener onClickAway={this.handleClickAway}>
      <div className="BillingInfo">
        <div className="block-white-info ">
          {topMenu}
          <div className=" table-info-billing row d-flex justify-content-between ">
            <div className="col-2  ml-4">
              <div className="table-title"> Request Time & date</div>
              <div className="table-description">
                {' '}
                {moment(job.requestTime).format('DD MMM YY  HH:mm')}{' '}
              </div>
            </div>
            <div className="col-2  row">
              <div className="vertical-border" />
              <div className="ml-2">
                <div className="table-title"> Department</div>
                <div className="table-description">{job.departmentName}</div>
              </div>
            </div>
            <div className="col-2 row">
              <div className="vertical-border" />
              <div className="ml-2">
                <div className="table-title">Requestor</div>
                <div className="table-description color-blue">
                 {job.requestorName}
                </div>
              </div>
            </div>
            <div className="col-2 row">
              <div className="vertical-border" />
              <div className="ml-2">
                <div className="table-title"> Total Work Time</div>
                <div className="table-description">{Math.trunc(job.total_hours)+' h '+ parseInt((job.total_hours-Math.trunc(job.total_hours))*100) + ' m' }</div>
              </div>
            </div>
            <div className="col-2 row">
              <div className="vertical-border" />
              <Tooltip title={job.po && job.po.length > 12 ? job.po : ""} arrow aria-label="po">
                <div className="ml-2">
                  <div className="table-title">PO #</div>
                  <div className="table-description">{job.po && job.po.length > 12 ? `${job.po.slice(0,11)}...` : job.po}</div>
                </div>
              </Tooltip>
            </div>
            <div className="col-2 row">
              <div className="vertical-border" />
              <Tooltip title={job.requisition && job.requisition.length > 12 ? job.requisition : ""} arrow aria-label="requisition">
                <div className="ml-2">
                  <div className="table-title">Requisition #</div>
                  <div className="table-description">{job.requisition && job.requisition.length > 12 ? `${job.requisition.slice(0,11)}...` : job.requisition}</div>
                </div>
              </Tooltip>
            </div>
            <div className="col-2 row">
              <div className="vertical-border" />
              <Tooltip title={job.receipt_number && job.receipt_number.length > 12 ? job.receipt_number : ""} arrow aria-label="receipt_number">
                <div className="ml-2">
                  <div className="table-title">Receipt #</div>
                  <div className="table-description">{job.receipt_number && job.receipt_number.length > 12 ? `${job.receipt_number.slice(0,11)}...` : job.receipt_number}</div>
                </div>
              </Tooltip>
            </div>
            <div className="col-2 row">
              <div className="vertical-border" />
              <div className="ml-2">
                <div className="table-title">Total Due</div>
                <div className="table-description">{job.totalDue}</div>
              </div>
            </div>
          </div>
          {job && job.timesheets && job.timesheets.length > 0 && buttonMenu}
        </div>
      </div>
      </ClickAwayListener>
      <MarkAsBilled 
      open={this.state.openModal}
        confirm={this.chengeJobStatus}
        jobId={job.id}
        status={jobStatusBtn['mark_as_billed'].nextStatus}
        onClose={this.closeMarkAsBilledModal}
        
        />
      </>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updatePOS: (job_ids, po_number) =>
      dispatch(actions.JobsActions.updatePO(job_ids, po_number)),
    updateStatus: (id, status) => dispatch(actions.BillingActions.updateStatus(id, status)),
  };
}

export default connect(null, mapDispatchToProps)(BillingInfoRow);
