import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Tooltip from '@material-ui/core/Tooltip';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import AddIcon from '@material-ui/icons/Add';
import { SRLWrapper } from 'simple-react-lightbox';
import SimpleReactLightbox from 'simple-react-lightbox';
import TextsmsIcon from '@material-ui/icons/Textsms';
import * as COLORS from '../../../../Constants/colors';
import JobWorkerCard from './JobWorkerCard';
import LocationAddress from '../../dialog/locationAddress/LocationAddress';
import DeleteLocation from '../../dialog/deleteLocation/DeleteLocation';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0 !important',
    '& .MuiAccordionSummary-root': {
      padding: 0,
      '& .MuiAccordionSummary-content': {
        margin: 0,
        '& .MuiAccordionSummary-content.Mui-expanded': {
          margin: 0,
        },
        '& .MuiPaper-elevation1': {
          boxShadow: 'none',
          borderRadius: 0,
          borderTop: '1px solid #F2F2F2',
          borderBottom: '1px solid #F2F2F2',
        },
      },
    },
    '& .MuiAccordionDetails-root': {
      padding: 0,
    },
  },
  cardContainer: {
    width: '100%',
  },
  addressBox: {
    background:
      'linear-gradient(180deg, rgba(48, 173, 242, 0.1) 0%, rgba(3, 153, 221, 0.1) 100%)',
    padding: '10px 17px !important',
  },
  cardIndex: {
    fontFamily: 'Nunito Sans',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '12px',
    lineHeight: '16px',
    color: '#FFFFFF',
    background: '#2F80ED',
    borderRadius: '50%',
    minWidth: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3px',
  },
  cardContent: {
    padding: '0 !important',
  },
  jobType: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: 'Roboto',
  },
  locationName: {
    fontWeight: 500,
  },
  location: {
    width: '200px',
    fontSize: 12,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  locationNote: {
    padding: 0,
  },
  note: {
    width: '200px',
    fontSize: 12,
    lineHeight: '20px',
  },
  workers: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: '20px',
    textAlign: 'right',
    color: '#2F80ED',
  },
  hideList: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '16px',
    color: COLORS.BLUE_1,
  },
  moreBtn: {
    background: '#FFFFFF',
    border: '1px solid #F2F2F2',
    boxSizing: 'border-box',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  simpleMenu: {
    '& .MuiMenu-paper': {
      left: '830px !important',
    },
  },
  listContainer: {
    flexDirection: 'column',
    backgroundColor: '#F2F2F2',
  },
}));
let new_job_id;
let new_workers;

interface Props {
  job: any;
  job_type: string;
  job_id: number;
  location: any;
  index: number;
  workers: any;
  assignWorker: (job_worker_id: number) => void;
  updateWorkerStatus: (job_worker_id: number, data: any) => void;
  addLocation: () => void;
  editShift: (shift: any) => void;
  addShiftFunction: (location_id: number) => void;
  setSelectedWorker: (worker: any) => void;
  job_types: any;
}

