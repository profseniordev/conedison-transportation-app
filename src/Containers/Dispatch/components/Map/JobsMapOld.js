import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as mapboxgl from 'mapbox-gl';
import workerImage from '../../../../Assets/map/worker-image.png';
import jobImage from '../../../../Assets/map/ellipse.png';
import workerFlagging from '../../../../Assets/map/worker-flagging.png';
import DetailsPopup from '../DetailsPopup';

export const MAPBOX_TOKEN =
  'pk.eyJ1IjoibGFjdXN0ZWNoIiwiYSI6ImNqM3p5djBnaDA2YmsycXA4aGhuM2lvejMifQ.dL2fI1F87JZo1VZiWP3HTQ';

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
const styles = {
  map: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
};

let self;

class JobsMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active_job: null,
      center: [-73.935242, 40.73061],
      anchorEl: null,
      driverData: false,
    };

    this.handleDriverClick = this.handleDriverClick.bind(this);

    this.mapContainer = React.createRef();

    this.tooltipRef = React.createRef(new mapboxgl.Popup());

    self = this;
  }

  markers = [];
  driver_markers = [];
  refresh_interval = null;
  eta_interval = null;

  componentDidMount() {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    this.map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style:
        'mapbox://styles/lacustech/ckjm45r9l1inm1ao9gsyie64b?optimize=true',
      center: this.state.center,
      zoom: 10,
      pitch: 0,
      bearing: 0,
      maxZoom: 19
    });

    this.map.on('load', () => {
      this.map.addControl(new mapboxgl.NavigationControl());

      this.map.loadImage(workerImage, (error, image) => {
        if (error) throw error;
        this.map.addImage('workerImg', image);
      });

      this.map.loadImage(workerFlagging, (error, image) => {
        if (error) throw error;
        this.map.addImage('workerFlagging', image);
      });

      this.map.loadImage(jobImage, (error, image) => {
        if (error) throw error;
        this.map.addImage('jobImg', image);
      });

      this.map.addSource('available_drivers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      this.map.addSource('locations_jobs', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
      this.map.addLayer({
        id: 'available_drivers',
        source: 'available_drivers',
        type: 'symbol',
        layout: {
          'icon-image': { type: 'identity', property: 'image' },
          'icon-size': 1,
          'icon-padding': 1,
          'icon-allow-overlap': true,
          'icon-rotate': { type: 'identity', property: 'rotation' },
          // 'icon-rotation-alignment': 'auto',
          'text-font': ['Lato Black'],
          'text-padding': 20,
          'text-anchor': 'top',
          'text-offset': [0, -6],
          'text-size': 10,
          'text-allow-overlap': true,
          'text-field': { type: 'identity', property: 'title' },
          'text-justify': 'center',
          'icon-offset': [0, -22],
          'text-letter-spacing': 0.15,
        },
        paint: {
          'text-color': '#000000',
          'text-halo-color': '#fff',
          'text-halo-width': 2,
        },
      });
      this.map.addLayer({
        id: 'locations_jobs',
        source: 'locations_jobs',
        type: 'symbol',
        layout: {
          'icon-image': { type: 'identity', property: 'image' },
          'icon-size': 1,
          'icon-padding': 1,
          'icon-allow-overlap': true,
          'icon-rotate': { type: 'identity', property: 'heading' },

          'text-font': ['Lato Black'],
          'text-padding': 20,
          'text-anchor': 'center',
          'text-size': 10,
          'text-allow-overlap': true,
          'text-field': { type: 'identity', property: 'label' },
          'text-justify': 'center',
          'text-letter-spacing': 0.15,
        },
        paint: {
          'text-color': '#000000',
          'text-halo-color': '#fff',
          'text-halo-width': 2,
        },
      });
    });

    this.map.on('click', function (e) {
      self.handleCloseDriverData();
    });

    this.map.on('click', 'available_drivers', function (e) {
      this.flyTo({
        center: e.features[0].geometry.coordinates,
      });

      self.handleDriverClick(e);
    });

    this.map.on('click', 'locations_jobs', function (e) {
      self.handleCloseDriverData();
      this.flyTo({
        center: e.features[0].geometry.coordinates,
      });
    });
  }

  handleClose() {
    self.setState({
      driverData: false,
      anchorEl: null,
    });
  }

  handleCloseDriverData() {
    this.setState({ driverData: false });
  }

  handleDriverClick(e) {
    const props = e.features[0].properties;

    const payload = {
      id: props.worker_id,
      coordinates: { lng: props.lon, lat: props.lat },
      worker: {
        id: props.worker_id,
        worker_name: props.name,
        phone_number: props.phone_number,
        status: props.status,
      },
    };
    this.setState({
      driverData: payload,
      anchorEl: e.target,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.locationJob) {
      if (prevProps.locationJob) {
        if (prevProps.locationJob.id !== this.props.locationJob.id) {
          this.map.resize();
          this.initJobs();
          this.initWorkers();
          this.fitMap(
            this.props.locationJob.locations,
            this.props.workers
          );
        } else {
          this.map.resize();
          this.initJobs();
          this.initWorkers();
          // this.centerMap(
          //   this.props.locationJob.locations[0].lon,
          //   this.props.locationJob.locations[0].lat
          // );
        }
      } else {
        this.map.resize();
        this.initJobs();
        this.initWorkers();
        this.fitMap(
          this.props.locationJob.locations,
          this.props.workers
        );
      }
    }
  }

  fitMap(jobData, workerData) {

    let jobP = jobData.map(item => {
      if (item.lon && item.lat) {
        return [item.lon, item.lat]
      } else return null
    }).filter(item => item);

    let workerP = workerData.map(item => {
      if (item.lon && item.lat) {
        return [item.lon, item.lat]
      } else return null
    }).filter(item => item);

    if (jobP[0] && workerP[0]) {
      this.map.fitBounds(
        [jobP[0], workerP[0]], {
        padding: { top: 50, bottom: 90, left: 95, right: 150 }
      }
      )
    } else {
      this.centerMap(
        this.props.locationJob.locations[0].lon,
        this.props.locationJob.locations[0].lat
      );
    }
  }

  centerMap(lat, lng) {
    this.map.flyTo({
      center: [lat, lng],
      zoom: 12
    });
  }

  initWorkers() {
    let workers = this.props.workers;

    this.driver_markers.forEach((marker) => marker.remove());

    let drivers_data = [];

    for (let i = 0; i < workers.length; i++) {
      let worker = workers[i];

      let images = 'workerImg';
      if (this.props.locationJob.type === "Flagging")
        images = "workerFlagging";

      drivers_data.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [worker.lon, worker.lat],
        },

        properties: {
          image: images,
          worker_id: worker.worker_id,
          name: worker.worker_name,
          phone_number: worker.phone_number,
          heading: '',
          title: worker.worker_name,
          rotation: 0,
          lon: worker.lon,
          lat: worker.lat,
          status: worker.status,
        },
      });
    }

    let available_drivers = this.map.getSource('available_drivers');
    if (available_drivers) {
      available_drivers.setData({
        type: 'FeatureCollection',
        features: drivers_data,
      });
    }
  }

  initJobs() {
    let jobs = this.props.locationJob.locations;

    let jobs_data = [];

    for (let i = 0; i < jobs.length; i++) {
      let job = jobs[i];

      const cutAddress = job.address && job.address.split(',')[0];

      jobs_data.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [job.lon, job.lat],
        },

        properties: {
          job_id: job.id,
          address: job.address,
          title: this.props.locationJob.id,
          label: `${i + 1} - ${cutAddress}`,
          image: 'jobImg',
        },
      });
    }

    let locations_jobs = this.map.getSource('locations_jobs');
    if (locations_jobs) {
      locations_jobs.setData({
        type: 'FeatureCollection',
        features: jobs_data,
      });
    }
  }

  render() {
    return (
      <>
        <div ref={this.mapContainer} style={styles.map}>
          {this.state.driverData ? (
            <div style={{ position: 'absolute', top: 0, left: 0 }}>
              <div
                className="details-popup"
                style={{
                  background: '#fff',
                  boxShadow: '16px 16px 38px 0px rgba(34, 60, 80, 0.2)',
                }}
              >
                <DetailsPopup worker={this.state.driverData.worker} />
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

function mapStateToProps({ jobs }) {
  return {
    workers: jobs.location_job ? jobs.location_job.workers : [],
    locationJob: jobs.location_job,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    // eta: (ride_type_id, lat, lon) => dispatch(actions.RidesActions.eta(ride_type_id, lat, lon)),
    // retrieveRideLocation: (ride_id) => dispatch(actions.RidesActions.retrieveRideLocation(ride_id)),
    // retrieveDriverRides : (driver_id) => dispatch(actions.CarsActions.retrieveDriverRides(driver_id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobsMap);
