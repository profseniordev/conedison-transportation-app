import GoogleMapReact from 'google-map-react';
import React, { Component } from 'react';
import Point from '../../Maps/Point';
import LocationsAsyncSearch from './LocationsAsyncSearch';
import mapStore from '../../../Stores/mapStore';
import { CurrentLocation } from '../../../Models/geoLocation';
import ImageUpload from '../../../Containers/Components/ImageUpload/ImageUpload';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';

export default class MapSelect extends Component<any> {
  static defaultProps = {
    withMap: true,
  };

  selectLocation = (item) => {
    if (item) {
      let location = this.props.location;
      let updated_location = {
        ...location,
        ...item.value,
      };
      this.props.onChange(updated_location, this.props.location_index);
      this.forceUpdate();
    } else {
      this.props.onChange(
        {
          address: undefined,
          finish_time: '23:59',
          lat: 0,
          lng: 0,
          max_workers: 1,
          start_time: '00:00',
          structure: '',
        },
        this.props.location_index
      );
      this.removeLocation();
    }
  };

  removeLocation = () => {
    this.props.onRemove(this.props.location_index);
  };

  fieldChanged = (event) => {
    let location = {
      ...this.props.location,
      [event.target.name]: event.target.value,
    };
    this.props.onChange(location, this.props.location_index);
  };

  getErrorMessage = (key) => {
    if (!this.props.errorLocation) {
      return null;
    }
    const jobs = this.props.errorLocation.jobs;
    if (!jobs || !Array.isArray(jobs) || !jobs[this.props.index]) {
      return null;
    }
    return jobs[this.props.index][key];
  };

  get mapCenter() {
    if (this.props.location) {
      if (this.props.location) {
        return {
          lat: this.props.location.lat,
          lng: this.props.location.lng,
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

  render() {
    const {
      location,
      location_index,
      errors,
      handleBlur,
      touchedSubmit,
    } = this.props;
    return (
      <>
        <div className="row">
          <div className="col-sm-12">
            <div className="form-group relative">
              <label className="d-block">
                Location #{this.props.index + 1}{' '}
                {!this.props.can_edit_location &&
                  '- Please Re-Route instead of editing location'}
              </label>
              {this.props.location_index > 0 && this.props.can_edit_location && (
                <IconButton
                  aria-label="delete"
                  style={{ position: 'absolute', right: '15px', top: 0 }}
                  onClick={this.removeLocation}
                >
                  <DeleteForeverOutlinedIcon style={{ color: '#BDBDBD' }} />
                </IconButton>
              )}

              {touchedSubmit && errors && (
                <p className="error error-location">
                  {errors.map((error, index) => {
                    return index === this.props.index
                      ? error
                        ? error.address
                        : ''
                      : null;
                  })}
                </p>
              )}
              <div className="d-flex" style={{marginBottom: '28px'}}>
                <div className="d-block mr-2" style={{ width: '49%' }}>
                  {this.props.location_index === 0 ? (
                    <LocationsAsyncSearch
                      handleBlur={handleBlur}
                      onSelect={this.selectLocation}
                      disabled={!this.props.can_edit_location}
                      defaultInputValue={location.address}
                      defaultValue={null}
                    />
                  ) : (
                    <p>{location.address}</p>
                  )}
                </div>
              {this.props.location_index === 0 && <br />}

                  <div className="address-list-select" style={{marginTop: '-28px'}}>
                    {!this.props.flagging && (
                      <>
                        <div>
                          <label className="d-block">Structure #</label>
                          <input
                            style={{ width: 100, height: '46px', border: '1px solid lightgrey' }}
                            className="ce-form-control"
                            placeholder="00001"
                            data-type={'text'}
                            value={location.structure ? location.structure : ''}
                            name={'structure'}
                            onChange={this.fieldChanged}
                          />
                        </div>
                        {touchedSubmit && errors && (
                          <p
                            style={{ color: '#a94442', margin: '0!important' }}
                          >
                            {errors.map((error, index) => {
                              return index === this.props.index
                                ? error
                                  ? error.structure
                                  : ''
                                : null;
                            })}
                          </p>
                        )}
                      </>
                    )}
                </div>
              </div>
              {this.props.withMap &&
              location.lat !== 0 &&
              location.lng !== 0 ? (
                <div
                  style={{ height: '200px', width: 'auto', marginBottom: 20 }}
                >
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
                    }}
                    center={this.mapCenter}
                    defaultCenter={{
                      lat: Number(process.env.REACT_APP_MAP_CENTER_LAT),
                      lng: Number(process.env.REACT_APP_MAP_CENTER_LNG),
                    }}
                    yesIWantToUseGoogleMapApiInternals
                    defaultZoom={11}
                  >
                    <Point lat={location.lat} lng={location.lng}>
                      {location_index}
                    </Point>
                  </GoogleMapReact>
                </div>
              ) : null}

              <ImageUpload
                onChangeImage={(images) =>
                  this.fieldChanged({
                    target: {
                      name: 'images',
                      value: images,
                    },
                  })
                }
                defaultImages={location.images}
              />

              <div className="form-group">
                <label className="d-block">
                  {this.props.flagging
                    ? 'Flagging points'
                    : 'Comments (optional)'}
                </label>
                <textarea
                  rows={5}
                  placeholder={
                    this.props.flagging
                      ? 'Add Flagging points'
                      : 'Comments (optional)'
                  }
                  className="ce-form-control-textarea"
                  value={location.note ? location.note : ''}
                  name={'note'}
                  onChange={this.fieldChanged}
                  style={{height: 70}}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
