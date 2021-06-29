import { withFormik } from 'formik';
import React from 'react';
import Geocode from 'react-geocode';
import { jobAPI } from '../../Services/API';
import jobStore from '../../Stores/jobStore';
import './JobCreate.scss';
import { JobCreateValidation } from './JobCreateValidation';
import JobFormComponent from './JobFormComponent';
import { JobType } from '../../Constants/job';
import confirmAlert from '../../Utils/confirmAlert';
import moment from 'moment';
import history from '../../history';
import { connect } from 'react-redux';
import { actions } from '../../Services';
import { toast } from 'react-toastify';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API_KEY);
Geocode.enableDebug();
export const default_location = {
  lat: 0,
  lng: 0,
  address: undefined,
  structure: '',
  start_time: '00:00',
  finish_time: '23:59',
  max_workers: 1,
};

const default_job = {
  ccUser: null,
  changesLog: null,
  comment: '',
  department: undefined,
  endTime: null,
  feeder: '',
  jobStatus: '',
  jobType: 1,
  location: undefined,
  locations: [default_location],
  municipality: undefined,
  po: '',
  poet: '',
  projectId: null,
  projectPo: null,
  projectTitle: null,
  receipt: '',
  requestDate: null,
  requestTime: '2021-03-12T17:20:02.908Z',
  requestor: undefined,
  requisition: '',
  section: undefined,
  structure: null,
  supervisor: undefined,
  uid: null,
  workers: [],
  wr: '',
  maxWorkers: undefined,
};

