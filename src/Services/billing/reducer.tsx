import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  jobs: [],
  processing: false,
  update_po_number_processing: false,
  update_disputed: false,
  search_options: {
    page: 1,
    limit: 10,
    totalPage: 0,
    total: 0,
    startDate: '',
    finishDate: '',
    statuses: [],
    search: '',
  },
  status: {}
});

let filters;
let index;
let jobs;
let job;
let job_ids = null;
let updated_jobs = null;

export default function (state = initialState, { type, ...action }) {
  switch (type) {
    case actionTypes.GET_JOBS_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.GET_JOBS_SUCCESS:
      return state.merge({
        processing: false,
        jobs: action.jobs,
        search_options: {
          ...state.search_options,
          ...action.search_options
        }
      });
    case actionTypes.GET_JOBS_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.GET_JOBS_ERROR:
      return state.merge({
        processing: false,
      });
    case actionTypes.UPDATE_STATUS_JOB_REQUEST:
        return state.merge({
          processing: true,
        });
    case actionTypes.UPDATE_STATUS_JOB_SUCCESS:
      //console.log(action);
      index = state.jobs.findIndex(i => i.id === action.status.id);
      if(index === -1){
        return state;
      } else {
        jobs = JSON.parse(JSON.stringify(state.jobs));
        job = Immutable.asMutable(jobs[index]);
        job.billing_status = action.status.status;
        jobs[index] = job;
        //console.log(job);
        return state.merge({
          jobs: jobs,
          processing: false,
        });
      }
    case actionTypes.UPDATE_STATUS_JOB_FAIL:
        return state.merge({
          processing: false,
        });
    case actionTypes.UPDATE_STATUS_JOB_ERROR:
        return state.merge({
          processing: false,
    });

    case actionTypes.UPDATE_FILTERS:
      filters = {
        ...state.search_options,
        ...action.search_options,
      };
      return state.merge({
        search_options: filters,
      });

    case actionTypes.UPDATE_TIMESHEETS_SUCCESS:
      index = state.jobs.findIndex(i => i.id === action.timesheet.job_id);
      if(index === -1){
        return state;
      } else {
        jobs = JSON.parse(JSON.stringify(state.jobs));
        job = Immutable.asMutable(jobs[index]);
        let i = job.timesheets.findIndex(t => t.id === action.timesheet.id );
        const prevStatus = job.timesheets[i].verified;
        console.log(prevStatus);
        job.timesheets = job.timesheets.map((timesheet) => timesheet.id === action.timesheet.id ? {
            ...timesheet,
            ...action.timesheet,
            start_at: action.timesheet.startDate,
            finish_at: action.timesheet.finishDate
        } : timesheet);
        if(job.unverifiedCount > 0 && action.timesheet.isVerified && !prevStatus )
          job.unverifiedCount = job.unverifiedCount - 1;
        else if(!action.timesheet.isVerified && prevStatus )
          job.unverifiedCount = job.unverifiedCount + 1;
        //console.log(job.timesheets)
        jobs[index] = job;
        //console.log(job);
        return state.merge({
          jobs: jobs
        });
      }
    // UPDATE PO NUMBER, REQUISITION, RECEIPT
    case actionTypes.UPDATE_PO_NUMBER_REQUEST:
      return state.merge({
        update_po_number_processing: true,
      });
    case actionTypes.UPDATE_PO_NUMBER_SUCCESS:
      jobs = state.jobs;
      job_ids = action.job_ids;
      updated_jobs = jobs.map((job) =>
        job_ids.indexOf(job.id) !== -1
          ? {
              ...job,
              po: action.po_number,
              requisition: action.requisition,
              receipt_number: action.receipt
            }
          : job
      );
      return state.merge({
        jobs: updated_jobs,
        update_po_number_processing: false,
      });
    case actionTypes.UPDATE_PO_NUMBER_FAIL:
    case actionTypes.UPDATE_PO_NUMBER_ERROR:
      return state.merge({
        update_po_number_processing: false,
      });

    // UPDATE STATUS TO DISPUTED
    case actionTypes.UPDATE_DISPUTE_JOB_REQUEST:
      return state.merge({
        update_disputed: true,
    });
    case actionTypes.UPDATE_DISPUTE_JOB_SUCCESS:
      index = state.jobs.findIndex(i => i.id === action.result.id);
      if(index === -1){
        return state;
      } else {
        jobs = JSON.parse(JSON.stringify(state.jobs));
        job = Immutable.asMutable(jobs[index]);
        let i = job.timesheets.findIndex(t => t.id === action.result.data.id );
        job.timesheets = job.timesheets.map((timesheet) => timesheet.id === action.result.data.id ? {
            ...timesheet,
            dispute_reason: action.result.data.disputeReason,
        } : timesheet);
        job.billing_status = action.result.newStatus;
        jobs[index] = job;
        return state.merge({
          jobs: jobs,
          update_disputed: false,
        });
      }
    case actionTypes.UPDATE_DISPUTE_JOB_FAIL:
    case actionTypes.UPDATE_DISPUTE_JOB_ERROR:
      return state.merge({
        update_disputed: false,
      });

    case actionTypes.LOGOUT:
      return state.merge(initialState);

    default:
      return state;
  }
}
