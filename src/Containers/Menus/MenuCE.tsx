/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './MenuCE.scss';
// import Cogwheel from '../../Images/cogwheel.png';
import Logout from '../../Images/logout.png';
import Right from '../../Images/chevron-right-12.png';
import NoAvatar from '../../Images/no-ava.png';
// import * as CeIcon from '../../Utils/Icon';
// import ProfileMenu from './../Notifications/ProfileMenu';
import { connect } from 'react-redux';
import { actions } from '../../Services';
import some from 'lodash/some';
import history from '../../history';
import ProfileMenus from './ProfileMenus/ProfileMenus';

interface Props {
  logout: () => void;
  notifications: any;
  user: any;
  has_access_to_dispatch: boolean;
  canAccessWorker: boolean;
  canAccessSubContractor: boolean;
  canAccessInvoice: boolean;
  canAccessRoles: boolean;
  canAccessReports: boolean;
}

const MenuCE: React.FC<Props> = ({
  logout,
  notifications,
  user,
  has_access_to_dispatch,
  canAccessWorker,
  canAccessSubContractor,
  canAccessInvoice,
  canAccessRoles,
  canAccessReports,
}) => {
  const [haveUnreadNotifications, setHaveUnreadNotifications] = useState(false);

  // const [toggleProfile, setToggleProfile] = useState(false);

  // const toggleProfileMenu = () => {
  //   setToggleProfile(!toggleProfile);
  // };

  const ClickToMenu = () => {
    const el: HTMLElement | null = document.getElementById('ceSidebar');
    if (el) {
      const definitelyAnElement: HTMLElement = el;
      definitelyAnElement.style.display = 'block';
    }
    const el1: HTMLElement | null = document.getElementById('ceSidebarOpacity');
    if (el1) {
      const definitelyAnElement1: HTMLElement = el1;
      definitelyAnElement1.style.display = 'block';
    }
  };

  const ClickToCloseMenu = () => {
    const el: HTMLElement | null = document.getElementById('ceSidebar');
    if (el) {
      const definitelyAnElement: HTMLElement = el;
      definitelyAnElement.style.display = 'none';
    }
    const el1: HTMLElement | null = document.getElementById('ceSidebarOpacity');
    if (el1) {
      const definitelyAnElement1: HTMLElement = el1;
      definitelyAnElement1.style.display = 'none';
    }
  };

  const onLogout = () => {
    logout();
    ClickToCloseMenu();
  };

  const navigate = (link) => {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');

    if (link === '/timesheets' && jobId) {
      window.location.replace(link);
    } else {
      history.push(link);
    }
  };

  const checkUnreadNotification = () => {
    setHaveUnreadNotifications(
      some(notifications, {
        isRead: false,
      })
    );
  };

  useEffect(() => {
    checkUnreadNotification();
  }, [notifications]);

  const header = () => (
    <header className="App-header">
      <div>
        <div id="ceSidebar" className="ce-sidebar">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-between align-items-center">
              <div className="user-avatar">
                <img src={NoAvatar} alt="" />
              </div>
              <div className="user-info text-left">
                <div className="fullname">
                  {user && `${user.firstName} ${user.lastName}`}
                </div>
                <div className="role">
                  {user && user.roles && user.roles.join(', ')}
                </div>
              </div>
            </div>
            <div className="mr-3">
              <img src={Right} alt="" />
            </div>
          </div>
          <hr className="styleHr" />
          <ul className="mt-3">
            {has_access_to_dispatch && (
              <li>
                <span
                  className="link cursor-pointer"
                  onClick={(_) => navigate('/dispatch')}
                >
                  Dispatch
                </span>
              </li>
            )}
            <li>
              <span
                className="link cursor-pointer"
                onClick={(_) => navigate('/map')}
              >
                Map
              </span>
            </li>
            <li>
              <span
                className="link cursor-pointer"
                onClick={(_) => navigate('/job')}
              >
                Job List
              </span>
            </li>
            <li>
              <span
                className="link cursor-pointer"
                onClick={(_) => navigate('/job-grid')}
              >
                Job Grid
              </span>
            </li>
            {canAccessWorker && (
              <li>
                <span
                  className="link cursor-pointer"
                  onClick={(_) => navigate('/workers')}
                >
                  Workers
                </span>
              </li>
            )}
            {canAccessSubContractor && (
              <li>
                <span
                  className="link cursor-pointer"
                  onClick={(_) => navigate('/subcontractors')}
                >
                  Subcontractors
                </span>
              </li>
            )}
            <li>
              <span
                className="link cursor-pointer"
                onClick={(_) => navigate('/timesheets')}
              >
                Timesheets
              </span>
            </li>
            {canAccessInvoice && (
              <li>
                <span
                  className="link cursor-pointer"
                  onClick={(_) => navigate('/invoices')}
                >
                  Invoices
                </span>
              </li>
            )}
            {has_access_to_dispatch && (
              <li>
                <span
                  className="link cursor-pointer"
                  onClick={(_) => navigate('/billing')}
                 >
                  Billing
                </span>
              </li>
            )}
            {canAccessReports && (
              <li>
                <span
                  className="link cursor-pointer"
                  onClick={(_) => navigate('/reports')}
                >
                  Reports
                </span>
              </li>
            )}
            {canAccessRoles && (
              <li>
                <span
                  className="link cursor-pointer"
                  onClick={(_) => navigate('/roles')}
                >
                  Settings
                </span>
              </li>
            )}
            <li className="log-out" onClick={onLogout}>
              <span>
                <img className="mr-2" src={Logout} alt="" />
                <span>Log Out</span>
              </span>
            </li>
          </ul>
        </div>
        <div
          onClick={() => {
            ClickToCloseMenu();
          }}
          id="ceSidebarOpacity"
          className="ce-sidebar-opacity"
        />
        <div className="menu-mobile">
          <div
            className="menu-icon d-flex align-items-center"
            onClick={ClickToMenu}
          >
            <img
              className="m-auto"
              alt=""
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA4SURBVFhH7dOxCQAADAJB9186WUCwMZDiD760VAA+muMiN2oGIHLXaRa5UTMAkbtOs8iNmgH4RFrzpY9xuWJl5QAAAABJRU5ErkJggg=="
            />
          </div>
          <img
            src={
              'https://storage.googleapis.com/conedison/assets/coned_logo.png'
            }
            alt="logo"
            style={{ width: 143, height: 24 }}
          />

          {/* {toggleProfile && <ProfileMenu />} */}
        </div>

        <div className="menu-web">
          <img
            src={
              'https://storage.googleapis.com/conedison/assets/coned_logo.png'
            }
            alt="logo"
            className="d-none d-md-block ml-3 "
            style={{ width: 143, height: 24 }}
          />
          <div className="menu-router">
            {has_access_to_dispatch && (
              <NavLink className=" p-lg-2 p-md-1 p-xl-3" id="dispatch" to="/dispatch">
                Dispatch
              </NavLink>
            )}
            <NavLink className="p-lg-2 p-md-1 p-xl-3" id="map" to="/map">
              Map
            </NavLink>
            <NavLink className="p-lg-2 p-md-1 p-xl-3" id="job" to="/job">
              Job List
            </NavLink>
            <NavLink className="p-lg-2 p-md-1 p-xl-3" id="job-grid" to="/job-grid">
              Job Grid
            </NavLink>
            {canAccessWorker && (
              <NavLink className="p-lg-2 p-md-1 p-xl-3" id="workers" to="/workers">
                Workers
              </NavLink>
            )}
            {canAccessSubContractor && (
              <NavLink
                className="p-lg-2 p-md-1 p-xl-3"
                id="subcontractors"
                to="/subcontractors"
              >
                <span>Subcontractors</span>
              </NavLink>
            )}
            <NavLink
              className="p-lg-2 p-md-1 p-xl-3"
              id="timesheets"
              to="/timesheets"
              onClick={() => navigate('/timesheets')}
            >
              Timesheets
            </NavLink>
            {has_access_to_dispatch && (
              <NavLink className="p-lg-2 p-md-1 p-xl-3" id="billing" to="/billing">
                Billing
              </NavLink>
            )}
            {canAccessInvoice && (
              <NavLink className="p-lg-2 p-md-1 p-xl-3" id="invoices" to="/invoices">
                Invoices
              </NavLink>
            )}
            {canAccessReports && (
              <NavLink
                className="p-lg-2 p-md-1 p-xl-3"
                id="reports"
                to="/reports"
                onClick={() => navigate('/reports')}
              >
                Reports
              </NavLink>
            )}
          </div>
          <div className="header-action d-flex align-items-center mr-3">
            {/* <NavLink
              style={{ borderBottom: 'none' }}
              className={`p-3 notification-icon ${
                haveUnreadNotifications ? 'active' : ''
              }`}
              to="/notifications"
            >
              <div className="border-custom">
                <CeIcon.BellIcon />
              </div>
            </NavLink> */}
            {/* {canAccessRoles && (
              <NavLink
                style={{ borderBottom: 'none' }}
                className="p-3"
                id="roles"
                to="/roles"
              >
                <div className="border-custom">
                  <img src={Cogwheel} alt="" />
                </div>
              </NavLink>
            )} */}
            {/* <div
              className={`p-3 user-icon ${toggleProfile ? 'active' : ''}`}
              id="profile"
              onClick={() => toggleProfileMenu()}
            >
              <div className="border-custom">
                <CeIcon.UserIcon />
              </div>
            </div> */}

            {/* {toggleProfile && <ProfileMenu />} */}

            <ProfileMenus />
          </div>
        </div>
      </div>
    </header>
  );

  return user == null ? null : header();
};

function mapStateToProps({ app, notifications }) {
  return {
    canAccessWorker: app.user
      ? [5, 6, 8].some((r) => app.user.roles.includes(r))
      : false,
    canAccessSubContractor: app.user
      ? [5, 6, 8].some((r) => app.user.roles.includes(r))
      : false,
    canAccessInvoice: app.user
      ? [4, 7, 8].some((r) => app.user.roles.includes(r))
      : false,
    canAccessRoles: app.user
      ? [6, 8].some((r) => app.user.roles.includes(r))
      : false,
    canAccessReports: app.user
      ? [1, 2, 3, 4, 7, 8].some((r) => app.user.roles.includes(r))
      : false,
    has_access_to_dispatch: app.user
      ? ![1, 2, 3, 4].some((r) => app.user.roles.includes(r))
      : false,
    user: app.user,
    notifications: notifications.notifications,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    logout: () => dispatch(actions.AppActions.logout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuCE);
