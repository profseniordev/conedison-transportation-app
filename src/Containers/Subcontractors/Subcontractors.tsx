/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './Subcontractors.scss';
import { actions } from '../../Services';
import mainStore from '../../Stores/mainStore';
import { subcontractorsAPI, workerAPI } from '../../Services/API';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import SubcontractorsTable from './SubcontractorsTable';
import AddSubcontractorDialog from './AddSubcontractorDialog';

interface Props {
  subcontractors: Array<any>;
  retrieve: () => void;
  createSubcontractor: (values: any) => Promise<any>;
}

const Subcontractors: React.FC<Props> = ({
  subcontractors,
  retrieve,
  createSubcontractor,
}) => {
  const [isToggleModal, setIsToggleModal] = useState(false);
  const [timer] = useState(null);

  const [isEdit, setIsEdit] = useState(null);

  const [data, setData] = useState(null);

  const [state, setState] = useState({
    searchParams: {},
    workers: [],
    workersDefault: [],
  });

  const [workersList, setWorkersList] = useState([]);

  const resetData = () => [setData(null)];

  const showModal = () => {
    setIsToggleModal(true);
  };

  const closeModal = () => {
    setIsToggleModal(false);
    setIsEdit(false);
  };

  const handleEdit = (
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
    setData({
      id,
      subcontractor: item,
      companyName,
      workers,
      workersIds: workerIds,
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    setIsEdit(true);
    showModal();
    loadDefaultWorkers(workers);
  };

  const loadSubcontractorsWithDelay = () => {
    if (timer) clearTimeout(timer);
    setTimeout(loadSubcontractors, 700);
  };

  const loadSubcontractors = (params: any = state.searchParams) => {
    mainStore.loadSubcontractors(params);
  };

  const loadDefaultWorkers = (workers) => {
    let data = [];

    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
      let val = JSON.stringify(worker);
      const obj = JSON.parse(val);

      console.log(worker);

      data.push({
        label: obj.name + ' ' + obj.lastName,
        value: obj,
      });
    }
    setState({ ...state, workersDefault: data });
  };

  const handleCreateSub = async (values: any) => {
    if (Array.isArray(values.workersIds) && values.workersIds.length > 0) {
      values.workersIds = values.workersIds.map((worker) => worker.value.id);
    }
    await createSubcontractor(values)
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
        console.log(err);
        let message = "Create subcontractor error!";
        //if (err.response) 
        message = err.error;
        toast.error(message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

    closeModal();
  };

  const handleUpdateSub = async (values) => {
    const { workers } = state;
    const ids = [];
    for (let i = 0; i < state.workersDefault.length; i++) {
      const el = state.workersDefault[i];
      ids.push(el.value.id);
    }
    for (let i = 0; i < workers.length; i++) {
      const el = workers[i];
      ids.push(el.value.id);
    }
    await subcontractorsAPI
      .update(values.id, {
        ...values.subcontractor,
        companyName: values.companyName,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
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
        retrieve();
        closeModal();
      })
      .catch((err) => {
        let message = "Update subcontractor error!";
        if (err.response) 
          message = err.response.data.error;
        toast.error(message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        closeModal();
      });
  };

  const submitSubcontractor = (values) => {
    if (isEdit) {
      handleUpdateSub(values);
    } else {
      handleCreateSub(values);
    }
    closeModal();
    loadSubcontractorsWithDelay();
  };

  const loadDataWorkers = async () => {
    const response: any = await workerAPI.loadAllWorkers({
      ...state.searchParams,
    });

    if (response.data) {
      console.log(response.data);

      const workers = response.data.results.map((worker: any) => ({
        label: worker.name,
        value: worker,
      }));
      setWorkersList(workers);
    }
  };

  useEffect(() => {
    loadSubcontractors();
    loadDataWorkers();
  }, []);

  return (
    <div
      className="subcontractors-list-page sub-contractor-page"
      style={{ height: '90%' }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center sub-header">
        <div className="page-title">Subcontractors</div>
        <button
          type="button"
          className="btn btn-success btn-add"
          onClick={() => showModal()}
        >
          Add New
        </button>
      </div>

      <div
        className="container-fluid timesheet-body"
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <div
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            height: '90%'
          }}
        >
          <SubcontractorsTable data={subcontractors} onRowClick={handleEdit} />
        </div>
      </div>
      {isToggleModal && workersList && (
        <AddSubcontractorDialog
          isEdit={isEdit}
          data={data}
          open={isToggleModal}
          onClose={closeModal}
          submit={submitSubcontractor}
          workersDefault={state.workersDefault}
          workersList={workersList}
          resetData={resetData}
        />
      )}
    </div>
  );
};

function mapStateToProps({ subcontractors }) {
  return {
    subcontractors: subcontractors.subcontractors,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    retrieve: () => dispatch(actions.SubcontractorsActions.retrieve()),
    getWorkers: () => dispatch(actions.WorkersActions.retrieve()),
    createSubcontractor: (values) =>
      dispatch(actions.SubcontractorsActions.createSubcontractor(values)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Subcontractors);
