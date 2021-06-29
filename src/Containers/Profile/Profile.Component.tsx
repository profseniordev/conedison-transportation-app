/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { withFormik } from 'formik';
import DepartmentMaterialAsyncSearch from '../Components/Controls/DepartmentMaterialAsyncSearch';
import RolesMaterialAsyncSearch from '../Components/Controls/RolesMaterialAsyncSearch';
import { ProfileEditValidation } from './Profile.Validation';
import { ISelectItem } from '../Components/Controls/AsyncSelect';
import { EROLES, ROLES } from '../../Constants/user';
import { userAPI, workerAPI } from '../../Services/API';
import ReactSelect from 'react-select';
import { WORKER_TYPE } from '../Workers/Workers';
import FullScreenLoader from '../../components/FullScreenLoader/FullScreenLoader';
import history from '../../history';
import { connect } from 'react-redux';
import { actions } from '../../Services';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import './Profile.scss';

const ProfileComponent: React.FC<any> = ({
  match,
  errors,
  setFieldValue,
  handleSubmit,
}) => {
  const [showImage, setShowImage] = useState(false);

  const [file, setFile] = useState(null);

  const [user, setUser] = useState(null);

  const [hasWorker, setHasWorker] = useState(false);

  const inputOpenFileRef = useRef(null);

  const fetchUser = useCallback(async () => {
    const { data: user } = await userAPI.user(match.params.id);
    setFieldValue('workerTypes', user.workerTypes);
    setFieldValue('name', user.name);
    setFieldValue('email', user.email);
    setFieldValue('phoneNumber', user.phoneNumber);
    setFieldValue('departments', user.departments);
    setUser(user);
    console.log(user)
  }, [match.params.id]);

  useEffect(() => {
    fetchUser();
  }, []);

  const save = (event) => {
    handleSubmit(event);
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowImage(false);
    setFile(undefined);
    setFieldValue('avatar', undefined);
  };

  const showOpenFileDlg = () => {
    inputOpenFileRef.current.click();
  };

  const onChangeFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const blob = event.target.files[0];
    setFile(URL.createObjectURL(blob));
    setShowImage(true);
    inputOpenFileRef.current.value = '';
    setFieldValue('avatar', blob);
  };

  const handleChangeField = (name) => {
    return (event) => {
      const {
        currentTarget: { value },
      } = event;
      return setFieldValue(name, value);
    };
  };

  const onDepartmentSelect = (department) => {
    if (!department) {
      setFieldValue('departments', null);
      return;
    }
    let departments = department.map(
      (dep) => dep.value
    );
    setFieldValue('departments', departments);
  };

  const onRoleSelect = (role) => {
    if (!role) {
      setFieldValue('roles', null);
      return;
    }
    setFieldValue('roles', role);
    setHasWorker(
      Array.isArray(role) &&
        role.findIndex((item) => item.value.id === EROLES.worker) >= 0
    );
  };

  const onTypeSelect = (items) => {
    if (items && items.length > 0) {
      setFieldValue(
        'workerTypes',
        items.map((item) => item)
      );
    } else {
      setFieldValue('workerTypes', []);
    }
  };
  const onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  const isWorker = user &&
    Array.isArray(user.roles) &&
    user.roles.findIndex((item) => item === EROLES.worker) >= 0;
  const isOnlyWorker = isWorker && user.roles.length === 1;

  return (
    <>
      {!user ? (
        <FullScreenLoader />
      ) : (
        <form
          className="container container-profile"
          onKeyDown={onKeyDown}
          style={{ height: '90%', overflowY: 'scroll' }}
        >
          <div className="form-login form-sign-up m-auto">
            <div className="form-login-header border-0">
              Profile Information
            </div>
            {user ? (
              <div className="form-login-body">
                <div>
                  <input
                    type="file"
                    className="feature-image mr-3"
                    id="file"
                    ref={inputOpenFileRef}
                    style={{ display: 'none' }}
                    onChange={onChangeFile}
                  />
                  {showImage ? (
                    <div
                      className="view-feature-image"
                      style={{ backgroundImage: `url(${file})` }}
                      onClick={() => showOpenFileDlg()}
                    >
                      <div
                        className="remove-feature-image d-flex"
                        onClick={(e) => removeImage(e)}
                      >
                        <i className="fa fa-times m-auto" />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="feature-image d-flex"
                      style={{
                        backgroundImage: `url("${process.env.REACT_APP_API_ENDPOINT}${user.avatar}")`,
                      }}
                      onClick={() => showOpenFileDlg()}
                    />
                  )}
                </div>
                <div className="form-group">
                  <label className="d-block">Name</label>
                  <input
                    className="ce-form-control"
                    defaultValue={user.name}
                    name="name"
                    placeholder="name"
                    onChange={handleChangeField('name')}
                  />
                  <p className="error">{errors.name}</p>
                </div>
                <div className="form-group">
                  <label className="d-block">Email</label>
                  <input
                    className="ce-form-control"
                    name="email"
                    placeholder="email"
                    defaultValue={user.email}
                    onChange={handleChangeField('email')}
                  />
                  <p className="error">{errors.email}</p>
                </div>
                <div className="form-group">
                  <label className="d-block">Role(s)</label>
                  <RolesMaterialAsyncSearch
                    small
                    noLabel={true}
                    limitTags={10}
                    defaultValue={
                      Array.isArray(user.roles) &&
                      user.roles.map((role) => ({
                        label: ROLES.find((r) => r.id === role).name,
                        value: ROLES.find((r) => r.id === role),
                      }))
                    }
                    disabledValue={{label: "Worker", value: {id: 9, name: "Worker",  role: "worker"}}}
                    onSelectRole={(role: ISelectItem) => onRoleSelect(role)}
                  />
                  <p className="error">{errors.role}</p>
                </div>
                {(isWorker || hasWorker) && (
                  <div className="form-group">
                    <label className="d-block">Worker Type(s)</label>
                    <ReactSelect
                      onChange={onTypeSelect}
                      placeholder="No Type"
                      options={WORKER_TYPE}
                      isMulti
                      defaultValue={
                        Array.isArray(user.workerTypes) &&
                        user.workerTypes.map((type) => ({
                          label: type.label,
                          value: type,
                        }))
                      }
                    />
                    <p className="error">{errors.workerTypes}</p>
                  </div>
                )}
                <div className="form-group">
                  <label className="d-block">PhoneNumber</label>
                  <input
                    className="ce-form-control"
                    name="phoneNumber"
                    defaultValue={user.phoneNumber}
                    placeholder="+X (XXX) XXX XXXX"
                    onChange={handleChangeField('phoneNumber')}
                  />
                  <p className="error">{errors.phoneNumber}</p>
                </div>
                {!isOnlyWorker && (
                  <div className="form-group">
                    <label className="d-block">Department(s)</label>
                    <DepartmentMaterialAsyncSearch
                      //isMulti
                      noLabel={true}
                      limitTags={10}
                      width={'100%'}
                      defaultValue={
                        Array.isArray(user.departments) &&
                        user.departments.map((department) => ({
                          label: department.name,
                          value: department,
                        }))
                      }
                      onSelect={(department: ISelectItem) =>
                        onDepartmentSelect(department)
                      }
                    />
                    <p className="error">{errors.department}</p>
                  </div>
                )}
              </div>
            ) : null}
            <div className="form-login-header border-0">Password</div>
            <div className="form-login-body">
              <div className="form-group">
                <label className="d-block">New Password</label>
                <input
                  className="ce-form-control"
                  type="password"
                  name="password"
                  onChange={handleChangeField('password')}
                />
                <p className="error">{errors.password}</p>
              </div>
              <div className="form-group">
                <label className="d-block">Repeat New Password</label>
                <input
                  autoComplete="new-password"
                  className="ce-form-control"
                  type="password"
                  name="repeatPassword"
                  onChange={handleChangeField('repeatPassword')}
                />
                <p className="error">{errors.repeatPassword}</p>
              </div>
              <div className="mt-4 d-flex justify-content-start page-action-bottom">
                <button
                  type="submit"
                  className="btn btn-success py-2 px-5 btn-add mr-4"
                  onClick={save}
                >
                  Save
                </button>
                <div className="goto-roles mr-2">
                  <button
                    type="button"
                    style={{borderRadius: '12px'}}
                    className="btn btn-outline-secondary w-100 px-5"
                    onClick={() => {
                      history.push({
                        pathname: '/roles',
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};
const user = (values: any) => {
  if (values.name) {
    values.name = values.name.id;
  }
  if (values.phoneNumer) {
    values.phoneNumer = values.phoneNumer.id;
  }
  return values;
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    update: (id,data) => dispatch(actions.WorkersActions.updateWorker(id,data)), 
  };
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( withFormik({
  mapPropsToValues() {
    return {
    };
  },
  validationSchema: ProfileEditValidation,
  handleSubmit: async (values : any, {props} : any) => {
    console.log('Submit');
    console.log(values);

    const _props = props as any;
    /*if (values.departments) {
      values.departments = values.departments.map(
        (department) => department.value
      );
    } else {
      values.departments = [];
    }*/
    if (values.roles) {
      values.roles = values.roles.map((role) => role.value && role.value.id);
    }

    if (values.name) {
      const [firstName, lastName] = values.name.split(' ');
      values.firstName = firstName;
      values.lastName = lastName;
    }

    await props.update(props.match.params.id, user(values))
    .then((res) => {
        toast.success('User was updated!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        _props.history.push({
          pathname: '/roles',
          state: _props.location.state,
        });
    })
    .catch(error => {
      toast.error(error.error, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    /*await workerAPI
      .update(_props.match.params.id, user(values) as any)
      .then((res) => {
        if (res.status < 300) {
          _props.history.push({
            pathname: '/roles',
            state: _props.location.state,
          });
        }
      });*/
  },
})(ProfileComponent)
);
