import React, { useState } from 'react';
import Collapsible from 'react-collapsible';
import CheckboxComponent from '../../Components/Controls/Checkbox.Component';
import { WORKER_STATUS } from '../../../Constants/worker';
import CEModal from '../../Components/Modal/Modal.Component';
import CloseIcon from '../../../Images/close-regular.png';
import NewModalForm from '../RerouteWorker/NewModalForm';
import { jobAPI } from '../../../Services/API';
import * as CeIcon from '../../../Utils/Icon';
import { useSelector } from 'react-redux';
import RerouteWorker from './ReroutWorker';
import UploadPhoto from './UploadPhoto';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import { NavLink } from 'react-router-dom';
import './WorkerGroup.scss';
import { LocationItem } from '../../../Models/locationItem';
import history from '../../../history';
import Dialog from '@material-ui/core/Dialog';
import   TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { actions } from '../../../Services';
import { toast } from 'react-toastify';
import { WORKER_STATUSES } from '../../../Constants/worker';

interface Props {
  groups: any;
  jobId: number | string;
  onSaveSuccess: () => void;
  hasSeen?: any;
  jobDetail?: any;
  updateJobWorker?: any;
  noBorder?: boolean;
  selectRow?: Function;
}

const WorkerGroup: React.FC<Props> = ({
  groups,
  jobId,
  onSaveSuccess,
  hasSeen,
  jobDetail,
  updateJobWorker,
  noBorder,
  selectRow
}) => {
  const [opened, setOpened] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [isToggleModal, setisToggleModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isUpdateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [newLocations, setNewLocations] = useState({});
  const [files, setFiles] = useState([]);
  const [structure, setStructure] = useState('');
  const user = useSelector((state: any) => state.app.user);

  const openJobDetail = (jobId, workerId) => {
    history.push(`/job/${jobId}?workerId=${workerId}`);
  };

  const closeModal = () => {
    setisToggleModal(false);
    selectRow(false);
  };

  const openModal = (event) => {
    event.stopPropagation();
    setisToggleModal(true);
    selectRow(true);
  };

  const handleSelectWorker = (worker: any) => {
    const index = selectedWorkers.findIndex(
      (item) => item.shift_id === worker.shift_id
    );
    if (index > -1) {
      setSelectedWorkers((prevState) => {
        const newState = prevState.filter(
          (item) => item.shift_id !== worker.shift_id
        );
        return newState;
      });
    } else {
      setSelectedWorkers((prevState) => [...prevState, worker]);
    }
  };

  const onChangeLocations = (location) => {
    setNewLocations(location);
  };

  const onChangeWorker = (worker, index) => {
    let updated_workers = selectedWorkers;
    updated_workers[index] = {
      ...updated_workers[index],
      ...worker,
    };

    setSelectedWorkers(updated_workers);
  };

  const openWorkerDetail = (workerId) => {
    history.push(`/workers/${workerId}`);
  };

  const handleClickReroute = async (event) => {
    event.stopPropagation();
    setProcessing(true);
    const workerIds = selectedWorkers.map((worker) => {
      return {
        id: worker.workerId,
        shift_id: worker.shift_id,
        structure: worker.structure,
        note: worker.note,
      };
    });
    let images = [];
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((image, index) =>
        formData.append('images_' + index, image)
      );
      images = (await jobAPI.uploadImages(formData)).data;
    }
    const data = {
      job_id: jobId,
      workers: workerIds,
      location: { ...newLocations },
      files: images,
      structure: structure
    };
    try {
      await jobAPI.rerouting(data);
      setisToggleModal(false);
      selectRow(false);
      setNewLocations([]);
      setSelectedWorkers([]);
      onSaveSuccess();
      setProcessing(false);
    } catch (e) {
      setProcessing(false);
    }
  };

  const locationCurrent: any = newLocations;

  const isShowUpdateWorkerStatus =
    user && user.roles
      ? user.roles.some((role) => [5, 6, 8].includes(role))
      : false;

  const isWorkerStatusUpdatable = (worker) => worker && worker.status < 7;

  const getWorkerNextStatus = (worker) => {
    return worker && worker.status + (worker.status === 5 ? 2 : 1);
  };

  const handleUpdateWorkerStatus = () => {
    setUpdateStatusModalOpen(false);
    if (selectedWorkers) {
       jobDetail.workers.forEach( async (worker) => {
        if (
          selectedWorkers.some(
            (selectedWorker) =>
              selectedWorker.shift_id === worker.shift_id &&
              selectedWorker.status < 7
          )
        ) {
          // setLoading(true);
          console.log(getWorkerNextStatus(worker))
            await updateJobWorker(jobId, worker.shift_id, {status: WORKER_STATUSES[getWorkerNextStatus(worker)].value})
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
                  }).then(() => {
                    setSelectedWorkers([]);
                  });
          }
      });
    }
  };

  const fieldChanged = (event) => {
    // let location = {
    //     ...newLocations,
    //     [event.target.name]: event.target.value
    // };
    //setNewLocations(location);
    setFiles(event.target.value);
  };
  const getUpdateWorkerStatusButtonName = () => {
    const [worker] =
      selectedWorkers &&
      selectedWorkers.filter((selectedWorker) => selectedWorker.status < 7);
    return worker
      ? `Update to ${WORKER_STATUS[getWorkerNextStatus(worker)]}`
      : 'Update no available';
  };

  const getUpdateWorkerStatusModalMessage = () => {
    const workers =
      selectedWorkers && selectedWorkers.filter((worker) => worker.status < 7);
    const workersStatusString = workers
      .map(
        (worker) =>
          `${worker.worker.name} status from "${
            WORKER_STATUS[worker.status]
          }" to "${WORKER_STATUS[getWorkerNextStatus(worker)]}"`
      )
      .join(', ');
    return `Do you want to change the worker ${workersStatusString} ?`;
  };

  return (
    <>
      <div className={noBorder ? 'worker-group no-border' : 'worker-group'}>
        {groups.map((group, gIdx) =>
          group.workers.length <= 0 ? (
            <div
              key={String(gIdx)}
              className="border-top d-flex flex-sm-row align-items-center pr-3"
              style={{ background: '#F3F3F3' }}
            >
              <div className="job-location d-flex align-items-center mr-auto location-row">
                <div className="d-flex mr-2">
                  <RoomOutlinedIcon
                    fontSize="large"
                    style={{ color: '#BDBDBD' }}
                  />
                </div>
                <div className="flex-mobile">
                  <div className="mr-1 logo-location-address text-16-500">
                    <span>
                      {group.location.address}{' '}
                      <span style={{ color: '#6f7780' }}>
                        {group.location.structure
                          ? `(Structure #${group.location.structure})`
                          : ''}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              {group.workers.map((worker, id) => {
                return (
                  <div
                    key={String(worker.shift_id + id)}
                    className="d-flex justify-content-start align-items-center ml-4"
                  >
                    <div>
                      <CheckboxComponent
                        checked={Boolean(
                          selectedWorkers.find(
                            (item) => item.shift_id === worker.shift_id
                          )
                        )}
                        id={worker.shift_id}
                        className="mr-3"
                        onChange={() => handleSelectWorker(worker)}
                      />
                    </div>
                    <div
                      className="mr-3"
                      onClick={() => openWorkerDetail(worker.workerId)}
                    >
                      <img
                        className="avatar"
                        alt="avatar"
                        src={`${process.env.REACT_APP_API_ENDPOINT}${worker.worker.avatar}`}
                      />
                    </div>
                    <div>
                      <div>
                        {worker.worker.name}
                        {worker.hasSeen ? (
                          <CeIcon.DobuleTickIcon
                            className="has-seen ml-3"
                            fill="green"
                          />
                        ) : null}
                      </div>
                      <div className="status">
                        {WORKER_STATUS[parseInt(worker.status)]}
                      </div>
                      <a href={`tel:${worker.worker.phoneNumber}`}>
                        {worker.worker.phoneNumber}
                      </a>
                    </div>
                  </div>
                );
              })}
              <div className="worker-link">
                {group.workers[0] && (
                  <div
                    onClick={() =>
                      openJobDetail(jobId, group.workers[0].workerId)
                    }
                  />
                )}
              </div>
              {/*selectedWorkers.length > 0 && gIdx === 0 && (
                  <div>
                    {
                      isShowUpdateWorkerStatus
                      && selectedWorkers.some(worker => isWorkerStatusUpdatable(worker))
                      && (
                          <button className="new-buttons light" style={{width: '220px', marginRight: '17px'}} onClick={_ => setUpdateStatusModalOpen(true)} disabled={loading}>
                            {loading ? 'Loading' : getUpdateWorkerStatusButtonName() }
                          </button>
                      )
                    }
                    <button onClick={openModal} style={{width: '200px'}} className="new-buttons blue">
                      Re-Route Selected Worker
                    </button>
                  </div>
                  )*/}
            </div>
          ) : (
            <div className="d-flex" key={String(gIdx)}>
              <Collapsible
                trigger={
                  <div className="d-flex align-items-center justify-content-start border-top pr-3 location-row">
                    <div className="font-weight-bold border-right d-flex align-items-center px-2">{`${
                      opened ? '-' : '+'
                    } (${group.workers.length})`}</div>
                    <div className="job-location d-flex align-items-center mr-4">
                      <div className="d-flex mr-2">
                        <RoomOutlinedIcon
                          fontSize="large"
                          style={{ color: '#BDBDBD' }}
                        />
                      </div>
                      <div className="d-flex flex-mobile">
                        <div className="mr-1 logo-location-address text-16-500">
                          <span>
                            {group.location.address}{' '}
                            <span style={{ color: '#6f7780' }}>
                              {group.location.structure
                                ? `(Structure #${group.location.structure})`
                                : ''}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex worker-link">
                      {group.workers.map((worker, idx) => (
                        <div
                          key={String(idx + worker.worker.id + worker.id)}
                          className="avatar-wrapper"
                          style={{ zIndex: group.workers.length - idx }}
                          //onClick={() => openWorkerDetail(worker.workerId)}
                        >
                          <img
                            className="avatar"
                            alt="avatar"
                            src={`${process.env.REACT_APP_API_ENDPOINT}${worker.worker.avatar}`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="d-flex px-2">
                      {opened ? (
                        <div className="show-workers">
                          <PeopleOutlineIcon
                            style={{ color: '#BDBDBD', marginRight: '5px' }}
                          />
                          Hide Workers
                          <ArrowDropDownIcon
                            fontSize="small"
                            style={{
                              color: '#2F80ED',
                              transform: ' rotate(180deg)',
                            }}
                          />
                        </div>
                      ) : (
                        <div className="show-workers">
                          <PeopleOutlineIcon
                            style={{ color: '#2F80ED', marginRight: '5px' }}
                          />
                          Show Workers
                          <ArrowDropDownIcon
                            fontSize="small"
                            style={{ color: '#2F80ED' }}
                          />
                        </div>
                      )}{' '}
                    </div>
                    {/*selectedWorkers.length > 0 && gIdx === 0 && (
                      <div>
                        {
                          isShowUpdateWorkerStatus
                          && selectedWorkers.some(worker => isWorkerStatusUpdatable(worker))
                          && (
                              <button className="button-update-status" onClick={() => setUpdateStatusModalOpen(true)}>
                                {getUpdateWorkerStatusButtonName()}
                              </button>
                          )
                        }
                        <button onClick={openModal} className="button-submit">
                          Re-Route Selected Worker
                        </button>
                      </div>
                      )*/}
                  </div>
                }
                onOpen={() => setOpened(true)}
                onClose={() => setOpened(false)}
                easing="ease"
                className="collaped-content"
              >
                <div className="workers-row">
                  {group.workers.map((worker, id) => {
                    return (
                      <div
                        key={worker.shift_id + '-' + id}
                        className="worker-element"
                        onClick={() => handleSelectWorker(worker)}
                      >
                            <Checkbox
                              style={{ marginTop: '-48px' }}
                              icon={<CircleUnchecked />}
                              checkedIcon={
                                <CircleCheckedFilled
                                  style={{ fill: '#2F80ED' }}
                                />
                              }
                              checked={Boolean(
                                selectedWorkers.find(
                                  (item) => item.shift_id === worker.shift_id
                                )
                              )}
                              id={worker.shift_id + id}
                              color="primary"
                            />
                              <div style={{marginTop: '-8px' , fontSize: 14}}>
                                <div className="text-16-blue">
                                  <NavLink to={`/workers/${worker.id}`}>
                                    {worker.worker.name}
                                  </NavLink>
                                  {worker.hasSeen ? (
                                    <CeIcon.DobuleTickIcon
                                      className="has-seen ml-3"
                                      fill="green"
                                    />
                                  ) : null}
                                </div>
                                <a
                                  style={{ color: '#000000' }}
                                  href={`tel:${worker.worker.phoneNumber}`}
                                >
                                  {worker.worker.phoneNumber}
                                </a>
                                <div className="status" style={{justifyContent: 'start'}}>
                                  {WORKER_STATUS[worker.status]}
                                </div>
                              </div>
                              
                        
                        
                      </div>
                    );
                  })}
                </div>
              </Collapsible>
            </div>
          )
        )}

        {selectedWorkers.length > 0 && (
          <div className="bottom-buttons">
            <button
              onClick={openModal}
              style={{ width: '200px' }}
              className="new-buttons blue"
            >
              Re-Route Selected Worker
            </button>
            {isShowUpdateWorkerStatus &&
              selectedWorkers.some((worker) =>
                isWorkerStatusUpdatable(worker)
              ) && (
                <button
                  className="new-buttons light"
                  style={{ width: '220px', marginRight: '17px' }}
                  onClick={() => setUpdateStatusModalOpen(true)}
                >
                  {getUpdateWorkerStatusButtonName()}
                </button>
              )}
          </div>
        )}
      </div>

      {isToggleModal && (
        <Dialog 
          open={isToggleModal} 
          onClose={closeModal}
          maxWidth={'lg'}>
          <div className="p-3 pt-0">
            <div className="ce-flex-right">
              <div className="pull-right bg-grey" onClick={closeModal}>
                <img src={CloseIcon} alt="" />
              </div>
            </div>

            <div className="align-items-center mb-3">
              <div className="font-weight-bold mr-3 title-modal">
                Re-Route to New Location
              </div>
              <div className="sub-title-modal">
                Fill in the details of this place and add information for
                workers
              </div>
              <hr />
            </div>

            <NewModalForm
              location={newLocations as LocationItem}
              onChangeLocations={onChangeLocations}
              withMap
            />
              {jobDetail && jobDetail.jobType === 2 && (
                <Grid container item xs={4}>
                  <InputLabel htmlFor="location-structure">
                    Structure #
                  </InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="structure"
                    value={structure}
                    onChange={(event) => setStructure(event.target.value) }
                  />
                </Grid>
              )}
            <p className="sub-title-modal mt-14" style={{marginTop: 23}}>
              Upload the necessary photos for the selected location
            </p>
            <UploadPhoto
              onChangeImage={(images) =>
                fieldChanged({
                  target: {
                    name: 'images',
                    value: images,
                  },
                })
              }
            />
            <RerouteWorker
              job={jobDetail}
              location={newLocations}
              onChangeLocations={onChangeLocations}
              onChangeWorker={onChangeWorker}
              selectedWorkers={selectedWorkers}
              handleSelectWorker={handleSelectWorker}
              closeModal={closeModal}
            />

            <div className="buttons">
              <button
                type="button"
                className="btn btn-cancel-new height-46"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-new btn-confirm  btn-add height-46"
                onClick={(event) => handleClickReroute(event)}
                disabled={
                  locationCurrent && locationCurrent.address && (structure !== '' && jobDetail && jobDetail.jobType === 2 ) && !processing ? false : true
                }
                style={{
                  backgroundColor: (
                    locationCurrent && locationCurrent.address && (structure !== '' && jobDetail && jobDetail.jobType === 2 ) && !processing ? false : true
                  )
                    ? '#828282'
                    : '#333333',
                }}
              >
                Confirm Reroute
              </button>
            </div>
          </div>
        </Dialog>
      )}

      {isUpdateStatusModalOpen && (
        <Dialog
          open={isUpdateStatusModalOpen}
          onClose={() => setUpdateStatusModalOpen(false)}
          maxWidth={'lg'}
        >
          <div className="p-3 pt-0">
            <p className="text-center">{getUpdateWorkerStatusModalMessage()}</p>
            <div className="text-center actions">
              <button
                type="button"
                className="btn btn-success btn-add height-42"
                onClick={() => setUpdateStatusModalOpen(false)}
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-primary btn-add height-42"
                onClick={handleUpdateWorkerStatus}
                style={{ marginLeft: 24 }}
              >
                Yes
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateJobWorker: (jobId, shiftId, data) => dispatch(actions.JobsActions.updateJobWorker(jobId, shiftId, data))
  }
}

export default connect(null, mapDispatchToProps)(WorkerGroup);
