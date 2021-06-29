import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  processing: false,
});

let filters;

export default function (state = initialState, { type, ...action }) {
  switch (type) {
    case actionTypes.SEND_REPORT_PAYROLL_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.SEND_REPORT_PAYROLL_SUCCESS:
      return state.merge({
        processing: false,
        //report: action.report
      });
    case actionTypes.SEND_REPORT_PAYROLL_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.SEND_REPORT_PAYROLL_ERROR:
      return state.merge({
        processing: false,
      });
    case actionTypes.SEND_REPORT_DAILY_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.SEND_REPORT_DAILY_SUCCESS:
      return state.merge({
        processing: false,
          //report: action.report
      });
    case actionTypes.SEND_REPORT_DAILY_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.SEND_REPORT_DAILY_ERROR:
      return state.merge({
        processing: false,
      });
    case actionTypes.SEND_REPORT_WEEKLY_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.SEND_REPORT_WEEKLY_SUCCESS:
      return state.merge({
        processing: false,
          //report: action.report
      });
    case actionTypes.SEND_REPORT_WEEKLY_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.SEND_REPORT_WEEKLY_ERROR:
      return state.merge({
        processing: false,
      });
    case actionTypes.SEND_REPORT_METRICS_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.SEND_REPORT_METRICS_SUCCESS:
      return state.merge({
        processing: false,
          //report: action.report
      });
    case actionTypes.SEND_REPORT_METRICS_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.SEND_REPORT_METRICS_ERROR:
      return state.merge({
        processing: false,
      });
    case actionTypes.LOGOUT:
      return state.merge(initialState);

    default:
      return state;
  }
}
