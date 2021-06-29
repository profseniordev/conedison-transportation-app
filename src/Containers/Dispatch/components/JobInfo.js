import React, { Component } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { connect } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';
import { withStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import ReceiptIcon from '@material-ui/icons/Receipt';
import BlockIcon from '@material-ui/icons/Block';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';
import { JOB_STATUS_COLORS } from '../../../Constants/colors';
import JobLocationCard from './Details/JobLocationCard';
import * as COLORS from '../../../Constants/colors';
import AddWorker from '../dialog/addWorker/AddWorker';
import CancelJobReason from '../dialog/CancelJobReason/CancelJobReason';
import CompleteJob from '../dialog/completeJob/CompleteJob';
import LocationAddress from '../dialog/locationAddress/LocationAddress';
import Redispatch from '../dialog/Redispatch/Redispatch';
import history from '../../../history';
import { actions } from '../../../Services';
import JobNotes from './Details/JobNotes';
import './JobInfo.scss';
import ReRoute from '../dialog/ReRoute/ReRoute';
import EditShift from '../dialog/EditShift/EditShift';
import SmsIcon from '@material-ui/icons/Sms';
import PhoneIcon from '@material-ui/icons/Phone';
import { FormControlLabel } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import VerticalBorder from '../../../components/Border/VerticalBorder';
import ReviveJob from '../dialog/reviveJob/ReviveJob';
import CancelJob from '../../Job/dialogs/CancelJob';
import { toast } from 'react-toastify';
import { requestorLetter } from '../../../Constants/letter';

const styles = (theme) => ({
  root: {
    border: '1px solid #F2F2F2',
    // borderRadius: 16,
    boxShadow: '0px 6px 58px rgba(196, 203, 214, 0.103611)',
    marginBottom: 4,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #F2F2F2',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    height: 60,
    alignItems: 'center',
  },
  cardContent: {
    padding: '16px 18px',
    '&:last-child': {
      paddingBottom: theme.spacing(1),
    },
  },
  formControl: {
    '& .MuiFilledInput-root': {
      fontSize: 12,
      fontWeight: 500,
      borderRadius: 24,
      '& .MuiSelect-selectMenu': {
        paddingRight: theme.spacing(5),
        borderRadius: 24,
      },
    },
    '& .MuiFilledInput-underline:before': {
      display: 'none',
    },
    '& .MuiFilledInput-underline:after': {
      display: 'none',
    },
  },
  jobStatusDropdown: {
    '& .MuiFilledInput-root': {
      color: COLORS.GREEN_2,
      fontSize: 14,
      textTransform: 'uppercase',
      '& .MuiSelect-selectMenu': {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        backgroundColor: '#ffffff',
      },
      '& .MuiSelect-icon': {
        color: '#000000',
      },
    },
  },
  jobActionDropdown: {
    '& .MuiFilledInput-root': {
      border: '1px solid #F2F2F2',
      backgroundColor: COLORS.WHITE,
      '& .MuiSelect-selectMenu': {
        paddingTop: theme.spacing(1.4),
        paddingBottom: theme.spacing(1.4),
        paddingLeft: theme.spacing(2.5),
      },
      '& .MuiSelect-icon': {
        color: COLORS.BLACK,
        borderLeft: '1px solid #F2F2F2',
      },
    },
  },
  jobType: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: 'Roboto',
    marginBottom: 5,
    marginTop: 6,
  },
  jobId: {
    fontSize: 12,
  },
  requestTime: {
    fontWeight: 500,
  },
  requestor: {
    fontWeight: 500,
    color: '#2F80ED',
    cursor: 'pointer',
  },
  comments: {
    lineHeight: '24px',
  },
  moreDetailsButton: {
    minWidth: 70,
    fontSize: 14,
    borderRadius: 20,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    borderColor: '#F2F2F2',
    textTransform: 'capitalize',
  },
  confirmed: {
    marginLeft: 5,
    marginBottom: 0,
    '& .MuiButtonBase-root': {
      height: '36px',
      width: '36px',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '16px',
      color: 'rgba(0,0,0,0.54)',
      marginBottom: '3px',
    },
    '& .MuiTypography-root': {
      fontSize: '16px',
      color: 'rgba(0,0,0,0.60)',
      letterSpacing: '0.33px',
      lineHeight: '16px',
    },
  },
  unconfirmed: {
    marginLeft: 5,
    marginBottom: 0,
    '& .MuiButtonBase-root': {
      height: '36px',
      width: '36px',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '16px',
      color: 'rgba(0,0,0,0.54)',
      marginBottom: '3px',
    },
    '& .MuiTypography-root': {
      color: '#2F80ED',
      fontWeight: 700,
      fontSize: '16px',
      letterSpacing: '0.33px',
      lineHeight: '16px',
    },
  },
});

class JobInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      selected_shift_id: 0,
      open_add_worker: false,
      open_cancel_job: false,
      open_location_address: false,
      open_complete_job: false,
      open_revive_job: false,
      open_reroute: false,
      open_edit_shift: false,
      open_redispatch: false,
      anchorEl: null,
      anchorElRequestor: null,
      showConfirmTooltip: false,
    };
  }

  handleShowConfirmTooltipClose = () => {
    this.setState({ showConfirmTooltip: false });
  };

  handleShowConfirmTooltipOpen = () => {
    this.setState({ showConfirmTooltip: true });
  };

  openRequestor = (event) => {
    this.setState({
      anchorElRequestor: event.currentTarget,
    });
  };
  closeRequestor = () => {
    this.setState({
      anchorElRequestor: null,
    });
  };

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };
  //
  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  getChipColorFromStatus = (status) => {
    switch (status) {
      case 'new':
        return JOB_STATUS_COLORS.SEARCHING;
      case 'inprogress':
        return JOB_STATUS_COLORS.IN_PROGRESS;
      case 'cancelled':
        return JOB_STATUS_COLORS.DRIVER_LATE;
      default:
        return JOB_STATUS_COLORS.SEARCHING;
    }
  };

  assignWorker = (job_worker_id) => {
    this.setState({
      selected_shift_id: job_worker_id,
      open_add_worker: true,
    });
    // setShiftID(job_worker_id);
    // setOpenWorkderModal(true);
  };

  updateWorkerStatus = async (job_worker_id, data) => {
    if (data.status === 'revive') {
      this.setState({
        open_redispatch: true,
        selected_shift_id: job_worker_id,
      });
    } else {
      await this.props.updateJobWorker(this.props.job.id, job_worker_id, data)
      .catch(error => {
        toast.error(error.error, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });;
    }
  };

  reRouteWorker = (job_worker_id) => {
    this.setState({ open_reroute: true, selected_shift_id: job_worker_id });
    // this.props.updateJobWorker(this.props.job.id, job_worker_id, data);
  };

  editShift = (shift) => {
    this.setState({ open_edit_shift: true, selected_shift: shift });
  };

  addShift = (location_id) => {
    this.props.addShift(this.props.job.id, location_id);
  };

  handleCloseWorkerModal = () => {
    this.setState({ open_add_worker: false });
  };

  handleCloseCancelJobReasonModal = () => {
    this.setState({ open_cancel_job: false });
  };

  handleCloseCompleteJobModal = () => {
    this.setState({ open_complete_job: false });
  };
  handleCloseReviveJobModal = () => {
    this.setState({ open_revive_job: false });
  };

  handleCloseEditShiftModal = () => {
    this.setState({ open_edit_shift: false });
  };

  handleCloseRerouteModal = () => {
    this.setState({ open_reroute: false });
  };

  handleCloseLocationAddressModal = () => {
    this.setState({ open_location_address: false });
  };

  handleCloseRedispatchModal = () => {
    this.setState({ open_redispatch: false });
  };

  handleChange = (event) => {
    //alert(event.target.value);
    // setStatus(event.target.value);
    //props.updateJob(job.id, {status: event.target.value})
  };

  editJob = () => {
    this.handleClose();
    history.push(`/job/${this.props.job.id}/edit`);
  };

  CancelJobReason = (show) => {
    this.handleClose();
    this.setState({
      open_cancel_job: show,
    });
  };

  addLocation = () => {
    this.handleClose();
    this.setState({
      open_location_address: true,
    });
  };

  completeJob = () => {
    this.handleClose();
    this.setState({
      open_complete_job: true,
    });
  };
  reviveJob = () => {
    this.handleClose();
    this.setState({
      open_revive_job: true,
    });
  };

  confirmJob = () => {
    this.props
      .updateJobStatus(this.props.job.id, {
        status: 'confirmed',
        value: this.props.job.confirmed === 1 ? 0 : 1,
      })
      .then(() => {
        // this.setState({
        //   processing: false,
        // });
        // this.props.onClose();
        this.handleShowConfirmTooltipClose();
      });

  };

  formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  };

  moreDetails = () => {
    history.push(`/job/${this.props.job.id}`);
  };

  viewShifts = () => {
    this.handleClose();
    this.props.updateFilters({
      search: `id:${this.props.job.id}`,
    });
  };

  render() {
    const { classes, job } = this.props;
    if (job == null) {
      return (
        <div className="job-info-wrapper">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography className={classes.jobType} variant="h5">
              Please select job
            </Typography>
          </Box>
        </div>
      );
    }

    return (
      <div className="job-info-wrapper">
        <Card className={classes.root}>
          <Box className={classes.cardHeader}>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <FormControl
                variant="filled"
                className={clsx(classes.formControl, classes.jobStatusDropdown)}
                style={{ alignItems: 'center' }}
              >
                <p
                  style={{
                    color: '#27AE60',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                  }}
                >
                  {job.status}
                </p>
              </FormControl>
            </Box>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                {job.confirmed === 1 ? (
                  <Typography className={classes.jobType} variant="h5">
                    Job #{job.id} {job.type}
                  </Typography>
                ) : (
                  <div>
                    <Typography className={classes.jobType} variant="h5">
                      Job #{job.id}
                    </Typography>
                    <Typography className={classes.jobType} variant="h5">
                      {job.type}
                    </Typography>
                  </div>
                )}
              </Box>
              {!job.confirmed && (
                <VerticalBorder
                  style={{ height: 60, marginLeft: 10, marginRight: 10 }}
                />
              )}
              <Tooltip
                open={this.state.showConfirmTooltip}
                onClose={this.handleShowConfirmTooltipClose}
                onOpen={this.handleShowConfirmTooltipOpen}
                title="Confirm job"
                aria-label="Confirm job"
                arrow
              >
                <FormControlLabel
                  onClick={this.confirmJob}
                  control={<div />}
                  className={
                    job.confirmed ? classes.confirmed : classes.unconfirmed
                  }
                  label={
                    job.confirmed === 1 ? null : (
                      <div
                        style={{
                          background: 'rgb(255 46 249)',
                          borderRadius: '8px',
                          padding: '7px',
                        }}
                      >
                        <div className="checkBox" />{' '}
                      </div>
                    )
                  }
                />
              </Tooltip>
            </div>
          </Box>

          <CardContent className={classes.cardContent}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Box display="flex" alignItems="center">
                <EventAvailableOutlinedIcon fontSize="small" />
                <Box ml={2}>
                  <Typography variant="body2" color="textSecondary">
                    Start
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography className={classes.requestTime} variant="body2">
                  {moment(job.start_at).format('MMMM DD, YYYY h:mm A')}
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Box display="flex" alignItems="center">
                <SupervisorAccount fontSize="small" />
                <Box ml={2}>
                  <Typography variant="body2" color="textSecondary">
                    Workers requested
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography className={classes.requestTime} variant="body2">
                  {job.max_workers}
                </Typography>
              </Box>
            </Box>
            {job.added_by && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Box display="flex" alignItems="center">
                  <PersonIcon fontSize="small" />
                  <Box ml={2}>
                    <Typography variant="body2" color="textSecondary">
                      Requestor
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ flexDirection: 'column' }}
                >
                  {/*<a href={`mailto:${job.added_by.email}?subject=Regarding%20Job%20${job.reference_id}&body=Hello%20${encodeURI(job.added_by.name)}%2C%0D%0A%0D%0ARegarding%20Job%20${job.reference_id}%2C`}
                   style={{textDecoration: 'none'}}>*/}
                  <Typography
                    variant="body2"
                    onClick={this.openRequestor}
                    className={classes.requestor}
                  >
                    {job.added_by.name}
                  </Typography>
                  {/*</a>*/}
                  {/*<a href={`tel:${job.added_by.phone_number}`} style={{textDecoration: 'none'}}>
                  <Typography className={classes.requestTime} variant="body2">
                    {this.formatPhoneNumber(job.added_by.phone_number)}
                  </Typography>
            </a>*/}
                  <Menu
                    id="customized-menu"
                    classes={{ paper: 'requestor_menu' }}
                    anchorEl={this.state.anchorElRequestor}
                    keepMounted
                    open={Boolean(this.state.anchorElRequestor)}
                    onClose={this.closeRequestor}
                    anchorOrigin={{
                      vertical: 'bottom',
                    }}
                  >
                    <a
                      href={requestorLetter(job.added_by.email, job.added_by.name, job.reference_id, job.locations )}
                      style={{ textDecoration: 'none', color: '#333333' }}
                    >
                      <MenuItem onClick={this.closeRequestor}>
                        <Typography variant="body1">Send E-mail</Typography>
                        <SmsIcon fontSize="small" style={{ fill: '#BDBDBD' }} />
                      </MenuItem>
                    </a>
                    <a
                      href={`tel:${job.added_by.phone_number}`}
                      style={{ textDecoration: 'none', color: '#333333' }}
                    >
                      <MenuItem onClick={this.closeRequestor}>
                        <Typography variant="body1">
                          Call to Requestor
                        </Typography>
                        <PhoneIcon
                          fontSize="small"
                          style={{ fill: '#BDBDBD' }}
                        />
                      </MenuItem>
                    </a>
                  </Menu>
                </Box>
              </Box>
            )}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                className={classes.moreDetailsButton}
                variant="outlined"
                onClick={this.moreDetails}
              >
                More Details
              </Button>
              <Box>
                <Button
                  className={classes.moreDetailsButton}
                  variant="outlined"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  Edit Job
                  <ArrowDropDownIcon fontSize="small" />
                </Button>
                <Menu
                  id="simple-menu-job"
                  anchorEl={this.state.anchorEl}
                  keepMounted
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleClose}
                >
                  {['new', 'in_progress'].indexOf(job.status) !== -1 && (
                    <MenuItem onClick={this.completeJob}>
                      <ListItemIcon>
                        <AssignmentTurnedIn
                          fontSize="small"
                          style={{ fill: '#4baf4f' }}
                        />
                      </ListItemIcon>
                      Complete
                    </MenuItem>
                  )}
                  {['new', 'in_progress'].indexOf(job.status) !== -1 && (
                    <MenuItem onClick={() => this.CancelJobReason(true)}>
                      <ListItemIcon>
                        <BlockIcon
                          fontSize="small"
                          style={{ fill: '#EB5757' }}
                        />
                      </ListItemIcon>
                      Cancel
                    </MenuItem>
                  )}
                  {['cancelled', 'completed'].indexOf(job.status) !== -1 && (
                    <MenuItem onClick={this.reviveJob}>
                      <ListItemIcon>
                        <BlockIcon
                          fontSize="small"
                          style={{ fill: '#EB5757' }}
                        />
                      </ListItemIcon>
                      Revive
                    </MenuItem>
                  )}
                  {/*{['new', 'in_progress'].indexOf(job.status) !== -1 && <MenuItem onClick={this.addLocation}>
                    <ListItemIcon>
                      <AddCircleIcon
                        fontSize="small"
                        style={{ fill: '#2F80ED' }}
                      />
                    </ListItemIcon>
                    Add Location
                  </MenuItem>}*/}
                  <MenuItem onClick={this.editJob}>
                    <ListItemIcon>
                      <BorderColorIcon
                        fontSize="small"
                        style={{ fill: '#E0E0E0' }}
                      />
                    </ListItemIcon>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={this.viewShifts}>
                    <ListItemIcon>
                      <ReceiptIcon
                        fontSize="small"
                        style={{ fill: '#E0E0E0' }}
                      />
                    </ListItemIcon>
                    View shifts
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box>
          {job.locations.map((location, index) => (
            <JobLocationCard
              key={index}
              job={job}
              job_type={job.type}
              job_id={job.id}
              location={location}
              index={index + 1}
              workers={job.workers.filter(
                (worker) => worker.location_id === location.id
              )}
              assignWorker={this.assignWorker}
              updateWorkerStatus={this.updateWorkerStatus}
              editShift={this.editShift}
              addShiftFunction={this.addShift}
              job_types={job.type === 'Parking'}
            />
          ))}
        </Box>
        <JobNotes job={job} />
        <AddWorker
          open={this.state.open_add_worker}
          onClose={this.handleCloseWorkerModal}
          job_id={job.id}
          job_worker_id={this.state.selected_shift_id}
        />
        {/*<CancelJobReason
          open={this.state.open_cancel_job}
          onClose={this.handleCloseCancelJobReasonModal}
          job_id={job.id}
        />*/}
        <CancelJob 
          job={job}
          isInProgressModal = {this.state.open_cancel_job}
          handleIsInProgressModal = {this.CancelJobReason}
          />
        <CompleteJob
          open={this.state.open_complete_job}
          onClose={this.handleCloseCompleteJobModal}
          job_id={job.id}
        />
        <ReviveJob
          open={this.state.open_revive_job}
          onClose={this.handleCloseReviveJobModal}
          job_id={job.id}
        />
        <ReRoute
          open={this.state.open_reroute}
          onClose={this.handleCloseRerouteModal}
          job_id={job.id}
          job_worker_id={this.state.selected_shift_id}
        />
        {this.state.selected_shift && (
          <EditShift
            open={this.state.open_edit_shift}
            onClose={this.handleCloseEditShiftModal}
            shift={this.state.selected_shift}
            job_id={job.id}
          />
        )}
        <LocationAddress
          job={job}
          open={this.state.open_location_address}
          onClose={this.handleCloseLocationAddressModal}
          job_id={job.id}
        />
        {this.state.selected_shift && (
          <EditShift
            open={this.state.open_edit_shift}
            onClose={this.handleCloseEditShiftModal}
            shift={this.state.selected_shift}
            job_id={job.id}
          />
        )}
        <Redispatch
          open={this.state.open_redispatch}
          onClose={this.handleCloseRedispatchModal}
          job_id={job.id}
          job_worker_id={this.state.selected_shift_id}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateJobStatus: (job_id, options) =>
      dispatch(actions.JobsActions.updateJobStatus(job_id, options)),
    retrieveLocationJob: (job_location) =>
      dispatch(actions.JobsActions.retrieveLocationJob(job_location)),
    updateJobWorker: (job_id, job_worker_id, data) =>
      dispatch(
        actions.JobsActions.updateJobWorker(job_id, job_worker_id, data)
      ),
    updateFilters: (filters) =>
      dispatch(actions.JobsActions.updateLocationsFilters(filters)),
    addShift: (job_id, location_id) =>
      dispatch(actions.JobsActions.addShift(job_id, location_id)),
  };
}

function mapStateToProps(state) {
  return {
    job: state.jobs.location_job,
  };
}

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(JobInfo)
);
