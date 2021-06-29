import React from 'react';
import { actions } from '../../../../Services';
import { connect } from 'react-redux';
import Loading from './Loading';
import Button from '@material-ui/core/Button';
import history from '../../../../history';
import './Header.scss';
import DatePicker from '../../../../components/Picker/DatePicker';
import VerticalBorder from '../../../../components/Border/VerticalBorder';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Menu from '@material-ui/core/Menu';
import StatusesPopup from './StatusesPopup';
import TypesPopup from './TypesPopup';
import ZonesPopup from './ZonesPopup';
import SearchFC from '../Search/SearchFC';
import Tooltip from '@material-ui/core/Tooltip';
import moment from "moment";

class HeaderMapPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openBuilded: false,
      openJobType: false,
      openStatus: false,
      openCalendar: false,
      statuses: [
        {
          value: 'new',
          label: 'New Job',
          checked: false,
        },
        {
          value: 'in_progress',
          label: 'In Progress',
          checked: false,
        },
        {
          value: 'completed',
          label: 'Completed',
          checked: false,
        },
        {
          value: 'review',
          label: 'Review',
          checked: false,
        },
        {
          value: 'billed',
          label: 'Billed',
          checked: false,
        },
        {
          value: 'paid',
          label: 'Paid',
          checked: false,
        },
        {
          value: 'cancelled',
          label: 'Canceled Jobs',
          checked: false,
        },
        {
          value: 'cancelled_billable',
          label: 'Canceled Billable',
          checked: false,
        },
      ],
      types: [
        {
          value: 1,
          label: 'Flagging',
          checked: false,
        },
        {
          value: 2,
          label: 'Parking',
          checked: false,
        },
        {
          value: 3,
          label: 'Signage',
          checked: false,
        },
      ],
      search_status: {
        job_status: [],
        job_type: [],
      },
      selectionRange: [new Date(), new Date()],
      anchorEl: null,
      anchorEl2: null,
      anchorZoneSelect: null,
    };
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClickTypes = (event) => {
    this.setState({ anchorEl2: event.currentTarget });
  };

  handleCloseTypes = () => {
    this.setState({ anchorEl2: null });
  };

  update = (event) => {
    let value = event.target.value;
    if (event.target.value.length > 1) {
      if (event.target.value[event.target.value.length - 1] === 0) {
        value = [0];
      } else {
        value = value.filter((v) => v !== 0);
      }
    }
    this.props.updateFilters({
      [event.target.name]: value,
    });
  };

  updateJobTypes = (event) => {
    let job_types = this.props.search_options.job_types;
    if (typeof job_types === 'object') {
      job_types = job_types.join(',');
    }

    let value = event.target.value;
    if (job_types.indexOf(value) === -1) {
      job_types = job_types + ',' + value;
    } else {
      job_types = job_types.replace(value, '');
    }

    this.props.updateFilters({
      job_types,
      page: 0
    });
  };

  updateJobStatus = (event) => {
    let job_statuses = this.props.search_options.job_statuses;
    if (typeof job_statuses === 'object') {
      job_statuses = job_statuses.join(',');
    }

    let value = event.target.value;
    if (job_statuses.indexOf(`,${value},`) === -1) {
      job_statuses = job_statuses + ',' + value;
    } else {
      job_statuses = job_statuses.replace(`,${value},`, '');
    }

    job_statuses = job_statuses + ',';

    this.props.updateFilters({
      job_statuses,
      page: 0
    });
  };

  handleClickZones = (event) => {
    this.setState({ anchorZoneSelect: event.currentTarget });
  };

  handleCloseZones = () => {
    this.setState({ anchorZoneSelect: null });
  };

  updateZones = (event) => {
    let zones = this.props.search_options.zones.asMutable();

    console.log('zones', zones);

    let value = +event.target.value;
    console.log('value', value);

    if (zones.includes(value)) {
      zones = zones.filter((item) => item !== value);
    } else {
      zones.push(value);
    }
    console.log('zones', zones);

    this.props.updateFilters({
      zones,
      page: 0
    });
  };

  dateChange = (data) => {
    this.props.updateFilters({
      from_datetime: moment(data.from_datetime).format("YYYY-MM-DDT04:00"),
      to_datetime: moment(data.to_datetime).format("YYYY-MM-DDT03:59") ,
      page: 0
    });
  };

  createJob = () => {
    history.push('/job/create');
  };

  updateFilter = (filters) => {
    this.props.updateFilters(filters);
  };

  resetFilters = (type) => {
    this.props.updateFilters({
      [type]: '',
      page: 0
    });
  };

  render() {
    const props = this.props;
    const search_options = props.search_options;

    return (
      <div>
        <Loading />
        <div className="panel">
          <SearchFC updateFilters={this.updateFilter} />
          <Button
            variant="outlined"
            style={{
              overflow: 'hidden',
              backgroundColor: 'rgb(0 154 216)',
              color: '#FFFFFF',
              borderRadius: '20px',
              marginRight: '10px',
            }}
            onClick={this.createJob}
          >
            Create
          </Button>
          <VerticalBorder />
          <span style={{ marginRight: 15 }}>
            {props.zones_stats.today_jobs_count > 0 ? (
              <Tooltip title="Today active jobs">
                <span
                  style={{
                    border: '3px solid #4caf50', // 3px solid #4caf50  rgb(198 229 199)
                    backgroundColor: '#4caf50',
                    color: '#FFFFFF',
                    borderRadius: 20,
                    marginLeft: 5,
                    padding: 1,
                  }}
                >
                  {props.zones_stats.today_jobs_count}
                </span>
              </Tooltip>
            ) : (
              ''
            )}
            {props.zones_stats.today_late_jobs_count > 0 ? (
              <Tooltip title="Today late">
                <span
                  style={{
                    border: '3px solid red', // 3px solid #4caf50  rgb(198 229 199)
                    backgroundColor: 'red',
                    color: '#FFFFFF',
                    borderRadius: 20,
                    marginLeft: 5,
                    padding: 1,
                  }}
                >
                  {props.zones_stats.today_late_jobs_count}
                </span>
              </Tooltip>
            ) : (
              ''
            )}
            {props.zones_stats.tomorrow_jobs_count > 0 ? (
              <Tooltip title="Tomorrow unassigned">
                <span
                  style={{
                    border: '3px solid #ffb300',
                    backgroundColor: '#ffb300',
                    color: '#FFFFFF',
                    borderRadius: 20,
                    marginLeft: 5,
                    padding: 1,
                  }}
                >
                  {props.zones_stats.tomorrow_jobs_count}
                </span>
              </Tooltip>
            ) : (
              ''
            )}
            {props.zones_stats.tomorrow_unconfirmed_workers_count > 0 ? (
              <Tooltip title="Unconfirmed shifts tomorrow">
                <span
                  style={{
                    border: '3px solid #536dfe',
                    backgroundColor: '#536dfe',
                    color: 'rgb(255 255 255)',
                    borderRadius: 20,
                    marginLeft: 5,
                    padding: 1,
                  }}
                >
                  {props.zones_stats.tomorrow_unconfirmed_workers_count}
                </span>
              </Tooltip>
            ) : (
              ''
            )}
            {props.zones_stats.total_unconfirmed_jobs > 0 ? (
              <Tooltip title="Unconfirmed jobs">
                <span
                  style={{
                    cursor: 'pointer',
                    border: '3px solid rgb(255 46 249)',
                    backgroundColor: 'rgb(255 46 249)',
                    color: 'rgb(255 255 255)',
                    borderRadius: 20,
                    marginLeft: 5,
                    padding: 1,
                    paddingLeft: 5,
                    paddingRight: 5,
                    WebkitBoxShadow:
                      search_options.unconfirmed === true
                        ? '0px 0px 10px 0px rgba(0,0,0,0.75)'
                        : '',
                    MozBoxShadow:
                      search_options.unconfirmed === true
                        ? '0px 0px 10px 0px rgba(0,0,0,0.75)'
                        : '',
                  }}
                  id={'UnconfirmedJobs'}
                  onClick={(_) =>
                    this.updateFilter({
                      unconfirmed: !search_options.unconfirmed,
                      workers_unconfirmed: '',
                      search: '',
                      page: 0
                    })
                  }
                >
                  {props.zones_stats.total_unconfirmed_jobs} Uncnf Jbs{' '}
                </span>
              </Tooltip>
            ) : (
              ''
            )}

            {props.zones_stats.today_unconfirmed_asap_shifts > 0 ? (
              <Tooltip title="Unconfirmed shifts">
                <span
                  style={{
                    cursor: 'pointer',
                    border: '3px solid rgb(142 68 255)',
                    backgroundColor: 'rgb(142 68 255)',
                    color: 'rgb(255 255 255)',
                    borderRadius: 20,
                    marginLeft: 5,
                    padding: 1,
                    paddingLeft: 5,
                    paddingRight: 5,
                    WebkitBoxShadow:
                      search_options.workers_unconfirmed === true
                        ? '0px 0px 10px 0px rgba(0,0,0,0.75)'
                        : '',
                    MozBoxShadow:
                      search_options.workers_unconfirmed === true
                        ? '0px 0px 10px 0px rgba(0,0,0,0.75)'
                        : '',
                  }}
                  id={'WorkersUnconfirmedJobs'}
                  onClick={(_) =>
                    this.updateFilter({
                      workers_unconfirmed: !search_options.workers_unconfirmed,
                      unconfirmed: '',
                      search: '',
                      page: 0,
                    })
                  }
                >
                  {props.zones_stats.today_unconfirmed_asap_shifts} Uncnf shifts
                </span>
              </Tooltip>
            ) : (
              ''
            )}
          </span>
          {/*<VerticalBorder />*/}

          <Button
            variant="outlined"
            style={{
              overflow: 'hidden',
              backgroundColor: '#F8F8F8',
              color: '#333333',
              borderRadius: '20px',
              marginRight: '10px',
            }}
            onClick={this.handleClickZones}
          >
            {search_options.zones.length > 0 && search_options.zones.length}{' '}
            {search_options.zones.length === 1 ? 'Zone' : 'Zones'}
            <ArrowDropDownIcon fontSize="small" />
          </Button>

          {this.state.anchorZoneSelect && (
            <Menu
              id="customized-menu"
              classes={{ paper: 'job-select' }}
              anchorEl={this.state.anchorZoneSelect}
              keepMounted
              open={Boolean(this.state.anchorZoneSelect)}
              onClose={this.handleCloseZones}
              anchorOrigin={{
                vertical: 'bottom',
              }}
            >
              <ZonesPopup
                update={this.updateZones}
                zones={this.props.zones}
                resetFilters={this.resetFilters}
                onClose={this.handleCloseZones}
                updateFilters={this.props.updateFilters}
              />
            </Menu>
          )}

          <Button
            variant="outlined"
            style={{
              overflow: 'hidden',
              backgroundColor: '#F8F8F8',
              color: '#333333',
              borderRadius: '20px',
              marginRight: '10px',
            }}
            onClick={this.handleClickTypes}
          >
            Type
            <ArrowDropDownIcon fontSize="small" />
          </Button>
          <Menu
            id="customized-menu"
            classes={{ paper: 'job-select' }}
            anchorEl={this.state.anchorEl2}
            keepMounted
            open={Boolean(this.state.anchorEl2)}
            onClose={this.handleCloseTypes}
            anchorOrigin={{
              vertical: 'bottom',
            }}
          >
            <TypesPopup
              updateJobTypes={this.updateJobTypes}
              types={this.state.types}
              resetFilters={this.resetFilters}
              onClose={this.handleCloseTypes}
              updateFilters={this.props.updateFilters}
            />
          </Menu>

          <Button
            variant="outlined"
            style={{
              overflow: 'hidden',
              backgroundColor: '#F8F8F8',
              color: '#333333',
              borderRadius: '20px',
              marginRight: '10px',
            }}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            Status
            <ArrowDropDownIcon fontSize="small" />
          </Button>
          <Menu
            id="customized-menu"
            classes={{ paper: 'job-select' }}
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
            anchorOrigin={{
              vertical: 'bottom',
            }}
          >
            <StatusesPopup
              updateJobStatus={this.updateJobStatus}
              statuses={this.state.statuses}
              resetFilters={this.resetFilters}
              onClose={this.handleClose}
              updateFilters={this.props.updateFilters}
            />
          </Menu>
          <VerticalBorder style={{ marginRight: 10 }} />
          {/*          <FormControlLabel
            control={
              <Checkbox
                onChange={_ => this.updateFilter({ 'workers_unconfirmed': !search_options.workers_unconfirmed })}
                checked={search_options.workers_unconfirmed === '' ? false : search_options.workers_unconfirmed}
                color='primary'
              />
            }
            label='Unconfirmed'
            style={{ fontSize: 12 }}
          />
          <VerticalBorder style={{ marginRight: 5 }} />*/}
          <DatePicker
            updated={this.dateChange}
            from_datetime={moment(search_options.from_datetime).format("YYYY-MM-DDT04:00")}
            to_datetime={moment(search_options.to_datetime).format("YYYY-MM-DDT03:59")}
          />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateFilters: (filters) =>
      dispatch(actions.JobsActions.updateLocationsFilters(filters)),
  };
}

function mapStateToProps(state) {
  return {
    search_options: state.jobs.locations_search_options,
    zones: state.zones.zones,
    zones_stats: state.zones.stats,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMapPage);
