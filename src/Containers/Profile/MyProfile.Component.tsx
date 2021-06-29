/* eslint-disable react-hooks/exhaustive-deps */
import { withFormik } from 'formik';
import React, { useRef, useEffect, useState } from 'react';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import { ProfileEditValidation } from './Profile.Validation';
import { ISelectItem } from '../Components/Controls/AsyncSelect';
import { userAPI } from '../../Services/API';
import CheckboxComponent from '../Components/Controls/DoubleCheckbox.Component';
import Collapsible from 'react-collapsible';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import avatarImg from '../../Assets/avatar.png';
import { connect } from 'react-redux';
import { actions } from '../../Services';

const MyProfileComponent: React.FC<any> = ({
  setFieldValue,
  getNotifications,
  notifications,
  errors,
  handleSubmit,
  user,
}) => {
  const inputOpenFileRef = useRef(null);

  const [showImage, setShowImage] = useState(false);

  const [file, setFile] = useState(null);

  const [notification, setNotification] = useState({ Jobs: [], Worker: [] });

  const [isNotify, setIsNotify] = useState(false);

  const [totalHeight, setTotalHeight] = useState(0);

  useEffect(() => {
    const total_height = document.getElementById('root').clientHeight - 70;
    setTotalHeight(total_height);
    getNotifications();
  }, []);

  useEffect(() => {
    if (notifications.Jobs || notifications.Worker) {
      setNotification(JSON.parse(JSON.stringify(notifications)));
    }
  }, [notifications]);

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

    setFieldValue('departments', department);
  };

  // const onEnableNotification = (status: boolean) => {
  //   setFieldValue('enableNotification', status);
  // };

  const onChangeNotification = (checked, index, type) => {
    let chengedNotifications = notification;
    chengedNotifications[type][index] = {
      ...chengedNotifications[type][index],
      notify_email: checked[0],
      notify_web_push: checked[1],
    };
    setNotification(chengedNotifications);
    setFieldValue('notification', {
      notifications: [
        ...chengedNotifications.Jobs,
        ...chengedNotifications.Worker,
      ],
    });
  };

  return (
    <form autoComplete={'off'} className="container container-profile" onSubmit={handleSubmit}>
      <div
        className="scroll"
        style={{
          overflowY: 'scroll',
          maxHeight: totalHeight,
        }}
      >
        <div className="form-login form-sign-up m-auto">
          <div className="form-login-header border-0">Profile Information</div>
          {user.id ? (
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
                      <i className="fa fa-times m-auto"> </i>
                    </div>
                  </div>
                ) : (
                  <div
                    className="feature-image d-flex"
                    style={{
                      backgroundImage: `url("${
                        user.avatar !== 'null'
                          ? process.env.REACT_APP_API_MEDIA
                          : ''
                      }/${user.avatar !== 'null' ? user.avatar : avatarImg}")`,
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
                  autoComplete={'false'}
                />
                <p className="error">{errors.email}</p>
              </div>
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
              <div className="form-group">
                <label className="d-block">Department(s)</label>
                <DepartmentAsyncSearch
                  isMulti
                  defaultInputValue={
                    Array.isArray(user.departments)
                      ? user.departments
                          .map((department) => department.name)
                          .join(', ')
                      : undefined
                  }
                  onSelect={(department: ISelectItem) =>
                    onDepartmentSelect(department)
                  }
                />
                <p className="error">{errors.department}</p>
              </div>
              {/* <div className="form-group" >
                <label className="d-block">Enable Notification</label>
                <CheckboxComponent
                  id="Enable Notification"
                  hasTitle=""
                  checked={userStore.me.enableNotification}
                  onChange={this.onEnableNotification}
                />
              </div> */}
            </div>
          ) : null}

          <div className="form-login-header border-0">Password</div>
          <div className="form-login-body">
            <div className="form-group">
              <label className="d-block">New Password</label>
              <input
                className="ce-form-control"
                type="password"
                autoComplete={'off'}
                name="password"
                onChange={handleChangeField('password')}
              />
              <p className="error">{errors.password}</p>
            </div>
            <div className="form-group">
              <label className="d-block">Confirm New Password</label>
              <input
                className="ce-form-control"
                type="password"
                autoComplete={'off'}
                name="repeatPassword"
                onChange={handleChangeField('repeatPassword')}
              />
              <p className="error">{errors.repeatPassword}</p>
            </div>
          </div>
          <Collapsible
            open={false}
            onOpen={() => {
              setIsNotify(true);
            }}
            onClose={() => {
              setIsNotify(false);
            }}
            className="notify-settings"
            trigger={
              <h3 className="title">
                {isNotify ? <FaAngleDown /> : <FaAngleRight />}
                Notification Settings
              </h3>
            }
          >
            <div className="notify-item">
              <h4 className="d-flex flex-row justify-content-end">
                <span className="flex-fill">Jobs</span>
                <span className="mr-4">Email</span>
                <span>Web/Push</span>
              </h4>
              {notification.Jobs.length > 0 &&
                notification.Jobs.map((item, index) => {
                  return (
                    <div className="form-group">
                      <CheckboxComponent
                        key={item.id}
                        id={item.id}
                        hasTitle={item.title}
                        name={item.title}
                        checked={[item.notify_email, item.notify_web_push]}
                        onChange={(checked) =>
                          onChangeNotification(checked, index, 'Jobs')
                        }
                      />
                    </div>
                  );
                })}
            </div>

            <div className="notify-item">
              <h4 className="d-flex flex-row justify-content-end">
                <span className="flex-fill">Workers</span>
                <span className="mr-4">Email</span>
                <span>Web/Push</span>
              </h4>
              {notification.Worker.length > 0 &&
                notification.Worker.map((item, index) => (
                  <div className="form-group">
                    <CheckboxComponent
                      key={item.id}
                      id={item.id}
                      hasTitle={item.title}
                      name={item.title}
                      checked={[item.notify_email, item.notify_web_push]}
                      onChange={(checked) =>
                        onChangeNotification(checked, index, 'Worker')
                      }
                    />
                  </div>
                ))}
            </div>
          </Collapsible>

          <div className="row my-4">
            <div className="col-sm-4">
              <button
                type="submit"
                className="btn btn-secondary w-100 py-2"
                style={{ marginLeft: 45 }}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getNotifications: () => dispatch(actions.UsersActions.getNotifications()),
    updateNotifications: (data) =>
      dispatch(actions.UsersActions.updateNotifications(data)),
    update: (data) => dispatch(actions.UsersActions.update(data)),
  };
}

function mapStateToProps(state) {
  return {
    notifications: state.users.notifications,
    user: state.users.user,
    updateUser: state.users.updateUser,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withFormik({
    mapPropsToValues: () => ({
      name: '',
      email: '',
      phoneNumber: '',
      subcontractorId: '',
      avatar: '',
      firstName: '',
      lastName: '',
      departments: [],
      notification: {},
    }),
    validationSchema: ProfileEditValidation,
    handleSubmit: async (values: any, { props, data }: any) => {
      if (Array.isArray(values.departments)) {
        values.departments = values.departments.map(
          (department) => department.value.id
        );
      }

      if (values.name) {
        const [firstName, lastName] = values.name.split(' ');
        values.firstName = firstName;
        values.lastName = lastName;
      }

      const user = Object.entries(values).reduce((user, [key, value]) => {
        if (value !== '' && key !== 'notifications') {
          user[key] = value;
        }
        return user;
      }, {});

      await props.update(user).then((res) => {
        if (res.status_code === 200) {
          toast.success('Profile was updated!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });

      if (Object.keys(values.notification).length !== 0) {
        await userAPI.updateNotification(values.notification).then((res) => {
          if (res.status === 200) {
            toast.success('Notifications was updated!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      }
    },
  })(MyProfileComponent)
);
