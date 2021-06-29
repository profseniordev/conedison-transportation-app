import HttpService from '../HttpService';
import {
  SEARCH_SUPERVISORS_ERROR,
  SEARCH_SUPERVISORS_FAIL,
  SEARCH_SUPERVISORS_REQUEST,
  SEARCH_SUPERVISORS_SUCCESS,
} from './actionTypes';

export function search(search_options): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: SEARCH_SUPERVISORS_REQUEST });
        HttpService.get(
          '/supervisors',
          search_options,
          (response) => {
            dispatch({
              type: SEARCH_SUPERVISORS_SUCCESS,
              supervisors: response.supervisors,
            });
            return resolve(response.supervisors);
          },
          (error) => {
            dispatch({ type: SEARCH_SUPERVISORS_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: SEARCH_SUPERVISORS_ERROR });
    }
  };
}
