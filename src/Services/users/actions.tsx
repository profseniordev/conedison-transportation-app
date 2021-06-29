import HttpService from '../HttpService';
import { APPROVE } from '../../Constants/user';
import { User } from '../../Models/APITypes';
import {
  GET_USER_ERROR,
  GET_USER_FAIL,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  CREATE_USER_ERROR,
  CREATE_USER_FAIL,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  USER_APPROVE_ERROR,
  USER_APPROVE_FAIL,
  USER_APPROVE_REQUEST,
  USER_APPROVE_SUCCESS,
  GET_USERS_ERROR,
  GET_USERS_FAIL,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_NOTIFICATIONS_ERROR,
  GET_NOTIFICATIONS_FAIL,
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  UPDATE_FILTERS,
  UPDATE_NOTIFICATIONS_SUCCESS,
  UPDATE_NOTIFICATIONS_FAIL,
  UPDATE_NOTIFICATIONS_REQUEST,
  UPDATE_NOTIFICATIONS_ERROR,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_ERROR,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  DELETE_USER_ERROR,
} from './actionTypes';
export const FILTERS_STORAGE_KEY = 'users.filters';

//get user account
export function retrieve(): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: GET_USER_REQUEST });
      //let search_options = getState().users.search_options.asMutable();
      HttpService.get(
        '/user',
        {},
        (response) => {
          dispatch({ type: GET_USER_SUCCESS, user: response });
        },
        (error) => {
          dispatch({ type: GET_USER_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: GET_USER_ERROR });
    }
  };
}

//get users
export function retrieveUsers(): any {
  return function (dispatch, getState) {
    try {
      let processing_key = Math.random();
      dispatch({ type: GET_USERS_REQUEST, processing_key });
      let search_options = getState().users.search_options.asMutable();
      HttpService.get(
        '/user/users',
        search_options,
        (response) => {
          dispatch({
            type: GET_USERS_SUCCESS,
            users: response.results,
            processing_key,
          });
        },
        (error) => {
          dispatch({ type: GET_USERS_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: GET_USERS_ERROR });
    }
  };
}

//get user by id
export function getUserId(id): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: GET_USERS_REQUEST });
      HttpService.get(
        `/user/${id}`,
        {},
        (response) => {
          dispatch({ type: GET_USERS_SUCCESS, user: response });
        },
        (error) => {
          dispatch({ type: GET_USERS_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: GET_USERS_ERROR });
    }
  };
}

//get user notifications
export function getNotifications(): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: GET_NOTIFICATIONS_REQUEST });
      HttpService.get(
        `/user/notifications`,
        {},
        (response) => {
          dispatch({
            type: GET_NOTIFICATIONS_SUCCESS,
            notifications: response.notifications,
          });
        },
        (error) => {
          dispatch({ type: GET_NOTIFICATIONS_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: GET_NOTIFICATIONS_ERROR });
    }
  };
}

//update notifications
export function updateNotifications(data): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: UPDATE_NOTIFICATIONS_REQUEST });
        HttpService.put(
          `/user/notifications`,
          data,
          (response) => {
            dispatch({
              type: UPDATE_NOTIFICATIONS_SUCCESS,
              notifications: response,
            });
          },
          (error) => {
            dispatch({ type: UPDATE_NOTIFICATIONS_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_NOTIFICATIONS_ERROR });
    }
  };
}

// update user
export function update(data): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: UPDATE_USER_REQUEST });
        HttpService.put(
          `/user`,
          data,
          (response) => {
            dispatch({ type: UPDATE_USER_SUCCESS, user: response });
            return resolve(response);
          },
          (error) => {
            dispatch({ type: UPDATE_USER_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_USER_ERROR });
    }
  };
}

// create user
export function createUser(user : User): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: CREATE_USER_REQUEST });
        HttpService.post(
          '/user/role',
          user,
          (response) => {
            dispatch({ type: CREATE_USER_SUCCESS, user: response.user });
            return resolve(response)
          },
          (error) => {
            dispatch({ type: CREATE_USER_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: CREATE_USER_ERROR });
    }
  };
}

// approve user
export function updateApprove(id, approve = APPROVE.waiting): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: USER_APPROVE_REQUEST });
        HttpService.post(
          '/user/approve',
          { id, approve },
          (response) => {
            dispatch({ type: USER_APPROVE_SUCCESS, user: {id: id, isApproved: approve} });
            return resolve(response)
          },
          (error) => {
            dispatch({ type: USER_APPROVE_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: USER_APPROVE_ERROR });
    }
  };
}

//update filters
export function updateFilters(search_options): any {
  return function (dispatch, getState) {
    let storage_filters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
    dispatch({
      type: UPDATE_FILTERS,
      filters: { ...storage_filters, ...search_options },
    });
    dispatch(retrieveUsers());
  };
}

export function deleteUser(id): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: DELETE_USER_REQUEST });
        HttpService.delete(
          `/user/${id}`,
          {id},
          (response) => {
            dispatch({ type: DELETE_USER_SUCCESS, user: {id: id} });
          },
          (error) => {
            dispatch({ type: DELETE_USER_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: DELETE_USER_ERROR });
    }
  };
}
