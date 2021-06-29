import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';
import { DEPARTMENT_GROUPS } from '../../Constants/user';


const initialState = Immutable({
  headers: [],
  sources: [],
  list: [],
  timesheets: [],
  sublist: [],
  conf: null,
  pagination: { page: 1, totalPage: 0, total: 0, limit: 100 },
  invoicePagination: { page: 1, totalPage: 0, total: 0, limit: 100 },
  invoice: {
    departmentType: DEPARTMENT_GROUPS.CONSTRUCTION_SERVICE_GROUP,
    timesheets: [],
    startDate: undefined,
    endDate: undefined,
  },
  processing: false,
  search_options: {
    page: 1,
    limit: 100,
    totalPage: 0,
    total: 0,
    startDate: '',
    finishDate: '',
    departments: [],
    billing_cycles: [],
  },
});

let filters;
let index;
let configs;
let config;


export default function (state = initialState, { type, ...action }) {
  switch (type) {
    //get configurations
    case actionTypes.GET_INVOICES_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.GET_INVOICES_SUCCESS:
      return state.merge({
        processing: false,
        list: action.list,
        pagination: action.pagination,
        search_options: action.search_options,
      });
    case actionTypes.GET_INVOICES_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.GET_INVOICES_ERROR:
      return state.merge({
        processing: false,
      });

    //get invoicef for configuration
    case actionTypes.GET_SUB_INVOICES_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.GET_SUB_INVOICES_SUCCESS:
      return state.merge({
        processing: false,
        sublist: action.list,
        pagination: action.pagination,
      });
    case actionTypes.GET_SUB_INVOICES_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.GET_SUB_INVOICES_ERROR:
      return state.merge({
        processing: false,
      });  

    //get timesheets for invoice
    case actionTypes.GET_INVOICE_TIMESHEETS_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.GET_INVOICE_TIMESHEETS_SUCCESS:
      return state.merge({
        processing: false,
        timesheets: action.timesheets,
        pagination: action.pagination,
      });
    case actionTypes.GET_INVOICE_TIMESHEETS_FAIL:
        return state.merge({
          processing: false,
        });
    case actionTypes.GET_INVOICE_TIMESHEETS_ERROR:
        return state.merge({
        processing: false,
      });

  //get configuration
    case actionTypes.GET_CONFIGURATION_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.GET_CONFIGURATION_SUCCESS:
      return state.merge({
        processing: false,
        conf: action.conf,
      });
    case actionTypes.GET_CONFIGURATION_FAIL:
        return state.merge({
          processing: false,
        });
    case actionTypes.GET_CONFIGURATION_ERROR:
        return state.merge({
        processing: false,
      });

    //update configuration
    case actionTypes.UPDATE_INVOICE_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.UPDATE_INVOICE_SUCCESS:
      index = state.list.findIndex(i => i.id === action.item.id);
      if(index === -1){
        return state;
      } else {
        configs = Immutable.asMutable(state.list);
        configs[index] = action.item;
        console.log(configs);
      return state.merge({
        processing: false,
        list: configs,
      });
    }
    case actionTypes.UPDATE_INVOICE_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.UPDATE_INVOICE_ERROR:
      return state.merge({
        processing: false,
      });

    //delete configuration
    case actionTypes.DELETE_INVOICE_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.DELETE_INVOICE_SUCCESS:
      configs = state.list.filter(i => i.id !== action.item.id);
      return state.merge({
        processing: false,
        list: configs,
      });
    case actionTypes.DELETE_INVOICE_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.DELETE_INVOICE_ERROR:
      return state.merge({
        processing: false,
      });

    //update fillters
    case actionTypes.UPDATE_FILTERS:
      filters = {
        ...state.search_options,
        ...action.filters,
      };
      return state.merge({
        search_options: filters,
      });
  
    case actionTypes.LOGOUT:
        return state.merge(initialState);

    default:
      return state;
  }
}
