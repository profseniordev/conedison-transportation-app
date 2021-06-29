import React, { Component } from 'react';
import mapStore from '../../../Stores/mapStore';
import { CurrentLocation } from '../../../Models/geoLocation';
import './ModalForm.scss';
import CancelIcon from '@material-ui/icons/Cancel';
import { JobWorker } from '../../../Models/jobListItem';
import TextField from '@material-ui/core/TextField';

interface IProps {
  location: any;
  onChangeWorker: (worker: any, index: any) => void;
  onChangeLocations: (locations: any) => void;
  selectedWorkers: Array<any>;
  handleSelectWorker: (worker: JobWorker) => void;
  closeModal: () => void;
}

export default class ReroutWorker extends Component<any> {
  selectedLocation: {
    address: string;
    lat: number;
    lng: number;
    structure: any;
    note: any;
    images: any;
  };

  state = {
    workersLength: 0,
    structure: null,
    note: null,
  };

  componentDidMount() {
    this.setState({ workersLength: this.props.selectedWorkers.length });
  }

  addLocation = () => {
    if (!this.selectedLocation || !this.selectedLocation.address) return;

    const locations = { ...this.selectedLocation };
    this.props.onChangeLocations(locations);
  };

  remove(worker: JobWorker) {
    this.props.handleSelectWorker(worker);
    // const newState = --this.state.workersLength;
    this.setState({ workersLength: this.state.workersLength - 1 });
    if (this.state.workersLength === 0) this.props.closeModal();
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

  onChange = (event, index) => {
    this.setState({ [event.target.name]: event.target.value });
    const _location = this.props.location;
    _location[event.target.name] = event.target.value;
    this.props.onChangeWorker(
      {
        [event.target.name]: event.target.value,
      },
      index
    );
    // this.props.onChangeLocations(_location)
  };

  render() {
    const show_structure_number = this.props.job.jobType === 2;
    const selectedWorkers = this.props.selectedWorkers;
    return (
      <div className="">
        <div className="row">
          {selectedWorkers.map((worker, index) => (
            <div
              key={String(worker.shift_id)}
              className=" mr-3 justify-content-start align-items-center worker-row"
            >
              <div className="col-sm-1 mr-3 mt-11">
                <span onClick={() => this.remove(worker)}>
                  <CancelIcon className="cursor-pointer" />
                </span>
              </div>
              <div className="mr-3">
                <p>Worker</p>
                <img
                  className="avatarSmall"
                  alt="avatar"
                  src={`${process.env.REACT_APP_API_ENDPOINT}${worker.worker.avatar}`}
                />
              </div>
              <div className="col-sm-2 margins">
                <div>{worker.worker.name}</div>
              </div>
              <>
                {show_structure_number && (
                  <div className="px2 py-2 row d-flex align-items-center">
                    <div className="vl" />
                    <div>
                      <TextField
                        label="Structure Number"
                        style={{ width: '156px' }}
                        required
                        type="text"
                        name={'structure'}
                        value={worker.structure}
                        onChange={(event) => this.onChange(event, index)}
                      />
                    </div>
                  </div>
                )}
                <div className="px2 py-2 row d-flex align-items-center ml-77">
                  <div className="vl" />
                  <div>
                    <TextField
                      label="Comment"
                      style={{ width: '240px' }}
                      name={'note'}
                      value={worker.note}
                      onChange={(event) => this.onChange(event, index)}
                    />
                  </div>
                </div>
              </>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
