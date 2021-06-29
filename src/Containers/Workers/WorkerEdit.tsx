import { withFormik } from 'formik';
import { createBrowserHistory } from 'history';
import React, { RefObject } from 'react';
import { workerAPI } from '../../Services/API';
import { WorkerEditValidation } from './WorkerValidation';
import SubcontractorAsyncSearch from '../Components/Controls/SubcontractorAsyncSearch';
import { ISelectItem } from '../Components/Controls/AsyncSelect';
import { WORKER_TYPE } from './Workers';
import ReactSelect from 'react-select';
import userStore from '../../Stores/userStore';
import { toast } from 'react-toastify';


class WorkerEditComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      workerTypesData: [],
    };
  }

  showImage = false;
  file: any;
  private readonly inputOpenFileRef: RefObject<HTMLInputElement> = React.createRef();

  // componentDidMount = () => {
  //   if (this.props.values && this.props.values.workerTypes) {
  //     const workerTypes = this.props.values.workerTypes;
  //     this.loadDefaultWorkersTypes(workerTypes);
  //   }
  // };

  // loadDefaultWorkersTypes = async (workerTypes) => {
  //   let data = [];
  //   for (let i = 0; i < WORKER_TYPE.length; i++) {
  //     const el = WORKER_TYPE[i];
  //     for (let j = 0; j < workerTypes.length; j++) {
  //       const item = workerTypes[j];
  //       if (el.value === item) {
  //         data.push(WORKER_TYPE[i]);
  //       }
  //     }
  //   }
  //   await this.setState({ workerTypesDefault: data });
  // };

  /*componentDidMount = () => {
   
      const id = JSON.parse(JSON.stringify(userStore.user)).subcontractor_id;
      console.log(JSON.parse(JSON.stringify(userStore.user)))
      this.loadSubcontractor(id);
      
  }

  loadSubcontractor = async (id) => {
    const index = this.props.subcontractors.findIndex(i => i.id === id);
    if(index === -1){
      return;
    }
    let subcontractor = this.props.subcontractors[index].subcontractor;
    console.log(subcontractor);
    await this.setState({ subcontractor: this.props.subcontractors[index].subcontractor });
  }*/

  handleChangeField(name) {
    return (event) => {
      const {
        currentTarget: { value },
      } = event;
      return this.props.setFieldValue(name, value);
    };
  }

  removeImage() {
    this.showImage = false;
    this.file = undefined;
    this.setState({ change: true });
    this.props.setFieldValue('avatar', undefined);
  }

  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click();
  };

  onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const blob = event.target.files[0];
    this.file = URL.createObjectURL(blob);
    this.showImage = true;
    this.inputOpenFileRef.current.value = '';
    this.setState({ change: true });
    this.props.setFieldValue('avatar', blob);
  }

  onSubcontractorSelected = (subcontractor: ISelectItem) => {
    if (!subcontractor) {
      this.props.setFieldValue('subcontractorId', '');
      this.props.setFieldValue('subcontractorName', null);
      return;
    }

    this.props.setFieldValue('subcontractorId', subcontractor.value.id);
    this.props.setFieldValue('subcontractorName', subcontractor.value.subcontractor.name);
  };

  // workerTypesDefault = (workerTypes) => {
  //   const workerTypesData = [];
  //   for (let i = 0; i < workerTypes.length; i++) {
  //     const el = workerTypes[i];
  //     workerTypesData.push(WORKER_TYPE[i]);
  //   }

  //   this.setState({ workerTypesData: workerTypesData });
  //   return workerTypesData;
  // };

  onTypeSelect = (items) => {
    if (items && items.length > 0) {
      this.props.setFieldValue(
        'workerTypes',
        items.map((item) => Number(item.value))
      );
    } else {
      this.props.setFieldValue('workerTypes', []);
    }
  };

  getWorkerTypes = () => {
    let types = this.props.values.workerTypes;
    if (this.props.values.workerTypes.some((r) => [1, 2, 3].includes(r))){
      types = this.props.values.workerTypes.map(type => WORKER_TYPE.find(t => t.value === type));
    }
    return types;
  }

  public render() {
    const { errors, touched, handleBlur, handleSubmit } = this.props;
    // const { workerTypesData } = this.state;
    return (
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="container worker-create-page">
          <div className="page-header">
            <div className="page-title">Edit Worker</div>
          </div>
          <div className="box-item-body">
            <input
              type="file"
              id="file"
              ref={this.inputOpenFileRef}
              style={{ display: 'none' }}
              onChange={this.onChangeFile.bind(this)}
            />
            {this.showImage ? (
              <div
                className="view-feature-image"
                style={{ backgroundImage: `url(${this.file})` }}
                onClick={() => this.showOpenFileDlg()}
              >
                <div
                  className="remove-feature-image d-flex"
                  onClick={() => this.removeImage()}
                >
                  <i className="fa fa-times m-auto"></i>
                </div>
              </div>
            ) : (
              <div
                className="feature-image d-flex"
                onClick={() => this.showOpenFileDlg()}
              >
                {/* <i className="fa fa-camera m-auto"></i> */}
              </div>
            )}
            <p className="error">{errors.avatar}</p>
            <div className="row mt-3">
              <div className="form-group col-sm-4">
                <label className="d-block">Name</label>
                <input
                  className="ce-form-control"
                  placeholder="First name Last Name"
                  value={this.props.values.name}
                  name="name"
                  onBlur={handleBlur}
                  onChange={this.handleChangeField('name')}
                />
                {touched.name && errors.name && (
                  <p className="error">{errors.name}</p>
                )}
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block">Email</label>
                <input
                  className="ce-form-control"
                  placeholder="Email"
                  // value={userData && userData.email || ''}
                  value={this.props.values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={this.handleChangeField('email')}
                />
                {touched.email && errors.email && (
                  <p className="error">{errors.email}</p>
                )}
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block">Phone Number</label>
                <input
                  className="ce-form-control"
                  placeholder="+X (XXX) XXX XXXX"
                  // value={userData && userData.phoneNumber || ''}
                  value={this.props.values.phoneNumber}
                  name="phoneNumber"
                  onBlur={handleBlur}
                  onChange={this.handleChangeField('phoneNumber')}
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <p className="error">{errors.phoneNumber}</p>
                )}
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-4">
                <label className="d-block">Worker Types</label>
                {/* <ReactSelect
                  defaultValue={ReactSelect}
                  // defaultInputValue={workerTypesData}
                  // onChange={this.onTypeSelect}
                  placeholder="All Type"
                  options={WORKER_TYPE}
                  isMulti
                /> */}
                <ReactSelect
                  defaultValue={this.getWorkerTypes()}
                  isMulti
                  name="colors"
                  options={WORKER_TYPE}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={this.onTypeSelect}
                />
                {touched.workerTypes && errors.workerTypes && (
                  <p className="error">{errors.workerTypes}</p>
                )}
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block">Subcontractor</label>
                <SubcontractorAsyncSearch
                  isClearable
                  /*defaultValue={
                    this.state && this.state.subcontractor 
                  }*/
                  defaultInputValue={
                    (this.props.values &&
                      this.props.values &&
                      this.props.values.subcontractorName) ||
                    ''
                  }
                  onSelect={(subcontractor: ISelectItem) =>
                    this.onSubcontractorSelected(subcontractor)
                  }
                />
                <p className="error">{errors.subcontractor}</p>
                <p className="error">{errors.subcontractorId}</p>
              </div>

              <div className="form-group col-sm-4">
                <label className="d-block">Password</label>
                <input
                  autoComplete="new-password"
                  type="password"
                  name="password"
                  className="ce-form-control"
                  onChange={this.handleChangeField('password')}
                />
                {touched.password && errors.password && (
                  <p className="error">{errors.password}</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 d-flex justify-content-end page-action-bottom">
            <button type="submit" className="btn btn-success btn-add">
              Change
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default withFormik({
  mapPropsToValues: () => ({
    name: `${(userStore && userStore.user && userStore.user.firstName) || ''} ${
      (userStore && userStore.user && userStore.user.lastName) || ''
    }`,
    email: (userStore && userStore.user && userStore.user.email) || '',
    phoneNumber:
      (userStore && userStore.user && userStore.user.phoneNumber) || '',
    subcontractorId:
      (userStore && userStore.user && userStore.user.subcontractorInfo) || '',
    subcontractorName:
      (userStore &&
        userStore.user &&
        userStore.user.subcontractorName ) ||
      '', 
    avatar: (userStore && userStore.user && userStore.user.avatar) || '',
    firstName: (userStore && userStore.user && userStore.user.firstName) || '',
    lastName: (userStore && userStore.user && userStore.user.lastName) || '',
    workerTypes:
      (userStore && userStore.user && userStore.user.workerTypes) || [],
    workerTypesDefault:
      (userStore && userStore.user && userStore.user.workerTypesDefault) || [],
  }),
  validationSchema: WorkerEditValidation,
  handleSubmit: async (values, { props }) => {
    const name = values.name.split(' ');
    values.firstName = name[0];
    values.lastName = name[1];

    await workerAPI
      .update(userStore.user.id, values)
      .then((res) => {
          if (res.status === 200) 
            toast.success('Worker was updated!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            userStore.updateUserLocal(res.data.worker);
        //createBrowserHistory({ forceRefresh: true }).push('/workers');
      })
      .catch((err) => {
        toast.error(err.response.data.error, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  },
})(WorkerEditComponent);
