import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';
import { FILTERS_STORAGE_KEY, LOCATIONS_FILTERS_STORAGE_KEY } from './actions';
import { JOB_STATUS_COLORS } from '../../Constants/colors';
import { WORKERS_STATUS } from '../../Constants/worker';

let jobs = null;
let job_ids = null;
let updated_jobs = null;
let filters = null;
let jobs_locations = null;

const initialState = Immutable({
  processing: false,
  search_options: {
    page: 0,
    per_page: 75,
    search: '',
    sort_by: 'rides.pickup_at',
    sort_by_type: false,
    limit: 5000,
    jobStatus: [0, 1],
    job_type: [],
  },
  // jobs locations
  jobs_locations: [],
  selected_location: null,
  locations_processing: false,
  jobs_locations_processing_key: null,
  location_job_processing: false,
  add_worker_processing: false,
  update_worker_processing: false,
  selected_location_id: 0,
  location_job: null,
  create_job_processing: false,
  re_route_location: false,
  locations_search_options: {
    page: 0,
    per_page: 75,
    total: 100,
    worker_statuses: '',
    job_statuses: 'new,in_progress',
    job_types: '',
    search: '',
    from_datetime: '',
    to_datetime: '',
    zones: [],
    workers_unconfirmed: '',
    unconfirmed: '',
  },
  jobs: {
    results: [],
    page: 0,
    totalPage: 0,
    total: 0,
    limit: 0,
  },
  stats: {
    total_jobs: 0,
    total_workers_assigned: 0,
    total_workers_needed: 0,
  },
  confirmed_jobs: [],
  unconfirmed_jobs: [],
  img_data: null,
  processing_key: null,
  confirm_jobs_processing: false,
  update_po_number_processing: false,
  job: null,
  job_id: '',
  retrieve_job_processing: false,
  update_job_processing: false,
  total: 0,
});

let new_job; 

