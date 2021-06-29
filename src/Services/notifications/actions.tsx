import HttpService from '../HttpService';
import {
  GET_NOTIFICATIONS_ERROR,
  GET_NOTIFICATIONS_FAIL,
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  UPDATE_FILTER_OPTIONS,
  MARK_NOTIFICATIONS_READ_REQUEST,
  MARK_NOTIFICATIONS_READ_SUCCESS,
  MARK_NOTIFICATIONS_FAIL,
  MARK_NOTIFICATIONS_ERROR,
  DELETE_NOTIFICATION_ERROR,
  DELETE_NOTIFICATION_FAIL,
  DELETE_NOTIFICATION_REQUEST,
  DELETE_NOTIFICATION_SUCCESS,
} from './actionTypes';

export function getNotifications(): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: GET_NOTIFICATIONS_REQUEST });
      let search_options = getState().notifications.search_options.asMutable();
      HttpService.get(
        '/notifications',
        search_options,
        (response) => {
          dispatch({
            type: GET_NOTIFICATIONS_SUCCESS,
            notifications: response.results,
            filters: {
              page: response.page,
              limit: response.limit,
              totalPage: response.totalPage,
              total: response.total,
            },
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

export function markNotificationsAsRead(notification): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: MARK_NOTIFICATIONS_READ_REQUEST });
      HttpService.put(
        '/notifications',
        notification,
        (response) => {
          dispatch({
            type: MARK_NOTIFICATIONS_READ_SUCCESS,
            notifications: response.results,
            filters: {
              page: response.page,
              limit: response.limit,
              totalPage: response.totalPage,
              total: response.total,
            },
          });
        },
        (error) => {
          dispatch({ type: MARK_NOTIFICATIONS_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: MARK_NOTIFICATIONS_ERROR });
    }
  };
}

export function deleteNotification(id): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: DELETE_NOTIFICATION_REQUEST });
      HttpService.delete(`/notifications/${id}`,
      {},
        (response) => {
          dispatch({
            type: DELETE_NOTIFICATION_SUCCESS,
            result: {response, id}
          });
        },
        (error) => {
          console.log(error)
          dispatch({ type: DELETE_NOTIFICATION_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: DELETE_NOTIFICATION_ERROR });
    }
  };
}

export function updateFilters(search_options): any {
  return function (dispatch, getState) {
    dispatch({
      type: UPDATE_FILTER_OPTIONS,
      filters: search_options,
    });
    dispatch(getNotifications());
  };
}
