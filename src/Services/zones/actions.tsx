import * as actionTypes from './actionTypes';
import HttpService from '../HttpService';

export function retrieve(): any {
  return function (dispatch, getState): any {
    try {
      dispatch({ type: actionTypes.GET_ZONES_REQUEST });
      HttpService.get(
        '/zones',
        {},
        (response) => {
          dispatch({
            type: actionTypes.GET_ZONES_SUCCESS,
            zones: response.zones,
            stats: response.stats,
          });
        },
        (error) => {
          dispatch({ type: actionTypes.GET_ZONES_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: actionTypes.GET_ZONES_ERROR });
    }
  };
}
