import {
  APP_INIT,
  GET_ACCOUNT_REQUEST,
  GET_ACCOUNT_ERROR,
  GET_ACCOUNT_SUCCESS,
  GET_ACCOUNT_FAIL,
  ACTIVATE_ACCOUNT_REQUEST,
  ACTIVATE_ACCOUNT_ERROR,
  ACTIVATE_ACCOUNT_SUCCESS,
  ACTIVATE_ACCOUNT_FAIL,
  GET_ROLES_REQUEST,
  GET_ROLES_SUCCESS,
  GET_ROLES_FAIL,
  GET_ROLES_ERROR,
  GET_PERMISSIONS_REQUEST,
  GET_PERMISSIONS_SUCCESS,
  GET_PERMISSIONS_FAIL,
  GET_PERMISSIONS_ERROR,
  GET_DEPARTMENTS_REQUEST,
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_FAIL,
  GET_DEPARTMENTS_ERROR,
  LOGOUT,
} from './actionTypes';
import HttpService from '../HttpService';
import { actions } from '../index';
import ifvisible from 'ifvisible.js';
import history from '../../history';

export function init(): any {
  return function (dispatch, getState) {
    dispatch({ type: APP_INIT });
  };
}

export function retrieve(): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: GET_ACCOUNT_REQUEST });
      HttpService.get(
        `/user`,
        {},
        (response) => {
          dispatch({ type: GET_ACCOUNT_SUCCESS, user: response });

          /**** INIT ***/
          let location_job = null;
          ifvisible.setIdleDuration(180);
          ifvisible.onEvery(80, () => {
            dispatch(actions.JobsActions.retrieve());
            dispatch(actions.JobsActions.retrieveLocations());
            dispatch(actions.ZonesActions.retrieve());
            location_job = getState().jobs.location_job;
            if (location_job) {
              dispatch(
                actions.JobsActions.retrieveLocationJob({
                  job_id: location_job.id,
                })
              );
            }
          });
          ifvisible.onEvery(10, () => {
            dispatch(actions.ZonesActions.retrieve());
          });
          ifvisible.onEvery(60, () => {
            dispatch(actions.NotificationsActions.getNotifications());
          });
          ifvisible.on('focus', () => {
            dispatch(actions.JobsActions.retrieve());
            dispatch(actions.JobsActions.retrieveLocations());
            dispatch(actions.ZonesActions.retrieve());
            location_job = getState().jobs.location_job;
            if (location_job) {
              dispatch(
                actions.JobsActions.retrieveLocationJob({
                  job_id: location_job.id,
                })
              );
            }
          });
        },
        (error) => {
          dispatch({ type: GET_ACCOUNT_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: GET_ACCOUNT_ERROR });
    }
  };
}

export function getPermissions(): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: GET_PERMISSIONS_REQUEST });
      HttpService.get(
        `/permissions`,
        {},
        (response) => {
          dispatch({ type: GET_PERMISSIONS_SUCCESS, permissions: response.results });
        },
        (error) => {
          dispatch({ type: GET_PERMISSIONS_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: GET_PERMISSIONS_ERROR });
    }
  };
}


export function getRoles(): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: GET_ROLES_REQUEST });
      HttpService.get(
        `/roles`,
        {},
        (response) => {
          dispatch({ type: GET_ROLES_SUCCESS, roles: response });
        },
        (error) => {
          dispatch({ type: GET_ROLES_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: GET_ROLES_ERROR });
    }
  };
}

export function activateAccount(token : any, password : any): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: ACTIVATE_ACCOUNT_REQUEST });
        HttpService.post(
          `/user/activate-with-password`,
          {token, password},
          (response) => {
            dispatch({ type: ACTIVATE_ACCOUNT_SUCCESS, response: response });
            return resolve(response);
          },
          (error) => {
            console.log(error);
            dispatch({ type: ACTIVATE_ACCOUNT_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: ACTIVATE_ACCOUNT_ERROR });
    }
  };
}

export function getDepartments(): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: GET_DEPARTMENTS_REQUEST });
      HttpService.get(
        `/departments`,
        {},
        (response) => {
          dispatch({ type: GET_DEPARTMENTS_SUCCESS, departments: response });
        },
        (error) => {
          dispatch({ type: GET_DEPARTMENTS_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: GET_DEPARTMENTS_ERROR });
    }
  };
}

export function logout(): any {
  return function (dispatch, getState) {
    HttpService.setToken(null);

    localStorage.removeItem('token');
    localStorage.removeItem('Logged');
    localStorage.removeItem('Token');
    localStorage.removeItem('CurrentUser');
    dispatch({ type: LOGOUT });
    history.go(0);
    //history.replace('/login');
  };
}
