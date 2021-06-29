import {
  GET_JOBS_REQUEST,
  GET_JOBS_ERROR,
  GET_JOBS_SUCCESS,
  GET_JOBS_FAIL,
  CONFIRM_JOB_REQUEST,
  CONFIRM_JOB_SUCCESS,
  CONFIRM_JOB_FAIL,
  CONFIRM_JOB_ERROR,
  UPDATE_FILTERS,
  SORT_ASAP,
  SORT_LOCATIONS_ASAP,
  UPDATE_PO_NUMBER_REQUEST,
  UPDATE_PO_NUMBER_SUCCESS,
  UPDATE_PO_NUMBER_FAIL,
  UPDATE_PO_NUMBER_ERROR,
  CALCULATE_JOBS_STATS,
  RETRIEVE_JOB_REQUEST,
  RETRIEVE_JOB_SUCCESS,
  RETRIEVE_JOB_FAIL,
  RETRIEVE_JOB_ERROR,
  UPDATE_JOB_REQUEST,
  UPDATE_JOB_SUCCESS,
  UPDATE_JOB_FAIL,
  UPDATE_JOB_ERROR,
  CLEAR_JOB,
  UPDATE_JOB_WORKERS_REQUEST,
  UPDATE_JOB_WORKERS_SUCCESS,
  UPDATE_JOB_WORKERS_FAIL,
  UPDATE_JOB_WORKERS_ERROR,
  ASSIGN_WORKERS_TO_JOB,
  GET_JOBS_LOCATIONS_REQUEST,
  GET_JOBS_LOCATIONS_FAIL,
  GET_JOBS_LOCATIONS_ERROR,
  GET_JOBS_LOCATIONS_SUCCESS,
  UPDATE_LOCATIONS_FILTERS,
  RETRIEVE_LOCATION_JOB_REQUEST,
  RETRIEVE_LOCATION_JOB_SUCCESS,
  RETRIEVE_LOCATION_JOB_FAIL,
  RETRIEVE_LOCATION_JOB_ERROR,
  ADD_WORKER_REQUEST,
  ADD_WORKER_SUCCESS,
  ADD_WORKER_FAIL,
  ADD_WORKER_ERROR,
  UPDATE_JOB_WORKER_REQUEST,
  UPDATE_JOB_WORKER_SUCCESS,
  UPDATE_JOB_WORKER_FAIL,
  UPDATE_JOB_WORKER_ERROR,
  JOB_UPLOAD_IMAGE_REQUEST,
  JOB_UPLOAD_IMAGE_SUCCESS,
  JOB_UPLOAD_IMAGE_FAIL,
  JOB_UPLOAD_IMAGE_ERROR,
  JOB_CREATE_REQUEST,
  JOB_CREATE_SUCCESS,
  JOB_CREATE_FAIL,
  JOB_CREATE_ERROR,
  UPDATE_JOB_STATUS_REQUEST,
  UPDATE_JOB_STATUS_SUCCESS,
  UPDATE_JOB_STATUS_FAIL,
  UPDATE_JOB_STATUS_ERROR,
  ADD_JOB_LOCATION_REQUEST,
  ADD_JOB_LOCATION_SUCCESS,
  ADD_JOB_LOCATION_FAIL,
  ADD_JOB_LOCATION_ERROR,
  UPDATE_JOB_LOCATION_REQUEST,
  UPDATE_JOB_LOCATION_SUCCESS,
  UPDATE_JOB_LOCATION_FAIL,
  UPDATE_JOB_LOCATION_ERROR,
  ADD_SHIFT_REQUEST,
  ADD_SHIFT_SUCCESS,
  ADD_SHIFT_FAIL,
  ADD_SHIFT_ERROR,
  DELETE_JOB_LOCATION_REQUEST,
  DELETE_JOB_LOCATION_SUCCESS,
  DELETE_JOB_LOCATION_FAIL,
  DELETE_JOB_LOCATION_ERROR,
} from './actionTypes';
import HttpService from '../HttpService';
import moment from 'moment';
import history from '../../history';
import { actions } from '../index';

