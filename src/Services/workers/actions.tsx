import HttpService from '../HttpService';
import {
  GET_WORKERS_ERROR,
  GET_WORKERS_FAIL,
  GET_WORKERS_REQUEST,
  GET_WORKERS_SUCCESS,
  UPDATE_WORKER_STATUS_REQUEST,
  UPDATE_WORKER_STATUS_SUCCESS,
  UPDATE_WORKER_STATUS_FAIL,
  UPDATE_WORKER_STATUS_ERROR,
  UPDATE_WORKER_REQUEST,
  UPDATE_WORKER_SUCCESS,
  UPDATE_WORKER_FAIL,
  UPDATE_WORKER_ERROR,
  UPDATE_FILTER_OPTIONS,
} from './actionTypes';

export function retrieve(): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: GET_WORKERS_REQUEST });
      let search_options = getState().workers.search_options.asMutable();
      HttpService.get(
        '/workers',
        search_options,
        (response) => {
          dispatch({ type: GET_WORKERS_SUCCESS, workers: response.results });
        },
        (error) => {
          dispatch({ type: GET_WORKERS_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: GET_WORKERS_ERROR });
    }
  };
}

export function updateFilters(search_options): any {
  return function (dispatch, getState) {
    dispatch({
      type: UPDATE_FILTER_OPTIONS,
      filters: search_options,
    });
    dispatch(retrieve());
  };
}

export function updateWorkerStatus(worker_id, data): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: UPDATE_WORKER_STATUS_REQUEST });
        HttpService.post(
          `/workers/${worker_id}`,
          data,
          (response) => {
            dispatch({
              type: UPDATE_WORKER_STATUS_SUCCESS,
              worker: response.worker,
            });
            return resolve(response);
          },
          (error) => {
            console.log(error);
            dispatch({ type: UPDATE_WORKER_STATUS_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_WORKER_STATUS_ERROR });
    }
  };
}

export function updateWorker(id, data): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: UPDATE_WORKER_REQUEST });
        HttpService.postJSON(
          `/workers/${id}`,
          data,
          (response) => {
            dispatch({
              type: UPDATE_WORKER_SUCCESS,
              worker: response.worker,
            });
            return resolve(response);
          },
          (error) => {
            console.log(error);
            dispatch({ type: UPDATE_WORKER_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_WORKER_ERROR });
    }
  };
}