class JobCreateComponent extends React.Component<any, any> {
  duplicateJob: any = {};
  formSubmit: any = null;

  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      jobs: [],
    };
    this.state = {
      jobs: [],
    };
  }

  componentDidMount = () => {
    const { id } = this.props.match.params;
    if (id) {
      jobStore.getJob(id).then((job) => {
        job.requestTime = moment().format('YYYY-MM-DDTHH:mm:ss');
        job.department = {
          id: job.department,
          name: job.departmentName,
        };
        job.requestor = {
          id: job.requestor,
          name: job.requestorName,
        };
        job.supervisor = {
          id: job.supervisor,
          name: job.supervisorName,
        };
        let ccUsers = [];
        job.ccUser.forEach((cc_user) => {
          ccUsers.push({
            label: cc_user.name,
            value: cc_user,
          });
        });
        job.ccUser = ccUsers;
        this.setState({
          jobs: [job],
        });
        job.jobStatus = 0;
        job.status = 'new';
        this.props.setFieldValue('jobs', [job], false);
      });
    } else {
      default_job.requestTime = moment().format('YYYY-MM-DDTHH:mm:ss');
      default_job.locations = [default_location];
      this.setState(
        {
          jobs: [default_job],
        },
        () => {
          this.props.setFieldValue('jobs', this.state.jobs, false);
        }
      );
    }
  };

  componentWillUnmount(): void {
    default_job.requestTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    default_job.locations = [default_location];
    this.setState({
      jobs: [default_job],
    });
  }

  addNewJob = () => {
    default_job.locations = [default_location];
    this.setState({ jobs: [...this.state.jobs, default_job] });
  };

  removeJob(e) {
    const arr = [...this.state.jobs];
    const index = arr.indexOf(e.target.value);
    if (index !== -1) {
    }
    arr.splice(index, 1);
    this.setState({ jobs: arr });
  }

  onJobFormChange = (idx, name, value) => {
    let updated_jobs = this.state.jobs.map((job, index) => {
      if (idx === index) {
        return {
          ...job,
          [name]: value,
        };
      }
      return job;
    });

    this.setState({
      jobs: updated_jobs,
    });
    this.props.setFieldValue('jobs', updated_jobs, false);
    if (this.props.isValidating === true) {
      this.props.validateField(name);
    }
  };

  onSubmit = (event) => {
    event.preventDefault();
    let now = moment().subtract(2, 'hour').toDate(),
      requestTime = new Date(this.state.jobs[0].requestTime),
      canCreatePastDateJob = this.props.currentUser.roles.includes(8);

    if (now > requestTime) {
      if (canCreatePastDateJob) {
        this.checkDuplicateJob(event);
        //this.props.handleSubmit(event, this.state.jobs);
      } else {
        toast.error('You can\'t create job with past date', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      this.checkDuplicateJob(event);
      //this.props.handleSubmit(event, this.state.jobs);
    }
  };

  checkDuplicateJob = (event) => {
    const keys = Object.keys(this.duplicateJob);
    let duplicateJob = null;
    keys.forEach((key) => {
      if (this.duplicateJob[Number(key)])
        duplicateJob = {
          job: this.duplicateJob[Number(key)],
          index: Number(key),
        };
    });
    if (!duplicateJob) {
      this.props.handleSubmit(event, this.state.jobs);
    } else {
      const { job, index } = duplicateJob;
      const jobTypes = Object.keys(JobType);
      confirmAlert({
        title: `Potential duplicate job found:`,
        message: `${jobTypes[job.jobType + 3]} Conf #${job.confirmNumber} for ${
          job.maxWorkers
        } at ${job.locations[0].address} at ${moment(job.requestTime)
          .local()
          .format('M/D/YYYY HH:mm')} for ${job.departmentName} requested by ${
          job.requestorName
        }`,
        buttons: [
          {
            label: 'Cancel',
            onClick: (hideAlert) => {
              hideAlert();
            },
            btnType: 'success',
          },
          {
            label: 'Open Existing Job',
            onClick: (hideAlert) => window.open(`/job/${job.id}`, '_blank'),
            btnType: 'success',
          },
          {
            label: 'Submit Anyway',
            onClick: (hideAlert) => {
              this.setDuplicateJob(null, index);
              this.checkDuplicateJob(event);
              hideAlert();
            },
            btnType: 'primary',
          },
        ],
      });
    }
  };

  setDuplicateJob = (job, index) => {
    this.duplicateJob[index] = job;
  };

  goBack = () => {
    history.goBack();
  };

  onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  public render() {
    const { errors, touched, handleBlur } = this.props;

    return (
      <div
        className="JobCreate container-indent pt-4 pb-4"
        style={{
          height: '88%',
          overflowY: 'scroll',
        }}
      >
        <form className="template-wrapper" onKeyDown={this.onKeyDown}>
          {this.state.jobs.map((job, index) => {
            return (
              <React.Fragment key={`job-${index}`}>
                <JobFormComponent
                  onJobFormChange={this.onJobFormChange}
                  index={index}
                  job={job}
                  remove={true}
                  touchedSubmit={touched ? touched.createJob : false}
                  errors={errors}
                  handleBlur={handleBlur}
                  removeJob={(event) => this.removeJob(event)}
                  setDuplicateJob={this.setDuplicateJob}
                  can_edit_location={true}
                  isEdit={false}
                />
              </React.Fragment>
            );
          })}

          <div className=" d-flex justify-content-between ml-3 mr-3">
            <div className="row cursor-pointer" onClick={this.addNewJob}>
              <div className="add-another-job" />
              <div className="text-16 text-blue">Add Another Job</div>
            </div>

            <div className=" row">
              <button
                type="button"
                className="btn btn-dark btn-cancel height-46"
                onClick={this.goBack}
              >
                Cancel
              </button>
              <button
                className="btn btn-dark btn-add height-46 ml-5 btn-submit-create-job"
                type="submit"
                disabled={this.props.processing}
                style={{ backgroundColor: '#029bd8', borderColor: '#029bd8' }}
                onBlur={handleBlur}
                onClick={this.onSubmit}
              >
                {this.props.processing ? 'Loading' : 'Save Jobs'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const formatter = (array: any[]) =>
  array.map((item) => {
    if (item.requestor) {
      item.requestor = item.requestor.id;
    }
    if (item.supervisor) {
      item.supervisor = item.supervisor.id;
    }
    if (item.department) {
      item.department = item.department.id;
    }
    if (item.ccUser) {
      let ccUser = [];
      item.ccUser.map((_item) =>
        ccUser.push(_item.value ? _item.value.id : _item.id)
      );
      item.ccUser = [...ccUser];
    }
    return item;
  });

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    createJob: (data) => dispatch(actions.JobsActions.createJob(data)),
    uploadImages: (images) =>
      dispatch(actions.JobsActions.uploadImages(images)),
  };
}

function mapStateToProps(state) {
  return {
    processing: state.jobs.create_job_processing,
    job: state.jobs.job,
    currentUser: state.app.user,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withFormik({
    mapPropsToValues: (props: any) => {
      return {
        ...props,
      };
    },
    validationSchema: JobCreateValidation,

    handleSubmit: (values: any, { props }) => {
      return new Promise(async (resolve, reject) => {
        try {
          for (let i = 0; i < values.jobs.length; i++) {
            for (let x = 0; x < values.jobs[i].locations.length; x++) {
              let location = values.jobs[i].locations[x];
              if (location.images && location.images.length > 0) {
                const formData = new FormData();
                values.jobs[i].locations[x].images.forEach((image, index) =>
                  formData.append('images_' + index, image)
                );
                values.jobs[i].locations[x]['files'] = (
                  await jobAPI.uploadImages(formData)
                ).data;
              }
            }
          }
          const jobs = JSON.parse(JSON.stringify(values));
          const data = {
            jobs: formatter([...jobs.jobs]),
          };

          props.createJob(data).then((job) => {
            localStorage.removeItem('JobsTemp');
            localStorage.removeItem('duplicateJob');
            history.push(`/job/${job.id}`);
          });

          //
        } catch (e) {
          console.log(e);
          return reject();
        }
      });
    },
  })(JobCreateComponent)
);
