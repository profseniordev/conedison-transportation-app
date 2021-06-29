import React, { PureComponent } from 'react';
import { actions } from '../../Services';
import { connect } from 'react-redux';
import HeaderMapPage from './components/Header/HeaderMapPage';
import JobsTable from './components/Table/JobsTable';
import './dispatch.scss';
import { LOCATIONS_FILTERS_STORAGE_KEY } from "../../Services/jobs/actions";
import JobInfo from './components/JobInfo';
import JobsMap from './components/Map/JobsMapOld';

import moment from 'moment';

class Dispatch extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let query = new URLSearchParams(this.props.location.search);
    let storage_filters = JSON.parse(localStorage.getItem(LOCATIONS_FILTERS_STORAGE_KEY));

    let search = '';
    for (let param of query.entries()) {
      if (param[0] === 'search') {
        search = param[1];
      }
    }

    this.props.updateFilters({
      ...storage_filters,
      page: 0,
      search,
      from_datetime: moment().format('YYYY-MM-DD'),
      to_datetime: moment().format('YYYY-MM-DD'),
      worker_statuses: ',pending,assigned,en_route,on_location,secured,crew_arrived,cannot_secure,review,finished',
    });

  }

  render() {
    return (
      <div className="map-container">
        <HeaderMapPage />
        <div className="wrapper">
          <JobsTable />
          <JobInfo />
          <JobsMap />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateFilters: (search_options) => dispatch(actions.JobsActions.updateLocationsFilters(search_options)),
    retrieve: (job_id, workerId) => dispatch(actions.JobsActions.retrieveJob(job_id, workerId)),
    updateJob: (job_id, data) => dispatch(actions.JobsActions.updateJob(job_id, data)),
  };
}

function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(Dispatch);

