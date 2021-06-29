import React from 'react';
import jobStore from '../../Stores/jobStore';
import userStore from '../../Stores/userStore';
import CalendarComponent from '../Components/Calendars/Calendar.Component';
import { CalendarType } from '../Components/Calendars/CalendarType';
import * as CeIcon from '../../Utils/Icon';
import { observer } from 'mobx-react';
import { workerAPI } from '../../Services/API';
import AppointedJob from './Details/AppointedJob';
import WorkerSchedule from './WorkerSchedule/WorkerSchedule';
import WorkerEditComponent from './WorkerEdit';
import confirmAlert from '../../Utils/confirmAlert';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';


enum TabContent {
  TabAppointedJobs = 1,
  TabSchedule,
  TabEdit,
}

@observer
export class WorkerDetailsComponent extends React.Component<any> {
  tab = TabContent.TabAppointedJobs;

  componentDidUpdate = (prevProps) => {
    if(this.props.match.params.id !== prevProps.match.params.id) {
      userStore.loadUser(this.props.match.params.id);
    }
  }

  componentDidMount = () => {
    userStore.loadUser(this.props.match.params.id);
  };

  changeTab(tab) {
    this.tab = tab;
    this.setState({ change: true });
  }

  deleteWorker = () => {
    confirmAlert({
      title: `Confirm Delete Worker`,
      message: (
        <>
          <div>If you remove the worker, this worker will be removed from Subcontractor and Jobs, Timesheets.</div>
          <div>Are you sure to remove worker <strong>{userStore.user.name}</strong> permanently?</div>
        </>
      ),
      buttons: [
        {
          label: 'Yes',
          onClick: (hideAlert) => {
            this._deleteWorker(hideAlert);
          },
          btnType: 'danger'
        },
        {
          label: 'No',
          onClick: (hideAlert) => {
            hideAlert();
          }
        }
      ]
    });
  }

  _deleteWorker = async (callback) => {
    await workerAPI.delete(this.props.match.params.id)
    .then(res => {
      this.props.history.push('/workers');
    })
    .catch((error) => {
      toast.error(error.response.data.error, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
    });
    callback();
  };

  renderMenu() {
    return (
      <ul className="nav justify-content-between">
        <div className="d-flex">
          <li
            className={`nav-item ${
              this.tab === TabContent.TabAppointedJobs ? 'active' : ''
            }`}
            onClick={() => this.changeTab(TabContent.TabAppointedJobs)}
          >
            <span className="nav-link cursor-pointer">
              Appointed Jobs
            </span>
          </li>
          {/*<li
            className={`nav-item ${
              this.tab === TabContent.TabSchedule ? 'active' : ''
            }`}
            onClick={() => this.changeTab(TabContent.TabSchedule)}
          >
            <span className="nav-link cursor-pointer">
              Schedule
            </span>
          </li>*/}
          <li
            className={`nav-item ${
              this.tab === TabContent.TabEdit ? 'active' : ''
            }`}
            onClick={() => this.changeTab(TabContent.TabEdit)}
          >
            <span className="nav-link cursor-pointer">
              Profile
            </span>
          </li>
        </div>
        {this.props.permissions.includes('deactivate_workers')  &&
        <div className="d-flex align-items-center">
          <span className="nav-link cursor-pointer" onClick={this.deleteWorker}>
            <i className="fa fa-times mr-1"></i>Remove Worker
          </span>
        </div>
        }
      </ul>
    );
  }

  renderContentTabSchedule() {
    return <CalendarComponent typeOfCalendar={CalendarType.Worker} />;
  }

  renderContent(tab) {
    switch (tab) {
      case TabContent.TabAppointedJobs:
        return <AppointedJob />;
      case TabContent.TabSchedule:
        return (
          <WorkerSchedule
            typeOfCalendar={CalendarType.Worker}
            jobs={jobStore.projects}
            workerId={this.props.match.params.id}
          />
        );
      case TabContent.TabEdit:
        return <WorkerEditComponent />;
    }
  }

  public render() {

    return (
      <div className="d-flex App-content worker-details-page">
        <div className="col-left p-4">
          <div className="box-item-body shadow">
            <div className="d-flex align-items-center border-bottom px-3 py-4">
              <img
                alt="avatar"
                src={`${process.env.REACT_APP_API_ENDPOINT}${userStore.user.avatar}`}
                className="avatar mr-3"
              />
              <div>
                <div>{userStore.user.name}</div>
                <div>
                  <span className="badge badge-success badge-circle mr-2">
                    &nbsp;
                  </span>
                  Active
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="item-contact mb-2">
                <CeIcon.EnvelopeSolidIcon className="ce-mr-10" />
                {userStore.user.email}
              </div>
              <div className="item-contact mb-2">
                <CeIcon.PhonesolidIcon className="ce-mr-10" />
                {userStore.user.phoneNumber}
              </div>
              {userStore.user.subcontractorName ? (
                <div className="item-contact mb-2">
                  <CeIcon.UserSolidIcon className="ce-mr-10" />
                  {userStore.user.subcontractorName}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="col-right border-right" style={{
          maxHeight: '98vh'
          }}>
          {this.renderMenu()}
          <div className="border-menu mb-3"></div>
          {this.renderContent(this.tab)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    permissions: state.app.permissions
  }
}

export default connect(mapStateToProps, null)(WorkerDetailsComponent);
