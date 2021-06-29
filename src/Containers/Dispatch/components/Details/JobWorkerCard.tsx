import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import * as COLORS from '../../../../Constants/colors';
import DetailsPopup from '../DetailsPopup';
import Menu from '@material-ui/core/Menu';
import moment from 'moment';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Check from '@material-ui/icons/Check';
import './job_notes.scss';
import SimpleReactLightbox from 'simple-react-lightbox';
import PreviewImage from '../../../Components/ImageUpload/PreviewImage';
import { SRLWrapper } from 'simple-react-lightbox';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: '#f7f7f7',
    position: 'relative',
    '&:hover': {
      backgroundColor: '#eee',
    },
  },
  cardContent: {
    padding: '8px 18px',
    '&:last-child': {
      paddingBottom: theme.spacing(1),
    },
    '&.pending': {
      backgroundColor: '#FEFCF6',
    },
  },
  workerName: {
    fontSize: 14,
    fontWeight: 500,
  },
  assignWorkerBtn: {
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  moreBtn: {
    background: '#FFFFFF',
    border: '1px solid #F2F2F2',
    boxSizing: 'border-box',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  address: {
    fontSize: 10,
    color: COLORS.GRAY_4,
    lineHeight: '26px',
  },
  phoneNumber: {
    color: COLORS.BLUE_1,
    fontWeight: 'bold',
    lineHeight: '20px',
  },
  status: {
    fontSize: 12,
    fontWeight: 500,
    color: COLORS.GREEN_2,
  },
  timeSection: {
    borderRadius: 54,
    backgroundColor: '#D7F7E4',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 3,
    paddingBottom: 3,
  },
  timeValue: {
    fontSize: 12,
    fontWeight: 500,
    color: COLORS.GREEN_2,
  },
  greyIcon: {
    color: COLORS.GRAY_4,
  },
  pending: {
    backgroundColor: '#FFECB3',
    '&.Mui-selected': {
      backgroundColor: '#FFECB3',
    },
    '&:hover': {
      backgroundColor: '#FFECB3 !important',
    },
  },
  assigned: {
    backgroundColor: '#FFECB3',
    '&.Mui-selected': {
      backgroundColor: '#FFECB3',
    },
    '&:hover': {
      backgroundColor: '#FFECB3 !important',
    },
  },
  en_route: {
    backgroundColor: '#E8F5E9',
    '&.Mui-selected': {
      backgroundColor: '#E8F5E9',
    },
    '&:hover': {
      backgroundColor: '#E8F5E9 !important',
    },
  },
  secured: {
    backgroundColor: 'rgba(70,152,224,.12)',
    '&.Mui-selected': {
      backgroundColor: 'rgba(70,152,224,.12)',
    },
    '&:hover': {
      backgroundColor: 'rgba(70,152,224,.12) !important',
    },
  },
  finished: {
    backgroundColor: '#F5F5F5',
    '&.Mui-selected': {
      backgroundColor: '#F5F5F5',
    },
    '&:hover': {
      backgroundColor: '#F5F5F5 !important',
    },
  },
  on_location: {
    backgroundColor: '#C7F09D',
    '&.Mui-selected': {
      backgroundColor: '#C7F09D',
    },
    ':hover': {
      backgroundColor: '#C7F09D',
    },
  },
  cannot_secure: {
    backgroundColor: '#FCE4EC',
    '&.Mui-selected': {
      backgroundColor: '#FCE4EC',
    },
    '&:hover': {
      backgroundColor: '#FCE4EC !important',
    },
  },
}));

interface Props {
  worker: any;
  assignWorker: (job_worker_id: number) => void;
  updateWorkerStatus: (job_worker_id: number, data: any) => any;
  addLocation: () => void;
  editShift: (shift: any) => void;
  job_type: string;
  setSelectedWorker: (worker: any) => void;
  job_status: string;
}

