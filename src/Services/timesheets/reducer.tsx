import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';
import { FILTERS_STORAGE_KEY } from './actions';
import { startBatch } from 'mobx/lib/internal';

const initialState = Immutable({
  search_options: localStorage.getItem(FILTERS_STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY))
    : {
        per_page: 100,
        order_by: 'timesheets.start_at',
        order_by_type: false
      },
  timesheets: [],
  processing_key: '',
  processing: false,
  currentPage: 1,
});

let filters;
let timesheets;
let timesheet;

export default function (state = initialState, { type, ...action }) {
  switch (type) {
    case actionTypes.GET_TIMESHEETS_REQUEST:
      return state.merge({
        processing: true,
        processing_key: action.processing_key
      });
    case actionTypes.GET_TIMESHEETS_SUCCESS:
      if (action.processing_key === state.processing_key) {
        return state.merge({
          processing: false,
          timesheets: action.timesheets
        });
      } else {
        return state;
      }
    case actionTypes.GET_TIMESHEETS_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.GET_TIMESHEETS_ERROR:
      return state.merge({
        processing: false,
      });
    case actionTypes.LOAD_EXACT_PAGE:
      return state.merge({
        timesheets: action.timesheets,
        processing: false,
      });

     // UPDATE TIMESHEET 
    case actionTypes.UPDATE_TIMESHEETS_REQUEST: 
      return state.merge({
        processing: true,
      })
    case actionTypes.UPDATE_TIMESHEETS_SUCCESS:
      let index = state.timesheets.results.findIndex(i => i.id === action.timesheet.id);
      if(index === -1){
        return state;
      } else {
        timesheets = JSON.parse(JSON.stringify(state.timesheets));
        timesheet = Immutable.asMutable(timesheets.results[index]);
        timesheet = action.timesheet;
        timesheets.results[index] = action.timesheet;
        //console.log(job);
      console.log(timesheets)
      return state.merge({
        processing: false,
        timesheets: timesheets,
      })
    }
    case actionTypes.UPDATE_TIMESHEETS_FAIL:
      return state.merge({
        processing: false,
      })
    case actionTypes.UPDATE_TIMESHEETS_ERROR:
      return state.merge({
        processing: false,
      })

  // DELEET TIMESHEET 
    case actionTypes.DELETE_TIMESHEETS_REQUEST: 
      return state.merge({
        processing: true,
      })
    case actionTypes.DELETE_TIMESHEETS_SUCCESS:
      let i = state.timesheets.results.findIndex(i => i.id === action.timesheet.id);
      if(i === -1){
        return state;
      } else {
        timesheets = JSON.parse(JSON.stringify(state.timesheets));
        timesheets.results = timesheets.results.filter(i => i.id !== action.timesheet.id);
      return state.merge({
        processing: false,
        timesheets: timesheets,
      })
    }
    case actionTypes.DELETE_TIMESHEETS_FAIL:
      return state.merge({
        processing: false,
      })
    case actionTypes.DELETE_TIMESHEETS_ERROR:
      return state.merge({
        processing: false,
      })

    case actionTypes.UPDATE_FILTERS:
      filters = {
        ...state.search_options,
        ...action.filters,
      };
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
      return state.merge({
        search_options: filters,
      });

    case actionTypes.LOGOUT:
      return state.merge(initialState);

    default:
      return state;
  }
}
