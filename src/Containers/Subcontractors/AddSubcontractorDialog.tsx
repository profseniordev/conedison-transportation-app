/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Formik } from 'formik';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { WorkerAsyncSearch } from '../Components/Controls/WorkerAsyncSearch';
import { CreateSubcontractorValidation } from './subcontractorValidation';
import Select from 'react-select';

interface Props {
  onClose: () => void;
  data: any;
  open: boolean;
  isEdit: boolean;
  submit: (values: any) => void;
  workersDefault: any;
  workersList: any;
  resetData: () => void;
}

const newSubcontractor = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  companyName: '',
  workersIds: [],
};

const AddSubcontractorDialog: React.FC<Props> = ({
  isEdit,
  data,
  open,
  onClose,
  submit,
  workersDefault,
  workersList,
  resetData,
}) => {
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    return () => {
      resetData();
    };
  }, []);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {isEdit ? 'Edit Subcontractor' : 'Add New Subcontractor'}
      </DialogTitle>
      <DialogContent>
        <Formik
          enableReinitialize={true}
          validationSchema={CreateSubcontractorValidation}
          initialValues={data ? data : newSubcontractor}
          onSubmit={(values) => {
            submit(values);
          }}
        >
          {({
            setFieldValue,
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
          }) => {
            const onWorkerSelect = (workers) => {
              if (!workers) {
                setFieldValue('workersIds', null);
                return;
              }
              setFieldValue('workersIds', workers);
            };

            return (
              <form onSubmit={handleSubmit} style={{ width: 350 }}>
                <div className="form-group">
                  <label className="d-block" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="ce-form-control"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter First Name"
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="error">{errors.firstName}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="d-block" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="ce-form-control"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter Last Name"
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="error">{errors.lastName}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="d-block" htmlFor="email">
                    Email
                  </label>
                  <input
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="ce-form-control"
                    id="email"
                    name="email"
                    placeholder="Enter Email"
                  />
                  {errors.email && touched.email && (
                    <p className="error">{errors.email}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="d-block" htmlFor="companyName">
                    Company Name
                  </label>
                  <input
                    value={values.companyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="ce-form-control"
                    id="companyName"
                    name="companyName"
                    placeholder="Enter Company Name"
                  />
                  {errors.companyName && touched.companyName && (
                    <p className="error">{errors.companyName}</p>
                  )}
                </div>
                <div className="form-group">
                  <label className="d-block" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <input
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="ce-form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="+X (XXX) XXX XXXX"
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="error">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="d-block">Workers</label>
                  {console.log(workersDefault)}
                  {isEdit ? (
                    <Select
                      defaultValue={workersDefault}
                      isMulti
                      name="workersIds"
                      options={workersList}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(item) => setFieldValue('workersIds', item)}
                    />
                  ) : (
                    <WorkerAsyncSearch
                      isMulti
                      onSelect={(worker) => onWorkerSelect(worker)}
                    />
                  )}
                </div>

                <div className="text-center mt-4 mb-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-add w-100"
                  >
                    {isEdit ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubcontractorDialog;
