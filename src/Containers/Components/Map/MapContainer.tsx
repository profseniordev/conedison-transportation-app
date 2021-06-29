/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  DirectionsRenderer,
  Marker,
  InfoWindow,
} from 'react-google-maps';
import { observer } from 'mobx-react';
import * as mobx from 'mobx';
import JobLocationMaker from './JobLocationMaker';
import WorkerPoint from '../../Maps/WorkerPoint';
import { JobListItem } from '../../../Models/jobListItem';
import { createBrowserHistory } from 'history';
import mapStore from '../../../Stores/mapStore';
import CurrentPin from './currentPin.png';
import history from '../../../history';
import { CurrentLocation } from '../../../Models/geoLocation';
import { JOB_STATUSES } from '../../../Constants/job';

const MapWithAMarker = withScriptjs(
  withGoogleMap(({ children, ...props }: any) => (
    <MapDirection children={children} {...props} />
  ))
);
declare var google: any;

@observer
class MapDirection extends Component<any, any> {
  mapControl: any;
  directions: Array<any>;
  directionsService = new google.maps.DirectionsService();
  constructor(props) {
    super(props);
    this.directions = new Array<any>();
    this.mapControl = React.createRef();
    this.state = {
      job: null,
      workerLocations: [],
      directions: [],
      isShow: false,
    };
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({ change: true });
    }
  }

  componentDidMount() {
    if(this.props.jobSelected) {
      this.onChangeJob(this.props.jobSelected)
    }
  }

  componentDidUpdate(preProps) {
    const job = mobx.toJS(this.props.jobSelected);
    if (
      this.props.jobSelected &&
      JSON.stringify(job) !== JSON.stringify(mobx.toJS(preProps.jobSelected))
    ) {
      this.onChangeJob(job);
    }
  }

  async onChangeJob(job) {
    this.setState({
      job: null,
      workerLocations: [],
      directions: [],
    });

    if (job && parseInt(job.jobStatus.toString()) !== JOB_STATUSES.Cancelled && parseInt(job.jobStatus.toString()) !== JOB_STATUSES.Completed && parseInt(job.jobStatus.toString()) !== JOB_STATUSES.CancelledBillable) {
      const workerLocations = [...job.workers];
      this.setState({
        job,
      });
      try {
        const directions = await this.findDirections(workerLocations);
        this.setState({
          directions,
          workerLocations,
        });
      } catch (e) {}
    }
  }

  findDirectionByWorker(w) {
    return new Promise((resolve, reject) => {
      if (w.worker && w.worker.location) {
        var origin = {
          lat: parseFloat(w.worker.location.lat),
          lng: parseFloat(w.worker.location.lng),
        };
        this.directionsService.route(
          {
            origin: origin,
            destination: w.location,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              resolve({
                w,
                directions: result,
              });
            }
            resolve({
              w,
              directions: null,
            });
          }
        );
      } else {
        resolve(null);
      }
    });
  }

  async findDirections(workerLocations) {
    let results = [];
    for (let i = 0; i < (workerLocations || []).length; i++) {
      const d = await this.findDirectionByWorker(workerLocations[i]);
      if (d) {
        results.push(d);
      }
    }
    return results;
  }

  renderDirection(d: any, index: number) {
    if (d.directions) {
      var info = d.directions.routes[0].legs[0];
      d = JSON.parse(JSON.stringify(d));
      if (!d.hasOwnProperty('w')) {
        d.w = { ...d.w, jobType: '', requestTime: '' };
      }
      d.w.jobType = this.state.job.jobType;
      d.w.requestTime = this.state.job.requestTime;

      return (
        <React.Fragment key={index}>
          <JobLocationMaker
            position={d.w.location}
            jobItem={d.w}
            onJobClick={(jobItem, event) => {
              if (event === 'double') {
                createBrowserHistory({ forceRefresh: true }).push(
                  `/job/${jobItem.id}`
                );
              }
            }}
          />
          <DirectionsRenderer
            options={{
              markerOptions: { visible: false },
            }}
            directions={d.directions}
          />
          <WorkerPoint
            position={d.w.worker.location}
            google={google}
            worker={d.w}
            info={info}
          />
        </React.Fragment>
      );
    }
    return <div key={index} />;
  }

  renderJobLocation(jobItem: JobListItem) {
    return (
      jobItem &&
      jobItem.locations.map((location: any, idx) => {
        return (
          <JobLocationMaker
            key={String(idx + location.id)}
            position={{
              lat: parseFloat(location.lat.toString()),
              lng: location.lon ? parseFloat(location.lon.toString()) : parseFloat(location.lng.toString()),
            }}
            jobItem={{ ...jobItem, location }}
            onJobClick={(jobItem, event) => {
              if (event === 'double') {
                history.push(`/job/${jobItem.id}`);
              }
            }}
          />
        );
      })
    );
  }

  show = () => {
    this.setState({ isShow: true });
  };
  close = () => {
    this.setState({ isShow: false });
  };
  render() {
    const { props, children, defaultZoom, zoom, jobSelected } = this.props;
    const { directions } = this.state;
    const currentLocation = mapStore.currentLocation;
    if (!currentLocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const currentLocation: CurrentLocation = {
          Longtitude: position.coords.longitude,
          Latitude: position.coords.latitude,
        };
        mapStore.setCurrentLocation(currentLocation);
      });
    }

    return (
      <GoogleMap
        //defaultZoom={defaultZoom}
        zoom={zoom}
        ref={this.mapControl}
        //defaultCenter={this.props.jobLocation}
        center={this.props.jobSelected ? this.props.jobSelected.locations[0] : this.props.jobLocation}
        {...props}
      >
        {children}
        {currentLocation ? (
          <Marker
            position={{
              lat: parseFloat(currentLocation.Latitude.toString()),
              lng: parseFloat(currentLocation.Longtitude.toString()),
            }}
            icon={{ url: CurrentPin, scaledSize: new google.maps.Size(30, 50) }}
            onClick={this.show}
          >
            {this.state.isShow && (
              <InfoWindow onCloseClick={this.close}>
                <div className="d-flex align-items-center">
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <p style={{ margin: 0 }}>YOU</p>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ) : null}
        {this.renderJobLocation(this.props.jobSelected)}
        {jobSelected &&
          directions.map((d, index) => this.renderDirection(d, index))}
        {this.state.workerLocations
          .filter((worker) => !directions.find((d) => d.id === worker.id))
          .map((wl, index) => {
            return (
              <JobLocationMaker
                key={index}
                position={{
                  lat: parseFloat(wl.location.lat.toString()),
                  lng:parseFloat( wl.location.lng.toString()),
                }}
                jobItem={{ ...this.props.jobSelected, location: wl.location }}
                onJobClick={(jobItem, event) => {
                  if (event === 'double') {
                    history.push(`/job/${jobItem.id}`);
                  }
                }}
              />
            );
          })}
      </GoogleMap>
    );
  }
}

export default class MapContainer extends Component<any> {
  render() {
    const { children, ...props } = this.props;

    return (
      <MapWithAMarker
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        {...props}
      >
        {children}
      </MapWithAMarker>
    );
  }
}
