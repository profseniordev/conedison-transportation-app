import { observer } from 'mobx-react';
import React from 'react';
import { EROLES } from '../../Constants/user';
import timeSheetStore from '../../Stores/timeSheetStore';
import userStore from '../../Stores/userStore';
import { formatDate, FORMATES, renderTime } from '../../Utils/Date';
import * as CeIcon from '../../Utils/Icon';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import { UsersAsyncSearch } from '../Components/Controls/UsersAsyncSearch';
import SignatureCanvas from 'react-signature-canvas';
import './TimesheetEdit.scss';
import { timesheetAPI } from '../../Services/API';
import ImageUpload from '../Components/ImageUpload/ImageUpload';
import CircularProgress from '@material-ui/core/CircularProgress';
import {  Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';
import moment from 'moment';
import History from '../Components/History/History';
import HistoryIcon from '@material-ui/icons/History';

@observer
class TimesheetEdit extends React.Component<any> {
  comment = null;
  tempComment = null;
  signCanvas: SignatureCanvas;

  state = {
    timesheet: null,
    signature: false,
    isLoading: true,
    editComment: null, 
    openHistory: false,
  };

  loadStart = () => {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
  };

  loadEnd = () => {
    this.setState((state) => ({
      ...state,
      isLoading: false,
    }));
  };

  componentDidUpdate = () => {
    const { timesheet } = timeSheetStore;
      //alert(JSON.stringify(timesheet));

      if (this.signCanvas && timesheet && timesheet.sign) {
        const sign = JSON.parse(timesheet.sign);
        sign && this.signCanvas.fromDataURL(`data:${sign.type};base64,${sign.data}`);
      }
  }

  componentDidMount = async () => {
    this.loadStart();

    try {
      await timeSheetStore.getTimesheet(this.props.match.params.id);

      const { timesheet } = timeSheetStore;
      //alert(JSON.stringify(timesheet));

      if (this.signCanvas && timesheet && timesheet.sign) {
        const sign = JSON.parse(timesheet.sign);
        this.signCanvas.fromDataURL(`data:${sign.type};base64,${sign.data}`);
      }

      this.loadEnd();
    } catch (error) {
      this.loadEnd();
    }
  };

  getTimesheetTotalHours = async () => {
    const totalHours = await timeSheetStore.getTimesheetTotalHours(
      timeSheetStore.timesheet.startDate,
      timeSheetStore.timesheet.finishDate,
      timeSheetStore.timesheet.id
    );

    this.setState((state: any) => ({
      ...state,
      timesheet: { ...state.timesheet, totalHours: Number(totalHours) },
    }));
  };

  handleValueChange = (name, value) => {
    this.setState(
      (state: any) => ({ timesheet: { ...state.timesheet, [name]: value } }),
      () => {
        if (name === 'startDate' || name === 'finishDate') {
          this.getTimesheetTotalHours();
        }
      }
    );
    timeSheetStore.updateLocal(name, value);
  };

  handleInputChange = (event) => {
    const { name, value, type } = event.currentTarget;
    if (type === 'number') {
      return this.handleValueChange(name, Number(value));
    }
    return this.handleValueChange(name, value);
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

  save = async (event) => {
    this.loadStart();
    event.preventDefault();
    try {
      const timesheet = this.state.timesheet;
      let signature = null;
      if (this.signCanvas && !this.signCanvas.isEmpty()) {
        signature = {
          data: this.signCanvas
            .toDataURL()
            .replace('data:image/png;base64,', ''),
          type: 'image/jpeg',
          name: 'photo.jpg',
        };
      }
      let images = [];
      if (timesheet && timesheet.images && timesheet.images.length > 0) {
        let newImagesUrl = [];
        const newImages = timesheet.images.filter(
          (image) => typeof image !== 'string'
        );
        if (newImages.length > 0) {
          const formData = new FormData();
          newImages.forEach((image, index) => {
            formData.append(`images-${index}`, image);
          });
          newImagesUrl = (await timesheetAPI.uploadImages(formData)).data;
        }
        const oldImage = timesheet.images.filter(
          (image) => typeof image === 'string'
        );
        images = [...oldImage, ...newImagesUrl];
      }

      const response = await timeSheetStore.update(this.props.match.params.id, {
        ...timesheet,
        ...{ sign: signature ? JSON.stringify(signature) : null },
        images: images,
      });

      if (response.status < 300) {
        this.props.history.push('/timesheets');
      }
    } catch (error) {
      this.loadEnd();
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

  downloadPdf = async () => {
    const response = await timesheetAPI.downloadPdf(this.props.match.params.id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'timesheet.pdf');
    document.body.appendChild(link);
    link.click();
  };

  openHistory = () => {
    this.setState({
      openHistory: !this.state.openHistory
    });
  }

  public render() {
    const { timesheet } = timeSheetStore;
    const inputProps = {
      // min:  moment( Date()).format('YYYY-MM-DDThh:mm') ,
    };
    return (
      <>
        {this.state.isLoading && (
          <div className="timesheet-loader_wrapper">
            <CircularProgress size={24} className={'circular-progress'} />
          </div>
        )}

        {timesheet.id && (
          <form
            onSubmit={this.save}
            className="container timesheet-create-page"
            style={{
              height: '90%',
              overflowY: 'scroll',
            }}
          >
            <div className="page-header">
              <div className="page-title">Timesheet</div>
            </div>
            <div className="box-item">
              <div className="box-item-header p-4 row justify-content-between">
                <div className="">
                  <div className="d-flex align-items-center">
                    <img
                      className="worker-img  avatar mr-4"
                      src={timesheet.worker.avatar}
                      alt="avatar"
                    />
                    <div className="row justify-content-between ">
                      <span className="text-bold h2 mb-0 mr-2">
                        {timesheet.worker.name}
                      </span>
                      <span className="text-bold  h2 mb-0 mr-4">
                        #{timesheet.confirmationNumber} {timesheet.job_type}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    {this.props.hasCESolutionRole && (
                      <>
                        <span className="mr-4">
                          {timesheet.subcontractorName}
                        </span>
                        <br />
                      </>
                    )}
                    <span className="mr-4">{timesheet.worker.email}</span>{' '}
                    <br />
                    <span className="mr-4">
                      {timesheet.worker.phoneNumber}
                    </span>{' '}
                    <br />
                    {/* <span>{formatDate(timesheet.job.requestTime)}</span> */}
                  </div>
                </div>
                <div className="">
                  <span
                    className="mr-3 ce-mr-20 download-link"
                    onClick={this.downloadPdf}
                  >
                    <CeIcon.DownloadInvoiceIcon className="ce-mr-10" />
                    Download
                  </span>
                  {this.props.canAccessInvoice && (
                    <span className="mr-3 ">
                      <Link
                        style={{ color: '#3a3c3e' }}
                        to={`/invoices?create=true`}
                      >
                        <CeIcon.CreateInvoiceIcon className="ce-mr-10" />
                        Create Invoice
                      </Link>
                    </span>
                  )}
                  {this.props.permissions.includes('see_timesheet_history') && (
                    <span className="mr-3 hover-line " style={{ color: '#3a3c3e' }} onClick={this.openHistory}>
                        <HistoryIcon style={{ color: '#3a3c3e', marginRight: 5, marginBottom: 3 }} fontSize='small' />
                        {!this.state.openHistory ? 'History' : 'Timesheet'}
                    </span>
                  )}
                </div>
              </div>
              {this.state.openHistory ? <History changesLog={timesheet.changesLog} canDownload={false} /> : 
                <>
                  <div className="box-item-body">
                    <div className="row">
                      <div className="col-sm-4 col-12 form-group">
                        <label className="d-block" htmlFor="requestor">
                          Requestor
                        </label>
                        <UsersAsyncSearch
                          searchParams={{ roles: [EROLES.requestor] }}
                          disabled
                          defaultValue={
                            timesheet.requestorName
                              ? {
                                  label: timesheet.requestorName,
                                  value: timesheet.requestor,
                                }
                              : null
                          }
                        />
                      </div>
                      <div className="col-sm-4 col-6 form-group" style={{marginTop: 27}}>
                        {/*<label className="d-block" htmlFor="requestdate">*/}
                        {/*  Request Date*/}
                        {/*</label>*/}
                        {/*<DateComponent*/}
                        {/*  showTimeSelect*/}
                        {/*  disabled*/}
                        {/*  date={timesheet.requestDate ? new Date(timesheet.requestDate) : new Date()}*/}
                        {/*/>*/}
                        <TextField
                          label="Request Date"
                          type="datetime-local"
                          variant={'outlined'}
                          name={'requestDate'}
                          style={{width: 220}}
                          onChange={(date) =>
                            this.handleValueChange('requestDate', date.target.value)
                          }
                          value={
                            timesheet.requestDate
                              ? moment(timesheet.requestDate).format(
                                  'YYYY-MM-DDTHH:mm'
                                )
                              : null
                          }
                          disabled
                          InputLabelProps={{ shrink: true }}
                          inputProps={inputProps}
                        />
                      </div>
                    </div>
                    <div className="row">
                      {/* <div className="col-sm-4 col-12 form-group">
                    <label className="d-block" htmlFor="electric">
                      Electric
                    </label>
                    <input
                      className="ce-form-control"
                      name="electric"
                      type="number"
                      onChange={this.handleInputChange}
                      defaultValue={`${timesheet.electric}`}
                      id="electric"
                    />
                  </div>
                  <div className="col-sm-4 col-12 form-group">
                    <label className="d-block" htmlFor="gas">
                      Gas
                    </label>
                    <input
                      defaultValue={`${timesheet.gas}`}
                      className="ce-form-control"
                      name="gas"
                      type="number"
                      onChange={this.handleInputChange}
                      id="gas" />

                  </div> */}
                    </div>
                    <div className="row">
                      <div className="form-group col-sm-12 col-md-4">
                        <TextField
                          id={'start-datetime-input'}
                          label="Start Date"
                          type="datetime-local"
                          variant={'outlined'}
                          name={'startDate'}
                          style={{width: 220}}
                          onChange={(date) =>
                            this.handleValueChange('startDate', date.target.value)
                          }
                          value={
                            timesheet.startDate
                              ? moment(timesheet.startDate).format(
                                  'YYYY-MM-DDTHH:mm'
                                )
                              : null
                          }
                          disabled={timeSheetStore.timesheet.workerPaid || timesheet.job_status === 'cancelled' || timesheet.job_status === 'cancelled_billable'}
                          InputLabelProps={{ shrink: true }}
                          inputProps={inputProps}
                        />
                      </div>

                      <div className="form-group  col-sm-12 col-md-4">
                        {/*<label className="d-block text-nowrap" htmlFor="finishDate">
                          Finish Date
                        </label>*/}
                        <TextField
                          id={'finish-datetime-input'}
                          label="Finish Date"
                          type="datetime-local"
                          variant={'outlined'}
                          name={'finishDate'}
                          style={{width: 220}}
                          onChange={(date) =>
                            this.handleValueChange('finishDate', date.target.value)
                          }
                          value={
                            timesheet.finishDate
                              ? moment(timesheet.finishDate).format(
                                  'YYYY-MM-DDTHH:mm'
                                )
                              : null
                          }
                          disabled={timeSheetStore.timesheet.workerPaid || timesheet.job_status === 'cancelled' || timesheet.job_status === 'cancelled_billable'}
                          InputLabelProps={{ shrink: true }}
                          inputProps={inputProps}
                        />
                        {/*<DateComponent*/}
                        {/*  showTimeSelect*/}
                        {/*  disabled={timeSheetStore.timesheet.workerPaid}*/}
                        {/*  date={*/}
                        {/*    timesheet.finishDate ? new Date(timesheet.finishDate) : null*/}
                        {/*  }*/}
                        {/*  onChange={date => this.handleValueChange('finishDate', date)}*/}
                        {/*/>*/}
                      </div>

                      <div className="form-group  col-sm-12 col-md-4" style={{marginTop: -58}}>
                        <label className="d-block text-nowrap" htmlFor="totalHours">
                          Total Hours
                        </label>
                        <input
                          className="ce-form-control input-pick-time h-55"
                          id="totalHours"
                          disabled
                          defaultValue={renderTime(timesheet.totalHours)}
                          value={renderTime(timesheet.totalHours)}
                          name="totalHours"
                          placeholder="08:00"
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="box-item-body">
                    <div className="row">
                      <div className="col-sm-3 form-group">
                        <label className="d-block" htmlFor="department">
                          Department
                        </label>
                        <DepartmentAsyncSearch
                          disabled
                          defaultValue={
                            timesheet.departmentName
                              ? {
                                  label: timesheet.departmentName,
                                  value: timesheet.department,
                                }
                              : null
                          }
                          // onSelect={item =>
                          //   this.props.setFieldValue('department', item ? item.value.id : null)}
                        />
                      </div>
                      <div className="form-group col-sm-3">
                        <label className="d-block" htmlFor="section">
                          Section #
                        </label>
                        <input
                          className="ce-form-control h-55"
                          id="section"
                          name="section"
                          placeholder="000"
                          disabled
                          defaultValue={`${timesheet.section}`}
                        />
                      </div>
                      {/* <div className="form-group col-sm-3">
                    <label className="d-block" htmlFor="account">
                      Account #
                    </label>
                    <input
                      className="ce-form-control"
                      id="account"
                      name="account"
                      type="number"
                      disabled
                      placeholder="00000"
                      defaultValue={`${timesheet.account}`}
                    />
                  </div> */}
                      <div className="form-group col-sm-3">
                        <label className="d-block" htmlFor="poet">
                          POET #
                        </label>
                        <input
                          className="ce-form-control h-55"
                          id="poet"
                          name="poet"
                          disabled
                          // type="number"
                          // disabled
                          placeholder="00000"
                          defaultValue={`${timesheet.poet}`}
                          onChange={this.handleInputChange}
                        />
                      </div>
                      <div className="form-group col-sm-3">
                        <label className="d-block" htmlFor="workrequest">
                          Work Request #
                        </label>
                        <input
                          className="ce-form-control h-55"
                          name="workrequest"
                          type="number"
                          id="workrequest"
                          disabled
                          defaultValue={`${timesheet.workRequest}`}
                          placeholder="00000"
                        />
                      </div>
                      <div className="form-group col-sm-3">
                        <label className="d-block" htmlFor="po">
                          PO #
                        </label>
                        <input
                          className="ce-form-control h-55"
                          id="po"
                          name="po"
                          type="number"
                          disabled
                          defaultValue={`${timesheet.po}`}
                          placeholder="00000000"
                        />
                      </div>
                      <div className="form-group col-sm-3">
                        <label className="d-block" htmlFor="receipt">
                          Receipt #
                        </label>
                        <input
                          className="ce-form-control h-55"
                          id="receipt"
                          name="receipt"
                          type="number"
                          disabled
                          defaultValue={`${timesheet.receipt}`}
                          placeholder="00000000"
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="box-item-body">
                    <div className="row">
                      {timesheet.locations.map((location, index) => {
                        return (
                          <React.Fragment>
                            <div className="form-group col-sm-4">
                              <label className="d-block" htmlFor="locationaddress">
                                Location Address #{index + 1}
                              </label>
                              <input
                                className="ce-form-control h-55"
                                id="locationaddress"
                                name="locationaddress"
                                disabled
                                placeholder="Address"
                                value={location.address}
                              />
                            </div>
                            <div className="form-group col-sm-4">
                              <label
                                className="d-block"
                                htmlFor="structuretosecure"
                              >
                                Structure #
                              </label>
                              <input
                                className="ce-form-control h-55"
                                id="structuretosecure"
                                name="structuretosecure"
                                disabled
                                placeholder="Structure #"
                                value={location.structure}
                              />{' '}
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                  {/* <div className="box-item-body">
                <div className="row">
                  <div className="form-group col-sm-4">
                    <label className="d-block" htmlFor="flaggerspotter">
                      Flagger/ Spotter Name
                    </label>
                    <input
                      className="ce-form-control"
                      id="flaggerspotter"
                      name="flaggerspotter"
                      disabled
                      defaultValue={timesheet.worker ? timesheet.worker.name : ''}
                      placeholder="Enter Name"
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="form-group col-sm-4">
                    <label className="d-block" htmlFor="confirmation">
                      Confirmation #
                    </label>
                    <input
                      className="ce-form-control"
                      id="confirmation"
                      type="number"
                      disabled
                      name="confirmation"
                      defaultValue={`${timesheet.confirmationNumber}`}
                      placeholder="00000000"
                    />
                  </div>
                </div>
              </div> */}
                  <div className="box-item-body">
                    <div className="row">
                      <div className="form-group col-sm-4">
                        <label className="d-block" htmlFor="conEdisonTruck">
                          Con edison truck #
                        </label>
                        <input
                          className="ce-form-control h-55"
                          id="conEdisonTruck"
                          name="conEdisonTruck"
                          type={'string'}
                          defaultValue={`${timesheet.conEdisonTruck}`}
                          onChange={this.handleInputChange}
                          placeholder="000"
                        />
                      </div>
                      <div className="form-group col-sm-4">
                        <label className="d-block" htmlFor="section">
                          Con edison supervisor
                        </label>
                        <input
                          className="ce-form-control h-55"
                          id="section"
                          name="section"
                          disabled
                          defaultValue={timesheet.conEdisonSupervisorName}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="box-item-body">
                    <div className="row">
                      <div className="form-inline col-sm-4 col-md-12">
                        <CheckboxComponent
                          id="Verified"
                          hasTitle="Timesheet Verified"
                          checked={timesheet.isVerified}
                          onChange={(checked) =>
                            this.handleValueChange('isVerified', checked)
                          }
                          className="mr-5"
                        />
                        <CheckboxComponent
                          id="Worker Paid"
                          hasTitle="Worker Paid"
                          checked={timesheet.workerPaid}
                          disabled={!this.props.can_access_worker_paid_checkbox}
                          onChange={(checked) =>
                            this.handleValueChange('workerPaid', checked)
                          }
                          className="mr-5"
                        />
                        <CheckboxComponent
                          id="Invliced"
                          hasTitle="Invoiced"
                          checked={timesheet.invoiced}
                          onChange={(checked) =>
                            this.handleValueChange('invoiced', checked)
                          }
                          className="mr-5"
                        />
                        <CheckboxComponent
                          id="Paid"
                          hasTitle="Invoice Paid"
                          checked={timesheet.paid}
                          onChange={(checked) =>
                            this.handleValueChange('paid', checked)
                          }
                          className="mr-5"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="box-item-body">
                    <div className="row">
                      <div className="form-group col-sm-3">
                        <label className="d-block" htmlFor="section">
                          Signature Name
                        </label>
                        <input
                          className="ce-form-control h-55"
                          id="section"
                          name="signatureName"
                          onChange={this.handleInputChange}
                          value={
                            timesheet.signatureName &&
                            timesheet.signatureName !== 'NULL'
                              ? timesheet.signatureName
                              : ''
                          }
                        />
                      </div>
                      <div className="form-group col-sm-3">
                        <label className="d-block" htmlFor="section">
                          Employee #
                        </label>
                        <input
                          className="ce-form-control h-55"
                          id="section"
                          name="employeeNumber"
                          onChange={this.handleInputChange}
                          value={
                            timesheet.employeeNumber &&
                            timesheet.employeeNumber !== 'NULL'
                              ? timesheet.employeeNumber
                              : ''
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="d-block" htmlFor="sign">
                        Signature
                      </label>
                      {timesheet.sign || this.state.signature ? (
                        <>
                          <SignatureCanvas
                            clearOnResize={false}
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
                        defaultImages={timesheet.images ? timesheet.images : []}
                      />
                    </div>
                  </div>
                  <div className="box-item-body">
                    {timesheet.comments.map((comment, idx) => {
                      return (
                        <div>
                          <div className="d-flex justify-content-between">
                            {/*<div className="text-small">
                              {comment.author}{' '}
                              {formatDate(comment.createdAt, FORMATES.datetime)}
                            </div>*/}
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
                    })}

                    <div className="form-group mt-3">
                      <div className="position-relative">
                        <input
                          className="ce-form-control h-55"
                          ref={(comment) => (this.comment = comment)}
                          placeholder="Your Comment..."
                        />
                        <CeIcon.SendButtonIcon
                          className="send-button cursor-pointer"
                          onClick={this.addComment}
                        />
                      </div>
                    </div>
                  </div>
                </>
              }
            </div>
            {this.props.canDoTimesheetAction && (
              <div className="my-4 d-flex justify-content-end">
                <button className="btn btn-success btn-add" type="submit">
                  Save
                </button>
              </div>
            )}
          </form>
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    permissions: state.app.permissions,
    hasCESolutionRole: state.app.user
      ? [5, 6, 7, 8].some((r) => state.app.user.roles.includes(r))
      : false,
    canAccessInvoice: state.app.user
      ? [7, 4, 8].some((r) => state.app.user.roles.includes(r))
      : false,
    isSuperAdmin: state.app.user
      ? [8].some((r) => state.app.user.roles.includes(r))
      : false,
    can_access_worker_paid_checkbox: state.app.user
      ? [7, 8].some((r) => state.app.user.roles.includes(r))
      : false,
    canDoTimesheetAction: state.app.user
      ? [7, 4, 8, 3].some((r) => state.app.user.roles.includes(r))
      : false,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimesheetEdit);
