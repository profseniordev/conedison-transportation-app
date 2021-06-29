import HttpService from '../HttpService';

import * as actionTypes from './actionTypes';
export const FILTERS_STORAGE_KEY = 'invoices.filters';

export function getInvoices(search_options): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: actionTypes.GET_INVOICES_REQUEST });
      // let search_options = getState().timesheets.search_options.asMutable();
      // let search_options = getState().invoices.search_options.asMutable();

      HttpService.get(
        '/invoices/configs',
        search_options,
        (response) => {
          let search_options = {
            page: response.page,
            limit: response.limit,
            totalPage:response.totalPage,
            total:response.total,
          };
          dispatch({
            type: actionTypes.GET_INVOICES_SUCCESS,
            response: response,
          });
        },
        (error) => {
          dispatch({ type: actionTypes.GET_INVOICES_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: actionTypes.GET_INVOICES_ERROR });
    }
  };
}

export function getSubInvoices(id, search_options): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: actionTypes.GET_SUB_INVOICES_REQUEST });
      HttpService.get(
        `/invoices/configs/${id}/invoices`,
        search_options,
        (response) => {
          let search_options = {
            page: response.page,
            limit: response.limit,
            totalPage: response.totalPage,
            total: response.total,
          };
          dispatch({
            type: actionTypes.GET_SUB_INVOICES_SUCCESS,
            list: response.results,
          });
        },
        (error) => {
          dispatch({ type: actionTypes.GET_SUB_INVOICES_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: actionTypes.GET_SUB_INVOICES_ERROR });
    }
  };
}

export function getInvoice(id, search_options?: any, jobType = 3): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: actionTypes.GET_INVOICE_REQUEST });
      HttpService.get(
        `/invoices/${id}/timesheets/${jobType}`,
        search_options,
        (response) => {
          console.log('GET_INVOICE_SUCCESS - responce', response);
          // dispatch({
          //   type: actionTypes.GET_INVOICE_SUCCESS,
          //   list: results,
          //   pagination: { limit, page, total },
          // });
        },
        (error) => {
          dispatch({ type: actionTypes.GET_INVOICE_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: actionTypes.GET_INVOICE_ERROR });
    }
  };
}

export function getTimesheets(config_id, invoice_id): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: actionTypes.GET_INVOICE_TIMESHEETS_REQUEST });
      HttpService.get(
        `/invoices/configs/${config_id}/invoices/${invoice_id}/timesheets`,
        {},
        (response) => {
          console.log('GET_INVOICE_TIMESHEETS_SUCCESS - responce', response);
           dispatch({
             type: actionTypes.GET_INVOICE_TIMESHEETS_SUCCESS,
             timesheets: response.results
           });
        },
        (error) => {
          dispatch({ type: actionTypes.GET_INVOICE_TIMESHEETS_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: actionTypes.GET_INVOICE_TIMESHEETS_ERROR });
    }
  };
}

export function getConfiguration(config_id): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: actionTypes.GET_CONFIGURATION_REQUEST });
      HttpService.get(
        `/invoices/configs/${config_id}`,
        {},
        (response) => {
          console.log('GET_CONFIGURATION_SUCCESS - responce', response);
           dispatch({
             type: actionTypes.GET_CONFIGURATION_SUCCESS,
             conf: response.config
           });
        },
        (error) => {
          dispatch({ type: actionTypes.GET_CONFIGURATION_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: actionTypes.GET_CONFIGURATION_ERROR });
    }
  };
}


export function createInvoiceOld(data): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: actionTypes.CREATE_INVOICE_REQUEST });
      HttpService.post(
        `/invoices/configs`,
        data,
        (response) => {
          // dispatch({
          //   type: actionTypes.CREATE_INVOICE_SUCCESS,
          //   list: results,
          //   pagination: { limit, page, total },
          // });
        },
        (error) => {
          dispatch({ type: actionTypes.CREATE_INVOICE_FAIL });
        }
      );
    } catch (error) {
      dispatch({ type: actionTypes.CREATE_INVOICE_ERROR });
    }
  };
}

