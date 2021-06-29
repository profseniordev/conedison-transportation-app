import HttpService from '../HttpService';
import * as actionTypes from './actionTypes';

export function retrieve(): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: actionTypes.GET_SUBCONTRACTORS_REQUEST });
      HttpService.get(
        '/subcontractors',
        {},
        (response) => {
          dispatch({
            type: actionTypes.GET_SUBCONTRACTORS_SUCCESS,
            subcontractors: response.results,
          });
        },
        (error) => {
          dispatch({ type: actionTypes.GET_SUBCONTRACTORS_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: actionTypes.GET_SUBCONTRACTORS_ERROR });
    }
  };
}
export function createSubcontractor(data) {
  return function (dispatch, getState) {
    try {
      return new Promise<void>((resolve, reject) => {
        dispatch({ type: actionTypes.CREATE_SUBCONTRACTOR_REQUEST });
        HttpService.post(
          '/subcontractors',
          data,
          (response) => {
            dispatch({
              type: actionTypes.CREATE_SUBCONTRACTOR_SUCCESS,
              subcontractors: response.results,
            });
            dispatch(retrieve());
            return resolve(response);
          },
          (error) => {
            dispatch({ type: actionTypes.CREATE_SUBCONTRACTOR_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: actionTypes.CREATE_SUBCONTRACTOR_ERROR });
    }
  };
}

export function updateSubcontractor(data) {
  console.log('updateSubcontractor data', data);
  return function (dispatch, getState) {
    try {
      // return new Promise((resolve, reject) => {
      // dispatch({ type: actionTypes.UPDATE_SUBCONTRACTOR_REQUEST });
      // HttpService.post(
      //   `/subcontractors/${data.id}`,
      //   data,
      //   (response) => {
      //     console.log('response', response);
      //     // dispatch({
      //     //   type: actionTypes.UPDATE_SUBCONTRACTOR_SUCCESS,
      //     //   subcontractors: response.results,
      //     // });
      //     // return resolve(response.results);
      //   },
      //   (error) => {
      //     console.log(error);
      //     dispatch({ type: actionTypes.UPDATE_SUBCONTRACTOR_FAIL });
      //     // return reject();
      //   }
      // );
      // });
    } catch (error) {
      dispatch({ type: actionTypes.UPDATE_SUBCONTRACTOR_ERROR });
    }
  };
}