export const FILTERS_STORAGE_KEY = 'jobs.filters';
export const LOCATIONS_FILTERS_STORAGE_KEY = 'jobs_locations.filters';

export function retrieve(): any {
  return function (dispatch, getState) {
    try {
      const processing = getState().jobs.processing;
      if (processing) {
        return;
      }
      let processing_key = Math.random();
      dispatch({ type: GET_JOBS_REQUEST, processing_key: processing_key });
      let state = getState();
      let search_options = state.jobs.search_options.asMutable();
      if (search_options) {
        if (search_options.hasOwnProperty('requestDate')) {
          search_options.requestDate = JSON.stringify(
            search_options.requestDate
          );
        }
        if (
          search_options.hasOwnProperty('requestor') &&
          search_options.requestor &&
          search_options.requestor.hasOwnProperty('id')
        ) {
          search_options.requestor = search_options.requestor.id;
        }
        if (
          search_options.hasOwnProperty('department') &&
          search_options.department &&
          search_options.department.hasOwnProperty('id')
        ) {
          search_options.department = search_options.department.id;
        }
        if (
          search_options.hasOwnProperty('worker') &&
          search_options.worker &&
          search_options.worker.hasOwnProperty('id')
        ) {
          search_options.workerId = search_options.worker.id;
          search_options.worker = '';
        }
      }

      HttpService.get(
        '/jobs',
        search_options,
        (response) => {
          dispatch({
            type: GET_JOBS_SUCCESS,
            processing_key: processing_key,
            response: response,
          });
          dispatch(calculateStats());
        },
        (error) => {
          dispatch({ type: GET_JOBS_FAIL });
        }
      );
    } catch (error) {
      console.log(error);
      dispatch({ type: GET_JOBS_ERROR });
    }
  };
}

export function retrieveLocations(search_options = null): any {
  return function (dispatch, getState) {
    try {
      // const processing = getState().jobs.locations_processing;
      // if(processing){
      //     return;
      // }
      let state = getState();

      let zones = state.zones;

      let processing_key = Math.random();
      dispatch({
        type: GET_JOBS_LOCATIONS_REQUEST,
        processing_key: processing_key,
      });
      if (search_options == null) {
        search_options = state.jobs.locations_search_options.asMutable();
      }

      if (
        search_options.unconfirmed === true &&
        parseInt(zones.stats.total_unconfirmed_jobs) === 0
      ) {
        search_options.unconfirmed = '';
      }
      if (
        search_options.workers_unconfirmed === true &&
        parseInt(zones.stats.today_unconfirmed_asap_shifts) === 0
      ) {
        search_options.workers_unconfirmed = '';
      }

      HttpService.get(
        '/jobs/locations',
        search_options,
        (response) => {
          dispatch({
            type: GET_JOBS_LOCATIONS_SUCCESS,
            processing_key: processing_key,
            jobs: response.jobs.data,
            total: response.jobs.total,
          });
          dispatch(sortLocationsASAP())
        },
        (error) => {
          console.log(error);
          dispatch({ type: GET_JOBS_LOCATIONS_FAIL });
        }
      );
    } catch (error) {
      console.log(error);
      dispatch({ type: GET_JOBS_LOCATIONS_ERROR });
    }
  };
}

export function initFilters(): any {
  return function (dispatch, getState) {
    let storage_filters = JSON.parse(
      localStorage.getItem(LOCATIONS_FILTERS_STORAGE_KEY)
    );
    dispatch({ type: UPDATE_LOCATIONS_FILTERS, filters: storage_filters });
    dispatch(retrieveLocations());
  };
}

export function updateLocationsFilters(search_options): any {
  return function (dispatch, getState) {
    const current_search_options = getState().jobs.locations_search_options;
    const new_search_options = { ...current_search_options, ...search_options };
    dispatch({ type: UPDATE_LOCATIONS_FILTERS, filters: new_search_options });
    dispatch(retrieveLocations(new_search_options));
  };
}

