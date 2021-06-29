import moment from 'moment';
import React, { Component } from 'react';
import { JobType, JOB_STATUSES } from '../../Constants/job';
import { EROLES } from '../../Constants/user';
import { JobWorker } from '../../Models/jobListItem';
import authStore from '../../Stores/authStore';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import MapSelect from '../Components/Controls/MapSelect';
import MunicipalitiesAsyncSearch from '../Components/Controls/MunicipalitiesAsyncSearch';
import { UsersAsyncSearch } from '../Components/Controls/UsersAsyncSearch';
import { RequestorAsyncSearch } from '../Components/Controls/RequestorAsyncSearch';
import JobAssign from './JobWorkers/JobAssign';
import { jobAPI } from '../../Services/API';
import history from '../../history';
import { connect } from 'react-redux';
import { SupervisorsAsyncSearch } from '../Components/Controls/SupervisorsAsyncSearch';
import { TextField } from '@material-ui/core';
import { default_location } from './JobCreate';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PhoneIcon from '@material-ui/icons/Phone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Tooltip from '@material-ui/core/Tooltip';
import DeleleJob from './dialogs/DeleteJobDialog';

class JobFormComponent extends Component<any> {
  times: any = {};
  state: any = {
    assign: false,
    supervisors: [],
    locations: [{ value: 1 }],
    comments: [],
    menuRequestor: undefined,
    menuSupervisor: null,
    open_delete_job: false,
  };
  timeout: any = 0;
  fields: any = {
    requestTime: this.props.job.requestTime
      ? moment(this.props.job.requestTime).format('YYYY-MM-DDTHH:mm:ss')
      : null,
  };

  openDeleteJob = (event) => {
    this.setState({
      open_delete_job: true,
    });
  };
  closeDeleteJob = () => {
    this.setState({
      open_delete_job: false,
    });
  };

  toggleAssign = () => {
    if (this.state.assign) {
      alert('Assignment saved successfully');
    }
    this.handleChangeFieldValue('assignForm', !this.state.assign);
    this.setState((state: any) => ({ assign: !state.assign }));
  };

  onChangeComment = (event) => {
    const {
      currentTarget: { name, value },
    } = event;
    this.state.comments.push(value);
    this.handleChangeFieldValue(name, this.state.comments);
  };

  getErrorMessage = (key) => {
    if (!this.props.errors) {
      return null;
    }
    const jobs = this.props.errors.jobs;
    if (!jobs || !Array.isArray(jobs) || !jobs[this.props.index]) {
      return null;
    }
    return jobs[this.props.index][key];
  };

  assignWorkers = (workers: JobWorker[]) => {
    this.handleChangeFieldValue('workers', workers);
  };

  removeWorker = (_worker: any) => {
    let workers = this.props.job.workers;
    workers = workers.filter((worker) => worker.id !== _worker.id);
    this.handleChangeFieldValue('workers', workers);
  };

  delay = (ms: number) => new Promise((res) => setTimeout(() => res(ms), ms));

  handleChangeField = (event) => {
    const {
      currentTarget: { name, value, type, dataset },
    } = event;
    if (type === 'number' || dataset.type === 'number') {
      return this.handleChangeFieldValue(name, Number(value));
    }
    return this.handleChangeFieldValue(name, value);
  };

  onLocationChange = (location: any, index) => {
    let locations = this.props.job.locations;
    locations[index] = location;

    this.handleChangeFieldValue('locations', locations);
  };

  onLocationRemove = (index) => {
    let locations = this.props.job.locations;
    locations = locations.splice(index - 1, 1);

    this.handleChangeFieldValue('locations', locations);
  };

  handleChangeFieldValue = (name, value) => {
    this.props.onJobFormChange(this.props.index, name, value);

    if (name === 'department' && value)
      this.fields = {
        ...this.fields,
        department: value.id,
      };
    else if (name === 'locations' && value) {
      //const loc = JSON.stringify(value);
      this.fields = {
        ...this.fields,
        [name]: value,
      };
    } else if (name === 'requestTime' && value)
    {
      console.log(value)
      this.fields = {
        ...this.fields,
        [name]: moment(value).format('YYYY-MM-DDThh:mm:ss'),
      };
    }
    else if (name === 'maxWorkers' && value)
      this.fields = {
        ...this.fields,
        [name]: value,
      };
    //alert(JSON.stringify(this.fields));

    this.checkDuplicateJob(this.fields);
    setTimeout(() => {
      this.props.handleBlur();
    }, 100);
  };

