/* eslint-disable no-undef */
import * as React from 'react';
import JobListComponent from '../Job/JobList';
import FilterComponent from '../Searchs/Filter.Component';
import './Map.css';
import { Location } from '../../Models/jobItem';
import mapStore from '../../Stores/mapStore';
import { JobListItem } from '../../Models/jobListItem';
import MapContainer from '../Components/Map/MapContainer';
import { EROLES } from '../../Constants/user';
import JobLocationMaker from '../Components/Map/JobLocationMaker';
import { actions } from '../../Services';
import { connect } from 'react-redux';
import qs from 'query-string';
import { toast } from 'react-toastify';
import JobsFilter from '../Dispatch/components/Filter/JobsFilter';

declare var google: any;

class Map extends React.Component<any> {
  map: any;
  location: Location;
  radius: number;
  radiusType: number;
  jobListComponentRef: any;

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
  }
  state: any = {
    zoom: 11,
    mode: 0,
    location: {
      lat: +process.env.REACT_APP_MAP_CENTER_LAT,
      lng: +process.env.REACT_APP_MAP_CENTER_LNG,
    },
    showJobInfo: {},
    searchParams: { page: 0 },
    isSelected: false,
  };

  componentDidMount = () => {
    this.fetchNewData();
  };

  fetchNewData = async () => {
    if (this.props.match.params.id) {
      this.props.retrieveJob(this.props.match.params.id)
        .then(res => {
          mapStore.selectJob(res);
          this.setState({ zoom: 11, isSelected: true });
          mapStore.setActive(res.po);
          this.onJobFocus(res.po);
          this.props.updateFilters({...this.props.serach_options, search: res.id})
        }).catch(err => {
          mapStore.selectJob(null);
        });
    } else {
      mapStore.selectJob(null);
    }
  };

  onZoomChanged = () => {
    this.setState({ zoom: 11 });
  };

  toggle = () => {
    this.setState((state: any) => ({
      mode: state.mode ? 0 : 1,
      location: state.mode
        ? {
            lat: +process.env.REACT_APP_MAP_CENTER_LAT,
            lng: +process.env.REACT_APP_MAP_CENTER_LNG,
          }
        : {
            lat: 46.6558,
            lng: 32.6178,
          },
    }));
    setTimeout(() => this.toggle(), 4000);
  };

  onJobFocus = (po: number) => {
    mapStore.setActive(po);
  };

  onJobBlur = () => {
    mapStore.clearActive();
  };

  renderPoint = (jobItem: JobListItem) => {
    return jobItem.locations.map((location: Location, idx) => (
      <JobLocationMaker
        key={String(idx + location.lat)}
        position={{
          lat: parseFloat(String(location.lat)),
          lng: parseFloat(String(location.lng)),
        }}
        jobItem={jobItem}
        onJobClick={(job, click = 'single') => {
          // this.jobListComponentRef.current.onClick(job, click, true);
        }}
      />
    ));
  };

  search = async (params: any, keepPage = false) => {
    const searchParams = { ...params };
    this.setState({ searchParams });
    this.props.updateFilters(searchParams);
  };

  isSuperVisor = () => {
    const user = JSON.parse(localStorage.getItem('CurrentUser'));
    if (
      user &&
      user.roles &&
      user.roles.includes(EROLES.coned_field_supervisor)
    ) {
      return true;
    }
    return false;
  };

  public render() {
    const { selected } = mapStore;
    const hasSupervisor = this.isSuperVisor();
    let jobs = this.props.jobs.asMutable();

    if (this.location && this.radius && this.radiusType) {
      jobs = jobs.filter((item) => {
        if (item.locations && item.locations.length) {
          const targetLoc = new google.maps.LatLng(
            item.locations[0].lat,
            item.locations[0].lng
          );
          const center = new google.maps.LatLng(
            this.location.lat,
            this.location.lng
          );
          const distanceInkm =
            google.maps.geometry.spherical.computeDistanceBetween(
              targetLoc,
              center
            ) / 1000;

          return distanceInkm < this.radius * this.radiusType;
        }
        return false;
      });
    }

    return (
      <div
        className="d-flex App-content"
        style={{ height: '100%', overflowY: 'scroll' }}
      >
        <div className="col-left-2 border-right">
          <FilterComponent
            hasDepartment={true}
            hasRequestDate={true}
            hasJobStatus={true}
            hasWorker={true}
            hasNumber={true}
            hasAddress={true}
            hasBorough={true}
            hasFieldSupervisor={hasSupervisor}
            hasFilter
            hasSort
            showSearch={true}
            numberMonth={1}
            //search={this.search}
            onFilter={(_) => {
              this.setState({ change: true });
            }}
            onFilterByLocation={(location, radius, radiusType) => {
              this.location = location;
              this.radius = radius;
              this.radiusType = radiusType;

              this.setState({});
            }}
          />

          <JobListComponent
            forwardRef={(divElement) => {
              this.jobListComponentRef = divElement;
            }}
            jobs={jobs}
            onJobFocus={this.onJobFocus}
            selectJob={(job: JobListItem) => {
              if (selected && job.id === selected.id) {
                mapStore.selectJob(null);
                mapStore.clearActive();
                this.setState({ isSelected: false, zoom: 11 });
              } else {
                mapStore.selectJob(job);
                this.setState({ zoom: 10, isSelected: true });
              }
            }}
            selectedJobId = {selected ? selected.id : null}
            isSelected={this.state.isSelected}
            onJobBlur={this.onJobBlur}
            active={selected ? null : mapStore.active}
          />
        </div>
        <div className="col-right no-margin p-0">
          <div
            /*style={{
              height: 'calc(100vh - 50px)',
              width: '81%',
              position: 'fixed',
            }}*/
            className='map-styles'
          >
            <MapContainer
              onZoomChanged={this.onZoomChanged}
              zoom={this.state.zoom}
              defaultZoom={this.state.zoom}
              reference={(map) => (this.map = map)}
              jobLocation={
                (selected && mapStore.jobLocation) || this.state.location
              }
              jobSelected={selected}
            >
              {selected === null && jobs.map(this.renderPoint)}
            </MapContainer>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    search_options: state.jobs.search_options,
    jobs: state.jobs.jobs.results,
    job: state.jobs.job,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateFilters: (search_options) =>
      dispatch(actions.JobsActions.updateFilters(search_options)),
    retrieveJob: (id, workerId) => 
      dispatch(actions.JobsActions.retrieveJob(id, workerId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
