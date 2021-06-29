import { withFormik } from 'formik';
import { observer } from 'mobx-react';
import React from 'react';
import Geocode from 'react-geocode';
import { jobAPI } from '../../Services/API';
import jobStore from '../../Stores/jobStore';
import './JobCreate.scss';
import { JobEditValidation } from './JobCreateValidation';
import history from '../../history';
import CircularProgress from '@material-ui/core/CircularProgress';
import JobFormComponent from './JobFormComponent';
import { connect } from 'react-redux';
import { actions } from '../../Services';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_AIP_KEY);
Geocode.enableDebug();

@observer
export class JobEdit extends React.Component<any, any> {
  state: any;
  times: any = {};

  constructor(props) {
    super(props);
    this.state = {
      job: null,
    };
  }

  // toggleAssign = () => {
  //   this.setState(state => ({ assign: !state.assign }));
  // };

  componentDidMount = () => {
    const { id } = this.props.match.params;
    if (id) {
      jobStore.getJob(id).then((job) => {
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
          job: job,
        });
        this.props.setValues(job);
      });
    }
  };

  handleChangeField(name) {
    return (event) => {
      let {
        currentTarget: { value, type, dataset },
      } = event;
      if (type === 'number' || dataset.type === 'number') {
        return this.props.setFieldValue(name, Number(value), false);
      }
      return this.props.setFieldValue(name, value, false);
    };
  }

  // delay = (ms: number) => new Promise(res => setTimeout(() => res(ms), ms));

  save = (event) => {
    event.preventDefault();

    this.props.handleSubmit(event);
  };

  handleChange = (idx, name, value) => {
    this.setState({
      job: {
        ...this.state.job,
        [name]: value,
      },
    });
    this.props.setFieldValue(name, value, false);
    if (this.props.isValidating === true) {
      this.props.validateField(name);
    }
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
    if (!this.state.job) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <CircularProgress color="primary" size={60} />
        </div>
      );
    }
    /*
        const {id, requestTime} = jobStore.job;
        if (!id) {
          return (<div style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex'
          }}><CircularProgress color="primary" size={60} /></div>)
        }
        const isJobStarted = requestTime && Date.parse(jobStore.job.requestTime.toString()) < Date.now();
    */
    const { errors, handleBlur } = this.props;

    return (
      <div
        className="JobCreate container-indent pt-4"
        style={{
          height: '90%',
          overflowY: 'scroll',
        }}
      >
        <div className="text-16">Edit Job</div>
        <form className="template-wrapper" onKeyDown={this.onKeyDown}>
          <JobFormComponent
            onJobFormChange={this.handleChange}
            job={this.state.job}
            index={0}
            errors={{ jobs: [errors] }}
            handleBlur={handleBlur}
            touchedSubmit={true}
            can_edit_location={false}
            isEdit={true}
          ></JobFormComponent>

          <div className=" d-flex justify-content-between ml-3 mr-3">
            <div className="row cursor-pointer">
              {/*<div className='add-another-job'/>*/}
              <div className="text-16 text-blue" />
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
                className="btn btn-dark btn-add height-46 ml-5"
                type="submit"
                disabled={this.props.processing}
                style={{ backgroundColor: '#029bd8', borderColor: '#029bd8' }}
                onBlur={handleBlur}
                onClick={this.save}
              >
                {this.props.processing ? 'Loading' : 'Update Job'}
              </button>
            </div>
          </div>
          <br />
          <br />
        </form>
      </div>
    );
  }
}

const formatter = (item: any) => {
  if (item.requestor) {
    item.requestor = item.requestor.id;
  }
  if (item.supervisor) {
    item.supervisor = item.supervisor.id;
  }
  if (item.department) {
    item.department = item.department.id;
  }
  return item;
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateJob: (id, data) => dispatch(actions.JobsActions.updateJob(id, data)),
    uploadImages: (images) =>
      dispatch(actions.JobsActions.uploadImages(images)),
  };
}

function mapStateToProps(state) {
  return {
    processing: state.jobs.update_job_processing,
    job: state.jobs.job,
    img_data: state.jobs.img_data,
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
    validationSchema: JobEditValidation,
    handleSubmit: (values: any, { props }) => {
      return new Promise(async (resolve, reject) => {
        try {
          for (let x = 0; x < values.locations.length; x++) {
            let location = values.locations[x];
            if (location.images && location.images.length > 0) {
              const newImages = values.locations[x].images.filter(
                (image) => typeof image !== 'string'
              );
              const oldImage = values.locations[x].images.filter(
                (image) => typeof image === 'string'
              );
              if (newImages.length > 0) {
                const formData = new FormData();
                newImages.forEach((image, index) => {
                  formData.append('images_' + index, image);
                });
                //props.uploadImages(formData);
                let newImagesUrl = (await jobAPI.uploadImages(formData)).data;
                values.locations[x].files = [...oldImage, ...newImagesUrl];
              } else {
                values.locations[x].files = oldImage;
              }
            } else {
              values.locations[x].files = [];
            }
          }

          if (values.ccUser) {
            values.ccUser = values.ccUser.map((item) => item.value.id);
          }
          
          props.updateJob(jobStore.job.id, formatter(values));
        } catch (e) {
          console.log(e);
          return reject();
        }
      });
    },
  })(JobEdit)
);