export function retrieveLocationJob(job_location): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({
          type: RETRIEVE_LOCATION_JOB_REQUEST,
          selected_location_id: job_location.id,
        });
        HttpService.get(
          `/jobs/${job_location.job_id}/details`,
          {},
          (response) => {
            dispatch({
              type: RETRIEVE_LOCATION_JOB_SUCCESS,
              job: response.job,
            });
            return resolve(response);
          },
          (error) => {
            dispatch({ type: RETRIEVE_LOCATION_JOB_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: RETRIEVE_LOCATION_JOB_ERROR });
    }
  };
}

export function addWorker(job_id, data): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: ADD_WORKER_REQUEST });
        HttpService.post(
          `/jobs/${job_id}/workers`,
          data,
          (response) => {
            dispatch({ type: ADD_WORKER_SUCCESS, job: response.job });
            return resolve(response);
          },
          (error) => {
            console.log(error);
            dispatch({ type: ADD_WORKER_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: ADD_WORKER_ERROR });
    }
  };
}

export function retrieveJob(job_id, workerId): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: RETRIEVE_JOB_REQUEST });
        HttpService.get(
          `/jobs/${job_id}`,
          { workerId },
          (response) => {
            dispatch({ type: RETRIEVE_JOB_SUCCESS, job: response });
            return resolve(response);
          },
          (error) => {
            dispatch({ type: RETRIEVE_JOB_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: RETRIEVE_JOB_ERROR });
    }
  };
}
export function clearJob(): any {
  return function (dispatch, getState) {
    dispatch({ type: CLEAR_JOB });
  };
}

//
export function updateJob(job_id, data): any {
  return function (dispatch, getState) {
    try {
      return new Promise<void>((resolve, reject) => {
        dispatch({ type: UPDATE_JOB_REQUEST });
        HttpService.putPure(
          `/jobs/${job_id}`,
          data,
          (response) => {
            dispatch({ type: UPDATE_JOB_SUCCESS, job: response });
            history.push(`/job/${job_id}`);
          },
          (error) => {
            dispatch({ type: UPDATE_JOB_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_JOB_ERROR });
    }
  };
}

export function updateJobStatus(job_id, data): any {
  return function (dispatch, getState) {
    try {
      return new Promise<void>((resolve, reject) => {
        dispatch({ type: UPDATE_JOB_STATUS_REQUEST });
        HttpService.post(
          `/jobs/${job_id}/status`,
          data,
          (response) => {
            dispatch({ type: UPDATE_JOB_STATUS_SUCCESS, job: response.job });
            dispatch(retrieveJob(response.job.id, 0));
            if (data && data.status === 'confirmed') {
              setTimeout(() => {
                dispatch(actions.ZonesActions.retrieve());
              }, 1500);
            }
            return resolve(response);
          },
          (error) => {
            console.log(error);
            dispatch({ type: UPDATE_JOB_STATUS_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_JOB_STATUS_ERROR });
    }
  };
}

export function updateJobWorker(job_id, job_worker_id, data): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        let shift = null;
        if (
          data.status &&
          [
            'pending',
            'assigned',
            'en_route',
            'on_location',
            'secured',
            'cannot_secure',
            'cancelled',
            'crew_arrived',
            'review',
            'review_finished',
          ].indexOf(data.status) !== -1
        ) {
          shift = {
            id: job_worker_id,
            status: data.status === 'cancel' ? 'cancelled' : data.status,
          };
        }
        dispatch({ type: UPDATE_JOB_WORKER_REQUEST});
        HttpService.put(
          `/jobs/${job_id}/workers/${job_worker_id}`,
          data,
          (response) => {
            dispatch({ type: UPDATE_JOB_WORKER_SUCCESS, job: response.job , shift });
            return resolve(response);
          },
          (error) => {
            console.log(error);
            dispatch({ type: UPDATE_JOB_WORKER_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_JOB_WORKER_ERROR });
    }
  };
}

export function addShift(job_id, location_id): any {
  return function (dispatch, getState) {
    try {
      return new Promise<void>((resolve, reject) => {
        dispatch({ type: ADD_SHIFT_REQUEST });
        HttpService.post(
          `/jobs/${job_id}/locations/${location_id}/add-shift`,
          {},
          (response) => {
            dispatch({ type: ADD_SHIFT_SUCCESS, job: response.job });
            return resolve();
          },
          (error) => {
            dispatch({ type: ADD_SHIFT_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: ADD_SHIFT_ERROR });
    }
  };
}

export function updateJobWorkers(job_id, worker): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: UPDATE_JOB_WORKERS_REQUEST });
        HttpService.put(
          `/jobs/${job_id}/worker-admin`,
          worker,
          (response) => {
            dispatch({ type: UPDATE_JOB_WORKERS_SUCCESS, job: {...response, workerAction: worker} });
            return resolve(response);
          },
          (error) => {
            dispatch({ type: UPDATE_JOB_WORKERS_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_JOB_WORKERS_ERROR });
    }
  };
}

export function addJobLocation(job_id, data): any {
  return function (dispatch) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: ADD_JOB_LOCATION_REQUEST });
        HttpService.post(
          `/jobs/${job_id}/locations`,
          data,
          (response) => {
            dispatch({ type: ADD_JOB_LOCATION_SUCCESS, job: response.job });
            return resolve(response);
          },
          (error) => {
            console.log(error);
            dispatch({ type: ADD_JOB_LOCATION_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: ADD_JOB_LOCATION_ERROR });
    }
  };
}

export function updateJobLocation(job_id, data, location_id): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: UPDATE_JOB_LOCATION_REQUEST });
        HttpService.put(
          `/jobs/${job_id}/locations/${location_id}`,
          data,
          (response) => {
            console.log('response', response);
            dispatch({ type: UPDATE_JOB_LOCATION_SUCCESS, job: response.job });

            return resolve(response);
          },
          (error) => {
            console.log(error);
            dispatch({ type: UPDATE_JOB_LOCATION_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: UPDATE_JOB_LOCATION_ERROR });
    }
  };
}

export function deleteJobLocation(job_id, location_id): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: DELETE_JOB_LOCATION_REQUEST });
        HttpService.delete(
          `/jobs/${job_id}/locations/${location_id}`,
          {},
          (response) => {
            dispatch({ type: DELETE_JOB_LOCATION_SUCCESS, job: {response, job_id, location_id } });
            return resolve(response);
          },
          (error) => {
            console.log(error);
            dispatch({ type: DELETE_JOB_LOCATION_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: DELETE_JOB_LOCATION_ERROR });
    }
  };
}

