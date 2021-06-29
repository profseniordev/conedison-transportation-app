import React from 'react';
import Select from 'react-select';
//import Select from '@material-ui/core/Select';
import CreatableSelect from 'react-select/creatable';
import { JobType } from '../../Constants/job';
import closeRegular from '../../Images/close-regular.png';
import {
  BILLING_CYCLE,
  IInvoice,
  IPricing,
  PricingType,
  PRICING_TYPE,
} from '../../Models/invoiceItem';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import RadioCustomComponent from '../Components/Controls/Radio.Component';
import DateComponent from '../Components/Date/Date.Component';
import './CreateConfiguration.scss';
import Dialog from '@material-ui/core/Dialog';
import Button from '../../components/Button/Button';
import TextField from '@material-ui/core/TextField';
import { toast } from 'react-toastify';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { FaThumbsDown } from 'react-icons/fa';
import Tooltip from '@material-ui/core/Tooltip';
import {actions} from "../../Services";
import {connect} from "react-redux";
import moment from 'moment';

interface Props {
  showed: boolean;
  closeSlide: Function;
  submit?: Function;
  updateInvoices?: any;
  invoice?: IInvoice;
  departments?: any;
}
const _state = {
  invoice:{
  job_types: [],
  emails: [],

  billing_cycle: BILLING_CYCLE.Monthly,
  date: null,

  completed_jobs_only: false,
  use_actual_breaks: false,
  ignore_breaks: false,
  forceBreakValue: false,
  force_break_time: '00:30',
  departments: [],
  excel_template_id: null,
  },
  defaultDepartments: null,
  defaultEmails: null,
};
const options = [{ label: 'Exel Tamplate 1', value: 1 }, { label: 'Exel Tamplate 2', value: 2 }];
class AddInvoiceSliderComponent extends React.Component<Props> {
  state = _state;

  /*handleChangePricingTypeInput = (jobType: number) => ({
    currentTarget: { name, value, type },
  }) => {
    if (type === 'number') {
      return this.changePricingField(jobType, name, Number(value));
      
    }
    this.changePricingField(jobType, name, value);
    
  };

  findJobType = (type: number) =>
    this.state.job_types.find((price) => price === type);*/

  componentDidUpdate(prevProps, prevState){
    if(this.props.invoice && prevProps.invoice !== this.props.invoice && this.props.departments){
      const deps = this.props.departments.filter(i=> this.props.invoice.departments.includes(i.id))
                            .map(e => ({label: e.name, value: e}));
      let emails = [];
      if(this.props.invoice.emails){
        emails = this.props.invoice.emails.map(e => ({label: e, value: e}));
      }
      const invoice = {
        job_types: this.props.invoice.job_types,
        emails: this.props.invoice.emails ? this.props.invoice.emails : [],
        billing_cycle: this.props.invoice.billing_cycle,
        date: this.props.invoice.date ? new Date(this.props.invoice.date) : null,
        completed_jobs_only: this.props.invoice.completed_jobs_only,
        use_actual_breaks: this.props.invoice.use_actual_breaks,
        ignore_breaks: this.props.invoice.ignore_breaks,
        forceBreakValue: this.props.invoice.forceBreakValue,
        force_break_time: this.props.invoice.force_break_time.substring(0,5),
        departments: this.props.invoice.departments,
        excel_template_id: this.props.invoice.template_id,
      }
      this.setState({
        invoice: invoice,
        defaultDepartments: deps,
        defaultEmails: emails
      })
      console.log(this.state);
    }
  } 