//iptate invoice configuration
export function updateInvoice(id, data): any {
  return function (dispatch, getState) {
    try {
      return new Promise<void>((resolve, reject) => {
        dispatch({ type: actionTypes.UPDATE_INVOICE_REQUEST });
        HttpService.putPure(
          `/invoices/configs/${id}`,
          data,
          (response) => {
            dispatch({ type: actionTypes.UPDATE_INVOICE_SUCCESS, item: response.invoice_config });
            return resolve(response);
          },
          (error) => {
            dispatch({ type: actionTypes.UPDATE_INVOICE_FAIL });
            console.log(error)
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: actionTypes.UPDATE_INVOICE_ERROR });
    }
  };
}

//Deactivate invoice configuration
export function deleteInvoice(id): any {
  return function (dispatch, getState) {
    try {
      return new Promise<void>((resolve, reject) => {
        dispatch({ type: actionTypes.DELETE_INVOICE_REQUEST });
        HttpService.delete(
          `/invoices/configs/${id}`,
          {},
          (response) => {
            dispatch({ type: actionTypes.DELETE_INVOICE_SUCCESS, item: {id, response} });
            return resolve(response);
          },
          (error) => {
            dispatch({ type: actionTypes.DELETE_INVOICE_FAIL });
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: actionTypes.DELETE_INVOICE_ERROR });
    }
  };
}


export function retrieve(search_options): any {
  return function (dispatch, getState) {
    try {
      dispatch({ type: actionTypes.GET_INVOICES_REQUEST });
      if (search_options == null) {
        search_options = getState().invoices.search_options.asMutable();
      }
      HttpService.get(
        '/invoices/configs',
        search_options,
        (response) => {
          let search_options = {
            page: response.page,
            limit: response.limit,
            totalPage: response.totalPage,
            total: response.total,
          };
          dispatch({
            type: actionTypes.GET_INVOICES_SUCCESS,
            list: response.results,
            search_options: search_options,
          });
        },
        (error) => {
          dispatch({ type: actionTypes.GET_INVOICES_FAIL });
          console.log(error);
        }
      );
    } catch (error) {
      dispatch({ type: actionTypes.GET_INVOICES_ERROR });
    }
  };
}

export function createInvoice(data) {
  return function (dispatch, getState) {
    try {
      return new Promise((resolve, reject) => {
        const current_search_options = getState().invoices.search_options;
        dispatch({ type: actionTypes.CREATE_INVOICE_REQUEST });
        HttpService.postJSON(
          '/invoices/configs',
          data,
          (response) => {
            dispatch({
              type: actionTypes.CREATE_INVOICE_SUCCESS,
              list: response.results,
            });
            dispatch(retrieve(current_search_options));
            return resolve(response);
          },
          (error) => {
            dispatch({ type: actionTypes.CREATE_INVOICE_FAIL });
            console.log(error);
            return reject();
          }
        );
      });
    } catch (error) {
      dispatch({ type: actionTypes.CREATE_INVOICE_ERROR });
    }
  };
}

export function initFilters(): any {
  return function (dispatch, getState) {
    let storage_filters = JSON.parse(localStorage.getItem(FILTERS_STORAGE_KEY));
    dispatch({ type: actionTypes.UPDATE_FILTERS, filters: storage_filters });
    dispatch(retrieve(storage_filters));
  };
}

export function updateFilters(search_options): any {
  return function (dispatch, getState) {
    const current_search_options = getState().invoices.search_options;
    const new_search_options = { ...current_search_options, ...search_options };
    dispatch({ type: actionTypes.UPDATE_FILTERS, filters: new_search_options });
    dispatch(retrieve(new_search_options));
    localStorage.setItem(
      FILTERS_STORAGE_KEY,
      JSON.stringify(new_search_options)
    );
  };
}