  handleChange = (event) => {
    this.props.onJobFormChange(
      this.props.index,
      event.currentTarget.name,
      event.currentTarget.value
    );
    
    this.handleChangeFieldValue(event.currentTarget.name, event.currentTarget.value);
  };

  handleMunicipality(name, value) {
    this.handleChangeFieldValue(name, value);
    setTimeout(() => {
      const poets = [
        {
          label: 'Bronx',
          poet: '22392897/0001',
        },
        {
          label: 'Brooklyn',
          poet: '22392894/0001',
        },
        {
          label: 'Manhattan',
          poet: '22392910/0001',
        },
        {
          label: 'Queens',
          poet: '22392894/0001',
        },
        {
          label: 'Staten Island',
          poet: '22392908/0001',
        },
        {
          label: 'Westchester',
          poet: '22392897/0001',
        },
      ];
      let find_value = poets.find(
        (poet) => value && poet.label === value.label
      );
      if (find_value && find_value.hasOwnProperty('poet')) {
        this.handleChangeFieldValue('poet', find_value.poet);
      }
    });
  }

  checkDuplicateJob = async (fields: any) => {
    if (
      fields.requestTime &&
      fields.department &&
      fields.locations &&
      fields.maxWorkers
    ) {
      console.log('CHECKING', fields);
      const checkDuplicate: any = await jobAPI.checkDuplicate(fields);
      //this.props.checkDuplicate(fields);
      //alert(JSON.stringify(checkDuplicate));
     // console.log(checkDuplicate.data);
      if (checkDuplicate.data && checkDuplicate.data.found.length > 0) {
        const job = checkDuplicate.data.found[0];
        this.props.setDuplicateJob(job, this.props.index);
      } else {
        this.props.setDuplicateJob(null, this.props.index);
      }
    }
  };

  goBack = () => {
    history.goBack();
  };

  addNewLocation = () => {
    this.props.onJobFormChange(this.props.index, 'locations', [
      ...this.props.job.locations,
      {
        ...default_location,
        address: '..',
      },
    ]);
  };

  handleClickRequestor = (event) => {
    this.setState({
      menuRequestor: event.currentTarget,
    });
  };
  handleCloseRequestor = () => {
    this.setState({
      menuRequestor: undefined,
    });
  };

  handleClickSupervisor = (event) => {
    this.setState({
      menuSupervisor: event.currentTarget,
    });
  };
  handleCloseSupervisor = () => {
    this.setState({
      menuSupervisor: null,
    });
  };