export default function (state = initialState, { type, ...action }) {
  switch (type) {
    case actionTypes.GET_JOBS_REQUEST:
      return state.merge({
        processing: true,
        processing_key: action.processing_key,
      });
    case actionTypes.GET_JOBS_SUCCESS:
      if (action.processing_key === state.processing_key) {
        return state.merge({
          processing: false,
          jobs: action.response,
        });
      } else {
        return state;
      }
    case actionTypes.GET_JOBS_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.GET_JOBS_ERROR:
      return state.merge({
        processing: false,
      });

    case actionTypes.GET_JOBS_LOCATIONS_REQUEST:
      return state.merge({
        locations_processing: true,
        // page         : action['page'],
        jobs_locations_processing_key: action.processing_key,
      });
    case actionTypes.GET_JOBS_LOCATIONS_SUCCESS:
      if (action.processing_key === state.jobs_locations_processing_key) {
        return state.merge({
          locations_processing: false,
          jobs_locations: action.jobs,
          total: action.total,
        });
      } else {
        return state;
      }
    case actionTypes.GET_JOBS_LOCATIONS_FAIL:
      return state.merge({
        locations_processing: false,
      });
    case actionTypes.GET_JOBS_LOCATIONS_ERROR:
      return state.merge({
        locations_processing: false,
      });

    // RETRIEVE_LOCATION_JOB
    case actionTypes.RETRIEVE_LOCATION_JOB_REQUEST:
      return state.merge({
        location_job_processing: true,
        selected_location_id: action.selected_location_id
          ? action.selected_location_id
          : state.selected_location_id,
      });
    case actionTypes.RETRIEVE_LOCATION_JOB_SUCCESS:
      return state.merge({
        location_job_processing: false,
        location_job: action.job,
      });
    case actionTypes.RETRIEVE_LOCATION_JOB_FAIL:
      return state.merge({
        location_job_processing: false,
      });
    case actionTypes.RETRIEVE_LOCATION_JOB_ERROR:
      return state.merge({
        location_job_processing: false,
      });

    // ADD_WORKER
    case actionTypes.ADD_WORKER_REQUEST:
      return state.merge({
        add_worker_processing: true,
      });
    case actionTypes.ADD_WORKER_SUCCESS:
      jobs_locations = state.jobs_locations.asMutable();
      jobs_locations.map((shift, index) => {
        action.job.workers.map((job_worker) => {
          if (job_worker.id === shift.id) {
            jobs_locations[index] = {
              ...shift,
              ...job_worker,
            };
          }
        });
      });

      return state.merge({
        add_worker_processing: false,
        location_job: action.job,
        jobs_locations: jobs_locations,
      });
    case actionTypes.ADD_WORKER_FAIL:
      return state.merge({
        add_worker_processing: false,
      });
    case actionTypes.ADD_WORKER_ERROR:
      return state.merge({
        add_worker_processing: false,
      });

    // UPDATE_JOB_STATUS_REQUEST
    case actionTypes.UPDATE_JOB_STATUS_REQUEST:
      return state.merge({});
    case actionTypes.UPDATE_JOB_STATUS_SUCCESS:
      jobs_locations = state.jobs_locations.asMutable();
      jobs = state.jobs.asMutable();
      jobs_locations.map((shift, index) => {
        action.job.workers.map((job_worker) => {
          if (job_worker.id === shift.id) {
            jobs_locations[index] = {
              ...shift,
              ...job_worker,
            };
          }
        });
      });

      jobs.results.map((job, index) => {
        action.job.workers.map((job_worker) => {
          if (job_worker.job_id === job.id) {
            job = { 
              ...job,
              ...job_worker.status,
            }
          }
        });
      });

      return state.merge({
        location_job: action.job,
        jobs_locations: jobs_locations,
        jobs: jobs
      });
    case actionTypes.UPDATE_JOB_STATUS_FAIL:
      return state.merge({});
    case actionTypes.UPDATE_JOB_STATUS_ERROR:
      return state.merge({});

    // UPDATE_JOB_WORKER
    case actionTypes.UPDATE_JOB_WORKER_REQUEST:
        return state.merge({
          update_worker_processing: true,
        });
    case actionTypes.UPDATE_JOB_WORKER_SUCCESS:
      jobs_locations = state.jobs_locations.asMutable();
      jobs_locations.map((shift, index) => {
        if(action.shift && shift.id === action.shift.id) {
          shift = {
            ...shift,
            ...action.shift,
          }
        }
        action.job.workers.map((job_worker) => {
          if (job_worker.id === shift.id) {
            jobs_locations[index] = {
              ...shift,
              ...job_worker,
            };
          }
        });
      });

      updated_jobs = JSON.parse(JSON.stringify(state.jobs)); 
      updated_jobs.results.map((job, index) => {
        if (job.id === action.job.id) {
          action.job.workers.map((job_worker) => {
            job.workers.map((w, i) => {  
              if (job_worker.worker_id === w.id && job_worker.location_id === w.locationID && job_worker.id === w.shift_id ) {
                updated_jobs.results[index].workers[i] = {
                  ...w,
                  status: WORKERS_STATUS.indexOf(job_worker.status),
                  workerStatus: job_worker.status
                }
              }
            });
          new_job = updated_jobs.results[index];
        })
      }
      });    

      console.log(updated_jobs)
      return state.merge({
        update_worker_processing: false,
        location_job: action.job,
        jobs_locations: jobs_locations,
        jobs: updated_jobs,
        job: {...state.job, ...new_job},
      });
    case actionTypes.UPDATE_JOB_WORKER_FAIL:
    case actionTypes.UPDATE_JOB_WORKER_ERROR:
      return state.merge({
        update_worker_processing: false,
      });

    // ADD_JOB_LOCATION
    case actionTypes.ADD_JOB_LOCATION_REQUEST:
      return state.merge({
        add_job_location_processing: true,
      });
    case actionTypes.ADD_JOB_LOCATION_SUCCESS:
      return state.merge({
        add_job_location_processing: false,
        location_job: action.job,
      });
    case actionTypes.ADD_JOB_LOCATION_FAIL:
    case actionTypes.ADD_JOB_LOCATION_ERROR:
      return state.merge({
        add_job_location_processing: false,
      });
    // ADD SHIFT
    case actionTypes.ADD_SHIFT_SUCCESS:
      return state.merge({
        location_job: action.job,
      });

    // UPDATE JOB
    case actionTypes.UPDATE_JOB_LOCATION_REQUEST:
      return state.merge({
        add_job_location_processing: true,
      });
    case actionTypes.UPDATE_JOB_LOCATION_SUCCESS:
      return state.merge({
        add_job_location_processing: false,
        location_job: action.job,
      });
    case actionTypes.UPDATE_JOB_LOCATION_FAIL:
      return state.merge({
        add_job_location_processing: false,
      });
    case actionTypes.UPDATE_JOB_LOCATION_ERROR:
      return state.merge({
        add_job_location_processing: false,
      });

    // DELETE LOCATION
    case actionTypes.DELETE_JOB_LOCATION_REQUEST:
      return state.merge({
        add_job_location_processing: true,
      });
    case actionTypes.DELETE_JOB_LOCATION_SUCCESS:
      console.log(action)
      jobs_locations = state.jobs_locations.asMutable();
      jobs_locations = jobs_locations.filter((location) => action.job.location_id !== location.location_id);
      console.log(jobs_locations);
      let newJob = state.location_job.asMutable();
      newJob.locations = newJob.locations.filter((location) => action.job.location_id !== location.id);
      console.log(newJob)
      return state.merge({
        update_worker_processing: false,
        location_job: newJob,
        jobs_locations: jobs_locations,
      });
    case actionTypes.DELETE_JOB_LOCATION_FAIL:
      return state.merge({
        add_job_location_processing: false,
      });
    case actionTypes.DELETE_JOB_LOCATION_ERROR:
      return state.merge({
        add_job_location_processing: false,
      });

    // RETRIEVE JOB
    case actionTypes.RETRIEVE_JOB_REQUEST:
      return state.merge({
        retrieve_job_processing: true,
      });
    case actionTypes.RETRIEVE_JOB_SUCCESS:
      /*jobs = JSON.parse(JSON.stringify(state.jobs)); 
      jobs.results.map((job, index) => {
        if (job.id === action.job.id) {
          jobs.results[index] = action.job;
        }
      });*/
      return state.merge({
        retrieve_job_processing: false,
        job: action.job,
        //jobs: jobs
      });
    case actionTypes.RETRIEVE_JOB_FAIL:
      return state.merge({
        retrieve_job_processing: false,
      });
    case actionTypes.RETRIEVE_JOB_ERROR:
      return state.merge({
        retrieve_job_processing: false,
      });

    // CLEAR JOB
    case actionTypes.CLEAR_JOB:
      return state.merge({
        job: initialState.job,
      });

    // UPDATE JOB
    case actionTypes.UPDATE_JOB_REQUEST:
      return state.merge({
        update_job_processing: true,
      });
    case actionTypes.UPDATE_JOB_SUCCESS:
      updated_jobs = JSON.parse(JSON.stringify(state.jobs)); 
      updated_jobs.results.map((job, index) => {
        if (job.id === action.job.id) {
          updated_jobs.results[index] = {
            ...job,
            ...action.job,
          }
          //new_job = updated_jobs.results[index];
        }
        });    
      return state.merge({
        update_job_processing: false,
        job: action.job,
        jobs:  updated_jobs,
      });
    case actionTypes.UPDATE_JOB_FAIL:
      return state.merge({
        update_job_processing: false,
      });
    case actionTypes.UPDATE_JOB_ERROR:
      return state.merge({
        update_job_processing: false,
      });

    // UPDATE JOB WORKERS
    case actionTypes.UPDATE_JOB_WORKER_REQUEST:
      return state.merge({
        update_job_processing: true,
      });
    case actionTypes.UPDATE_JOB_WORKERS_SUCCESS:
      updated_jobs = JSON.parse(JSON.stringify(state.jobs)); 
      updated_jobs.results.map((job, index) => {
        if (job.id === action.job.id) {
          updated_jobs.results[index] = {
            ...job,
            ...action.job,
          }
          updated_jobs.results[index].workers.map((w, i) => {
           if(w.id === action.job.workerAction.id && w.locationID === action.job.workerAction.locationID) {
            updated_jobs.results[index].workers[i] = {
              ...w,
              ...action.job.workerAction,
            }
          }
          new_job = updated_jobs.results[index];
        })
      }
      });    
      return state.merge({
        update_job_processing: false,
        job: new_job,
        jobs:  updated_jobs,
      });
    case actionTypes.UPDATE_JOB_WORKERS_FAIL:
      return state.merge({
        update_job_processing: false,
      });
    case actionTypes.UPDATE_JOB_WORKERS_ERROR:
      return state.merge({
        update_job_processing: false,
      });


    case actionTypes.CALCULATE_JOBS_STATS:
      return state.merge({
        stats: {
          ...state.stats,
          ...action.stats,
        },
      });
    case actionTypes.SOCKET_JOB_UPDATED:
      console.log(action);
      return state;

    // CONFIRM JOBS
    case actionTypes.CONFIRM_JOB_REQUEST:
      return state.merge({
        confirm_jobs_processing: true,
      });
    case actionTypes.CONFIRM_JOB_SUCCESS:
      jobs = state.jobs.results;
      job_ids = action.job_ids;
      updated_jobs = jobs.map((job) =>
        job_ids.indexOf(job.id) !== -1
          ? {
              ...job,
              confirmed: 1,
            }
          : job
      );

      let job = state.job;
      if (job) {
        job = job.asMutable();
        job_ids.forEach((job_id) => {
          if (job_id === job.id.toString()) {
            job.confirmed = 1;
          }
        });
      }

      return state.merge({
        jobs: {
          ...state.jobs,
          results: updated_jobs,
        },
        confirm_jobs_processing: false,
        job: job,
      });
    case actionTypes.CONFIRM_JOB_FAIL:
    case actionTypes.CONFIRM_JOB_ERROR:
      return state.merge({
        confirm_jobs_processing: false,
      });

    // UPDATE PO NUMBER
    case actionTypes.UPDATE_PO_NUMBER_REQUEST:
      return state.merge({
        update_po_number_processing: true,
      });
    case actionTypes.UPDATE_PO_NUMBER_SUCCESS:
      jobs = state.jobs.results;
      job_ids = action.job_ids;
      updated_jobs = jobs.map((job) =>
        job_ids.indexOf(job.id) !== -1
          ? {
              ...job,
              po: action.po_number ? action.po_number : job.po_number,
              requisition: action.requisition
                ? action.requisition
                : job.requisition,
            }
          : job
      );
      return state.merge({
        jobs: {
          ...state.jobs,
          results: updated_jobs,
        },
        update_po_number_processing: false,
      });
    case actionTypes.UPDATE_PO_NUMBER_FAIL:
    case actionTypes.UPDATE_PO_NUMBER_ERROR:
      return state.merge({
        update_po_number_processing: false,
      });

    case actionTypes.UPDATE_FILTERS:
      filters = {
        ...state.search_options,
        ...action.filters,
      };
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
      return state.merge({
        search_options: filters,
      });
    case actionTypes.UPDATE_LOCATIONS_FILTERS:
      filters = {
        ...state.locations_search_options,
        ...action.filters,
      };
      localStorage.setItem(
        LOCATIONS_FILTERS_STORAGE_KEY,
        JSON.stringify(filters)
      );
      return state.merge({
        locations_search_options: filters,
      });

    case actionTypes.SORT_ASAP:
      return state.merge({
        jobs: {
          ...state.jobs,
          results: action.jobs,
        },
      });

    case actionTypes.SORT_LOCATIONS_ASAP:
      return state.merge({
        jobs_locations: action.jobs
      });
    // UPLOAD IMAGE
    case actionTypes.JOB_UPLOAD_IMAGE_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.JOB_UPLOAD_IMAGE_SUCCESS:
      return state.merge({
        processing: false,
        img_data: action.img_data,
      });
    case actionTypes.JOB_UPLOAD_IMAGE_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.JOB_UPLOAD_IMAGE_ERROR:
      return state.merge({
        processing: false,
      });
    // CREATE JOB
    case actionTypes.JOB_CREATE_REQUEST:
      return state.merge({
        create_job_processing: true,
      });
    case actionTypes.JOB_CREATE_SUCCESS:
      return state.merge({
        create_job_processing: false,
        job_id: action.job.id
      });
    case actionTypes.JOB_CREATE_FAIL:
      return state.merge({
        create_job_processing: false,
      });
    case actionTypes.JOB_CREATE_ERROR:
      return state.merge({
        create_job_processing: false,
      });

    case actionTypes.LOGOUT:
      return state.merge(initialState);

    default:
      return state;
  }
}
