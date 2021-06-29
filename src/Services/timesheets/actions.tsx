import HttpService from '../HttpService';

import * as actionTypes  from './actionTypes';
export const FILTERS_STORAGE_KEY = 'timesheets.filters';

export function retrieve(): any {
  return function (dispatch, getState) {
    try {
      let processing_key = Math.random();

      dispatch({ type: actionTypes.GET_TIMESHEETS_REQUEST, processing_key });
      let search_options = getState().timesheets.search_options.asMutable();

      HttpService.get(
        '/timesheets',
        search_options,
        (response) => {
          dispatch({ type: actionTypes.GET_TIMESHEETS_SUCCESS, timesheets: response, processing_key });
        },
        (error) => {
          dispatch({ type: actionTypes.GET_TIMESHEETS_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: actionTypes.GET_TIMESHEETS_ERROR });
    }
  };
}


export function update(id, data): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: actionTypes.UPDATE_TIMESHEETS_REQUEST });
        HttpService.put(
          `/timesheets/${id}`,
          data,
          (response) => {
            dispatch({ type: actionTypes.UPDATE_TIMESHEETS_SUCCESS, timesheet: response });
            return resolve(response);
          },
          (error) => {
            console.log(error)
            dispatch({ type: actionTypes.UPDATE_TIMESHEETS_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: actionTypes.UPDATE_TIMESHEETS_ERROR });
    }
  };
}

export function deleteTimesheet(id): any {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        dispatch({ type: actionTypes.DELETE_TIMESHEETS_REQUEST });
        HttpService.delete(
          `/timesheets/${id}`,
          {},
          (response) => {
            dispatch({ type: actionTypes.DELETE_TIMESHEETS_SUCCESS, timesheet: {response, id} });
            return resolve(response);
          },
          (error) => {
            dispatch({ type: actionTypes.DELETE_TIMESHEETS_FAIL });
            return reject(error);
          }
        );
      });
    } catch (error) {
      dispatch({ type: actionTypes.DELETE_TIMESHEETS_ERROR });
    }
  };
}


/*export function loadExactPage(params: any = {}) : any {
    return function(dispatch, getState) {
        const state = getState();
        let page = state.timesheets.page;
        try {
            HttpService.get('/timesheets', params, (response) => {
                dispatch({ type: LOAD_EXACT_PAGE, timesheets: response});
            }, (error) => {
                console.log(error);
            })

    }catch (error) {
        console.log(error);

    }
    }
}*/

export function updateFilters(search_options): any {
  return function (dispatch, getState) {
    // let storage_filters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
    dispatch({
      type: actionTypes.UPDATE_FILTERS,
      filters: search_options,
    });
    dispatch(retrieve());
  };
}

export function setSelectedWorker(worker): any {
    localStorage.setItem('timesheets.filters.worker', JSON.stringify(worker));
}
