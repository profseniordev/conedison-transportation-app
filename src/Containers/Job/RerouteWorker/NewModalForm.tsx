import GoogleMapReact from 'google-map-react';
import React, { Component } from 'react';
import { LocationItem } from '../../../Models/locationItem';
import Point from '../../Maps/Point';
import LocationsAsyncSearch from '../../Components/Controls/LocationsAsyncSearch';
import mapStore from '../../../Stores/mapStore';
import { CurrentLocation } from '../../../Models/geoLocation';
import './ModalForm';
import './WorkerGroup.scss';

interface IProps {
  withMap?: Boolean;
  location: LocationItem;
  onChangeLocations: (location: LocationItem) => void;
  error?: string | null;
}

export default class NewMapSelect extends Component<IProps> {
  selectedLocation: {
    address: string;
    lat: number;
    lng: number;
    structure: number;
    images: any;
  };

  static defaultProps = {
    withMap: true,
  };

  selectLocation = (item) => {
    this.selectedLocation = item ? item.value : null;
    this.forceUpdate();
    if (!this.selectedLocation || !this.selectedLocation.address) return;

    const location = this.selectedLocation;
    this.props.onChangeLocations(location);
  };

  addLocation = () => {
    if (!this.selectedLocation || !this.selectedLocation.address) return;

    const locations = this.selectedLocation;
    this.props.onChangeLocations(locations);
  };

  removeLocation() {
    this.props.onChangeLocations({} as LocationItem);
  }

  get mapCenter() {
    if (this.selectedLocation) {
      return {
        lat: this.selectedLocation.lat,
        lng: this.selectedLocation.lng,
      };
    }

    if (this.props.location) {
      const last = this.props.location;
      if (last) {
        return {
          lat: last.lat,
          lng: last.lng,
        };
      }
    }
    const currentLocation = mapStore.currentLocation;
    if (currentLocation) {
      return {
        lat: Number(currentLocation.Latitude),
        lng: Number(currentLocation.Longtitude),
      };
    } else {
      navigator.geolocation.getCurrentPosition(function (position) {
        const currentLocation: CurrentLocation = {
          Longtitude: position.coords.longitude,
          Latitude: position.coords.latitude,
        };
        mapStore.setCurrentLocation(currentLocation);
        return {
          lat: Number(position.coords.latitude),
          lng: Number(position.coords.longitude),
        };
      });
    }
    return false;
  }

  addStructure = (e) => {
    const _location = this.props.location;
    _location.structure = Number(e.target.value);
    this.props.onChangeLocations(_location);
  };

  render() {
    const { location } = this.props;
    return (
      <div className="">
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group location">
              <label className="d-block sub-title-modal">Location Address</label>
              <div className="d-flex mb-4">
                <div className="d-block mr-2" style={{ width: '100%' }}>
                  <LocationsAsyncSearch
                    onSelect={this.selectLocation}
                    isMulti={false}
                  />
                </div>
              </div>
              <p className="error">{this.props.error}</p>
            </div>
          </div>
          <div className="col-sm-6 address-list-select">
            {this.props.withMap ? (
              <div
                style={{ height: '150px', width: 'auto', borderRadius: '16px' }}
              >
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: process.env.REACT_APP_GOOGLE_MAP_AIP_KEY,
                  }}
                  center={this.mapCenter}
                  defaultCenter={{
                    lat: Number(process.env.REACT_APP_MAP_CENTER_LAT),
                    lng: Number(process.env.REACT_APP_MAP_CENTER_LNG),
                  }}
                  yesIWantToUseGoogleMapApiInternals
                  defaultZoom={11}
                >
                  {location.lat &&
                    [location].map((item, idx) => (
                      <Point key={idx} lat={item.lat} lng={item.lng}>
                        {1}
                      </Point>
                    ))}
                </GoogleMapReact>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