const JobLocationCard: React.FC<Props> = ({
  job = null,
  job_type = null,
  job_id = null,
  location = null,
  index = null,
  workers = null,
  assignWorker = null,
  updateWorkerStatus = null,
  addLocation = null,
  editShift = null,
  addShiftFunction = null,
  job_types = null,
}) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState(workers.length > 0);
  const [openEditLocationAddress, setOpenEditLocationAddress] = useState(false);
  const [openDeleteLocationAddress, setOpenDeleteLocationAddress] = useState(false);
  const [openAddLocationAddress, setOpenAddLocationAddress] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  if (job_id !== new_job_id) {
    setExpanded(true);
  }
  if (new_workers !== workers && workers && workers.length > 0) {
    setExpanded(true);
  }

  new_job_id = job_id;
  new_workers = workers;

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
  };

  const handleEditLocation = (event) => {
    event.stopPropagation();
    setOpenEditLocationAddress(true);
    handleClose();
  };

  const handleRemoveLocation = (event) => {
    event.stopPropagation();
    setOpenDeleteLocationAddress(true);
    handleClose();
  };

  const handleAddLocation = () => {
    setOpenAddLocationAddress(true);
    handleClose();
  };

  const addShift = (event) => {
    event.stopPropagation();
    addShiftFunction(location.id);
    handleClose();
  };

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: any = null) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Accordion className={classes.root} elevation={0} expanded={expanded}>
        <AccordionSummary
          expandIcon={null}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Card className={classes.cardContainer}>
            <CardContent className={classes.cardContent}>
              <Box
                display="flex"
                alignItems="flex-start"
                className={classes.addressBox}
                onClick={handleChange}
              >
                <Box className={classes.cardIndex}>{index}</Box>
                <Box
                  ml={1}
                  width="100%"
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="space-between"
                >
                  <Box mr={1}>
                    <Typography
                      className={classes.location}
                      style={{ color: '#2F80ED', fontWeight: 500 }}
                      variant="body2"
                    >
                      {location.address}
                    </Typography>
                  </Box>
                  <Box display="flex">
                    <Box>
                      <Typography className={classes.workers}>
                        {
                          workers.filter(
                            (worker) =>
                              moment().endOf('day') > moment(worker.start_at) &&
                              worker.status !== 'pending' &&
                              worker.status !== 'review' &&
                              worker.status !== 'review_finished'
                          ).length
                        }
                      </Typography>
                    </Box>
                    <Box
                      ml={2}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {['new', 'in_progress'].indexOf(job.status) !== -1 && (
                        <MoreHorizIcon
                          className={classes.moreBtn}
                          fontSize="small"
                          onClick={handleClick}
                        />
                      )}
                      <Typography
                        className={classes.hideList}
                        style={{ marginLeft: 10 }}
                      >
                        {expanded ? (
                          <ExpandLessIcon
                            style={{ color: '#2F80ED', fontSize: '21px' }}
                          />
                        ) : (
                          <ExpandMoreIcon
                            style={{ color: '#2F80ED', fontSize: '21px' }}
                          />
                        )}
                      </Typography>
                      {['new', 'in_progress'].indexOf(job.status) !== -1 && (
                        <Menu
                          className={classes.simpleMenu}
                          id="simple-menu-job"
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                        >
                          {job.status === 'new' && (
                            <MenuItem onClick={handleEditLocation}>
                              <ListItemIcon>
                                <BorderColorIcon
                                  fontSize="small"
                                  style={{ fill: '#E0E0E0' }}
                                />
                              </ListItemIcon>
                              Edit Location
                            </MenuItem>
                          )}
                           <Tooltip 
                            title={(job.locations && job.locations.length === 1) || (job.workers && job.workers.some(w => w['worker_id'] !== null && w['location_id'] === location.id )) ? "Location is required. You only can remove location without workers." : ""} 
                            aria-label="remove">
                              <div>
                              <MenuItem 
                                onClick={handleRemoveLocation}
                                disabled={(job.locations && job.locations.length === 1) || (job.workers && job.workers.some(w => w['worker_id'] !== null && w['location_id'] === location.id ))}>
                                <ListItemIcon>
                                  <HighlightOffIcon
                                    fontSize="small"
                                    style={{ fill: '#E0E0E0' }}
                                  />
                                </ListItemIcon>
                                Remove Location
                              </MenuItem>
                              </div>
                          </Tooltip>
                          {['new', 'in_progress'].indexOf(job.status) !==
                            -1 && (
                            <MenuItem onClick={addShift}>
                              <ListItemIcon>
                                <AddIcon
                                  fontSize="small"
                                  style={{ fill: '#E0E0E0' }}
                                />
                              </ListItemIcon>
                              Add shift
                            </MenuItem>
                          )}
                        </Menu>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
              {((expanded &&
                location.structure &&
                location.structure.length > 0 &&
                location.structure !== 'null') ||
                (expanded &&
                  location.note &&
                  location.note.length > 0 &&
                  location.note !== 'null') ||
                (expanded &&
                  location.images &&
                  location.images.length > 0)) && (
                <Box
                  ml={3}
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  p="10px 17px !important"
                >
                  {location.structure &&
                    location.structure.length > 0 &&
                    location.structure !== 'null' && (
                      <Box
                        display="flex"
                        alignItems="flex-start"
                        justifyContent="space-between"
                      >
                        <Box mr={1}>
                          <Typography
                            className={classes.location}
                            variant="body2"
                          >
                            Structure Number: {location.structure}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  {location.note &&
                    location.note.length > 0 &&
                    location.note !== 'null' && (
                      <Box
                        className={classes.locationNote}
                        display="flex"
                        alignItems="flex-start"
                        justifyContent="space-between"
                      >
                        <Box mr={1}>
                          <TextsmsIcon
                            style={{
                              color: '#BDBDBD',
                              position: 'absolute',
                              left: '12px',
                              width: '18px',
                            }}
                          />
                          <Typography className={classes.note} variant="body2">
                            {location.note}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  {location.images && location.images.length > 0 && (
                    <Box
                      display="flex"
                      alignItems="flex-start"
                      flexDirection={'row'}
                    >
                      
                      <SimpleReactLightbox>
                        <SRLWrapper>
                          <div className='d-flex'>
                            {location.images.map( (image, idx) =>
                              image !== '' && image && (
                                <div key={String(idx)} className="img-wrapper">
                                  <img
                                    src={`${image}`}
                                    className="img"
                                    alt=""
                                    style={{
                                      width: 50,
                                      height: 50,
                                      padding: 5,
                                      borderRadius: 10,
                                    }}
                                  />
                                </div>
                                )
                            )}
                          </div>
                        </SRLWrapper>
                      </SimpleReactLightbox>
                      
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </AccordionSummary>
        <AccordionDetails className={classes.listContainer}>
          {Array.isArray(workers) &&
            workers.map((worker, index) => (
              <JobWorkerCard
                key={index}
                worker={worker}
                assignWorker={assignWorker}
                updateWorkerStatus={updateWorkerStatus}
                addLocation={handleAddLocation}
                editShift={editShift}
                job_type={job_type}
                setSelectedWorker={handleSelectWorker}
                job_status={job.status}
              />
            ))}
        </AccordionDetails>
      </Accordion>
      <LocationAddress
        job_dis_types={job_types}
        open={openEditLocationAddress}
        onClose={() => setOpenEditLocationAddress(false)}
        job_id={job_id}
        location={location}
        isAddMode={false}
      />
      <DeleteLocation
        job_id={job_id}
        location_id={location.id}
        open={openDeleteLocationAddress}
        onClose={() => setOpenDeleteLocationAddress(false)}
       />

      {selectedWorker && (
          <LocationAddress
            job={job}
            open={openAddLocationAddress}
            onClose={() => setOpenAddLocationAddress(false)}
            job_id={job.id}
            job_worker_id={selectedWorker.id}
            isAddMode={true}
          />
        )}
    </>
  );
};

export default JobLocationCard;
