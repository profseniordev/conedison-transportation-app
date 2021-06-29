import React from 'react';
import Search from '../../Images/search.png';
import CEModal from '../Components/Modal/Modal.Component';
import { WorkerAsyncSearch } from '../Components/Controls/WorkerAsyncSearch';
import { actions } from '../../Services';
import { PagingComponent } from '../Components';
import mainStore from '../../Stores/mainStore';
import { subcontractorsAPI, workerAPI } from '../../Services/API';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { CreateSubcontractorValidation } from './subcontractorValidation';
import Select from 'react-select';

class Subcontractors extends React.Component<any | any> {
  isToggleModal: boolean;
  colSpan = 7;
  details = {} as any;
  searchEnable = false;
  timer = null;
  state = {
    searchParams: {},
    isShowEdit: false,
    dataEdit: null,
    worker: null,
    workers: [],
    workersDefault: [],
    workersList: [],
  };

  showModalEdit = () => {
    this.setState({ isShowEdit: !this.state.isShowEdit });
  };

  showModal() {
    this.isToggleModal = true;
    this.setState({ change: true });
  }

  closeModal = () => {
    this.isToggleModal = false;
    this.setState({ change: true });
  };

  toggleDetails(name) {
    this.details[name] = !this.details[name];
    this.setState({ change: true });
  }

  renderDetailWorker(workers) {
    if (!workers || workers.length === 0) return '';
    return (
      <div className="row ml-0 mr-0">
        {workers.map((worker, index) => (
          <div key={(worker && worker.id) || ''} className="view-name-worker">
            <span>{(worker && worker.name) || ''}</span>
          </div>
        ))}
      </div>
    );
  }

  handleChangeField(name) {
    return (event) => {
      const {
        currentTarget: { value },
      } = event;
      return this.props.setFieldValue(name, value);
    };
  }

  handleChangeFieldEdit = (name) => {
    return (event) => {
      const {
        currentTarget: { value },
      } = event;
      const { subcontractor } = this.state.dataEdit;
      this.setState({
        dataEdit: { ...this.state.dataEdit, [name]: value },
      });
      /*if (name === 'companyName') {
        this.setState({
          dataEdit: { ...this.state.dataEdit, [name]: value },
        });
      } else {
        subcontractor[name] = value;
        this.setState({
          dataEdit: { ...this.state.dataEdit, subcontractor },
        });
      }*/
    };
  };

  handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    this.setState(
      (state: any) => ({
        searchParams: { ...state.searchParams, [name]: value },
      }),
      this.loadSubcontractorsWithDelay
    );
  };

  loadSubcontractorsWithDelay = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(this.loadSubcontractors, 700);
  };

  componentDidMount = async () => {
    this.loadSubcontractors();
    this.loadDataWorkers();
  };

  loadDataWorkers = async () => {
    const response: any = await workerAPI.loadAllWorkers({
      ...this.state.searchParams,
    });

    if (response.data) {
      console.log('response.data.results', response.data.results);

      const workers = response.data.results.map((worker: any) => ({
        label: worker.name,
        value: worker,
      }));
      this.setState({ workersList: workers });
    }
  };

  loadSubcontractors = (params: any = this.state.searchParams) => {
    mainStore.loadSubcontractors(params);
  };

  onPaginationChange = (page: number) => {
    this.setState(
      (state: any) => ({ searchParams: { ...state.searchParams, page } }),
      this.loadSubcontractorsWithDelay
    );
  };

  /*handleSubmit = (values) => {
    this.props.createSubcontractor(values);
    this.closeModal();
  };*/

  handleEdit = (
    id,
    item,
    companyName,
    workers,
    workerIds,
    firstName,
    lastName,
    email,
    phoneNumber
  ) => {
    this.setState({
      isShowEdit: true,
      dataEdit: {
        id,
        subcontractor: item,
        companyName,
        workers,
        workerIds,
        firstName,
        lastName,
        email,
        phoneNumber,
      },
    });
    this.loadDefaultWorkers(workers);
  };

  loadDefaultWorkers = (workers) => {
    let data = [];

    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
      let val = JSON.stringify(worker);
      const obj = JSON.parse(val);

      console.log(obj);

      data.push({
        label: obj.name,
        value: obj,
      });
    }
    this.setState({ workersDefault: data });
  };

  onWorkerSelect = (workers) => {
    // this.setState({ workers: workers ? workers : [] });
    if (!workers) {
      this.props.setFieldValue('workersIds', null);
      return;
    }
    this.props.setFieldValue('workersIds', workers);
  };

  handleSelectWorkers = (workers) => {
    if (!workers) {
      this.setState({
        workers: workers,
      });
      return;
    }
    this.setState({
      workers: workers,
    });
  };

  submitSubcontractor = () => {
    this.props.handleSubmit();
    this.closeModal();
    this.loadSubcontractorsWithDelay();
  };

  handleUpdateSub = async () => {
    const { dataEdit, workers } = this.state;
    const ids = [];
    for (let i = 0; i < this.state.workersDefault.length; i++) {
      const el = this.state.workersDefault[i];
      ids.push(el.value.id);
    }
    for (let i = 0; i < workers.length; i++) {
      const el = workers[i];
      ids.push(el.value.id);
    }
    const update = await subcontractorsAPI
      .update(dataEdit.id, {
        ...dataEdit.subcontractor,
        companyName: dataEdit.companyName,
        firstName: dataEdit.firstName,
        lastName: dataEdit.lastName,
        email: dataEdit.email,
        phoneNumber: dataEdit.phoneNumber,
        workerIds: ids,
      })
      .then((res) => {
        toast.success('Subconstructor was updated!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.props.retrieve();
        this.setState({ isShowEdit: false });
      })
      .catch((err) => {
        toast.success('Updated subconstructor error!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.setState({ isShowEdit: false });
      });
  };

  render() {
    const thNoBorderRight = {
      borderRight: 'none',
    };

    const props = this.props;
    const subcontractors = props.subcontractors;

    return (
      <div className="container sub-contractor-page">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">Subcontractors</div>
          <button
            type="button"
            className="btn btn-success btn-add"
            onClick={() => this.showModal()}
          >
            Add New
          </button>
        </div>
        <CEModal
          show={this.isToggleModal}
          onClose={() => this.closeModal()}
          header="Add New Subcontractor"
          size="ce-modal-content"
        >
          {/* <form autoComplete={'off'} onSubmit={this.props.handleSubmit}> */}
          <form autoComplete={'off'}>
            <div className="form-group">
              <label className="d-block" htmlFor="firstName">
                First Name
              </label>
              <input
                onChange={this.handleChangeField('firstName')}
                className="ce-form-control"
                id="firstName"
                name="firstName"
                placeholder="Enter First Name"
              />
              <p className="error">{this.props.errors.firstName}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="lastName">
                Last Name
              </label>
              <input
                onChange={this.handleChangeField('lastName')}
                className="ce-form-control"
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name"
              />
              <p className="error">{this.props.errors.lastName}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="email">
                Email
              </label>
              <input
                onChange={this.handleChangeField('email')}
                className="ce-form-control"
                id="email"
                name="email"
                placeholder="Enter Email"
              />
              <p className="error">{this.props.errors.email}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="companyName">
                Company Name
              </label>
              <input
                onChange={this.handleChangeField('companyName')}
                className="ce-form-control"
                id="companyName"
                name="companyName"
                placeholder="Enter Company Name"
              />
              <p className="error">{this.props.errors.companyName}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                onChange={this.handleChangeField('phoneNumber')}
                className="ce-form-control"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+X (XXX) XXX XXXX"
              />
            </div>
            <p className="error">{this.props.errors.phoneNumber}</p>
            <div className="form-group">
              <label className="d-block">Worker(s)</label>
              <WorkerAsyncSearch
                isMulti
                onSelect={(worker) => this.onWorkerSelect(worker)}
              />
              <p className="error">{this.props.errors.department}</p>
            </div>
            <div className="text-center mt-4 mb-2">
              <button
                type="submit"
                className="btn btn-primary btn-add w-100"
                onClick={this.submitSubcontractor}
              >
                Add
              </button>
            </div>
          </form>
        </CEModal>

        <div className="table-invoices">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th className="th-search">ID</th>
                <th className="th-search">
                  <span>First Name</span>
                  <div className="ce-search-control">
                    <input
                      name={'firstName'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
                <th className="th-search">
                  <span>Last Name</span>
                  <div className="ce-search-control">
                    <input
                      name={'lastName'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
                <th className="th-search">
                  <span>Email</span>
                  <div className="ce-search-control">
                    <input
                      name={'email'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
                <th className="th-search">
                  <span>Phone Number</span>
                  <div className="ce-search-control">
                    <input
                      name={'phoneNumber'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
                <th style={thNoBorderRight} className="th-search">
                  <span>Workers</span>
                  <div className="ce-search-control">
                    <input
                      name={'workers'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
                <th style={thNoBorderRight} className="th-search">
                  <span>
                    Company Name{' '}
                    <img className="cursor-pointer" src={Search} alt="" />
                  </span>
                  <div className="ce-search-control">
                    <input
                      name={'companyName'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(subcontractors) &&
                subcontractors.length > 0 &&
                subcontractors.map((subcontractor) => {
                  console.log(subcontractor);

                  return (
                    <tr
                      style={{ cursor: 'pointer' }}
                      key={subcontractor.id}
                      onClick={() =>
                        this.handleEdit(
                          subcontractor.id,
                          subcontractor.subcontractor,
                          subcontractor.subcontractor.subcontractorName,
                          subcontractor.workers,
                          subcontractor.workerIds,
                          subcontractor.subcontractor.firstName,
                          subcontractor.subcontractor.lastName,
                          subcontractor.subcontractor.email,
                          subcontractor.subcontractor.phoneNumber
                        )
                      }
                    >
                      <td>{subcontractor.id}</td>
                      <td>
                        {subcontractor.subcontractor
                          ? subcontractor.subcontractor.firstName
                          : ''}
                      </td>
                      <td>
                        {subcontractor.subcontractor
                          ? subcontractor.subcontractor.lastName
                          : ''}
                      </td>
                      <td>
                        {subcontractor.subcontractor
                          ? subcontractor.subcontractor.email
                          : ''}
                      </td>
                      <td>
                        {' '}
                        {subcontractor.subcontractor
                          ? subcontractor.subcontractor.phoneNumber
                          : ''}
                      </td>
                      <td>
                        <span
                          className="cursor-pointer view-details p-2"
                          onClick={() => this.toggleDetails(subcontractor.id)}
                        >
                          {subcontractor.workers.length}
                        </span>
                      </td>
                      <td style={thNoBorderRight}>
                        {subcontractor.companyName}
                      </td>
                    </tr>
                    /*              <tr
              // hidden={
              // !(this.details && this.details[subcontractor.id])
            // }
              className="sub-details"
                  >
                  <td colSpan={this.colSpan}>
                  {this.renderDetailWorker(workers || [])}
                  </td>
            </tr>*/
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="pagination-invoices">
          <PagingComponent
            totalItemsCount={mainStore.subcontractorsLoader.total}
            onChangePage={this.onPaginationChange}
          />
        </div>
        {
          //this.isToggleModal && (
          /*<AddSubcontractorDialog
            data={this.state.dataEdit}
            open={this.isToggleModal}
            onClose={this.closeModal}
            submit={this.handleSubmit}
          />*/
          //)
        }
        <CEModal
          show={this.state.isShowEdit}
          onClose={() => this.showModalEdit()}
          header="Edit Subcontractor"
          size="ce-modal-content"
        >
          <form onSubmit={this.props.handleSubmit}>
            <div className="form-group">
              <label className="d-block" htmlFor="firstName">
                First Name
              </label>
              <input
                onChange={this.handleChangeFieldEdit('firstName')}
                className="ce-form-control"
                id="firstName"
                name="firstName"
                placeholder="Enter First Name"
                value={
                  (this.state.dataEdit && this.state.dataEdit.firstName) || ''
                }
              />
              {/* <p className="error">{errors.firstName}</p> */}
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="lastName">
                Last Name
              </label>
              <input
                onChange={this.handleChangeFieldEdit('lastName')}
                className="ce-form-control"
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name"
                value={
                  (this.state.dataEdit && this.state.dataEdit.lastName) || ''
                }
              />
              {/* <p className="error">{errors.lastName}</p> */}
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="email">
                Email
              </label>
              <input
                onChange={this.handleChangeFieldEdit('email')}
                className="ce-form-control"
                id="email"
                name="email"
                placeholder="Enter Email"
                value={(this.state.dataEdit && this.state.dataEdit.email) || ''}
              />
              {/* <p className="error">{errors.email}</p> */}
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="companyName">
                Company Name
              </label>
              <input
                onChange={this.handleChangeFieldEdit('companyName')}
                className="ce-form-control"
                name="companyName"
                placeholder="Enter Company Name"
                value={
                  (this.state.dataEdit && this.state.dataEdit.companyName) || ''
                }
              />
              {/* <p className="error">{errors.companyName}</p> */}
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                onChange={this.handleChangeFieldEdit('phoneNumber')}
                className="ce-form-control"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+X (XXX) XXX XXXX"
                value={
                  (this.state.dataEdit && this.state.dataEdit.phoneNumber) || ''
                }
              />
              {/* <p className="error">{errors.phoneNumber}</p> */}
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="phoneNumber">
                Workers
              </label>
              <Select
                defaultValue={this.state.workersDefault}
                isMulti
                name="colors"
                options={this.state.workersList}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(item) => this.handleSelectWorkers(item)}
              />
            </div>
            <div className="text-center mt-4 mb-2">
              <button
                type="button"
                className="btn btn-primary btn-add w-100"
                onClick={this.handleUpdateSub}
              >
                Save
              </button>
            </div>
          </form>
        </CEModal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    subcontractors: state.subcontractors.subcontractors,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    retrieve: () => dispatch(actions.SubcontractorsActions.retrieve()),
    createSubcontractor: (values) =>
      dispatch(actions.SubcontractorsActions.createSubcontractor(values)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withFormik({
    mapPropsToValues: () => ({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      workersIds: [],
    }),
    validationSchema: CreateSubcontractorValidation,
    handleSubmit: async (values: any, { props, data }: any) => {
      console.log(values);
      if (Array.isArray(values.workersIds) && values.workersIds.length > 0) {
        values.workersIds = values.workersIds.map((worker) => worker.value.id);
      }
      //console.log('Finish');
      await props
        .createSubcontractor(values)
        .then(() => {
          toast.success('Subcontractor created!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((err) => {
          toast.error('Create subconstructor error!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });

      //props.closeModal();
    },
  })(Subcontractors)
);

// import React from 'react';
// import Search from '../../Images/search.png';
// import CEModal from '../Components/Modal/Modal.Component';
// import { WorkerAsyncSearch } from '../Components/Controls/WorkerAsyncSearch';
// import { actions } from '../../Services';
// import { PagingComponent } from '../Components';
// import mainStore from '../../Stores/mainStore';
// import { subcontractorsAPI, workerAPI } from '../../Services/API';
// import { toast } from 'react-toastify';
// import AddSubcontractorDialog from './AddSubcontractorDialog';
// import { connect } from 'react-redux';
// import { withFormik } from 'formik';
// import { CreateSubcontractorValidation } from '../Subcontractors/subcontractorValidation';

// class Subcontractors extends React.Component<any | any> {
//   isToggleModal: boolean;
//   colSpan = 7;
//   details = {} as any;
//   searchEnable = false;
//   timer = null;
//   state = {
//     searchParams: {},
//     isShowEdit: false,
//     dataEdit: null,
//     worker: null,
//     workers: [],
//     workersDefault: [],
//     workersList: [],
//   };

//   // showModalEdit = () => {
//   //   this.setState({ isShowEdit: !this.state.isShowEdit });
//   // };

//   showModal() {
//     this.isToggleModal = true;
//     this.setState({ change: true });
//   }

//   closeModal = () => {
//     this.isToggleModal = false;
//     this.setState({ change: true, dataEdit: null });
//   };

//   toggleDetails(name) {
//     this.details[name] = !this.details[name];
//     this.setState({ change: true });
//   }

//   renderDetailWorker(workers) {
//     if (!workers || workers.length === 0) return '';
//     return (
//       <div className="row ml-0 mr-0">
//         {workers.map((worker, index) => (
//           <div key={(worker && worker.id) || ''} className="view-name-worker">
//             <span>{(worker && worker.name) || ''}</span>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   handleChangeField(name) {
//     return (event) => {
//       const {
//         currentTarget: { value },
//       } = event;
//       return this.props.setFieldValue(name, value);
//     };
//   }

//   handleChangeFieldEdit = (name) => {
//     return (event) => {
//       const {
//         currentTarget: { value },
//       } = event;
//       const { subcontractor } = this.state.dataEdit;
//       if (name === 'companyName') {
//         this.setState({
//           dataEdit: { ...this.state.dataEdit, companyName: value },
//         });
//       } else {
//         subcontractor[name] = value;
//         this.setState({
//           dataEdit: { ...this.state.dataEdit, subcontractor },
//         });
//       }
//     };
//   };

//   handleChangeSearchParams = (event) => {
//     const { name, value } = event.target;
//     this.setState(
//       (state: any) => ({
//         searchParams: { ...state.searchParams, [name]: value },
//       }),
//       this.loadSubcontractorsWithDelay
//     );
//   };

//   loadSubcontractorsWithDelay = () => {
//     if (this.timer) clearTimeout(this.timer);
//     this.timer = setTimeout(this.loadSubcontractors, 700);
//   };

//   componentDidMount = async () => {
//     this.loadSubcontractors();
//     this.loadDataWorkers();
//   };

//   loadDataWorkers = async () => {
//     const response: any = await workerAPI.loadAllWorkers({
//       ...this.state.searchParams,
//     });

//     if (response.data) {
//       const workers = response.data.results.map((worker: any) => ({
//         label: worker.name,
//         value: worker,
//       }));
//       this.setState({ workersList: workers });
//     }
//   };

//   loadSubcontractors = (params: any = this.state.searchParams) => {
//     mainStore.loadSubcontractors(params);
//   };

//   onPaginationChange = (page: number) => {
//     this.setState(
//       (state: any) => ({ searchParams: { ...state.searchParams, page } }),
//       this.loadSubcontractorsWithDelay
//     );
//   };

//   handleSubmit = (values) => {
//     console.log('handleSubmit', values);

//     if (values.id) {
//       this.props.updateSubcontractor(values);
//       this.closeModal();
//     } else {
//       this.props.createSubcontractor(values);
//       this.closeModal();
//     }
//   };

//   handleEdit = (id, item, companyName, workers, workerIds) => {
//     this.setState({
//       isShowEdit: true,
//       dataEdit: { id, subcontractor: item, companyName, workers, workerIds },
//     });
//     this.loadDefaultWorkers(workers);
//   };

//   loadDefaultWorkers = (workers) => {
//     let data = [];

//     for (let i = 0; i < workers.length; i++) {
//       const worker = workers[i];
//       let val = JSON.stringify(worker);
//       const obj = JSON.parse(val);
//       data.push({
//         label: obj.name,
//         value: obj,
//       });
//     }
//     this.setState({ workersDefault: data });
//   };

//   onWorkerSelect = (workers) => {
//     // this.setState({ workers: workers ? workers : [] });
//     if (!workers) {
//       this.props.setFieldValue('workersIds', null);
//       return;
//     }
//     this.props.setFieldValue('workersIds', workers);
//   };

//   handleUpdateSub = async () => {
//     const { dataEdit, workers } = this.state;
//     if (workers && dataEdit) {
//       const ids = [];
//       for (let i = 0; i < workers.length; i++) {
//         const el = workers[i];
//         ids.push(el.value.id);
//       }
//       const update = await subcontractorsAPI
//         .update(dataEdit.id, {
//           ...dataEdit.subcontractor,
//           companyName: dataEdit.companyName,
//           workerIds: ids,
//         })
//         .then((res) => {
//           toast.success('Subconstructor was updated!', {
//             position: 'top-right',
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           });
//           this.setState({ isShowEdit: false });
//           this.loadSubcontractors();
//           this.loadDataWorkers();
//         })
//         .catch((err) => {
//           toast.success('Updated subconstructor error!', {
//             position: 'top-right',
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           });
//           this.setState({ isShowEdit: false });
//         });
//     }
//   };

//   handleTableRow = (
//     id,
//     firstName,
//     lastName,
//     email,
//     phoneNumber,
//     subcontractorName,
//     workers
//   ) => {
//     this.isToggleModal = true;
//     this.setState({
//       change: true,
//       dataEdit: {
//         id,
//         firstName,
//         lastName,
//         email,
//         phoneNumber,
//         companyName: subcontractorName,
//         workerIds: workers,
//       },
//     });
//   };

//   render() {
//     const thNoBorderRight = {
//       borderRight: 'none',
//     };

//     const props = this.props;
//     const subcontractors = props.subcontractors;

//     return (
//       <div className="container sub-contractor-page">
//         <div className="page-header d-flex justify-content-between align-items-center">
//           <div className="page-title">Subcontractors</div>
//           <button
//             type="button"
//             className="btn btn-success btn-add"
//             onClick={() => this.showModal()}
//           >
//             Add New
//           </button>
//         </div>

//         <div className="table-invoices">
//           <table className="table table-bordered">
//             <thead className="thead-light">
//               <tr>
//                 <th className="th-search">ID</th>
//                 <th className="th-search">
//                   <span>First Name</span>
//                   <div className="ce-search-control">
//                     <input
//                       name={'firstName'}
//                       className="ce-search-control-input"
//                       onChange={this.handleChangeSearchParams}
//                     />
//                   </div>
//                 </th>
//                 <th className="th-search">
//                   <span>Last Name</span>
//                   <div className="ce-search-control">
//                     <input
//                       name={'lastName'}
//                       className="ce-search-control-input"
//                       onChange={this.handleChangeSearchParams}
//                     />
//                   </div>
//                 </th>
//                 <th className="th-search">
//                   <span>Email</span>
//                   <div className="ce-search-control">
//                     <input
//                       name={'email'}
//                       className="ce-search-control-input"
//                       onChange={this.handleChangeSearchParams}
//                     />
//                   </div>
//                 </th>
//                 <th className="th-search">
//                   <span>Phone Number</span>
//                   <div className="ce-search-control">
//                     <input
//                       name={'phoneNumber'}
//                       className="ce-search-control-input"
//                       onChange={this.handleChangeSearchParams}
//                     />
//                   </div>
//                 </th>
//                 <th style={thNoBorderRight} className="th-search">
//                   <span>Workers</span>
//                   <div className="ce-search-control">
//                     <input
//                       name={'workers'}
//                       className="ce-search-control-input"
//                       onChange={this.handleChangeSearchParams}
//                     />
//                   </div>
//                 </th>
//                 <th style={thNoBorderRight} className="th-search">
//                   <span>
//                     Company Name{' '}
//                     <img className="cursor-pointer" src={Search} alt="" />
//                   </span>
//                   <div className="ce-search-control">
//                     <input
//                       name={'companyName'}
//                       className="ce-search-control-input"
//                       onChange={this.handleChangeSearchParams}
//                     />
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {Array.isArray(subcontractors) &&
//                 subcontractors.length > 0 &&
//                 subcontractors.map((subcontractor) => {
//                   return (
//                     <tr
//                       onClick={() =>
//                         this.handleTableRow(
//                           subcontractor.id,
//                           subcontractor.subcontractor.firstName,
//                           subcontractor.subcontractor.lastName,
//                           subcontractor.subcontractor.email,
//                           subcontractor.subcontractor.phoneNumber,
//                           subcontractor.subcontractor.subcontractorName,
//                           subcontractor.workers
//                         )
//                       }
//                       style={{ cursor: 'pointer' }}
//                       key={subcontractor.id}
//                     >
//                       <td>
//                         {subcontractor.subcontractor
//                           ? subcontractor.subcontractor.uid
//                           : ''}
//                       </td>
//                       <td>
//                         {subcontractor.subcontractor
//                           ? subcontractor.subcontractor.firstName
//                           : ''}
//                       </td>
//                       <td>
//                         {subcontractor.subcontractor
//                           ? subcontractor.subcontractor.lastName
//                           : ''}
//                       </td>
//                       <td>
//                         {subcontractor.subcontractor
//                           ? subcontractor.subcontractor.email
//                           : ''}
//                       </td>
//                       <td>
//                         {' '}
//                         {subcontractor.subcontractor
//                           ? subcontractor.subcontractor.phoneNumber
//                           : ''}
//                       </td>
//                       <td>
//                         <span
//                           className="cursor-pointer view-details p-2"
//                           onClick={() => this.toggleDetails(subcontractor.id)}
//                         >
//                           {subcontractor.workers.length}
//                         </span>
//                       </td>
//                       <td onClick={() => {}} style={thNoBorderRight}>
//                         {subcontractor.subcontractor
//                           ? subcontractor.subcontractor.subcontractorName
//                           : ''}
//                       </td>
//                     </tr>
//                   );
//                 })}
//             </tbody>
//           </table>
//         </div>
//         <div className="pagination-invoices">
//           <PagingComponent
//             totalItemsCount={mainStore.subcontractorsLoader.total}
//             onChangePage={this.onPaginationChange}
//           />
//         </div>
//         {this.isToggleModal && (
//           <AddSubcontractorDialog
//             data={this.state.dataEdit}
//             open={this.isToggleModal}
//             onClose={this.closeModal}
//             submit={this.handleSubmit}
//           />
//         )}
//       </div>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     subcontractors: state.subcontractors.subcontractors,
//   };
// }
// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch,
//     createSubcontractor: (values) =>
//       dispatch(actions.SubcontractorsActions.createSubcontractor(values)),
//     updateSubcontractor: (values) =>
//       dispatch(actions.SubcontractorsActions.updateSubcontractor(values)),
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Subcontractors);
