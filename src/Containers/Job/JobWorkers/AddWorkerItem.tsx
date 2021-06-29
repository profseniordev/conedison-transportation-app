import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { AssignWorker } from '../../../Models';
import * as CeIcon from '../../../Utils/Icon';
import SubcontractorAsyncSearch from '../../Components/Controls/SubcontractorAsyncSearch';
import CheckboxComponent from '../../Components/Controls/Checkbox.Component';
// import DateComponent from '../../Components/Date/Date.Component';
import moment from 'moment';
import { JobListItem } from '../../../Models/jobListItem';
import { WorkerAsyncSearch } from '../../Components/Controls/WorkerAsyncSearch';
import {
  FormControl,
  MenuItem,
  Select as MaterialSelect,
  TextField,
} from '@material-ui/core';

interface Props {
  assignWorker: AssignWorker;
  index: number;
  lastIndex: boolean;
  removeWorker: Function;
  handleChangeField: Function;
  selectedDate: any;
  job: JobListItem;
  errors: any;
}

@observer
class AddWorkerItem extends Component<Props> {
  state = {
    subcontractor: null,
    onlyAvailable: false,
  };

  componentDidMount() {
    const {
      index,
      handleChangeField,
      job,
      selectedDate,
      assignWorker,
    } = this.props;
    if (!assignWorker.startDate) {
      let date = moment
        .max([
          moment(job.requestTime),
          moment(selectedDate.id, 'YYYYMMDD'),
          moment(),
        ])
        .toDate();
      if (job.endTime) {
        date = moment.min([moment(date), moment(job.endTime)]).toDate();
      }
      handleChangeField(index, 'startDate', date);
    }
  }

  handleSelectSubcontractor = (item) => {
    const props = this.props;
    props.handleChangeField(props.index, 'worker', null);
    this.setState({ subcontractor: item ? item.value : null });
  };

  handleChangeOnlyAvailable = (checked) => {
    const { assignWorker, handleChangeField, index } = this.props;

    if (
      checked &&
      assignWorker.worker &&
      !this.checkWorkerAvailability(assignWorker.worker)
    ) {
      handleChangeField(index, 'worker', null);
    }
    this.setState({ onlyAvailable: checked });
  };

  checkWorkerAvailability = (worker) => {
    const { assignWorker } = this.props;

    const startTime = assignWorker.startDate
      ? moment(assignWorker.startDate).format('H:m').split(':')
      : null;
    const _startTime = startTime
      ? Number(startTime[0]) * 60 + Number(startTime[1])
      : null;

    let available = false;
    worker.workingHours.forEach((workingHour) => {
      const begin =
        Number(workingHour.begin.hour) * 60 + Number(workingHour.begin.minute);
      const end =
        Number(workingHour.end.hour) * 60 + Number(workingHour.end.minute);
      if (begin <= _startTime && end >= _startTime) available = true;
    });
    if (!worker.isActive || !worker.isApproved) {
      available = false;
    }
    return available;
  };

  handleChangeStartDate = (date) => {
    const { onlyAvailable } = this.state;
    const { assignWorker, handleChangeField, index } = this.props;

    handleChangeField(index, 'startDate', date);

    if (
      onlyAvailable &&
      assignWorker.worker &&
      !this.checkWorkerAvailability(assignWorker.worker)
    ) {
      handleChangeField(index, 'worker', null);
    }
  };

  handleChangeEndDate = (date) => {
    this.props.handleChangeField(this.props.index, 'endDate', date);
  };

  getError = (pair: [number, string][]) => {
    const key = pair.reduce((errorKey: string, [idx, key]) => {
      errorKey += `[${idx}].${key}`;
      return errorKey;
    }, '');
    if (!this.props.errors) return null;
    return this.props.errors[key];
  };