  /*renderPricingType(jobType, job_types: IPricing) {
    return (
      <div>
        {job_types.type === PRICING_TYPE.FLAT ||
        job_types.type === PRICING_TYPE.MIXED ? (
          <div>
            <div className="form-group mt-3">
              <label id={`rate${jobType}`} className="d-block">
                Flat Rate
              </label>
              <input
                className="ce-form-control ce-form-price"
                name="flatRate"
                onChange={this.handleChangePricingTypeInput(jobType)}
                defaultValue={`${job_types.flatRate}`}
                type="number"
                id={'rate' + jobType}
                placeholder="$00"
              />
            </div>
          </div>
        ) : null}
        {job_types.type === PRICING_TYPE.HOURLY ||
        job_types.type === PRICING_TYPE.MIXED ? (
          <div className="d-flex justify-content-between">
            <div className="form-group mt-3">
              <label
                htmlFor={'rateStraightHours' + jobType}
                className="d-block"
              >
                Rate(Straight Hours)
              </label>
              <input
                className="ce-form-control ce-form-price"
                name="straightHoursRate"
                id={'rateStraightHours' + jobType}
                defaultValue={`${job_types.straightHoursRate}`}
                onChange={this.handleChangePricingTypeInput(jobType)}
                placeholder="$00"
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor={'rateOtHours' + jobType} className="d-block">
                Rate(Ot Hours)
              </label>
              <input
                className="ce-form-control ce-form-price"
                name="otHoursRate"
                defaultValue={`${job_types.otHoursRate}`}
                onChange={this.handleChangePricingTypeInput(jobType)}
                placeholder="$00"
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor={'rateHolidayHours' + jobType} className="d-block">
                Rate(Holiday Hours)
              </label>
              <input
                className="ce-form-control ce-form-price"
                name="holidayHoursRate"
                defaultValue={`${job_types.holidayHoursRate}`}
                onChange={this.handleChangePricingTypeInput(jobType)}
                placeholder="$00"
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  changePricingType = (jobType, priceType) => {
    this.changePricingField(jobType, 'type', priceType);
    
  };

  changePricingField = (jobType, fieldName: string, value: any) => {
    this.handleChangeValue(
      'job_types',
      this.state.job_types.map((price) => {
        /*if (price === jobType) {
          return {
            ...price,
            [fieldName]: value,
          };
        }
        return price;
      })
    );
    
  };

  renderPricingOfJobType(jobType) {
    const job_types = this.findJobType(jobType);

    if (!job_types) return null;

    return (
      <div>
        <div className="slide-body-item-header">
          Pricing for {JobType[jobType]}
        </div>
        <div className="slide-body-item-content">
          <div className="d-flex justify-content-between">
            <RadioCustomComponent
              title={PricingType.Flat}
              id={`flat-${JobType[jobType]}`}
              name={`price-${jobType}`}
              checked={job_types.type === PRICING_TYPE.FLAT}
              onChange={() =>
                this.changePricingType(jobType, PRICING_TYPE.FLAT)
              }
            />
            <RadioCustomComponent
              title={PricingType.Hourly}
              id={`hourly-${JobType[jobType]}`}
              name={`price-${jobType}`}
              checked={job_types.type === PRICING_TYPE.HOURLY}
              onChange={() =>
                this.changePricingType(jobType, PRICING_TYPE.HOURLY)
              }
            />
            <RadioCustomComponent
              title={PricingType.Mixed}
              id={`mixed-${JobType[jobType]}`}
              name={`price-${jobType}`}
              checked={job_types.type === PRICING_TYPE.MIXED}
              onChange={() =>
                this.changePricingType(jobType, PRICING_TYPE.MIXED)
              }
            />
          </div>
          {this.renderPricingType(jobType, job_types)}
        </div>
      </div>
    );
  }
*/
  handleChangeBillingType = (billingType) => () => {
    let inv = this.state.invoice;
    inv.date = null;
    this.setState({invoice: inv});
    this.handleChangeValue('billing_cycle', billingType);
    console.log(this.state)
    
  };

  handleInputChange = (event) => {
    const { name, value } = event.currentTarget;
    this.handleChangeValue(name, value);
    
  };

  handleChangeValue = (name, value) => {
    this.setState({invoice: {...this.state.invoice, [name]: value }});
    
  };

  handleChangeDateValue = (name, value) => {
    this.setState({invoice: {...this.state.invoice, [name]: value, billing_cycle: null }});
    //this.handleChangeValue('billing_cycle', null);
    //this.handleChangeValue('date', value);
  };

  /*initPricing = (jobType: number): IPricing => {
    return {
      jobType,
      type: PRICING_TYPE.FLAT,
      flatRate: 0,
      straightHoursRate: 0,
      otHoursRate: 0,
      holidayHoursRate: 0,
    };
  };*/

