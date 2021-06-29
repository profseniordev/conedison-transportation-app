import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import { withStyles } from '@material-ui/core';
import '../billing.scss';
import DatePicker from '../../../components/Picker/DatePicker';
import { actions } from '../../../Services';
import { BILLING_STATUS } from '../../../Constants/billing';
import UpdatePODialog from "../../Job/dialogs/UpdatePODialog";
import Search from '../../../components/Search/Search';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DepartmentMaterialAsyncSearch from '../../Components/Controls/DepartmentMaterialAsyncSearch'; 



const styles = (theme) => ({
  formControlLabel: {
    backgroundColor: '#FFFFFF'
  }
});

class HeaderBilling extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      finishDate: '',
      selectedBillingStatuses: [],
      disableBtn:true,
      poMissing: false,
      search: '',
    };
  }

  
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


  static getDerivedStateFromProps(props, state) {
    if (state.search !== props.search_options.search) {
      return {
        search: props.search_options.search,
      };
    }
    if (state.startDate !== props.search_options.startDate) {
      return {
        startDate: props.search_options.startDate,
      };
    }
    if (state.finishDate !== props.search_options.finishDate) {
      return {
        finishDate: props.search_options.finishDate,
      };
    }
    if (state.selectedBillingStatuses !== props.search_options.statuses) {
      return {
        selectedBillingStatuses: [...props.search_options.statuses],
      };
    }
    return null;
  }
  // resetFilters = (type) => {
  //     this.props.updateFilters({
  //         [type]: ''
  //     })
  // };
  // update = (event) => {
  //     let value = event.target.value;
  //     if (event.target.value.length > 1) {
  //         if (event.target.value[event.target.value.length - 1] === 0) {
  //             value = [0];
  //         } else {
  //             value = value.filter(v => v !== 0);
  //         }
  //     }
  //     this.props.updateFilters({
  //         [event.target.name]: value
  //     })
  // };
  // updateJobStatus = (event) => {
  //     let job_statuses = this.props.search_options.job_statuses;
  //     if (typeof   job_statuses === 'object') {
  //         job_statuses = job_statuses.join(',');
  //     }
  //
  //     let value = event.target.value;
  //     if (job_statuses.indexOf(value) === -1) {
  //         job_statuses = job_statuses + ',' + value
  //     } else {
  //         job_statuses = job_statuses.replace(value, '')
  //     }
  //
  //     this.props.updateFilters({
  //         job_statuses
  //     })
  // };

  getSelectedBillingStatusNames = (items) => {
    let selectedBillingStatusNames = [];
    if (items.length > 0) {
      BILLING_STATUS.forEach((status) => {
        if (items.indexOf(status.value) > -1) {
          selectedBillingStatusNames.push(status.label);
        }
      })
    }
    return selectedBillingStatusNames;
  };

  // getSelectedVerifiedStatusNames = (items) => {
  //   let selectedVerifiedStatusNames = [];
  //   if(items.length > 0) {
  //     VERIFIED_STATUS.map((status) => {
  //       if(items.indexOf(status.value) > -1) {
  //         selectedVerifiedStatusNames.push(status.label);
  //       }
  //     })
  //   }
  //   return selectedVerifiedStatusNames;
  // };

  handleChangeBillingStatus = (event) => {
    this.setState({
      selectedBillingStatuses: event.target.value,
    },
      () => this.props.updateFilters({ statuses: event.target.value, page: 1 }));
  };

  // handleChangeVerifiedStatus = (event) => {
  //   this.setState({
  //     selectedVerifiedStatuses: event.target.value,
  //   });
  // };

  dateChange = (data) => {
    this.setState({
      startDate: data.from_datetime ? data.from_datetime : '',
      finishDate: data.to_datetime ? data.to_datetime : ''
    }, () => this.props.updateFilters({
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
      [event.target.name]: value,
      page: 1
    });
  };

  updateFilter = (filters) => {
    this.props.updateFilters(filters);
  };



  handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    this.setState(
      (state) => ({
        searchParams: { ...state.searchParams, [name]: value, page: 1 },
      }),
      this.update
    );

  };

  handlePoMissing = (event) => {
    const { checked } = event.target;
    this.setState(
      (state) => ({
        poMissing: checked
      }),
      this.props.updateFilters({
        [event.target.name]: checked,
        page: 1
      })
    );
  }


  render() {
    const { classes, search_options} = this.props;
    const {
      selectedBillingStatuses,
      startDate,
      finishDate,
      search,
      // selectedJobStatuses,
      // selectedVerifiedStatuses,
    } = this.state;

    return (
      <div className="page-header billing-header">
        <div className="block-white">
            <div>
              {/*<SearchBilling
                updateFilters={this.updateFilter}
                searchData={search_options.search}
              />*/}
              <Search
              name='id'
              updateFilters={this.updateFilter}
              placeholder={'Search ...'}
              instant={true}
              search_value={search}
            />
            </div>
            <div className='align'>
              <FormControlLabel
                control={
                  <Checkbox
                    name='po_missing'
                    icon={<CircleUnchecked />}
                    checkedIcon={<CircleCheckedFilled />}
                    checked={this.state.poMissing}
                    onChange={(event)=>this.handlePoMissing(event)}
                    color='primary'
                  />
                }
                label="PO# Missing"
              />
            </div>
              <FormControl variant="outlined">
                <InputLabel id="billing-page-status-selector-label" className={classes.formControlLabel}>
                  Select Billing
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
                  style={{width: '100%'}}
                  value={selectedBillingStatuses}
                  renderValue={(selected) =>
                    this.getSelectedBillingStatusNames(selected).join(', ')
                  }
                  multiple
                  onChange={this.handleChangeBillingStatus}
                >
                  {BILLING_STATUS.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Checkbox
                        icon={<CircleUnchecked />}
                        checkedIcon={<CircleCheckedFilled />}
                        checked={
                          selectedBillingStatuses.indexOf(status.value) > -1
                        }
                        color='primary'
                      />
                      <ListItemText primary={status.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className='deps-filter'>
              <DepartmentMaterialAsyncSearch
                width={'100%'}
                onSelect={(department) =>
                  this.onDepartmentSelect(department)
                }
              />
              </div>
              {/* <FormControl
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              >
                <InputLabel id="billing-page-status-selector-label">
                  Job Status
                </InputLabel>
                <Select
                  labelId="billing-page-status-selector-label"
                  id="billing-page-status-selector"
                  value={search_options.status}
                  input={<Input />}
                  renderValue={(selected) => (selected).join(', ')}
                  multiple
                  onChange={this.update}
                >
                  {JOB_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      <Checkbox checked={selectedJobStatuses.indexOf(status) > -1} />
                      <ListItemText primary={status} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
              {/*<div className='column mr-4'>
                            <p className="text-label">Approved For billing</p>
                            <BillingAsyncSelect
                                isClearable
                                isMulti
                                withNone
                                //onSelect={(subcontractor: ISelectItem) =>
                                //  this.onSubcontractorSelected(subcontractor)
                                //    }
                            />
                        </div>*/}
              {/*                   <div className='column'>
                            <p className="text-label"> Subcontractor </p>
                            <SubcontractorAsyncSearch
                                isClearable
                                //onSelect={(subcontractor: ISelectItem) =>
                                //  this.onSubcontractorSelected(subcontractor)
                                //    }
                            />
                        </div>*/}
              <UpdatePODialog
                  open={this.props.open}
                  close={this.props.close}
                  updatePOS={this.props.updatePO}
                  receiptUpdate
              />

            <div style={{paddingTop: '28px'}}>
              <DatePicker
                updated={this.dateChange}
                from_datetime={startDate}
                to_datetime={finishDate}
              />
              </div>
              <div style={{paddingTop: '7px'}}>
              <button
                  className="btn btn-dark mr-5"
                  style={{width: 300}}
                  onClick={this.props.show}
              >
                {' '}
                Update PO# / Requisition# / Receipt# 
              </button>
            </div> 
          </div>
          </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updatePOS: (job_ids, po_number) => dispatch(actions.JobsActions.updatePO(job_ids, po_number)),
    updateFilters: (search_options) => dispatch(actions.BillingActions.updateFilters(search_options)),
    // updateJob: (job_id, data) => dispatch(actions.JobsActions.updateJob(job_id, data)),
  };
}

function mapStateToProps(state) {
  return {
    search_options: state.billing.search_options,
  };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(HeaderBilling));