  render() {
    const { job, handleBlur, touchedSubmit } = this.props;
    const inputProps = {
      min: moment(Date()).format('YYYY-MM-DDThh:mm'),
    };
    if (job == null) {
      return null;
    }

    const can_add_new_location = job.locations.length < job.maxWorkers;

    return (
      <>
        {!this.state.assign ? (
          <>
            <div>
              <div className="row justify-content-between ml-1 mr-3">
                <div className="row ">
                  <p className="text-16"> Job # {this.props.index} </p>
                </div>

                <div className="row">
                  <div className="arrow_backward mt-1 mr-1" />
                  <span
                    style={{ textDecoration: 'none' }}
                    className="text-14 text-blue cursor-pointer"
                    onClick={this.goBack}
                  >
                    Back to list
                  </span>
                </div>
              </div>
              <div className="block-white">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5  pr-0">
                    <div className=" group-job-type w-100 " role="group">
                      <button
                        disabled={this.props.isEdit && this.props.permissions.includes('edit_job_info') && !this.props.permissions.includes('edit_all_jobs')}
                        type="button"
                        className={`mr-2 btn ${
                          job && job.jobType === JobType.Flagging
                            ? 'active'
                            : 'btn-outline-secondary'
                        }`}
                        value={JobType.Flagging}
                        data-type="number"
                        name={'jobType'}
                        onClick={this.handleChangeField}
                      >
                        Flagging
                      </button>
                      <button
                        disabled={this.props.isEdit && this.props.permissions.includes('edit_job_info') && !this.props.permissions.includes('edit_all_jobs')}
                        type="button"
                        data-type="number"
                        name={'jobType'}
                        className={`mr-2 btn ${
                          (job && job.jobType) === JobType.Parking
                            ? 'active'
                            : 'btn-outline-secondary'
                        }`}
                        value={JobType.Parking}
                        onClick={this.handleChangeField}
                      >
                        Parking
                      </button>
                      <button
                        disabled={this.props.isEdit && this.props.permissions.includes('edit_job_info') && !this.props.permissions.includes('edit_all_jobs')}
                        type="button"
                        data-type="number"
                        name={'jobType'}
                        className={`btn ${
                          (job && job.jobType) === JobType.Signage
                            ? 'active'
                            : 'btn-outline-secondary'
                        }`}
                        value={JobType.Signage}
                        onClick={this.handleChangeField}
                      >
                        Signage
                      </button>
                    </div>
                    <p className="error">{this.getErrorMessage('jobType')}</p>
                  </div>
                  <TextField
                    id={'start-datetime-input'}
                    label="Start Datetime"
                    type="datetime-local"
                    variant={'outlined'}
                    name={'requestTime'}
                    onChange={this.handleChange}
                    disabled={(job.jobStatus === JOB_STATUSES.Cancelled || job.jobStatus === JOB_STATUSES.CancelledBillable) 
                      || (this.props.isEdit && this.props.permissions.includes('edit_job_info') && !this.props.permissions.includes('edit_all_jobs'))
                      || (job.jobStatus === JOB_STATUSES.Completed && !this.props.permissions.includes('update_completed_job_start_time'))}
                    value={
                      job.requestTime
                        ? moment(job.requestTime).format('YYYY-MM-DDTHH:mm')
                        : null
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={inputProps}
                  />
                  {/* <p className="error">{this.getErrorMessage('requestTime')}</p> */}
                </div>
              </div>
              <div className="block-white">
                <div className="row">
                  <div className="form-group col-sm-6">
                    <label className="d-block">Department</label>
                    <DepartmentAsyncSearch
                      current_value={
                        job.department
                          ? {
                              label: job.department.name,
                              value: job.department,
                            }
                          : undefined
                      }
                      handleBlur={handleBlur}
                      onSelect={(item) =>
                        this.handleChangeFieldValue(
                          'department',
                          item ? item.value : undefined
                        )
                      }
                      onlyOwnDept={authStore.canAccessLimitDept()}
                    />
                    {touchedSubmit && (
                      <p className="error">
                        {this.getErrorMessage('department')}
                      </p>
                    )}
                  </div>
                  <div className="form-group col-sm-6 relative">
                    <label className="d-block">Requestor</label>
                    {job.requestor && (
                      <Box>
                        <Button
                          className="btn-contact-to-requestor"
                          variant="outlined"
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={this.handleClickRequestor}
                        >
                          Contact to Requestor
                        </Button>
                        <Menu
                          id="simple-menu-requestor"
                          anchorEl={this.state.menuRequestor}
                          keepMounted
                          open={Boolean(this.state.menuRequestor)}
                          onClose={this.handleCloseRequestor}
                        >
                          <Box
                            style={{
                              borderBottom: '1px solid #F2F2F2',
                              padding: '10px 16px',
                            }}
                          >
                            <Box className="text-id">№{job.requestor.id}</Box>
                            <Box className="text-name">
                              {job.requestor.name}
                            </Box>
                          </Box>
                          <a
                            href={`tel:${job.requestor.phoneNumber}`}
                            style={{ textDecoration: 'none', color: '#000' }}
                          >
                            <MenuItem style={{ paddingRight: '50px' }}>
                              Call Requestor
                              <PhoneIcon
                                fontSize="small"
                                style={{
                                  fill: '#E0E0E0',
                                  position: 'absolute',
                                  right: '15px',
                                  top: '7px',
                                }}
                              />
                            </MenuItem>
                          </a>
                          <a
                            href={`mailto:${job.requestor.email}`}
                            style={{ textDecoration: 'none', color: '#000' }}
                          >
                            <MenuItem style={{ paddingRight: '50px' }}>
                              Send E-mail
                              <MailOutlineIcon
                                fontSize="small"
                                style={{
                                  fill: '#E0E0E0',
                                  position: 'absolute',
                                  right: '15px',
                                  top: '7px',
                                }}
                              />
                            </MenuItem>
                          </a>
                        </Menu>
                      </Box>
                    )}
                    {/*<UsersAsyncSearch
                      creatable
                      value={
                        job.requestor
                          ? {
                              label: job.requestor.name,
                              value: job.requestor,
                            }
                          : undefined
                      }
                      defaultValue={
                        job.requestor
                          ? {
                              label: job.requestor.name,
                              value: job.requestor,
                            }
                          : undefined
                      }
                      searchParams={{
                        roles: [EROLES.requestor],
                      }}
                      handleBlur={handleBlur}
                      onSelect={(item) => {
                        this.handleChangeFieldValue(
                          'requestor',
                          item ? item.value : undefined
                        );
                      }}
                    />*/}
                    <RequestorAsyncSearch
                      creatable
                      departmentId={job.department ? job.department.id : 0}
                      value={
                        job.requestor
                          ? {
                              label: job.requestor.name,
                              value: job.requestor,
                            }
                          : undefined
                      }
                      defaultValue={
                        job.requestor
                          ? {
                              label: job.requestor.name,
                              value: job.requestor,
                            }
                          : undefined
                      }
                      /*searchParams={{
                        roles: [EROLES.requestor],
                      }}*/
                      handleBlur={handleBlur}
                      onSelect={(item) => {
                        this.handleChangeFieldValue(
                          'requestor',
                          item ? item.value : undefined
                        );
                      }}
                    />
                    {touchedSubmit && (
                      <p className="error">
                        {this.getErrorMessage('requestor')}
                      </p>
                    )}
                  </div>
                  <div className="form-group col-sm-6 relative">
                    <label className="d-block">Supervisor</label>
                    {job.supervisor && (
                      <Box>
                        <Button
                          className="btn-contact-to-supervisor"
                          variant="outlined"
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={this.handleClickSupervisor}
                        >
                          Contact to Supervisor
                        </Button>
                        <Menu
                          id="simple-menu-supervisor"
                          anchorEl={this.state.menuSupervisor}
                          keepMounted
                          open={Boolean(this.state.menuSupervisor)}
                          onClose={this.handleCloseSupervisor}
                        >
                          <Box
                            style={{
                              borderBottom: '1px solid #F2F2F2',
                              padding: '10px 16px',
                            }}
                          >
                            <Box className="text-id">№{job.supervisor.id}</Box>
                            <Box className="text-name">
                              {job.supervisor.name}
                            </Box>
                          </Box>
                          <a
                            href={`tel:${job.supervisor.phoneNumber}`}
                            style={{ textDecoration: 'none', color: '#000' }}
                          >
                            <MenuItem style={{ paddingRight: '50px' }}>
                              Call Requestor
                              <PhoneIcon
                                fontSize="small"
                                style={{
                                  fill: '#E0E0E0',
                                  position: 'absolute',
                                  right: '15px',
                                  top: '7px',
                                }}
                              />
                            </MenuItem>
                          </a>
                          <a
                            href={`mailto:${job.supervisor.email}`}
                            style={{ textDecoration: 'none', color: '#000' }}
                          >
                            <MenuItem style={{ paddingRight: '50px' }}>
                              Send E-mail
                              <MailOutlineIcon
                                fontSize="small"
                                style={{
                                  fill: '#E0E0E0',
                                  position: 'absolute',
                                  right: '15px',
                                  top: '7px',
                                }}
                              />
                            </MenuItem>
                          </a>
                        </Menu>
                      </Box>
                    )}
                    <SupervisorsAsyncSearch
                      creatable
                      departmentId={job.department ? job.department.id : 0}
                      value={
                        job.supervisor
                          ? {
                              label: job.supervisor.name,
                              value: job.supervisor,
                            }
                          : undefined
                      }
                      defaultValue={
                        job.supervisor
                          ? {
                              label: job.supervisor.name,
                              value: job.supervisor,
                            }
                          : undefined
                      }
                      searchParams={{
                        roles: [EROLES.coned_field_supervisor],
                      }}
                      handleBlur={handleBlur}
                      onSelect={(item) => {
                        this.handleChangeFieldValue(
                          'supervisor',
                          item ? item.value : null
                        );
                      }}
                    />
                    {touchedSubmit && (
                      <p className="error">
                        {this.getErrorMessage('supervisor')}
                      </p>
                    )}
                  </div>
                  <div className="form-group col-sm-6">
                    <label className="d-block">CC User</label>
                    <UsersAsyncSearch
                      isMulti
                      triggerReloadKey={
                        JSON.stringify(job.requestor) +
                        JSON.stringify(job.supervisor)
                      }
                      usersNotAvailable={[
                        job.supervisor ? job.supervisor.id : null,
                        job.requestor ? job.requestor.id : null,
                      ]}
                      searchParams={{
                        roles: [
                          EROLES.requestor,
                          EROLES.department_supervisor,
                          EROLES.coned_field_supervisor,
                          EROLES.coned_billing_admin,
                        ],
                        isApproved: 1,
                      }}
                      defaultValue={
                        job.ccUser
                          ? job.ccUser.map(
                              (user) =>
                                user &&
                                user.value && {
                                  label: `${user.value.firstName} ${user.value.lastName}`,
                                  value: user.value,
                                }
                            )
                          : null
                      }
                      handleBlur={handleBlur}
                      onSelect={(item) => {
                        this.handleChangeFieldValue(
                          'ccUser',
                          item ? item : null
                        );
                      }}
                    />
                    {touchedSubmit && (
                      <p className="error">{this.getErrorMessage('ccUser')}</p>
                    )}
                  </div>
                  <div className="form-group col-sm-6">
                    <label className="d-block">Municipality</label>
                    <MunicipalitiesAsyncSearch
                      defaultValue={
                        job.municipality
                          ? {
                              label: job.municipality.label,
                              value: job.municipality,
                            }
                          : undefined
                      }
                      handleBlur={handleBlur}
                      onSelect={(item) =>
                        this.handleMunicipality(
                          'municipality',
                          item ? item : undefined
                        )
                      }
                    />
                    {touchedSubmit && (
                      <p className="error">
                        {this.getErrorMessage('municipality')}
                      </p>
                    )}
                  </div>
                  <div className="form-group col-sm-6">
                    <label className="d-block">Section</label>
                    <input
                      className="ce-form-control"
                      placeholder="Enter Section Name"
                      name={'section'}
                      defaultValue={job.section}
                      onBlur={handleBlur}
                      onChange={this.handleChangeField}
                    />
                    {touchedSubmit && (
                      <p className="error">{this.getErrorMessage('section')}</p>
                    )}
                    <div className="write-pen" />
                  </div>
                  <div className="form-group col-sm-6">
                    <label className="d-block">Max workers</label>
                    <input
                      disabled={this.props.isEdit && this.props.permissions.includes('edit_job_info') && !this.props.permissions.includes('edit_all_jobs')}
                      type="number"
                      className="ce-form-control"
                      placeholder="Enter max workers"
                      name={'maxWorkers'}
                      min={1}
                      value={job.maxWorkers}
                      onBlur={handleBlur}
                      onChange={this.handleChangeField}
                    />
                    {touchedSubmit && (
                      <p className="error">
                        {this.getErrorMessage('maxWorkers')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="block-white">
                <div className="row">
                  <div className="form-group col-sm-4">
                    <label className="d-block">PO #</label>
                    <input
                      className="ce-form-control"
                      placeholder="Enter PO Number"
                      data-type={'text'}
                      defaultValue={job.po || ''}
                      name={'po'}
                      onChange={this.handleChangeField}
                    />
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block">Feeder #</label>
                    <input
                      className="ce-form-control"
                      placeholder="Enter Feeder Number"
                      data-type={'string'}
                      name={'feeder'}
                      defaultValue={job.feeder || ''}
                      onChange={this.handleChangeField}
                    />
                    <p className="error">{this.getErrorMessage('feeder')}</p>
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block">POET #</label>
                    <input
                      className="ce-form-control"
                      placeholder="Enter POET Number"
                      // data-type={'number'}
                      value={job.poet}
                      name={'poet'}
                      onChange={this.handleChangeField}
                    />
                    <p className="error">{this.getErrorMessage('poet')}</p>
                  </div>
                  {/*                  <div className="form-group col-sm-3">
                        <label className="d-block">Max Workers</label>
                        <input
                            className="ce-form-control"
                            placeholder="1"
                            data-type={'number'}
                            defaultValue={job.maxWorkers}
                            name={'maxWorkers'}
                            onChange={this.handleChangeField}
                        />
                        <p className="error">
                          {this.getErrorMessage('maxWorkers')}
                        </p>
                      </div>*/}
                </div>

                <div className="row">
                  <div className="form-group col-sm-4">
                    <label className="d-block">Work Request #</label>
                    <input
                      className="ce-form-control"
                      placeholder="Enter WR Number"
                      defaultValue={job.wr}
                      name={'wr'}
                      onChange={this.handleChangeField}
                    />
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block">Requisition #</label>
                    <input
                      className="ce-form-control"
                      placeholder="Enter Requisition #"
                      name={'requisition'}
                      defaultValue={job.requisition}
                      onChange={this.handleChangeField}
                    />
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block">Receipt #</label>
                    <input
                      className="ce-form-control"
                      placeholder="Enter Receipt Number"
                      name={'receipt'}
                      defaultValue={job.receipt}
                      onChange={this.handleChangeField}
                    />
                  </div>
                </div>
              </div>
              <div>
                {job.locations.map((location, index) => (
                  <div key={`${index}`} className="block-white">
                    <MapSelect
                      hasEdit={false}
                      location={location}
                      location_index={index}
                      flagging={(job && job.jobType) === JobType.Flagging}
                      index={index}
                      touchedSubmit={touchedSubmit}
                      handleBlur={handleBlur}
                      can_edit_location={this.props.can_edit_location}
                      errors={this.getErrorMessage('locations')}
                      onChange={this.onLocationChange}
                      onRemove={this.onLocationRemove}
                    />
                  </div>
                ))}
                <div
                  className="row cursor-pointer justify-content-end mr-4 mb-4"
                  onClick={
                    can_add_new_location ? this.addNewLocation : () => {}
                  }
                  style={{
                    cursor: can_add_new_location ? 'pointer' : 'not-allowed',
                  }}
                >
                  <div className="add-another-job" />
                  <Tooltip
                    title={
                      can_add_new_location
                        ? 'Add New Location'
                        : 'Increase Maximum workers to add new location'
                    }
                    placement={'top'}
                  >
                    <div
                      className="text-16 text-blue"
                      style={{
                        color: can_add_new_location
                          ? '#2F80ED'
                          : 'rgb(128 130 131)',
                        textDecoration: can_add_new_location
                          ? 'underline #2F80ED'
                          : 'underline rgb(128 130 131)',
                      }}
                    >
                      Add Location
                    </div>
                  </Tooltip>
                </div>
              </div>

              <div className="block-white">
                <div className="form-group">
                  <label className="d-block">Job Comments (optional)</label>
                  <textarea
                    rows={5}
                    placeholder="Add comments"
                    className="ce-form-control-textarea"
                    value={job.comment ? job.comment : ''}
                    name={'comment'}
                    onChange={this.handleChangeField}
                  />
                </div>
                {this.props.remove && this.props.index > 0 && (
                  <div
                    className=" ml-1 row cursor-pointer"
                    onClick={this.openDeleteJob}
                  >
                    <div className="delete-another-job" />
                    <div className="text-16 delete-another-job-text">
                      Delete Job
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}

        {this.state.assign ? (
          <JobAssign
            buttonTitle={'Save and continue'}
            job={job}
            onAssign={this.assignWorkers}
            onSave={this.toggleAssign}
            workers={job.workers}
          />
        ) : null}

        <DeleleJob
          open={this.state.open_delete_job}
          onClose={this.closeDeleteJob}
          clicked={this.props.removeJob}
        />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    permissions: state.app.permissions
  };
}
export default connect(mapStateToProps, null)(JobFormComponent);