  public render() {
    const props = this.props;
    const state = this.state;

    const inputProps = {
      max: props.assignWorker.endDate
        ? moment(props.assignWorker.endDate).format('YYYY-MM-DDThh:mm')
        : null,
      min: props.assignWorker.startDate
        ? moment(props.assignWorker.startDate).format('YYYY-MM-DDThh:mm')
        : null,
    };
    return (
      <div
        className={props.lastIndex ? 'worker-row-item-last' : 'worker-row-item'}
        key={`worker-${props.index}`}
      >
        <div className="ce-assign-worker ce-pd-20">
          <div className="ce-assign-worker-action">
            <img
              src={CeIcon.TrashIconB}
              width={12.6}
              height={14}
              className="ce-mr-10 cursor-pointer"
              alt=""
              onClick={() => {
                props.removeWorker(props.index);
              }}
            />
            <span className="cursor-pointer">Delete</span>
          </div>
          <div className="">
            <span className="ce-title">Subcontractor</span>
            <SubcontractorAsyncSearch
              placeholder="Select Subcontractor"
              onSelect={this.handleSelectSubcontractor}
              value={
                state.subcontractor
                  ? {
                      label: state.subcontractor.subcontractor.name,
                      value: state.subcontractor,
                    }
                  : null
              }
            />
          </div>
          <div className="ce-assign-worker-record mb-10">
            <span className="ce-title">Worker</span>
            <WorkerAsyncSearch
              onSelect={(item) =>
                props.handleChangeField(
                  props.index,
                  'worker',
                  item ? item.value : null
                )
              }
              isClearable
              defaultValue={
                props.assignWorker.worker
                  ? !state.onlyAvailable ||
                    (state.onlyAvailable &&
                      this.checkWorkerAvailability(props.assignWorker.worker))
                    ? {
                        label: props.assignWorker.worker.name,
                        value: props.assignWorker.worker,
                      }
                    : null
                  : null
              }
              searchParams={{
                status: state.onlyAvailable ? 'available' : null,
                startDate:
                  props.assignWorker && props.assignWorker.startDate
                    ? props.assignWorker.startDate
                    : null,
                subcontractorId: state.subcontractor
                  ? state.subcontractor.id
                  : null,
              }}
            />
            <p className="error">{this.getError([[props.index, 'worker']])}</p>
          </div>
          <CheckboxComponent
            checked={state.onlyAvailable}
            onChange={this.handleChangeOnlyAvailable}
            id="checkboxOnlyAvailable"
            hasTitle="Show only available workers"
          />
          <div className="ce-assign-worker-record work-time">
            <div className="work-time-start-date">
              {/*<DateComponent*/}
              {/*  hasTitle="Start Date"*/}
              {/*  showTimeSelect*/}
              {/*  maxDate={props.assignWorker.endDate ? new Date(props.assignWorker.endDate) : null}*/}
              {/*  minDate={props.assignWorker.startDate ? new Date(props.assignWorker.startDate) : null}*/}
              {/*  date={props.assignWorker.startDate ? new Date(props.assignWorker.startDate) : null}*/}
              {/*  onChange={this.handleChangeStartDate}*/}
              {/*  noDefault={true}*/}
              {/*/>*/}
              <TextField
                label="Start Date"
                type="datetime-local"
                variant={'outlined'}
                value={
                  props.assignWorker.startDate
                    ? moment(props.assignWorker.startDate).format(
                        'YYYY-MM-DDThh:mm'
                      )
                    : null
                }
                onChange={(date) =>
                  this.handleChangeStartDate(date.target.value)
                }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={inputProps}
              />
              <p className="error">
                {this.getError([[props.index, 'startDate']])}
              </p>
            </div>
            <div className="work-time-start-date">
              <TextField
                type="datetime-local"
                variant={'outlined'}
                value={
                  props.assignWorker.endDate
                    ? moment(props.assignWorker.endDate).format(
                        'YYYY-MM-DDThh:mm'
                      )
                    : null
                }
                onChange={(date) => this.handleChangeEndDate(date.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={inputProps}
              />
              {/*<DateComponent*/}
              {/*  hasTitle="End Date"*/}
              {/*  showTimeSelect*/}
              {/*  maxDate={props.assignWorker.endDate ? new Date(props.assignWorker.endDate) : null}*/}
              {/*  minDate={props.assignWorker.startDate ? new Date(props.assignWorker.startDate) : null}*/}
              {/*  date={props.assignWorker.endDate ? new Date(props.assignWorker.endDate) : null}*/}
              {/*  onChange={this.handleChangeEndDate}*/}
              {/*  noDefault={true}*/}
              {/*/>*/}

              <p className="error">
                {this.getError([[props.index, 'startDate']])}
              </p>
            </div>
          </div>
          <div className="ce-assign-worker-record work-location-list">
            {Array.isArray(props.job.locations) ? (
              <div key={`location-${props.index}`}>
                <div className="work-time-start-time">
                  <FormControl variant={'outlined'} style={{ marginTop: 10 }}>
                    <fieldset>
                      <legend>
                        {' '}
                        <span className="ce-title-custom">Location</span>{' '}
                      </legend>
                      <MaterialSelect
                        label="Location"
                        labelId="a-select-location-label"
                        id="select-worker-input"
                        value={
                          props.assignWorker.location
                            ? props.assignWorker.location
                            : ''
                        }
                        onChange={(event) =>
                          props.handleChangeField(
                            props.index,
                            'location',
                            event.target.value
                          )
                        }
                        style={{ width: '100%' }}
                      >
                        {props.job.locations.map((location, index) => {
                          return (
                            <MenuItem value={location} key={index}>
                              {location.address}
                            </MenuItem>
                          );
                        })}
                      </MaterialSelect>
                    </fieldset>
                  </FormControl>
                  {/*              <DropdownComponent
                                onSelect={(location: any) => {
                                  props.handleChangeField(props.index, 'location', location);
                                }}
                                displayName={'address'}
                                displayValue={'address'}
                                placeHolder="Select Location"
                                sources={props.job.locations}
                                //selected={location.address !== undefined ? item.location : undefined}
                              />*/}
                  {/*<Select
                    onChange={(location: any) => {
                      props.handleChangeField(props.index, 'location', location);
                    }}
                    defaultInputValue={
                      props.assignWorker.location && props.assignWorker.location.address
                    }
                    placeholder="Select Location"
                    options={props.job.locations.map((location) => ({
                      label: location.address,
                      value: location, 
                    }))}
                  />*/}
                </div>
                <p className="error">
                  {this.getError([[props.index, 'location.address']])}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default AddWorkerItem;
