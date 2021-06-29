import React, { useState } from 'react';
import {
  Popover,
  MenuItem,
  MenuList,
  Divider,
  Typography,
} from '@material-ui/core';
import * as CeIcon from '../../../Utils/Icon';
import { actions } from '../../../Services';
import { connect } from 'react-redux';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import history from '../../../history';


function ProfileMenu({ user, logout, canAccessRoles }) {
  const [anchorProfile, setAnchorProfile] = useState(null);

  const openProfile = (event) => {
    setAnchorProfile(event.currentTarget);
  };

  const closeProfile = () => {
    setAnchorProfile(null);
  };

  const toRoles = () => {
    history.push('/roles');
    closeProfile();
  };

  const toProfile = () => {
    history.push('/profile');
    closeProfile();
  };

  const toNotification = () => {
    history.push('/notifications');
    closeProfile();
  };

  return (
    <>
      <div
        onClick={openProfile}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: '0.3s',
          border: Boolean(anchorProfile) ? '1px solid #333' : '1px solid transparent',
          borderRadius: 16,
          padding: 5,
        }}
      >
        <img
          alt="avatar"
          className="avatar mr-3"
          style={{ objectFit: 'cover' }}
          src={`${process.env.REACT_APP_API_ENDPOINT}${user.avatar}`}
        />
            <div className='last-name-display-none'> {user.name}</div>
          <div className='display-none display'>   {user.firstName} </div>


        <ArrowDropDownIcon
          style={{
            transition: '0.3s',
            transform: Boolean(anchorProfile) ? 'rotate(180deg)' : 'none',
          }}
        />
      </div>

      <Popover
        id="customized-menu"
        classes={{ paper: 'job-select' }}
        anchorEl={anchorProfile}
        keepMounted
        open={Boolean(anchorProfile)}
        onClose={closeProfile}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuList>
          {canAccessRoles && (
            <div>
              <MenuItem onClick={toRoles}>
                <Typography>Manage Roles</Typography>
                <CeIcon.Users />
              </MenuItem>
              <Divider />
            </div>
          )}
          <MenuItem onClick={toProfile}>
            <Typography>Profile Settings</Typography>{' '}
            <CeIcon.Key />
          </MenuItem>
          <MenuItem onClick={toNotification}>
            <Typography>Edit Notifications</Typography>{' '}
            <CeIcon.Tune />
          </MenuItem>

          <div className="reset" onClick={logout}>
            Log Out
          </div>
        </MenuList>
      </Popover>
    </>
  );
}

function mapStateToProps({ app }) {
  return {
    canAccessRoles: app.user
      ? [6, 8].some((r) => app.user.roles.includes(r))
      : false,  
    user: app.user,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    logout: () => dispatch(actions.AppActions.logout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);
