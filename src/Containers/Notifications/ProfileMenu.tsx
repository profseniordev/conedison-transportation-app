import React from 'react';
import { ROLES } from '../../Constants/user';
import NextIcon from '../../Images/chevron-right-12.png';
import LogoutIcon from '../../Images/logout.png';
import { actions } from '../../Services';
import { connect } from 'react-redux';
import history from '../../history';

const ProfileMenu: React.FC<any> = (props) => {
  const renderRole = (role: number) =>
    ROLES[role - 1] ? <span>{ROLES[role - 1].name}</span> : null;

  const logout = () => {
    props.logout();
  };

  const viewProfile = () => {
    history.push('/profile');
  };

  return (
    <div className="profile-menu">
      <div className="box-item p-0">
        <div className="profile-menu__user" onClick={viewProfile}>
          <div className="profile-menu__info">
            <div className="avatar">
              <img
                src={`${process.env.REACT_APP_API_MEDIA}${
                  props.user ? props.user.avatar : ''
                }`}
                alt=""
              />
            </div>
            <div className="profile-menu__name">
              <p className="title">{props.user.name}</p>
              <p className="categories">{props.user.roles.map(renderRole)}</p>
            </div>
          </div>
          <div className="profile-menu__link">
            <img src={NextIcon} alt="" />
          </div>
        </div>
        <div className="profile-menu__button" onClick={logout}>
          <img src={LogoutIcon} alt="" /> Log Out
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    user: state.app.user,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    logout: () => dispatch(actions.AppActions.logout()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);