export function calculateStats(): any {
  return function (dispatch, getState) {
    const jobs = getState().jobs.jobs.results;
    let total_jobs = jobs.length;
    let total_workers_assigned = 0;
    let total_workers_needed = 0;
    jobs.forEach((job) => {
      total_workers_assigned += job.workers.length;
      total_workers_needed += job.maxWorkers;
    });
    let stats = {
      total_jobs,
      total_workers_assigned,
      total_workers_needed,
    };
    dispatch({ type: CALCULATE_JOBS_STATS, stats });
  };
}

export function confirmJobs(job_ids): any {
  return function (dispatch, getState) {
    try {
      return new Promise<void>((resolve, reject) => {
        dispatch({ type: CONFIRM_JOB_REQUEST });
        HttpService.post(
          '/jobs/confirm',
          { ids: job_ids, confirmed: 1 },
          (response) => {
            dispatch({ type: CONFIRM_JOB_SUCCESS, job_ids });
            return resolve();
          },
          (error) => {
            console.log(error);
            dispatch({ type: CONFIRM_JOB_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: CONFIRM_JOB_ERROR });
    }
  };
}

export function updatePOS(job_ids, po_number, requisition?, receipt?): any {
  return function (dispatch, getState) {
    try {
      return new Promise<void>((resolve, reject) => {
        dispatch({ type: UPDATE_PO_NUMBER_REQUEST });
        HttpService.post(
          '/jobs/pos',
          { ids: job_ids, newPo: po_number, requisition: requisition, receipt: receipt },
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
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_PO_NUMBER_ERROR });
    }
  };
}
export function updatePO(job_ids, po_number): any {
  return function (dispatch, getState) {
    try {
      return new Promise<void>((resolve, reject) => {
        dispatch({ type: UPDATE_PO_NUMBER_REQUEST });
        HttpService.post(
          '/jobs/pos',
          { ids: job_ids, newPo: po_number },
          (response) => {
            dispatch({ type: UPDATE_PO_NUMBER_SUCCESS, job_ids, po_number });
            return resolve();
          },
          (error) => {
            console.log(error);
            dispatch({ type: UPDATE_PO_NUMBER_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: UPDATE_PO_NUMBER_ERROR });
    }
  };
}

export function updateFilters(search_options): any {
  return function (dispatch, getState) {
    let storage_filters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
    dispatch({
      type: UPDATE_FILTERS,
      filters: { ...storage_filters, ...search_options },
    });
    dispatch(retrieve());
  };
}

export function assignWorkersToJob(workers): any {
  return function (dispatch, getState) {
    dispatch({ type: ASSIGN_WORKERS_TO_JOB, workers: workers });
  };
}

export function sortASAP(): any {
  return function (dispatch, getState) {
    let jobs = getState().jobs.jobs.results;
    const temp = [];

    /*jobs.forEach((project, index) => {
      const createTimeStampFromId = project.id.toString().substring(0, 8);
      const createDateTime = new Date(
        parseInt(createTimeStampFromId, 16) * 1000
      );
      //const createDateTime = new Date(project.created_at);
      const createDate = moment(createDateTime).format('YYYY-MM-DD');
      const currentDate = moment(Date.now()).format('YYYY-MM-DD');
      const requestTime = Date.parse(project.requestTime.toString());
      const createTime = createDateTime.setHours(createDateTime.getHours() + 4);

      if (createDate === currentDate && requestTime < createTime) {
        temp.unshift(project);
      } else {
        temp.push(project);
      }
    });*/

    jobs.forEach((project, index) => {
      const createTime = Date.parse(project.created_at.toString());
      //const createTime = Date.parse(new Date().toString());
      const requestTime = Date.parse(project.start_at.toString());

      let diff = Math.abs(createTime - requestTime);
      diff = Math.floor((diff / (1000 * 60 * 60)) % 24);

      //console.log(diff);

      if (diff >= 1 && (project.status==='new' || project.status==='in_progress' )) {
        temp.unshift(project);
      } else {
        temp.push(project);
      }
    });

    dispatch({ type: SORT_ASAP, jobs: temp });

    
  };
}

export function sortLocationsASAP(): any {
  return function (dispatch, getState) {
    let jobs = getState().jobs.jobs_locations;
    const temp = [];

    jobs.forEach((project, index) => {
      const createTime = Date.parse(project.created_at.toString());
      //const createTime = Date.parse(new Date().toString());
      const requestTime = Date.parse(project.start_at.toString());

      let diff = Math.abs(createTime - requestTime);
      diff = Math.floor((diff / (1000 * 60 * 60)) % 24);

      //console.log(diff);

      if (diff >= 1 && project.status==='pending') {
        temp.unshift(project);
      } else {
        temp.push(project);
      }
    });

    dispatch({ type: SORT_LOCATIONS_ASAP, jobs: temp });
  };
}

// works
export function uploadImages(images): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: JOB_UPLOAD_IMAGE_REQUEST });
        console.log(images);
        HttpService.postImages(
          `/jobs/upload/job-image`,
          images,
          (response) => {
            dispatch({ type: JOB_UPLOAD_IMAGE_SUCCESS, img_data: response });
          },
          (error) => {
            console.log(error);
            dispatch({ type: JOB_UPLOAD_IMAGE_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: JOB_UPLOAD_IMAGE_ERROR });
    }
  };
}

//
export function createJob(data): any {
  return function (dispatch, getState) {
    try {
      console.log('CREATE JOB');
      console.log('CREATE JOB');
      return new Promise((resolve, reject) => {
        dispatch({ type: JOB_CREATE_REQUEST });
        HttpService.postJSON(
          `/jobs`,
          data,
          (response) => {
            dispatch({ type: JOB_CREATE_SUCCESS, job: response.job.id });
            history.push(`/job/${response.job.id}`);
            dispatch(retrieve());
            return resolve(response.job);
          },
          (error) => {
            dispatch({ type: JOB_CREATE_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: JOB_CREATE_ERROR });
    }
  };
}
