import HttpService from '../HttpService';
import {
  GET_JOBS_ERROR,
  GET_JOBS_FAIL,
  GET_JOBS_REQUEST,
  GET_JOBS_SUCCESS,
  UPDATE_STATUS_JOB_ERROR,
  UPDATE_STATUS_JOB_FAIL,
  UPDATE_STATUS_JOB_REQUEST,
  UPDATE_STATUS_JOB_SUCCESS,
  UPDATE_DISPUTE_JOB_ERROR,
  UPDATE_DISPUTE_JOB_FAIL,
  UPDATE_DISPUTE_JOB_REQUEST,
  UPDATE_DISPUTE_JOB_SUCCESS,
  UPDATE_FILTERS,
  UPDATE_PO_NUMBER_REQUEST,
  UPDATE_PO_NUMBER_SUCCESS,
  UPDATE_PO_NUMBER_FAIL,
  UPDATE_PO_NUMBER_ERROR,

} from './actionTypes';
export const FILTERS_STORAGE_KEY = 'billing.filters';

export function retrieve(search_options): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: GET_JOBS_REQUEST });
      if (search_options == null) {
        search_options = getState().billing.search_options.asMutable();
      }
      HttpService.get(
        '/billing/jobs',
        search_options,
        (response) => {
          let search_options = {
            page: response.page,
            limit: response.limit,
            totalPage: response.totalPage,
            total: response.total,
          };
          dispatch({
            type: GET_JOBS_SUCCESS,
            jobs: response.results,
            search_options: search_options,
          });
        },
        (error) => {
          dispatch({ type: GET_JOBS_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: GET_JOBS_ERROR });
    }
  };
}

export function updateDispute(id, data): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: UPDATE_DISPUTE_JOB_REQUEST });
        const newStatus =  'coned_disputed';
        HttpService.post(
          `/billing/jobs/${id}/dispute`,
          data,
          (response) => {
            dispatch({ type: UPDATE_DISPUTE_JOB_SUCCESS, result: {id, data, newStatus, response}});
            return resolve(response);
          },
          (error) => {
            dispatch({ type: UPDATE_DISPUTE_JOB_FAIL });
            console.log(error);
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_STATUS_JOB_ERROR });
    }
  };
}

export function updateStatus(id, data): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: UPDATE_STATUS_JOB_REQUEST });
        const status =  data.status;
        HttpService.post(
          `/billing/jobs/${id}/change-status`,
          data,
          (response) => {
            dispatch({ type: UPDATE_STATUS_JOB_SUCCESS, status: {id, status, response}});
            return resolve(response);
          },
          (error) => {
            dispatch({ type: UPDATE_STATUS_JOB_FAIL });
            console.log(error);
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_STATUS_JOB_ERROR });
    }
  };
}

export function initFilters(): any {
  return function (dispatch, getState) {
    let storage_filters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
    dispatch({ type: UPDATE_FILTERS, search_options: storage_filters });
    dispatch(retrieve(storage_filters));
  };
}

export function updateFilters(search_options): any {
  return function (dispatch, getState) {
    const current_search_options = getState().billing.search_options;
    const new_search_options = { ...current_search_options, ...search_options };
    dispatch({ type: UPDATE_FILTERS, search_options: new_search_options });
    dispatch(retrieve(new_search_options));
    localStorage.setItem(
      FILTERS_STORAGE_KEY,
      JSON.stringify(new_search_options)
    );
  };
}

export function updatePOS(job_ids, po_number, requisition?, receipt?): any {
  return function (dispatch, getState) {
    try {
      return new Promise<void>((resolve, reject) => {
        dispatch({ type: UPDATE_PO_NUMBER_REQUEST });
        HttpService.post(
          '/billing/jobs/billing-info',
          { ids: job_ids, po: po_number, requisition: requisition, receipt: receipt },
          (response) => {
            dispatch({
              type: UPDATE_PO_NUMBER_SUCCESS,
              job_ids,
              po_number,
              requisition,
              receipt,
            });
            return resolve();
          },
          (error) => {
            console.log(error);
            dispatch({ type: UPDATE_PO_NUMBER_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_PO_NUMBER_ERROR });
    }
  };
}

/*
export function updateWorkerStatus(worker_id, data) : any {
    return function (dispatch, getState) {
        try {
            return new Promise((resolve, reject) => {
                dispatch({ type: UPDATE_WORKER_STATUS_REQUEST });
                HttpService.post(`/workers/${worker_id}`, data, (response) => {
                    dispatch({ type: UPDATE_WORKER_STATUS_SUCCESS, worker: response.worker });
                    return resolve();
                }, (error) => {
                    console.log(error);
                    dispatch({ type: UPDATE_WORKER_STATUS_FAIL});
                    return reject();
                })
            })
        }catch (error) {
            dispatch({type : UPDATE_WORKER_STATUS_ERROR });
        }
    }
}
*/
