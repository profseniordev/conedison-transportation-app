import { observer } from 'mobx-react';
import React from 'react';
import { EROLES } from '../../Constants/user';
import authStore from '../../Stores/authStore';
import timeSheetStore from '../../Stores/timeSheetStore';
import userStore from '../../Stores/userStore';
import { formatDate, FORMATES, renderTime } from '../../Utils/Date';
import * as CeIcon from '../../Utils/Icon';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import { UsersAsyncSearch } from '../Components/Controls/UsersAsyncSearch';
import { ConfNumberAsyncSearch } from '../Components/Controls/ConfNumberAsyncSearch';
import ConfNumberMaterialSelect from '../Components/Controls/ConfNumberMaterialSelect';
import SignatureCanvas from 'react-signature-canvas';
import './TimesheetCreate.scss';
import '../Components/Controls/AsyncSelect.scss';
import { timesheetAPI } from '../../Services/API';
import ImageUpload from '../Components/ImageUpload/ImageUpload';
import {
  TextField,
  Select as MaterialSelect,
  MenuItem,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import { actions } from '../../Services';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

@observer
class TimesheetCreate extends React.Component<any> {
  comment = null;
  signCanvas: SignatureCanvas;
  refConfNumber = null;

  state = {
    timesheet: null,
    signature: false,
    searchWorker: null,
    searchConfNumber: null,
    worker: null,
    worker_id: 0,
    workerObj: null,
    startDate: null,
    finishDate: null,
    jobType: null,
    jobStatus: null,
    editComment: null,
  };

  getTimesheetTotalHours = async () => {
    const totalHours = await timeSheetStore.getTimesheetTotalHours(
      timeSheetStore.timesheet.startDate,
      timeSheetStore.timesheet.finishDate,
      timeSheetStore.timesheet.id
    );

    this.setState((state: any) => ({
      timesheet: { ...state.timesheet, totalHours: Number(totalHours) },
    }));
  };

  handleValueChange = async (name, value) => {
    this.setState({
      [name]: value,
    });

    const state = this.state;
    const workerFields = ['startDate', 'finishDate', 'totalHours'];

    if (workerFields.includes(name) && value && value.toString().length > 0) {
      const startDate =
        name === 'startDate' ? value : state.workerObj.startDate;
      const finishDate =
        name === 'finishDate' ? value : state.workerObj.finishDate;
      const totalHours = await timeSheetStore.getTimesheetTotalHours(
        startDate,
        finishDate,
        null
      );

      this.setState({
        workerObj: {
          ...state.workerObj,
          [name]: value,
          totalHours: totalHours,
        },
      });
    } else {
      this.setState({ timesheet: { ...state.timesheet, [name]: value } });
    }
    timeSheetStore.updateLocal(name, value);
  };

  handleInputChange = (event) => {
    const { name, value, type } = event.currentTarget;
    if (type === 'number') {
      return this.handleValueChange(name, Number(value));
    }
    return this.handleValueChange(name, value);
  };

  workerUpdated = (value) => {
    this.setState({
      worker_id: value,
    });
    this.props.job.workers.forEach((worker) => {
      if (worker.worker.id === worker.id) {
        this.setState({
          workerObj: worker,
          startDate: moment(worker.startDate).format('YYYY-MM-DDThh:mm'),
          finishDate: moment(worker.finishDate).format('YYYY-MM-DDThh:mm'),
          endDate: moment(worker.endDate).format('YYYY-MM-DDThh:mm'),
        });
      }
    });
  };

  addComment = () => {
    if (!this.comment || !this.comment.value) return;
    this.handleValueChange('comments', [
      ...timeSheetStore.timesheet.comments,
      {
        createdAt: new Date().toISOString(),
        author: userStore.me.name,
        comment: this.comment.value,
      },
    ]);
    this.comment.value = '';
  };

  editComment = (idx) => {
    this.setState({
      editComment: idx
    });
  }

  deleteComment = (idx) => {
    this.handleValueChange(
      'comments',
      timeSheetStore.timesheet.comments.filter(
        (comment, index) => index !== idx
      )
    );
  };

  updateComment = (idx, event) => {
    console.log(idx, event.target.value);
    let comments = timeSheetStore.timesheet.comments;

    comments[idx] = {
      ...comments[idx],
      comment: event.target.value
    };

    console.log(comments);
    this.handleValueChange('comments', comments);
  };

  addZero = (i: number) => {
    if (i < 10) {
      return `0${i}`;
    }
    return `${i}`;
  };

  getTime = (date: Date) => {
    const hour = this.addZero(date.getHours());
    const minute = this.addZero(date.getMinutes());
    return hour + ':' + minute;
  };

  save = async (event) => {
    event.preventDefault();
    const { timesheet, worker, worker_id, workerObj } = this.state;
    let signature = null;
    if (this.signCanvas && !this.signCanvas.isEmpty()) {
      signature = {
        data: this.signCanvas.toDataURL().replace('data:image/png;base64,', ''),
        type: 'image/jpeg',
        name: 'photo.jpg',
      };
    }

    const startDate = new Date(workerObj.startDate);
    const finishDate = new Date(workerObj.finishDate);

    let images = [];
    if (timesheet.images && timesheet.images.length > 0) {
      const formData = new FormData();
      timesheet.images.forEach((image) => formData.append('images', image));
      images = (await timesheetAPI.uploadImages(formData)).data;
    }

    const _timesheet = {
      jobId: timesheet.jobId,
      date: timesheet.date,
      locations: workerObj.location,
      startDate: startDate,
      startTime: this.getTime(startDate),
      finishDate: finishDate,
      finishTime: this.getTime(finishDate),
      totalHours: workerObj.totalHours,
      conEdisonTruck: timesheet.conEdisonTruck,
      noBreak: false,
      hasDinner: false,
      hasLunch: false,
      workerId: worker_id,
      // overtimeHours:
      // holidayHours:
      // regHours:
      confirmationNumber: timesheet.jobId,
      department: timesheet.department,
      departmentName: timesheet.departmentName,
      // employeeNumber:
      // jobComment:
      // jobFinishTime:
      municipality: timesheet.municipality,
      po: timesheet.po,
      requestDate: timesheet.requestTime,
      requestor: timesheet.requestor,
      requestorName: timesheet.requestorName,
      section: timesheet.section,
      signatureName: timesheet.signatureName,
      // type:
      workRequest: timesheet.workRequest,
      // conEdisonSupervisorName:
      invoiced: timesheet.invoiced,
      paid: timesheet.paid,
      isVerified: timesheet.isVerified,
      workerPaid: timesheet.workerPaid,
      comments: timesheet.comments,
      images: images,
    };

    const response = await timeSheetStore.create({
      ..._timesheet,
      ...{ sign: signature ? JSON.stringify(signature) : null },
    });

    if (response.status < 300) {
      this.props.history.push('/timesheets');
    }
  };

  componentWillUnmount = () => {
    timeSheetStore.clearTimesheet();
  };

  showSignatureCanvas = () => {
    this.setState({
      signature: true,
    });
  };

  clearSignature = () => {
    if (this.signCanvas) {
      this.signCanvas.clear();
    }
  };

  onWorkerSelect = (item) => {
    this.setState({ worker: item ? item.value : null });
  };

  onJobSelect = async (item) => {
    this.setState({workerObj: null,  worker_id: null});
    const { worker } = this.state;
    if (item) {
      this.props
        .retrieveJob(item.value.id, worker ? worker.workerId : '')
        .then((job) => {
          const timesheet = {
            ...job,
            jobId: job.id,
            date: job.requestTime,
            poet: job.poet || '',
            workRequest: job.maxWorkers,
            po: job.po,
            jobType: job.jobType,
            supervisorName: job.supervisorName,
            jobStatus: job.jobStatus,
          };
          let workerObj = null;
          if (worker) {
            job.workers.map(async (w) => {
              if (w.workerId === worker.id) {
                const finishDate = new Date().toISOString();
                const totalHours = await timeSheetStore.getTimesheetTotalHours(
                  w.startDate,
                  finishDate,
                  null
                );
                workerObj = {
                  ...w,
                  finishDate: finishDate,
                  totalHours: totalHours,
                };
                this.setState({ workerObj: workerObj });
              }
            });
          }
          this.setState({ timesheet: timesheet });
        });
    } else {
      this.setState({ timesheet: null });
    }
  };

  public render() {
    const state = this.state;
    // const {timesheet} = timeSheetStore;
    /*    let selectWorkerComponent = (
        <WorkerAsyncSearch
            ref={(ref) => this.refWorker = ref}
            onSelect={this.onWorkerSelect} />
    );
    if (state.timesheet) {
      selectWorkerComponent = (
          <Select
              isClearable
              onChange={this.onWorkerObjSelect}
              defaultValue={state.worker ? {label: state.worker.name, value: state.worker} : null}
              options={state.timesheet.workers.map((worker) => {
                return {label: worker.worker.name, value: worker}
              })} />
      );
    }*/

    return (
      <form
        onSubmit={this.save}
        className="container timesheet-create-page timesheet-form"
        style={{
          height: '90%',
          overflowY: 'scroll',
        }}
      >
        <div className="page-header">
          <div className="page-title">Create Timesheet</div>
        </div>
        <div className="box-item">
          <div className="box-item-header d-flex align-items-center justify-content-between">
            <div className="row w-100">
              <div className="col-md-3 col-sm-4 form-group" style={{marginLeft: '3rem'}}>
               <label className="d-block">Confirmation Number</label>
                <ConfNumberAsyncSearch
                  ref={(ref) => (this.refConfNumber = ref)}
                  onSelect={this.onJobSelect}
                  placeholder='Select conf number'
                  searchParams={{
                    workerId:
                      state.worker && state.worker.id ? state.worker.id : null,
                  }}
                  triggerReloadKey={state.worker}
                  defaultValue={
                    state.timesheet
                      ? {
                          label: state.timesheet.jobId,
                          value: state.timesheet,
                        }
                      : null
                  }
                />
                </div>
              <div
                className="col-md-3 col-sm-4 form-group"
                style={{ margin: 0, height: 47, marginTop: 21 }}
              >
                <FormControl variant={'outlined'} style={{ marginTop: 10 }}>
                  <InputLabel id="select-worker-label">Worker</InputLabel>
                  <MaterialSelect
                    label="Worker"
                    labelId="select-worker-label"
                    id="select-worker-input"
                    value={this.state.worker_id}
                    onChange={(event) => this.workerUpdated(event.target.value)}
                    style={{
                      width: 200,
                    }}
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                      },
                      getContentAnchorEl: null
                    }}
                  >
                    {this.props.job && this.props.job.workers.length > 0 ?
                      this.props.job.workers.map((worker, index) => {
                        return (
                          <MenuItem value={worker.worker.id} key={index}>
                            {worker.worker.name}
                          </MenuItem>
                        );
                      }) : 
                        <MenuItem value="" disabled>
                            No workers
                        </MenuItem>
                    }
                  </MaterialSelect>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="col-sm-4 col-12 form-group">
                {/*<label className="d-block" htmlFor="requestor">
                  Requester
                  </label>*/}
                <UsersAsyncSearch
                  searchParams={{ roles: [EROLES.requestor] }}
                  disabled
                  placeholder='Select Requestor'
                  triggerReloadKey={state.timesheet}
                  defaultValue={
                    state.timesheet
                      ? {
                          label: state.timesheet.requestorName,
                          value: state.timesheet.requestor,
                        }
                      : null
                  }
                />
              </div>
              <div className="col-sm-4 col-6 form-group">
                {/*<label className="d-block" htmlFor="requestdate">
                    Request Date
                  </label>
                  <DateComponent
                      showTimeSelect
                      disabled
                      date={state.timesheet ? new Date(state.timesheet.date) : new Date()}
                  />*/}
                <TextField
                  label="Request Date"
                  type="datetime-local"
                  variant={'outlined'}
                  value={
                    state.timesheet
                      ? moment(state.timesheet.date).format('YYYY-MM-DDThh:mm')
                      : moment().format('YYYY-MM-DDThh:mm')
                  }
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-12 col-md-4">
                <TextField
                  id={'start-datetime-input'}
                  label="Start Date"
                  type="datetime-local"
                  variant={'outlined'}
                  onChange={(date) =>
                    this.handleValueChange('startDate', date.target.value)
                  }
                  value={this.state.startDate}
                  disabled={
                    !(state.workerObj && !timeSheetStore.timesheet.workerPaid)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="form-group  col-sm-12 col-md-4">
                <TextField
                  id={'finish-datetime-input'}
                  label="Finish Date"
                  type="datetime-local"
                  variant={'outlined'}
                  onChange={(date) =>
                    this.handleValueChange('finishDate', date.target.value)
                  }
                  value={this.state.finishDate}
                  disabled={
                    !(state.workerObj && !timeSheetStore.timesheet.workerPaid)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: moment(this.state.startDate).format('YYYY-MM-DDThh:mm'),
                  }}
                />
              </div>
              <div className="form-group  col-sm-12 col-md-4" style={{marginTop: '-4rem'}}>
                <label className="d-block text-nowrap" htmlFor="totalHours">
                  Total Hours
                </label>
                <input
                  className="ce-form-control input-pick-time"
                  id="totalHours"
                  disabled
                  value={renderTime(
                    state.workerObj && state.workerObj.totalHours
                      ? state.workerObj.totalHours
                      : 0
                  )}
                  name="totalHours"
                  placeholder="08:00"
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-3 ">
                {/*<div className="MuiFormControl-root MuiTextField-root">*/}
                {/*<label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined Mui-disabled Mui-disabled" htmlFor="department">*/}
                {/*  Department*/}
                {/*</label>*/}
                {/*  <div className='MuiInputBase-root MuiOutlinedInput-root Mui-disabled Mui-disabled MuiInputBase-formControl'>*/}
                {/*<DepartmentAsyncSearch*/}
                {/*    disabled*/}
                {/*    triggerReloadKey={state.timesheet}*/}
                {/*    defaultValue={*/}
                {/*      state.timesheet*/}
                {/*          ? {*/}
                {/*            label: state.timesheet.departmentName,*/}
                {/*            value: state.timesheet.department*/}
                {/*          }*/}
                {/*          : null*/}
                {/*    }/>*/}
                {/*  */}
                {/*  </div>*/}
                {/*</div>*/}
                {/*<div className="MuiFormControl-root MuiTextField-root"><label*/}
                {/*    className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined Mui-disabled Mui-disabled"*/}
                {/*    data-shrink="true" htmlFor="section" id="section-label"> Section #</label>*/}
                {/*  <div className="MuiInputBase-root MuiOutlinedInput-root Mui-disabled Mui-disabled MuiInputBase-formControl">*/}
                <DepartmentAsyncSearch
                  disabled
                  triggerReloadKey={state.timesheet}
                  defaultValue={
                    state.timesheet
                      ? {
                          label: state.timesheet.departmentName,
                          value: state.timesheet.department,
                        }
                      : null
                  }
                />
                {/*<fieldset aria-hidden="true"*/}
                {/*          className="PrivateNotchedOutline-root-1 MuiOutlinedInput-notchedOutline">*/}
                {/*  <legend*/}
                {/*      className="PrivateNotchedOutline-legendLabelled-3 PrivateNotchedOutline-legendNotched-4">*/}
                {/*    <span> Section #</span>*/}
                {/*  </legend>*/}
                {/*</fieldset>*/}
                {/*</div>*/}
                {/*</div>*/}
              </div>
              <div className="form-group col-sm-3">
                <TextField
                  disabled
                  id="section"
                  label=" Section #"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="000"
                  value={`${state.timesheet ? state.timesheet.section : ''}`}
                  variant="outlined"
                />
              </div>
              <div className="form-group col-sm-3">
                <TextField
                  disabled
                  id="poet"
                  label=" POET #"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="00000"
                  value={`${state.timesheet ? state.timesheet.poet : ''}`}
                  variant="outlined"
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-3">
                <TextField
                  disabled
                  id="workRequest"
                  label="Work Request  #"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="00000"
                  value={`${
                    state.timesheet ? state.timesheet.wr : ''
                  }`}
                  variant="outlined"
                />
              </div>
              <div className="form-group col-sm-3">
                <TextField
                  disabled
                  id="po"
                  label="PO #"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="PO #..."
                  value={`${state.timesheet ? state.timesheet.po : ''}`}
                  variant="outlined"
                />
              </div>
              <div className="form-group col-sm-3">
                <TextField
                  disabled
                  id="outlined-disabled"
                  label="Receipt #"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Receipt #..."
                  value={`${state.timesheet ? state.timesheet.receipt : ''}`}
                  variant="outlined"
                />
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-4">
                {/*<label className="d-block" htmlFor="locationaddress">
                  Location Address #1
                </label>
                <input
                  className="ce-form-control"
                  id="locationaddress"
                  name="locationaddress"
                  disabled
                  placeholder="BX, Gleason Ave/ Virginia Ave"
                  value={state.workerObj && state.workerObj.location ? state.workerObj.location.address : ''}
                />*/}
                <TextField
                  disabled
                  id="locationAddress"
                  label=" Location Address #1"
                  placeholder="BX, Gleason Ave/ Virginia Ave"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={
                    state.workerObj && state.workerObj.location
                      ? state.workerObj.location.address
                      : ''
                  }
                  variant="outlined"
                />
              </div>
              <div className="form-group col-sm-4">
                {/*<label className="d-block" htmlFor="structuretosecure">
                  Structure #
                </label>
                <input
                  className="ce-form-control"
                  id="structuretosecure"
                  name="structuretosecure"
                  disabled
                  placeholder="Structure #"
                  value={state.workerObj && state.workerObj.location ? state.workerObj.location.structure : ''}
                />*/}
                { state.timesheet && state.timesheet.jobType !== 1 ? 
                <TextField
                  disabled
                  id="locationAddress"
                  label="Structure #"
                  placeholder="Structure #"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={
                    state.workerObj && state.workerObj.location
                      ? state.workerObj.location.structure
                      : ''
                  }
                  variant="outlined"
                />
                  : null}
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-4">
                <TextField
                  id="email"
                  name="email"
                  label="Email #"
                  placeholder="000"
                  variant="outlined"
                  value={`${
                    state.workerObj && state.workerObj.worker
                      ? state.workerObj.worker.email
                      : ''
                  }`}
                  disabled={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
              <div className="form-group col-sm-4">
                <TextField
                  disabled={!state.timesheet}
                  required={state.timesheet && state.timesheet.jobStatus !== 6}
                  id="conEdisonTruck"
                  name="conEdisonTruck"
                  label="Phone #"
                  placeholder="000"
                  variant="outlined"
                  value={`${
                    state.workerObj && state.workerObj.worker
                      ? state.workerObj.worker.phoneNumber
                      : ''
                  }`}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-4">
                <TextField
                  disabled={!state.timesheet}
                  required={state.timesheet && state.timesheet.jobStatus !== 6}
                  id="conEdisonTruck"
                  name="conEdisonTruck"
                  label="ConEdison Truck #"
                  placeholder="000"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group col-sm-4">
                <TextField
                  disabled
                  id="section"
                  name="section"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={state.timesheet ? state.timesheet.supervisorName : ''}
                  label="ConEdison supervisor"
                  variant="outlined"
                />
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-inline col-sm-4 col-md-10">
                <CheckboxComponent
                  id="Verified"
                  hasTitle="Timesheet Verified"
                  checked={state.timesheet && state.timesheet.isVerified}
                  onChange={(checked) =>
                    this.handleValueChange('isVerified', checked)
                  }
                  className="mr-5"
                />
                <CheckboxComponent
                  id="Worker Paid"
                  hasTitle="Worker Paid"
                  checked={state.timesheet && state.timesheet.workerPaid}
                  onChange={(checked) =>
                    this.handleValueChange('workerPaid', checked)
                  }
                  className="mr-5"
                  disabled={!state.timesheet}
                />
                <CheckboxComponent
                  id="Invliced"
                  hasTitle="Invoiced"
                  checked={state.timesheet && state.timesheet.invoiced}
                  onChange={(checked) =>
                    this.handleValueChange('invoiced', checked)
                  }
                  className="mr-5"
                  disabled={!state.timesheet}
                />
                <CheckboxComponent
                  id="Paid"
                  hasTitle="Paid"
                  checked={state.timesheet && state.timesheet.paid}
                  onChange={(checked) =>
                    this.handleValueChange('paid', checked)
                  }
                  className="mr-5"
                  disabled={!state.timesheet}
                />
              </div>
            </div>
          </div>
          <div className="box-item-body">
            <div className="row">
              <div className="form-group col-sm-3">
                {/*<label className="d-block" htmlFor="section">*/}
                {/*  Signature Name*/}
                {/*</label>*/}
                {/*<input*/}
                {/*    className="ce-form-control"*/}
                {/*    id="section"*/}
                {/*    name="signatureName"*/}
                {/*    onChange={this.handleInputChange}*/}
                {/*    disabled={!state.timesheet}*/}
                {/*/>*/}
                <TextField
                  disabled={!state.timesheet}
                  required={state.timesheet && state.timesheet.jobStatus !== 6}
                  id="section"
                  name="signatureName"
                  label="Signature Name"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group col-sm-3">
                {/*<label className="d-block" htmlFor="section">*/}
                {/*  Employee #*/}
                {/*</label>*/}
                {/*<input*/}
                {/*    className="ce-form-control"*/}
                {/*    id="section"*/}
                {/*    name="employeeNumber"*/}
                {/*    onChange={this.handleInputChange}*/}
                {/*    disabled={!state.timesheet}*/}
                {/*/>*/}
                <TextField
                  disabled={!state.timesheet}
                  required={state.timesheet && state.timesheet.jobStatus !== 6}
                  id="section"
                  name="employeeNumber"
                  label="Employee #"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div>
              <label className="d-block" htmlFor="sign">
                Signature
              </label>
              {state.signature ? (
                <>
                  <SignatureCanvas
                    penColor="black"
                    ref={(ref) => {
                      this.signCanvas = ref;
                    }}
                    canvasProps={{
                      height: 150,
                      className: 'sign-canvas col-sm-8',
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-default clear-btn btn-sign"
                    onClick={this.clearSignature}
                  >
                    Clear
                  </button>
                </>
              ) : (
                <div
                  className="no-sign col-sm-8"
                  onClick={this.showSignatureCanvas}
                >
                  No Signature. Please Click Here To Sign
                </div>
              )}
            </div>
          </div>
          <div className="box-item-body-none">
            <div className="form-group">
              <label className="d-block">Photo of Paper Timesheet</label>
              <ImageUpload
                onChangeImage={(images) =>
                  this.handleValueChange('images', images)
                }
                disabled={!state.timesheet}
              />
            </div>
          </div>
          <div className="box-item-body">
            {state.timesheet && state.timesheet.comments
              ? state.timesheet.comments.map((comment, idx) => {
                  return (
                    <div>
                      <div className="d-flex justify-content-between">
                      <div></div>
                        <div className="actions d-flex align-items-center">
                          <CeIcon.PencilIcon className="cursor-pointer mr-2" onClick={() => this.editComment(idx)} />
                          <CeIcon.CloseSolidIcon
                            onClick={() => this.deleteComment(idx)}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="position-relative">
                        <input
                          className="ce-form-control border-none"
                          name='edit-comment'
                          value={comment.comment} 
                          disabled={this.state.editComment !== idx}
                          onChange={(value) => this.updateComment(idx, value)}
                          onBlur={() => this.editComment(null)}
                        />
                      </div>
                      </div>
                  );
                })
              : null}
            <div className="form-group mt-3">
              <div className="position-relative comment-section">
                <input
                    className="ce-form-control h-55"
                    ref={comment => (this.comment = comment)}
                    placeholder="Your Comment..."
                    disabled={!state.timesheet}
                />
                <CeIcon.SendButtonIcon
                  className="send-button-field cursor-pointer"
                  style={{top:17}}
                  onClick={this.addComment}
                />
              </div>
            </div>
          </div>
        </div>
        {authStore.canAccessInvoice() && (
          <div className="my-4 d-flex justify-content-end">
            <button
              className="btn btn-success btn-add"
              type="submit"
              disabled={!(state.timesheet && state.worker_id)}
            >
              Save
            </button>
          </div>
        )}
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    job: state.jobs.job,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    retrieveJob: (job_id, worker_id) =>
      dispatch(actions.JobsActions.retrieveJob(job_id, worker_id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimesheetCreate);
