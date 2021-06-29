import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  workers: [],
  processing: false,
  search_options: {
    page: 1,
    limit: 100,
    totalPage: 0,
    total: 0
  }
});

let workers = [];
let filters;

export default function (state = initialState, { type, ...action }) {
  switch (type) {
    case actionTypes.GET_WORKERS_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.GET_WORKERS_SUCCESS:
      return state.merge({
        processing: false,
        workers: action.workers,
      });
    case actionTypes.GET_WORKERS_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.GET_WORKERS_ERROR:
      return state.merge({
        processing: false,
      });

    case actionTypes.UPDATE_FILTER_OPTIONS:
      filters = {
        ...state.search_options,
        ...action.filters,
      };
      return state.merge({
        search_options: filters,
    });

    // Update Worker Status
    case actionTypes.UPDATE_WORKER_STATUS_REQUEST:
      return state.merge({
        processing: true,
      });

    case actionTypes.UPDATE_WORKER_STATUS_SUCCESS:
      workers = state.workers.asMutable();
      workers = workers.map((worker) =>
        worker.id === action.worker.id
          ? {
              ...worker,
              status: action.worker.status,
            }
          : worker
      );
      return state.merge({
        processing: false,
        workers: workers,
      });

    case actionTypes.UPDATE_WORKER_STATUS_FAIL:
      return state.merge({
        processing: false,
      });

    case actionTypes.UPDATE_WORKER_STATUS_ERROR:
      return state.merge({
        processing: false,
      });

    // UPDATE WORKER
    case actionTypes.UPDATE_WORKER_REQUEST:
    return state.merge({
      processing: true,
    });

    case actionTypes.UPDATE_WORKER_SUCCESS:
      workers = state.workers.asMutable();
      workers = workers.map((worker) =>
        worker.id === action.worker.id ? action.worker : worker
      );
      return state.merge({
        processing: false,
        workers: workers,
      });

    case actionTypes.UPDATE_WORKER_FAIL:
      return state.merge({
        processing: false,
      });

    case actionTypes.UPDATE_WORKER_ERROR:
      return state.merge({
        processing: false,
      });

    case actionTypes.LOGOUT:
      return state.merge(initialState);

    default:
      return state;
  }
}
