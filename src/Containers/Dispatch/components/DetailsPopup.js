import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import history from '../../../history';
import Menu from '@material-ui/core/Menu';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../Services';
import CircularProgress from '@material-ui/core/CircularProgress';
import { WORKER_STATUSES } from '../../../Constants/worker';

const DetailsPopup = ({
  worker,
  updateWorkerStatus,
  addLocation,
  editShift,
  job_type,
  onClose,
  setSelectedWorker,
  job_status,
}) => {
  const [processing_id, setProcessing] = useState(0);

  const locations = useSelector((state) => state.jobs.location_job.locations);
  const dispatch = useDispatch();

  const handleAddLocation = () => {
    setSelectedWorker(worker);
    addLocation();
  };

  const reRoute = (location) => {
    if (processing_id > 0) {
      return null;
    }
    setProcessing(location.id);
    dispatch(
      actions.JobsActions.updateJobWorker(worker.job_id, worker.id, {
        status: 're_route',
        location_id: location.id,
      })
    ).then(
      () => {
        setProcessing(0);
        closeReroute();
        onClose();
      },
      () => {
        setProcessing(0);
        closeReroute();
        onClose();
      }
    );
  };

  let status_updates = [];

  switch (worker.status) {
    case 'assigned':
      status_updates = [
        {
          label: 'En Route',
          value: 'en_route',
        },
        {
          label: 'Redispatch',
          value: 'revive',
          reason_required: true,
        },
        {
          label: 'Cancel',
          value: 'cancel',
        },
      ];
      break;
    case 'en_route':
      status_updates = [
        {
          label: 'On Location',
          value: 'on_location',
        },
        {
          label: 'Redispatch',
          value: 'revive',
          reason_required: true,
        },
        {
          label: 'Cancel',
          value: 'cancel',
        },
      ];
      break;
    case 'on_location':
      switch (job_type) {
        case 'Flagging':
          status_updates.push({
            label: 'Ready for crew',
            value: 'secured',
          });
          break;
        case 'Parking':
        case 'Signage':
          status_updates.push({
            label: 'Secure',
            value: 'secured',
          });
          status_updates.push({
            label: 'Not Secured',
            value: 'not_secured',
          });
          break;
        default:
          break;
      }
      status_updates = [
        ...status_updates,
        {
          label: 'Redispatch',
          value: 'revive',
          reason_required: true,
        },
        {
          label: 'Clock OUT',
          value: 'finished',
        },
      ];
      break;
    case 'secured':
      status_updates = [];
      switch (job_type) {
        case 'Flagging':
          break;
        case 'Parking':
        case 'Signage':
          status_updates.push({
            label: 'Cannot secure',
            value: 'cannot_secure',
          });
          break;
        default:
          break;
      }
      status_updates = [
        ...status_updates,
        {
          label: 'Crew arrived',
          value: 'crew_arrived',
        },
        {
          label: 'Redispatch',
          value: 'revive',
          reason_required: true,
        },
        {
          label: 'Clock OUT',
          value: 'finished',
        },
      ];
      break;
    case 'crew_arrived':
      status_updates = [];
      switch (job_type) {
        case 'Flagging':
          break;
        case 'Parking':
        case 'Signage':
          status_updates.push({
            label: 'Cannot secure',
            value: 'cannot_secure',
          });
          break;
        default:
          break;
      }
      status_updates = [
        ...status_updates,
        {
          label: 'Redispatch',
          value: 'revive',
          reason_required: true,
        },
        {
          label: 'Clock OUT',
          value: 'finished',
        },
      ];
      break;
    case 'cannot_secure':
      switch (job_type) {
        case 'Flagging':
          status_updates.push({
            label: 'Ready for crew',
            value: 'secured',
          });
          break;
        case 'Parking':
        case 'Signage':
          status_updates.push({
            label: 'Secure',
            value: 'secured',
          });
          break;
        default:
          break;
      }
      status_updates = [
        ...status_updates,
        {
          label: 'Redispatch',
          value: 'revive',
          reason_required: true,
        },
        {
          label: 'Clock OUT',
          value: 'finished',
        },
      ];
      break;

    case 'review':
      status_updates = [
        {
          label: 'Redispatch',
          value: 'revive',
          reason_required: true,
        },
        {
          label: 'Confirm Review',
          value: 'review_finished',
        },
      ];
      break;

    case 'review_finished':
      status_updates = [
        {
          label: 'Redispatch',
          value: 'revive',
          reason_required: true,
        },
      ];
      break;
    default:
      break;
  }

  if (
    [
      'assigned',
      'en_route',
      'on_location',
      'secured',
      'cannot_secure',
      'crew_arrived',
    ].indexOf(worker.status) !== -1 &&
    worker.worker_confirmed === 0
  ) {
    status_updates.push({
      label: 'Confirm',
      value: 'confirmed',
    });
  }

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeReroute = () => {
    setAnchorEl(null);
  };

  const viewWorker = () => {
    history.push(`/workers/${worker.worker_id}`);
  };

  const viewTimesheet = () => {
    history.push(`/timesheets/${worker.timesheet.id}/edit`);
  };

  const handleClose = () => {
    // onClose();
    closeReroute();
  };

  return (
    <>
      <Box className="box" style={{ paddingBottom: 5 }}>
        <Typography className="worker-name">{worker.worker_name}</Typography>
        <Box display="flex" justifyContent="space-between">
          <a
            href={`tel:${worker.phone_number}`}
            style={{ textDecoration: 'none', color: '#000' }}
          >
            <Typography className="status" style={{ fontSize: 12 }}>
              {worker.phone_number}
            </Typography>
          </a>
        </Box>
      </Box>
      <MenuItem onClick={viewWorker}>View Worker</MenuItem>
      {worker.timesheet && (
        <>
        <MenuItem onClick={viewTimesheet}>View Timesheet</MenuItem>
        <hr style={{ margin: 0 }} />
        </>
      )}
      {[
        'assigned',
        'en_route',
        'on_location',
        'secured',
        'cannot_secure',
        'review',
        'review_finished',
      ].indexOf(worker.status) !== -1 && job_status !== 'cancelled' && job_status !== 'cancelled_billable' &&  (
          <>
            <MenuItem onClick={editShift}>Edit</MenuItem>
          </>
        )}
      {/*WORKER_STATUSES.map((status, index) => {
        if(status.value === worker.status && index !== 0)
        return (
          <MenuItem
            key={index+status}
            onClick={(_) => updateWorkerStatus(WORKER_STATUSES[index-1].value)}
          >
           Revert to {WORKER_STATUSES[index-1].label}
          </MenuItem>
        );
        else return null;
      })*/}
      {status_updates.map((status_update, index) => {
        return (
          <MenuItem
            key={index}
            onClick={(_) => updateWorkerStatus(status_update.value)}
          >
            {status_update.label}
          </MenuItem>
        );
      })}
      {[
        'assigned',
        'en_route',
        'on_location',
        'secured',
        'crew_arrived',
        'cannot_secure',
      ].indexOf(worker.status) !== -1 && (
          <>
            <hr style={{ margin: 0 }} />
            <MenuItem onClick={handleClick}>Re-Route to Location</MenuItem>
            <Menu
              id="re-route-location-quick-menu"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleAddLocation}>
                <ListItemIcon>
                  <AddCircleIcon fontSize="small" style={{ fill: '#2F80ED' }} />
                </ListItemIcon>
              Add Location
            </MenuItem>
              {locations
                .filter((location) => location.id !== worker.location_id)
                .map((location) => {
                  let is_processing = location.id === processing_id;
                  return (
                    <MenuItem
                      onClick={(_) => reRoute(location)}
                      style={
                        is_processing
                          ? {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f7f7f7',
                            height: 36,
                          }
                          : { height: 36 }
                      }
                    >
                      {is_processing ? (
                        <CircularProgress size={'14px'} />
                      ) : (
                        `${location.id} - ${location.address}`
                      )}
                    </MenuItem>
                  );
                })}
            </Menu>
          </>
        )}
    </>
  );
};

export default DetailsPopup;
