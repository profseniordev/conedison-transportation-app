import React, { PureComponent } from 'react';
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates';
import moment from 'moment-timezone'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { withStyles } from "@material-ui/core/index";

const styles = {
    root: {
        zIndex: 100,
        width: '240px',
        display: 'flex',
        alignItems: 'center',
        margin: '0 20px',
        '& .DateRangePicker': {
            position: 'absolute',
            '& .DateRangePickerInput': {
                padding: '0 2px 2px',
                borderRadius: '4px',
                backgroundColor: ' none',
                background: 'none',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                height: '35px !important',
            },
        },
        '& .DateInput': {
            width: '100px',
            margin: '0 2px',
            background: 'none',

        },
        '& .DateInput_input': {
            fontSize: '16px',
            alignItems: 'center',
            padding: '5px 6px 4.2px',
            lineHeight: 0,
            backgroundColor: 'none',
            background: 'none',

        },
        '& .DateRangePickerInput_arrow': {
            margin: '3px',
        },
        '& .DateInput_input__focused': {
            borderBottom: 'none',
            color: '#4C79D1'
        },
        '& .CalendarDay__selected_span': {
            background: '#4C79D1',
            color: '#FFFFFF',
            border: '1px solid #e4e7e7'
        },
        '& .CalendarDay__selected': {
            background: '#4C79D1',
            color: '#FFFFFF',
            border: '1px solid #e4e7e7'
        },
        '& .CalendarDay__selected:hover': {
            background: '#3f51b5',
            color: '#FFFFFF',
            border: '1px solid #e4e7e7'
        },
        '& .CalendarDay__hovered_span:hover, .CalendarDay__hovered_span': {
            background: '#e4e7e7',
            color: '#3f51b5',
            border: '1px double #FFF'
        },
        '& .DayPickerKeyboardShortcuts_show__bottomRight::before': {
            borderRight: '33px solid #4C79D1'
        },

        '& .DayPickerKeyboardShortcuts_show__bottomRight:hover::before': {
            borderRight: '33px solid #3f51b5'
        },
        '& .DayPickerKeyboardShortcuts_show__topRight::before': {
            borderRight: '33px solid #4C79D1'
        },
        '& .DayPickerKeyboardShortcuts_show__topRight:hover::before': {
            borderRight: '33px solid #3f51b5'
        },
        '& .DayPickerKeyboardShortcuts_show__topLeft::before': {
            borderRight: '33px solid #4C79D1'
        },
        '& .DayPickerKeyboardShortcuts_show__topLeft:hover::before': {
            borderRight: '33px solid #3f51b5'
        },
    },
    rootRidePage: {
        zIndex: 301,
        width: '220px',
        display: 'flex',
        alignItems: 'center',
        margin: '0 16px 0 0',
        '& .DateRangePicker': {
            position: 'absolute',
            backgroundColor: 'rgba(189, 189, 189, 0.1)',
            borderRadius: '20px',
            paddingTop: '5px',
            '& .DateRangePickerInput': {
                padding: '0 2px 2px',
                border: 'none',
                backgroundColor: 'none',
                background: 'none',
                height: '35px !important',
            },
        },
        '& .DateInput': {
            width: '95px',
            margin: '0 2px',
            background: 'none',
        },
        '& .DateInput_input': {
            fontSize: '16px',
            alignItems: 'center',
            padding: '5px 6px 4.2px',
            lineHeight: 0,
            background: 'none',
            backgroundColor: 'none'


        },
        '& .DateRangePicker_picker': {
            zIndex: 2
        },
        '& .DateRangePickerInput_arrow': {
            margin: '3px',
        },
        '& .DateInput_input__focused': {
            borderBottom: 'none',
            color: '#4C79D1'
        },
        '& .CalendarDay__selected_span': {
            background: '#4C79D1',
            color: '#FFFFFF',
            border: '1px solid #e4e7e7'
        },
        '& .CalendarDay__selected': {
            background: '#4C79D1',
            color: '#FFFFFF',
            border: '1px solid #e4e7e7'
        },
        '& .CalendarDay__selected:hover': {
            background: '#3f51b5',
            color: '#FFFFFF',
            border: '1px solid #e4e7e7'
        },
        '& .CalendarDay__hovered_span:hover, .CalendarDay__hovered_span': {
            background: '#e4e7e7',
            color: '#3f51b5',
            border: '1px double #FFF'
        },
        '& .DayPickerKeyboardShortcuts_show__bottomRight::before': {
            borderRight: '33px solid #4C79D1'
        },

        '& .DayPickerKeyboardShortcuts_show__bottomRight:hover::before': {
            borderRight: '33px solid #3f51b5'
        },
        '& .DayPickerKeyboardShortcuts_show__topRight::before': {
            borderRight: '33px solid #4C79D1'
        },
        '& .DayPickerKeyboardShortcuts_show__topRight:hover::before': {
            borderRight: '33px solid #3f51b5'
        },
        '& .DayPickerKeyboardShortcuts_show__topLeft::before': {
            borderRight: '33px solid #4C79D1'
        },
        '& .DayPickerKeyboardShortcuts_show__topLeft:hover::before': {
            borderRight: '33px solid #3f51b5'
        },
    }
};

class DatePicker extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
            focusedInput: null
        };
    }

    datesUpdated = ({ startDate, endDate }) => {
        this.setState({
            startDate: startDate,
            endDate: endDate
        });
        this.props.updated({
            from_datetime: startDate ? startDate.format('YYYY-MM-DDTHH:mm') : null,
            to_datetime: endDate ? endDate.format('YYYY-MM-DDTHH:mm') : null
        });
        if (this.props.change) {
            this.props.change({
                target: {
                    name: 'from_datetime',
                    value: startDate ? startDate.format('YYYY-MM-DDTHH:mm') : null
                }
            });
            this.props.change({
                target: {
                    name: 'to_datetime',
                    value: endDate ? endDate.format('YYYY-MM-DDTHH:mm') : null
                }
            });
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.from_datetime !== this.props.from_datetime) {
            this.setState({
                startDate: this.props.from_datetime ? moment(this.props.from_datetime) : null
            })
        }
        if (prevProps.to_datetime !== this.props.to_datetime) {
            this.setState({
                endDate: this.props.to_datetime ? moment(this.props.to_datetime) : null
            })
        }
    }

    componentDidMount() {
        this.setState({
            startDate: this.props.from_datetime ? moment(this.props.from_datetime) : null,
            endDate: this.props.to_datetime ? moment(this.props.to_datetime) : null
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.rootRidePage}>
                <DateRangePicker
                    startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                    startDateId="startDate" // PropTypes.string.isRequired,
                    endDate={this.state.endDate}// momentPropTypes.momentObj or null,
                    endDateId="endDate"// PropTypes.string.isRequired,
                    onDatesChange={this.datesUpdated} // PropTypes.func.isRequired,
                    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                    isOutsideRange={day => !isInclusivelyBeforeDay(day, moment().add(6, 'month'))}
                    minimumNights={0}
                    numberOfMonths={this.props.numberMonth ? this.props.numberMonth : 2 }
                />

            </div>
        );
    }
}

export default withStyles(styles)(DatePicker);
