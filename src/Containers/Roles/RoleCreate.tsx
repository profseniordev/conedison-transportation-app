import { withFormik } from 'formik';
import React, { useRef, useState } from 'react';
import { User } from '../../Models/APITypes';
import { userAPI } from '../../Services/API';
import { RoleValidation } from './RoleValidation';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import RolesAsyncSearch from '../Components/Controls/RolesAsyncSearch';
import { ISelectItem } from '../Components/Controls/AsyncSelect';
import { Link } from 'react-router-dom';
import authStore from '../../Stores/authStore';
import history from '../../history';
import { toast } from 'react-toastify';
import { EROLES } from '../../Constants/user';
import { connect } from 'react-redux';
import { actions } from '../../Services';
import DepartmentMaterialAsyncSearch from '../Components/Controls/DepartmentMaterialAsyncSearch';
import RolesMaterialAsyncSearch from '../Components/Controls/RolesMaterialAsyncSearch';

const RoleCreateComponent: React.FC<any> = ({
  setFieldValue,
  errors,
  touched,
  handleBlur,
  handleSubmit,
}) => {
  const [showImage, setShowImage] = useState(false);

  const [file, setFile] = useState(null);

  const inputOpenFileRef = useRef(null);

  const handleChangeField = (name) => {
    return (event) => {
      const {
        currentTarget: { value },
      } = event;
      return setFieldValue(name, value);
    };
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

  const onDepartmentSelect = (department) => {
    if (!department) {
      setFieldValue('departments', undefined);
      return;
    }
    setFieldValue('departments', department);
  };

  const onRoleSelect = (role) => {
    if (!role) {
      setFieldValue('roles', undefined);
      return;
    }
    setFieldValue('roles', role);
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

  return (
    <form
      className="container"
      style={{ height: 'calc(100vh - 70px)', overflowY: 'auto' }}
      onSubmit={handleSubmit}
    >
      <div className="form-login form-sign-up m-auto">
        <div className="form-login-header border-0">Add New User</div>
        <div className="form-login-body">
          <div>
            <input
              type="file"
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
                  <i className="fa fa-times m-auto"></i>
                </div>
              </div>
            ) : (
              <div
                className="feature-image d-flex"
                onClick={() => showOpenFileDlg()}
              >
                {/* <i className="fa fa-camera m-auto"></i> */}
              </div>
            )}
            {touched.avatar && errors.avatar && (
              <p className="error">{errors.avatar}</p>
            )}
          </div>
          <div className="form-group">
            <label className="d-block">Name</label>
            <input
              className="ce-form-control"
              name="name"
              placeholder="name"
              onChange={handleChangeField('name')}
              onBlur={handleBlur}
            />
            {errors.name && touched.name && (
              <p className="error">{errors.name}</p>
            )}
          </div>
          <div className="form-group">
            <label className="d-block">Email</label>
            <input
              className="ce-form-control"
              name="email"
              placeholder="email"
              onChange={handleChangeField('email')}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && (
              <p className="error">{errors.email}</p>
            )}
          </div>
          <div className="form-group">
            <label className="d-block">Role(s)</label>
            <RolesMaterialAsyncSearch
              small
              noLabel={true}
              limitTags={10}
              onSelectRole={(role: ISelectItem) => onRoleSelect(role)}
              onlyDispatcher={!authStore.isSuperAdmin()}
            />
            {errors.roles && touched.roles && (
              <p className="error">{errors.roles}</p>
            )}
          </div>
          <div className="form-group">
            <label className="d-block">PhoneNumber</label>
            <input
              className="ce-form-control"
              name="phoneNumber"
              placeholder="+X (XXX) XXX XXXX"
              onChange={handleChangeField('phoneNumber')}
            />
          </div>
          <div className="form-group">
            <label className="d-block">Department(s)</label>
              <DepartmentMaterialAsyncSearch
                noLabel={true}
                limitTags={10}
                width={'100%'}
                onSelect={(department: ISelectItem) =>
                  onDepartmentSelect(department)
                }
              />
            {errors.departments && touched.departments && (
              <p className="error">{errors.departments}</p>
            )}
          </div>
        </div>
        <div className="form-login-header border-0">Password</div>
        <div className="form-login-body">
          <div className="form-group">
            <label className="d-block">Password</label>
            <input
              className="ce-form-control"
              type="password"
              autoComplete="new-password"
              name="password"
              onChange={handleChangeField('password')}
            />
            {errors.password && touched.password && (
              <p className="error">{errors.password}</p>
            )}
          </div>
          <div className="mt-4 d-flex justify-content-start page-action-bottom">
            <button
              type="submit"
              className="btn btn-success py-2 px-5 btn-add mr-4"
            >
              Add User
            </button>
            <Link className="goto-roles mr-2" to={`/roles`}>
              <button
                type="button"
                className="btn btn-outline-secondary w-100 px-5"
                style={{borderRadius: '12px'}}
              >
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    createUser: (user) => dispatch(actions.UsersActions.createUser(user)),
  };
}

export default connect(
  null,
  mapDispatchToProps
)( withFormik({
  mapPropsToValues: () => ({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    roles: '',
    departments: '',
    avatar: '',
    firstName: '',
    lastName: '',
  }),
  validationSchema: RoleValidation,
  handleSubmit: async (values: any, { props } : any) => {
    const name = values.name.split(' ');
    values.firstName = name[0];
    values.lastName = name[1];

    if (Array.isArray(values.departments)) {
      values.departments = values.departments.map(
        (department) => department.value.id
      );
      values.departments = values.departments.join(',');
    }

    if (Array.isArray(values.roles)) {
      values.roles = values.roles.map((role) => role.value && role.value.id);
      values.roles = values.roles.join(',');
    }

    await props.createUser(values as User)
      .then(() => {
        toast.success('User created!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        history.push('/roles');
      })
      .catch(error => {
        toast.error(error.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })

    /*userAPI.createRole(values as User).then(
      (res) => {
        if (res.status === 200) {
          history.push('/roles');
        }
      },
      (error) => {
        if (error.response.data.hasOwnProperty('error')) {
          toast.error(error.response.data.error, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          let errors = error.response.data.errors;
          Object.keys(errors).forEach((key) => {
            console.log(key);
            toast.error(errors[key][0], {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
        }
      }
    );*/
  },
})(RoleCreateComponent));
