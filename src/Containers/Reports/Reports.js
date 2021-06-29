import React from 'react';
import './Report.scss';
import MunicipalitiesAsyncSearch from '../Components/Controls/MunicipalitiesAsyncSearch';
import Calendar from "react-range-calendar";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '../../components/Button/Button';
import {actions} from '../../Services';
import {connect} from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';
import { REPORT_TYPE } from '../../Constants/reports';

class Reports extends React.Component {
    constructor(props){
        super(props);
        this.state={
            municipality: null,
            date: [new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)],
            reportType: false,
            disableMuni: true,
            error: null,
            calendarType: "single"
        }
    }

    initState = () => {
        this.setState({
            municipality: null,
            date: [new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)],
            reportType: false,
            disableMuni: true,
            error: null,
            calendarType: "single"
        })
    }

    handleValue = (name, value) => {
        this.setState({[name]: value,
                      error: null});
    }

    handleChange = (event) => {
        this.setState({
            reportType: event.target.value, 
            disableMuni: true,
            error: null,
            municipality: null,
        });
        if(event.target.value === REPORT_TYPE.Daily.value){
            this.setState({disableMuni: false, calendarType: "single"});
        }
        if(event.target.value === REPORT_TYPE.Weekly.value){
            this.setState({disableMuni: false, calendarType: "range"});
        }
        if(event.target.value === REPORT_TYPE.Payroll.value){
            this.setState({disableMuni: true, calendarType: "free-range"});
        }
        if(event.target.value === REPORT_TYPE.Metrics.value){
            this.setState({disableMuni: false, calendarType: "free-range"});
        }
    };

    toastSusses = () => {
        toast.success('Report generated!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
    }

    toastError = (message) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
    }

    sendPayroll = async (data) => {
        await this.props.sendReportPayroll(data)
        .then((res) => {
            this.toastSusses();
          })
          .catch((err) => {
            let message = "No data for this date!";
            //if (err.response) 
                //message = err.response.data.error;
            this.toastError(message);
          });
    }
    
    sendDaily = async (data) => {
        await this.props.sendReportDaily(data)
        .then((res) => {
            this.toastSusses();
          })
          .catch((err) => {
            let message = "No data for this date!"
            //if (err.response) 
                //message = err.response.data.error;
            this.toastError(message);
          });
    }

    sendWeekly = async (data) => {
        await this.props.sendReportWeekly(data)
        .then((res) => {
            this.toastSusses();
          })
          .catch((err) => {
            let message = "No data for this date!"
            //if (err.response) 
                //message = err.response.data.error;
            this.toastError(message);
          });
    }

    sendMetrics = async (data) => {
        await this.props.sendReporMetrics(data)
        .then((res) => {
            this.toastSusses();
          })
          .catch((err) => {
            let message = "No data for this date!"
            //if (err.response) 
                //message = err.response.data.error;
            this.toastError(message);
          });
    }

    handleValidation = () => {
        if(!this.state.disableMuni) {
            if(!this.state.municipality){
                this.setState({error: "Select Borough!"});
                return false;
            }
        }
        return true;
    }

    send = () => {
        if(this.handleValidation()) {
            let dates = [];
            dates = this.state.date.sort((a,b)=>a-b);
            let data = {};
        
            switch(this.state.reportType) {
                case REPORT_TYPE.Payroll.value:
                    data = {
                        cutOffTimeStart: moment(dates[0]).format('YYYY-MM-DDTHH:mm'),
                        cutOffTimeFinish: moment(dates[1]).format('YYYY-MM-DDTHH:mm')
                    }
                return this.sendPayroll(data);
                case REPORT_TYPE.Daily.value:
                    data = {
                        date: moment(dates[0]).format('YYYY-MM-DDTHH:mm'),
                        municipalities: this.state.municipality.map(m => m.value)
                    }
                    return this.sendDaily(data);
                case REPORT_TYPE.Weekly.value:
                    data = {
                        cutOffTimeStart: moment(dates[0]).format('YYYY-MM-DDTHH:mm'),
                        cutOffTimeFinish: moment(dates[1]).format('YYYY-MM-DDTHH:mm'),
                        municipalities: this.state.municipality.map(m => m.value)
                    }
                    return this.sendWeekly(data);
                case REPORT_TYPE.Metrics.value:
                    data = {
                        cutOffTimeStart: moment(dates[0]).format('YYYY-MM-DDTHH:mm'),
                        cutOffTimeFinish: moment(dates[1]).format('YYYY-MM-DDTHH:mm'),
                        municipalities: this.state.municipality.map(m => m.value)
                    }
                    return this.sendMetrics(data);
                default: return;
            }
        }
    } 


    render(){
        return(
            <div className='report-page'>
                <div className='main-block'>
                    <div className='d-flex justify-content'>
                    <p className='title-1 mt-3'>Reports</p>
                    <p className='title-blue' onClick={this.initState}>Reset Selected</p>
                    </div>
                    <div className='white-block'>
                        <div className='left-column'>
                            <p className='title-2'>Select Borough</p>
                            <MunicipalitiesAsyncSearch
                                disabled={this.state.disableMuni}
                                isMulti
                                value={this.state.municipality}
                                onSelect={(item) =>
                                    this.handleValue(
                                        'municipality',
                                        item ? item : null
                                    )
                                }
                            />
                            {this.state.error ? 
                                <p className="error">{this.state.error}</p> : null}
                            <p className='title-2 mt1'>Choose Report Type:</p>
                            <div className='options'>
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="gender" name="gender1" value={this.state.reportType} 
                                       onChange={this.handleChange}>
                                           {this.props.permissions.includes('generate_payroll_report') &&
                                                <FormControlLabel value={'payroll'} 
                                                control={
                                                    <Radio
                                                        color='primary'
                                                    />}
                                                label={'Payroll'} />
                                            }
                                            {this.props.permissions.includes('generate_daily_report') &&
                                                <FormControlLabel value={'daily'} 
                                                control={
                                                    <Radio
                                                        color='primary'
                                                    />}
                                                label={'Daily Report'} />
                                            }
                                            {this.props.permissions.includes('generate_weekly_report') &&
                                                <FormControlLabel value={'weekly'} 
                                                control={
                                                    <Radio
                                                        color='primary'
                                                    />}
                                                label={'Weekly Report'} />
                                            }
                                            {this.props.permissions.includes('generate_metrics_report') &&
                                                <FormControlLabel value={'metrics'} 
                                                control={
                                                    <Radio
                                                        color='primary'
                                                    />}
                                                label={'Metrics Report'} />
                                            }
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div className='right-column'>
                        <Calendar
                            visible={true}
                            disabledColor={'#FFFFFF'}
                            baseColor={'#3f51b5'}
                            hoverBackgroundColor='#3f51b5'
                            dateRange={this.state.date}
                            steps={6}
                            startWithDay={"Mon"}
                            onDateClick={(minDate, maxDate) => {
                                this.setState({ date: [minDate, maxDate] });
                            }}
                            type={this.state.calendarType}
                        />
                        <div className='btn-row'>
                            <Button 
                                color='dark'
                                width={169}
                                height={48}
                                borderRadius={'24px'}
                                onClick={this.send}
                                processing={this.props.processing}
                            >
                                Generate
                            </Button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return {
      dispatch,
      sendReportPayroll: (data) => dispatch(actions.ReportActions.sendReportPayroll(data)),
      sendReportDaily:   (data) =>  dispatch(actions.ReportActions.sendReportDaily(data)),
      sendReportWeekly:  (data) => dispatch(actions.ReportActions.sendReportWeekly(data)),
      sendReporMetrics:  (data) => dispatch(actions.ReportActions.sendReporMetrics(data)),
      };
  }
  
  function mapStateToProps(state) {
    return {
        processing: state.reports.processing,
        permissions: state.app.permissions,
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Reports);