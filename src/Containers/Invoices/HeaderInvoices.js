import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import { withStyles } from '@material-ui/core';
import './Invoices.scss';
import DatePicker from '../../components/Picker/DatePicker';
import { actions } from '../../Services';
import { BILLING_CYCLE } from '../../Constants/billing';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import DepartmentMaterialAsyncSearch from '../Components/Controls/DepartmentMaterialAsyncSearch'; 


const styles = (theme) => ({
  formControlLabel: {
    backgroundColor: '#FFFFFF',
  }
});

const types = [
  {
    value: 1,
    label: 'Flagging',
    checked: false
  },
  {
    value: 2,
    label: 'Parking',
    checked: false
  },
  {
    value: 3,
    label: 'Signage',
    checked: false
  }
];

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      finishDate: '',
      selectedBillingCycle: [],
      selectedJobTypes: [],
      selectedDepartments: [],
      search_params: {
        page: 1
      }
    };
  }

  getSelectedBillingCycleNames = (items) => {
    let selectedBillingCycleNames = [];
    if (items.length > 0) {
      BILLING_CYCLE.forEach((status) => {
        if (items.indexOf(status.value) > -1) {
          selectedBillingCycleNames.push(status.label);
        }
      })
    }
    return selectedBillingCycleNames;
  };

  getSelectedJobTypes = (items) => {
    let selected = [];
    if (items.length > 0) {
      types.forEach((status) => {
        if (items.indexOf(status.value) > -1) {
          selected.push(status.label);
        }
      })
    }
    return selected;
  };

  handleChangeBillingCycle = (event) => {
    console.log(event.target.value);
    this.setState({
      selectedBillingCycle: event.target.value,
      //search_params: {...this.state.search_params, cycles: event.target.value},
    },
      () => this.props.updateFilters({ ...this.props.search_options, billing_cycles: event.target.value, page: 1 }));
  };

  handleChangeJobTypes = (event) => {
    this.setState({
      selectedJobTypes: event.target.value,
    },
      () => this.props.updateFilters({ ...this.props.search_options, job_types: event.target.value, page: 1 }));
  };

  dateChange = (data) => {
    this.setState({
      startDate: data.from_datetime ? data.from_datetime : '',
      finishDate: data.to_datetime ? data.to_datetime : ''
    }, () => this.props.updateFilters({
      ...this.props.search_options,
      startDate: data.from_datetime ? data.from_datetime : '',
      finishDate: data.to_datetime ? data.to_datetime : '',
      page: 1
    }));
  };


  update = (event) => {
    let value = event.target.value;
    if (Array.isArray(event.target.value) && event.target.value.length > 1) {
      if (event.target.value[event.target.value.length - 1] === 0) {
        value = [0];
      } else {
        value = value.filter((v) => v !== 0);
      }
    }
    this.props.updateFilters({
      ...this.props.search_options,
      [event.target.name]: value,
      page: 1
    });
  };
  updateFilter = (filters) => {
    this.props.updateFilters(filters);
  };

  onDepartmentSelect = (department) => {
    if (!department) {
      this.setState({
        selectedDepartments: []
      }, () => this.props.updateFilters({
        ...this.props.search_options,
        departments: []
      }));
      return;
    }
    let departmentIds = department.map(a => a.value.id);
    this.setState(
      {
        selectedDepartments: department
      }, () => this.props.updateFilters({
        ...this.props.search_options,
        departments: departmentIds,
        page: 1
      }));
  };

  handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    this.setState(
      (state) => ({
        searchParams: { ...state.searchParams, [name]: value },
      }),
      this.update(event)
    );

  };

  render() {
    const { classes } = this.props;
    const {
      selectedBillingCycle,
      startDate,
      finishDate,
      selectedJobTypes,
      // selectedVerifiedStatuses,
    } = this.state;
    console.log("this.state", this.state);
    return (
      <div className="header">
        <div className="block-white">
          <div className="d-grid-4 ">
            {/*<div className="form-group" >
              {/*<label className="d-block lbl">Department</label>*/}
              <DepartmentMaterialAsyncSearch
                onSelect={(department) =>
                  this.onDepartmentSelect(department)
                }
              />
           {/* </div>
            <div className="form-group">
              {/*<label className="d-block lbl">Billing Cycle</label>*/}
              <FormControl
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              >
                <InputLabel id="billing-page-status-selector-label" className={classes.formControlLabel}>
                  Billing Cycle
                </InputLabel>
                <Select
                 MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  },
                  getContentAnchorEl: null
                }}
                  labelId="billing-page-status-selector-label"
                  id="billing-page-status-selector"
                  value={selectedBillingCycle}
                  //style={{ width: 350 }}
                  placeholder={'Select Billing Cycle'}
                  renderValue={(selected) =>
                    this.getSelectedBillingCycleNames(selected).join(', ')
                  }
                  multiple
                  onChange={this.handleChangeBillingCycle}
                >
                  {BILLING_CYCLE.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Checkbox
                        color='primary'
                        icon={<CircleUnchecked />}
                        checkedIcon={<CircleCheckedFilled />}
                        checked={
                          selectedBillingCycle.indexOf(status.value) > -1
                        }
                      />
                      <ListItemText primary={status.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            {/*</div>
            <div className="form-group">
              <label className="d-block lbl">Job Type</label>*/}
              <FormControl
                variant="outlined"
                //InputLabelProps={{ shrink: false }}
              >
                <InputLabel id="types-selector-label" className={classes.formControlLabel}>
                  Job Types
                  </InputLabel>
                <Select
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left"
                    },
                    getContentAnchorEl: null
                  }}
                  labelId="types-selector-label"
                  id="types-selector"
                  name='job_types'
                  value={selectedJobTypes}
                  //style={{ width: 350 }}
                  renderValue={(selected) =>
                    this.getSelectedJobTypes(selected).join(', ')
                  }
                  multiple
                  onChange={this.handleChangeJobTypes}
                >
                  {types.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Checkbox
                        color='primary'
                        icon={<CircleUnchecked />}
                        checkedIcon={<CircleCheckedFilled />}
                        checked={
                          selectedJobTypes.indexOf(status.value) > -1
                        }
                      />
                      <ListItemText primary={status.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            {/*</div>
            <div className="form-group">
              <label className="d-block lbl lbl-time">Invoice Date</label>*/}
              <div className="d-flex justify-content-between align-items-center" style={{height: '55px'}}>
                <DatePicker
                  updated={this.dateChange}
                  from_datetime={startDate}
                  to_datetime={finishDate}
                />
              </div>
            {/*</div>*/}
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateFilters: (search_options) => dispatch(actions.InvoicesActions.updateFilters(search_options)),
    // updateJob: (job_id, data) => dispatch(actions.JobsActions.updateJob(job_id, data)),
  };
}

function mapStateToProps(state) {
  return {
    search_options: state.invoices.search_options,
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Header));