  initPricing = (jobType: number) => {
    return jobType;
  };

  toggleJobType = (jobType: number) => {
    const idx = this.state.invoice.job_types.findIndex(
      (price) => price === jobType
    );
    if (!~idx) {
      this.handleChangeValue('job_types', [
        ...this.state.invoice.job_types,
        jobType,
        //this.initPricing(jobType),
      ]);
      return;
    }
    this.handleChangeValue(
      'job_types',
      this.state.invoice.job_types.filter((price) => price !== jobType)
    );
    
  };

  renderJobType = (jobType: number) => (
    <button
      type="button"
      className={`btn ${this.state.invoice.job_types.indexOf(jobType) !==-1 ? 'active' : ''}`}
      onClick={() => this.toggleJobType(jobType)}
    >
      {JobType[jobType]}
    </button>
  );

  public render() {
    console.log(this.state);
    return (
      <Dialog
        open={this.props.showed}
        onClose={()=>this.props.closeSlide}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={'slide-container-invoices showed-invoices'}>
          <div className="slide-content">
            <div className="slide-header d-flex align-items-center justify-content-between">
              <div className="slide-title">Invoice Configuration</div>
              <div className="close-slider">
                <img
                  className="cursor-pointer p-1"
                  onClick={() => {
                    this.props.closeSlide();
                    this.setState({ ..._state });
                  }}
                  src={closeRegular}
                  alt=""
                />
              </div>
            </div>
            <div className="border-bottom mb27">
              <div className="sub-slide-title">
                Fill Details for new invoice
              </div>
            </div>
            <div className="slide-body ">
            <div className="slide-body-item-content" style={{marginBottom: '1rem'}}>
            <label htmlFor="department" className="d-block first-title">
                    Select Job types *
                  </label>
              <FormControl required>
                <div className="btn-group group-job-type w-100" role="group">
                  {this.renderJobType(JobType.Flagging)}
                  {this.renderJobType(JobType.Parking)}
                  {this.renderJobType(JobType.Signage)}
                </div>
            </FormControl>
            </div>
              {/* {this.renderPricingOfJobType(JobType.Flagging)}
            {this.renderPricingOfJobType(JobType.Parking)}
            {this.renderPricingOfJobType(JobType.Signage)} */}

              <div className="slide-body-item-content">
                <div className="form-group">
                  <label htmlFor="department" className="d-block first-title">
                    Select Department *
                  </label>
                  <FormControl required>
                  {this.props.invoice && this.state.defaultDepartments &&
                  <DepartmentAsyncSearch
                    isMulti
                    defaultValue={this.state.defaultDepartments}
                    onSelect={(departments) =>
                      this.handleChangeValue(
                        'departments',
                        Array.isArray(departments)
                          ? departments.map((department) => department.value.id)
                          : []
                      )
                    }
                  />
                  }
                  {!this.props.invoice && !this.state.defaultDepartments &&
                  <DepartmentAsyncSearch
                    isMulti
                    onSelect={(departments) =>
                      this.handleChangeValue(
                        'departments',
                        Array.isArray(departments)
                          ? departments.map((department) => department.value.id)
                          : []
                      )
                    }
                  />
                  }
                </FormControl>
                </div>
              </div>

              <div>
                <div className="slide-body-item-header first-title">
                  Set billing cycle
                </div>
                <div className="slide-body-item-content">
                  <div className="pl9">
                    <RadioCustomComponent
                      title="Weekly"
                      name="billing_cycle"
                      id="Weekly"
                      checked={this.state.invoice.billing_cycle === BILLING_CYCLE.Weekly}
                      onChange={this.handleChangeBillingType(
                        BILLING_CYCLE.Weekly
                      )}
                    />
                    <RadioCustomComponent
                      title="Monthly"
                      id="Monthly"
                      name="billing_cycle"
                      checked={
                        this.state.invoice.billing_cycle === BILLING_CYCLE.Monthly
                      }
                      onChange={this.handleChangeBillingType(
                        BILLING_CYCLE.Monthly
                      )}
                    />
                    <RadioCustomComponent
                      title="Daily"
                      id="Daily"
                      name="billing_cycle"
                      checked={this.state.invoice.billing_cycle === BILLING_CYCLE.Daily}
                      onChange={this.handleChangeBillingType(
                        BILLING_CYCLE.Daily
                      )}
                    />
                    <div className="d-flex">
                      <RadioCustomComponent
                        title="Set  Specific Date and Time"
                        id="use_actual_breaks"
                        name="billing_cycle"
                        checked={this.state.invoice.billing_cycle===null}
                        onChange={checked =>
                          this.handleChangeDateValue('date', new Date())} />
                          {this.state.invoice.billing_cycle===null ? 
                          <div className="date-margins w-29">
                            <TextField
                              id="date"
                              label=""
                              type="date"
                              variant={'outlined'}
                              value={
                                this.state.invoice.date
                                  ? moment(this.state.invoice.date).format("YYYY-MM-DD")
                                  : null
                              }
                              onChange={event => this.handleChangeValue('date', event.target.value)}
                            />
                           {/* <DateComponent
                              date={this.state.invoice.date}
                           onChange={date => this.handleChangeValue('date', moment(date).utc().format())} />*/}
                          </div> : null}
                          </div>
                  </div>

                  <div className="form-group mt-3 ce-date d-flex justify-content">
                    {/*<div>
                      <CheckboxComponent
                        hasTitle="Set specific date and time"
                        id="use_actual_breaks"
                        checked={Boolean(this.state.date_time)}
                        onChange={(checked) =>
                          this.handleChangeValue(
                            'date_time',
                            checked ? new Date() : null
                          )
                        }
                        className="mb-2"
                      />
                      </div>
                    Boolean(this.state.date) ? <>
                     <label htmlFor="date" className="d-block">Date</label>
                    <div className="date-border">
                      <TextField
                        id="datetime-local"
                        type="datetime-local"
                        onChange={(event) =>
                          this.handleChangeValue('date_time', event.target.value)
                        }
                        //className={classes.textField}
                      />
                      <DateComponent
                        date={this.state.date_time}
                        onChange={(date) =>
                          this.handleChangeValue('date_time', date)
                        }
                      />
                    </div>*/}
                    {/*</> : null*/}
                  </div>
                </div>
                <hr />
              </div>
              <div>
                <div className="slide-body-item-header first-title">
                  Worker breaks invoicing options
                </div>
                <div className="slide-body-item-content pl5">
                  <CheckboxComponent
                    hasTitle="Use Actual Break Times"
                    id="use_actual_breaks"
                    checked={this.state.invoice.use_actual_breaks}
                    onChange={(checked) =>
                      this.handleChangeValue('use_actual_breaks', checked)
                    }
                    className="mb-2"
                  />
                  {/*<CheckboxComponent
                    hasTitle="Completed Jobs Only"
                    id="completedJobsOnly"
                    checked={this.state.completed_jobs_only}
                    onChange={(checked) =>
                      this.handleChangeValue('completed_jobs_only', checked)
                    }
                    className="mb-2"
                  />*/}
                  <CheckboxComponent
                    hasTitle="Ignore Breaks"
                    checked={this.state.invoice.ignore_breaks}
                    onChange={(checked) =>
                      this.handleChangeValue('ignore_breaks', checked)
                    }
                    id="ignore_breaks"
                  />

                  <div className="d-flex align-items-center force-break-value-invoice">
                    <CheckboxComponent
                      checked={this.state.invoice.forceBreakValue}
                      onChange={(checked) =>
                        this.handleChangeValue('forceBreakValue', checked)
                      }
                      hasTitle="Force Break Value for Invoice: "
                      id="forceBreakValueforInvoice"
                      className="mr-4"
                    />
                    <input
                      className="ce-form-control"
                      style={{width: 146, marginRight: 7, height: 51}}
                      name={'force_break_time'}
                      type={'time'}
                      value={this.state.invoice.force_break_time}
                      onChange={this.handleInputChange}
                      placeholder="30 min"
                    />
                  </div>
                </div>
              </div>

              <div></div>

              <div className="d-flex justify-content">
                <div className="form-group width-48">
                  <label
                    className="d-block first-title"
                    htmlFor="exceltemplate"
                  >
                    Excel Template *
                  </label>
                  <FormControl required >
                  
                  {this.props.invoice ? 
                  <Select
                    value={options.filter(option => option.value === this.state.invoice.excel_template_id )}
                    options={options}
                    onChange={(tamplate: any) =>
                      this.handleChangeValue('excel_template_id', tamplate.value)
                    }
                  />
                  : null
                  }
                  {!this.props.invoice && 
                  <Select
                    options={[{ label: 'Exel Tamplate 1', value: 1 }, { label: 'Exel Tamplate 2', value: 2 }]}
                    onChange={(tamplate: any) =>
                      this.handleChangeValue('excel_template_id', tamplate.value)
                    } />}
                  {/*<Select
                    variant='outlined'
                    native
                    required
                    value={this.state.excel_template_id}
                    onChange={(tamplate: any) =>
                      this.handleChangeValue('excel_template_id', tamplate)
                    }
                    inputProps={{
                      name: 'name',
                      id: 'name'
                    }}
                  >
                    <option value="" />
                    <option value={1}>Exel Tamplate 1</option>
                  </Select>*/}
                </FormControl>
                  {/*<Select
                    options={[{ label: 'Exel Tamplate 1', value: 1 }]}
                    onChange={(tamplate: any) =>
                      this.handleChangeValue('excel_template_id', tamplate.value)
                    }
                  />*/}
                </div>
                <div className="form-group width-48">
                  <label className="d-block first-title" htmlFor="emailto">
                    Email to
                  </label>
                  {this.props.invoice && this.state.defaultEmails &&
                  <CreatableSelect
                    isMulti
                    isClearable
                    name="emails"
                    formatCreateLabel={(email) => `Send email to ${email}`}
                    defaultValue={this.state.defaultEmails}
                    options={this.state.defaultEmails}
                    onChange={(emails) =>{
                      this.handleChangeValue(
                        'emails',
                        Array.isArray(emails)
                          ? emails.map((email) => email.value)
                          : []
                      );
                      }
                    }
                  />}
                  {!this.props.invoice &&
                  <CreatableSelect
                    isMulti
                    isClearable
                    name="emails"
                    formatCreateLabel={(email) => `Send email to ${email}`}
                    onChange={(emails) =>
                      this.handleChangeValue(
                        'emails',
                        Array.isArray(emails)
                          ? emails.map((email) => email.value)
                          : []
                      )
                    }
                  />}
                </div>
              </div>
              <div className="sub-slide-title">
              *Required
              </div>
              <hr style={{marginTop: '0'}} />
              <div className="d-flex justify-content" style={{marginBottom: '15px'}}>
                <Button
                  color={'gray'}
                  width={'158px'}
                  borderRadius={'20px'}
                  textTransform={false}
                  onClick={() => this.props.closeSlide()}
                >
                  Cancel
                </Button>
                <Tooltip title={!(this.state.invoice.excel_template_id && this.state.invoice.job_types.length!==0 && this.state.invoice.departments.length!== 0) 
                  ? 'Fill the required fields!': ''} arrow aria-label='disabled button'>
                <div>
                <Button
                  color={'dark'}
                  width={'158px'}
                  borderRadius={'20px'}
                  textTransform={false}
                  onClick={() => {
                    this.props.submit(this.state.invoice);
                    this.props.closeSlide();
                  }}
                  disabled={!(this.state.invoice.excel_template_id && this.state.invoice.job_types.length!==0 && this.state.invoice.departments.length!== 0)}
                >
                  Confirm
                </Button>
                </div>
                </Tooltip>
                {/*<button type="button" onClick={() => {
                    this.props.closeSlide();
                    this.setState({..._state});
                }} className="btn btn-light">Cancel</button>
              <button type="button" onClick={this.submit} className="btn btn-dark">Create Invoice</button>*/}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}
function mapStateToProps({app}) {
  return {
     departments: app.departments,
  }

}
function mapDispatchToProps(dispatch) {
  return {
      dispatch,
  };
}
export default  connect(mapStateToProps, mapDispatchToProps)(AddInvoiceSliderComponent);