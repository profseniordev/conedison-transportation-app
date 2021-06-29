import React from 'react';

import './sidemenu.scss';

import { AssignWorker } from '../../../Models/assignWorker';
import DateComponent from '../Date/Date.Component';

import * as CeIcon from '../../../Utils/Icon';
import { LocationItem } from '../../../Models/locationItem';

interface Props {
  showed: boolean;
  closeSlide: Function;
}

export class ApointJobSliderComponent extends React.Component<Props> {
  workers: Array<AssignWorker>;
  constructor(props: any) {
    super(props);
    this.workers = new Array<AssignWorker>();

    const location = new LocationItem();

    this.workers.push({
      location,
    } as AssignWorker);

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.showed === false) {
      this.workers = new Array<AssignWorker>();
      const location = new LocationItem();
      this.workers.push({
        location,
      } as AssignWorker);
    }
  }
  addWorker() {
    const location = new LocationItem();
    this.workers.push({
      location,
    } as AssignWorker);
  }
  onRemove(index: number) {
    this.workers.splice(index, 1);
    this.setState({ change: true });
  }
  public render() {
    return (
      <div className={'slide-container ' + (this.props.showed ? 'showed' : '')}>
        <div className="slide-content">
          <div className="slide-header d-flex align-items-center justify-content-between">
            <div className="slide-title justify-content-start">
              <div className="slide-date">04/04/2019</div>
              <div className="slide-number">2 Jobs</div>
            </div>
            <div className="cursor-pointer p-1">
              <CeIcon.Close
                height="14"
                width="14"
                onClick={() => {
                  this.props.closeSlide();
                }}
              ></CeIcon.Close>
            </div>
          </div>
          <div className="slide-body">
            {this.workers.map((item, index) => (
              <div
                className={
                  index === this.workers.length - 1
                    ? 'worker-row-item-last'
                    : 'worker-row-item'
                }
              >
                <div className="ce-assign-worker">
                  <div className="ce-pd-20">
                    <div className="ce-align-flex ">
                      <div>
                        <span>Parking</span>
                        <span className="ce-ml-10">123456</span>
                      </div>
                      <div>
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            this.onRemove(index);
                          }}
                        >
                          <img src={CeIcon.TrashIcon} className="ce-mr-10" alt=""/>
                          Delete
                        </span>
                      </div>
                    </div>

                    <div className="ce-pd-top-20">
                      <img src={CeIcon.MapPinIconPNG} className="ce-mr-10" alt=""/>
                      2569 Land Park Dr, Sacramento, CA 95818
                    </div>
                  </div>

                  {/* <div className="ce-flex">
                    <div className="side-time-left ce-d-flex">
                      <div className="ce-assign-worker-item-header">
                        <span>Scheduled time</span>
                      </div>
                      <div className="ce-flex ce-pd-20">
                        <DateComponent hasTitle="Start Date" />
                        <span className="m-2"> </span>
                        <CETextInputComponent
                          className="ce-time-input"
                          title="Start Time"
                        />
                      </div>
                    </div>
                    <div className="side-time-right ce-ml-10 ce-d-flex">
                      <div className="ce-assign-worker-item-header">
                        <span>Actual Time</span>
                      </div>
                      <div className="ce-flex ce-pd-tb ">
                        <CETextInputComponent
                          className="ce-time-input"
                          title="Start Time"
                        />

                        <span className="m-2 ce-pd-top-20"> - </span>
                        <CETextInputComponent
                          className="ce-time-input"
                          title="End Time"
                        />
                      </div>
                    </div>
                  </div> */}
                  <div>
                    <div className="ce-assign-worker-item-header">
                      <span>Scheduled time</span>
                    </div>
                    <div className="ce-assign-worker-item-schedule">
                      <div className="work-time-start-date">
                        <DateComponent hasTitle="Start Date" />
                      </div>
                      <div>
                        <span className="ce-title">Start Time</span>
                        <div className="work-time-start-time">
                          <div className="ce-form-control">
                            <input className="ce-input-control"/>
                          </div>
                          <div className="cursor-pointer ce-ml-10">
                            <img src={CeIcon.BtnPlus} onClick={() => { }} alt=""/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="ce-pd-left-20 ce-pd-bottom-20 cursor-pointer">
                    <CeIcon.FileIcon /> Open Timesheet
                  </div> */}
                </div>
              </div>
            ))}
            <div className="worker-action">
              <div className="ce-assign-worker-record">
                <span
                  className="btn ce-btn-confirm cursor-pointer"
                  onClick={() => {
                    const location = new LocationItem();
                    this.workers.push({
                      location,
                    } as AssignWorker);
                    this.setState({ change: true });
                  }}
                >
                  <span>Add Another Job</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