const JobWorkerCard: React.FC<Props> = (props) => {
  const classes = useStyles();
  const worker = props.worker;
  const is_selected =
    useSelector((state: any) => state.jobs.selected_location_id) === worker.id;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const assignWorker = () => {
    props.assignWorker(worker.id);
  };

  const updateWorkerStatus = (new_status) => {
    handleClose();
    props.updateWorkerStatus(worker.id, {
      status: new_status,
    })
  };

  const addLocation = () => {
    props.addLocation();
  };

  const editShift = () => {
    handleClose();
    props.editShift(worker);
  };

  let left_value = '';
  let right_value = '';
  let color = '';
  switch (worker.status) {
    case 'on_location':
      if (worker.timesheet) {
        left_value = `On Location (${moment(worker.timesheet.start_at).format(
          'h:mm A'
        )})`;
        right_value = worker.timesheet.total_hours;
        color = '#27AE60';
      }
      break;
    case 'secured':
      if (worker.timesheet) {
        switch (props.job_type) {
          case 'Flagging':
            left_value = `Ready for crew (${moment(
              worker.timesheet.start_at
            ).format('h:mm A')})`;
            break;
          case 'Signage':
          case 'Parking':
            left_value = `Secured (${moment(worker.timesheet.start_at).format(
              'h:mm A'
            )})`;
            break;
        }

        right_value = worker.timesheet.total_hours;
        color = '#27AE60';
      }
      break;
    case 'crew_arrived':
      if (worker.timesheet) {
        switch (props.job_type) {
          case 'Flagging':
            left_value = `Crew arrived (${moment(
              worker.timesheet.start_at
            ).format('h:mm A')})`;
            break;
          case 'Signage':
          case 'Parking':
            left_value = `Crew arrived (${moment(
              worker.timesheet.start_at
            ).format('h:mm A')})`;
            break;
        }

        right_value = worker.timesheet.total_hours;
        color = '#27AE60';
      }
      break;
    case 'cannot_secure':
      if (worker.timesheet) {
        left_value = `Cannot secure (${moment(worker.timesheet.start_at).format(
          'h:mm A'
        )})`;
        right_value = worker.timesheet.total_hours;
        color = 'red';
      }
      break;
    case 'assigned':
      left_value = `Assigned (arrives at ${moment()
        .add(worker.eta, 'minute')
        .format('h:mm A')})`;
      right_value = `${worker.eta} min`;
      color = 'rgb(214 153 38)';
      break;
    case 'en_route':
      left_value = `En Route (arrives at ${moment()
        .add(worker.eta, 'minute')
        .format('h:mm A')})`;
      right_value = `${worker.eta} min`;
      color = '#27AE60';
      break;
    case 'finished':
      if (worker.timesheet) {
        left_value = `Completed at (${moment(worker.timesheet.finish_at).format(
          'h:mm A'
        )})`;
        right_value = worker.timesheet.total_hours;
        color = '#000';
      }
      break;
    case 'review':
      if (worker.timesheet) {
        left_value = `Reviewing timesheet`;
        right_value = worker.timesheet.total_hours;
        color = '#000';
      }
      break;
    case 'review_finished':
      if (worker.timesheet) {
        left_value = `Review finished`;
        right_value = worker.timesheet.total_hours;
        color = '#000';
      }
      break;
    case 'cancelled':
      left_value = `Cancelled`;
      right_value = 'Cancelled';
      color = '#000';
      break;
  }

  const renderTime = () => {
    if (['assigned', 'en_route', 'cancelled'].indexOf(worker.status) !== -1) {
      return (
        <p style={{ margin: 0 }}>
          Starts {moment(worker.start_at).format('M/D h:mm A')}
        </p>
      );
    } else {
      if (worker.timesheet) {
        switch (worker.status) {
          case 'on_location':
          case 'secured':
          case 'not_secured':
          case 'crew_arrived':
            return (
              <p style={{ margin: 0 }}>
                {moment(worker.timesheet.start_at).format('M/D h:mm A')}
              </p>
            );
          case 'review':
          case 'review_finished':
            return (
              <div style={{ display: 'flex', justifyContent: 'space-beetwen' }}>
                <div style={{ margin: 0 }}>
                  {moment(worker.timesheet.start_at).format('M/D h:mm A')} -{' '}
                  {moment(worker.timesheet.finish_at).format('M/D h:mm A')}
                </div>
                <SimpleReactLightbox>
                  {worker.timesheet.images.map((image, index) => (
                    <SRLWrapper>
                      <div
                        key={String(index)}
                        className="img-wrapper"
                        style={{ cursor: 'pointer' }}
                      >
                        {typeof image === 'string' ? (
                          <div key={String(index)} className="mr-3">
                            <VisibilityIcon
                              fontSize="small"
                              style={{ marginLeft: '5px', marginTop: '-12px' }}
                            />
                            <div className="thumb-wrapper">
                              <img src={`${image}`} alt="" />
                            </div>
                          </div>
                        ) : (
                          <div key={String(index)} className="mr-3">
                            <PreviewImage url={URL.createObjectURL(image)} />
                          </div>
                        )}
                      </div>
                    </SRLWrapper>
                  ))}
                </SimpleReactLightbox>
              </div>
            );
        }
      }
    }
  };

  const onRowClick = () => {
    if (worker.status === 'pending') {
      assignWorker();
    }
  };

  return (
    <>
      <Card
        className={classes.root}
        elevation={0}
        style={{
          borderLeft: is_selected ? '10px solid #009ad8' : '',
          borderBottom: '1px solid rgb(128 128 128 / 13%)',
          backgroundColor: is_selected ? '#efeded' : '',
          cursor: worker.status === 'pending' ? 'pointer' : '',
        }}
        onClick={onRowClick}
      >
        <CardContent
          className={`${clsx(classes.cardContent)} ${
            worker.status === 'pending' ? 'pending' : ''
          }`}
        >
          <Box display="flex" alignItems="flex-start">
            <Box width="100%">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {worker.worker_name ? (
                  <Typography className={classes.workerName} variant="body2">
                    {worker.worker_name}{' '}
                    <span style={{ fontSize: 12, color: 'grey' }}>
                      #{worker.id}
                    </span>{' '}
                    {worker.worker_confirmed === 1 && (
                      <Check
                        style={{
                          fontSize: 23,
                          marginTop: -5,
                          color: '#3eb771',
                        }}
                      />
                    )}
                  </Typography>
                ) : worker.status === 'pending' ? (
                  <Box display={'flex'}>
                    <Typography className={classes.assignWorkerBtn}>
                      Add Worker -{' '}
                      <span style={{ color: 'rgb(117 117 117)', fontSize: 13 }}>
                        {moment(worker.start_at).format('M/D h:mm A')}
                      </span>
                    </Typography>
                    <AddCircleIcon
                      style={{
                        color: '#F2C94C',
                        position: 'absolute',
                        right: '15px',
                        top: '7px',
                      }}
                    />
                  </Box>
                ) : null}
                {worker.status !== 'pending' && (
                  <MoreHorizIcon
                    className={classes.moreBtn}
                    fontSize="small"
                    onClick={handleClick}
                  />
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    className={classes.workerName}
                    variant="body2"
                    style={{ color: color }}
                  >
                    {left_value}
                  </Typography>
                </Box>
                {right_value && (
                  <Box
                    className={classes.timeSection}
                    style={{ color: color, marginBottom: -20 }}
                  >
                    <Typography className={classes.timeValue} variant="body2">
                      {right_value}
                    </Typography>
                  </Box>
                )}
              </Box>
              {renderTime()}
            </Box>
          </Box>
        </CardContent>
        <Menu
          id={`menu-worker-${worker.id}`}
          classes={{ paper: 'details-popup' }}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <DetailsPopup
            setSelectedWorker={props.setSelectedWorker}
            worker={worker}
            updateWorkerStatus={updateWorkerStatus}
            addLocation={addLocation}
            editShift={editShift}
            job_type={props.job_type}
            onClose={handleClose}
            job_status={props.job_status}
          />
        </Menu>
      </Card>
    </>
  );
};

export default JobWorkerCard;
