import HttpService from '../HttpService';
import {
    SEND_REPORT_PAYROLL_REQUEST,
    SEND_REPORT_PAYROLL_SUCCESS,
    SEND_REPORT_PAYROLL_FAIL,
    SEND_REPORT_PAYROLL_ERROR,
    SEND_REPORT_DAILY_REQUEST,
    SEND_REPORT_DAILY_SUCCESS,
    SEND_REPORT_DAILY_FAIL,
    SEND_REPORT_DAILY_ERROR,
    SEND_REPORT_WEEKLY_REQUEST,
    SEND_REPORT_WEEKLY_SUCCESS,
    SEND_REPORT_WEEKLY_FAIL,
    SEND_REPORT_WEEKLY_ERROR,
    SEND_REPORT_METRICS_REQUEST,
    SEND_REPORT_METRICS_SUCCESS,
    SEND_REPORT_METRICS_FAIL,
    SEND_REPORT_METRICS_ERROR,
} from './actionTypes';

export function sendReportPayroll(data): any {
  return function (dispatch, getState) {
    try {
    return new Promise<void>((resolve, reject) => {
      dispatch({ type: SEND_REPORT_PAYROLL_REQUEST });
      HttpService.getReport(
        '/report/payroll',
        data,
        (response) => {
          dispatch({
            type: SEND_REPORT_PAYROLL_SUCCESS
          });
          return resolve(response);
        },
        (error) => {
          dispatch({ type:  SEND_REPORT_PAYROLL_FAIL });
          return reject(error);
        }
      );
    });
    } catch (error) {
      dispatch({ type: SEND_REPORT_PAYROLL_ERROR });
    }
  };
}

export function sendReportDaily(data): any {
  return function (dispatch, getState) {
    try {
    return new Promise<void>((resolve, reject) => {
      dispatch({ type: SEND_REPORT_DAILY_REQUEST });
      HttpService.getReport(
        '/report/daily',
        data,
        (response) => {
          dispatch({
            type: SEND_REPORT_DAILY_SUCCESS
          });
          return resolve(response);
        },
        (error) => {
          dispatch({ type:  SEND_REPORT_DAILY_FAIL });
          console.log(error);
          return reject();
        }
      );
    });
    } catch (error) {
      dispatch({ type: SEND_REPORT_DAILY_ERROR });
    }
  };
}

export function sendReportWeekly(data): any {
  return function (dispatch, getState) {
    try {
    return new Promise<void>((resolve, reject) => {
      dispatch({ type: SEND_REPORT_WEEKLY_REQUEST });
      HttpService.getReport(
        '/report/weekly',
        data,
        (response) => {
          dispatch({
            type: SEND_REPORT_WEEKLY_SUCCESS
          });
          return resolve(response);
        },
        (error) => {
          dispatch({ type:  SEND_REPORT_WEEKLY_FAIL });
          console.log(error);
          return reject();
        }
      );
    });
    } catch (error) {
      dispatch({ type: SEND_REPORT_WEEKLY_ERROR });
    }
  };
}

export function sendReporMetrics(data): any {
  return function (dispatch, getState) {
    try {
      return new Promise<void>((resolve, reject) => {
        dispatch({ type: SEND_REPORT_METRICS_REQUEST });
        HttpService.getReport(
          '/report/metrics',
          data,
          (response) => {
            dispatch({
              type: SEND_REPORT_METRICS_SUCCESS
            });
            return resolve(response);
          },
          (error) => {
            dispatch({ type: SEND_REPORT_METRICS_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: SEND_REPORT_METRICS_ERROR});
    }
  };
}