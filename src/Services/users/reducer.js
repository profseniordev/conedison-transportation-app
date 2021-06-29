import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';
import { FILTERS_STORAGE_KEY } from '../users/actions';
import { USER_STATUSES } from '../../Constants/user';

const initialState = Immutable({
  search_options: {},
  user: {},
  users: [],
  notifications: [],
  processing: false,
  processindUsers: false,
  processing_key: '',
  currentPage: 1,
  user_approved: {},
});

let filters;
let users = [];

export default function (state = initialState, { type, ...action }) {
  switch (type) {
    case actionTypes.GET_USER_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.GET_USER_SUCCESS:
      return state.merge({
        processing: false,
        user: action.user,
      });
    case actionTypes.GET_USER_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.GET_USER_ERROR:
      return state.merge({
        processing: false,
      });
    case actionTypes.GET_USERS_REQUEST:
      return state.merge({
        processingUsers: true,
        processing_key: action.processing_key,
      });
    case actionTypes.GET_USERS_SUCCESS:
      if (action.processing_key === state.processing_key) {
        return state.merge({
          processingUsers: false,
          users: action.users,
        });
      } else {
        return state;
      }
    case actionTypes.GET_USERS_FAIL:
      return state.merge({
        processingUsers: false,
      });
    case actionTypes.GET_USERS_ERROR:
      return state.merge({
        processingUsers: false,
      });
    case actionTypes.GET_NOTIFICATIONS_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.GET_NOTIFICATIONS_SUCCESS:
      return state.merge({
        processing: false,
        notifications: action.notifications,
      });
    case actionTypes.GET_NOTIFICATIONS_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.GET_NOTIFICATIONS_ERROR:
      return state.merge({
        processing: false,
      });
    case actionTypes.UPDATE_NOTIFICATIONS_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.UPDATE_NOTIFICATIONS_SUCCESS:
      return state.merge({
        processing: false,
        notifications: state.notifications,
      });
    case actionTypes.UPDATE_NOTIFICATIONS_FAIL:
    case actionTypes.UPDATE_NOTIFICATIONS_ERROR:
      return state.merge({
        processing: false,
      });
    case actionTypes.UPDATE_USER_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.UPDATE_USER_SUCCESS:
      users = state.users.asMutable();
      users= users.map((user) =>
        user.id === action.id ? {action} : user
        );
      return state.merge({
        processing: false,
        user: action.user,
        users: users
      });
    case actionTypes.UPDATE_USER_FAIL:
    case actionTypes.UPDATE_USER_ERROR:
      return state.merge({
        processing: false,
      });

  // CREATE USER

    case actionTypes.CREATE_USER_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.CREATE_USER_SUCCESS:
      users = state.users.asMutable();
      users.push(action.user);
      console.log(users.filter(u => u.id !== action.user.id));
      return state.merge({
        processing: false,
        users: users
      });
    case actionTypes.CREATE_USER_FAIL:
    case actionTypes.CREATE_USER_ERROR:
      return state.merge({
        processing: false,
      });

    // UPDATE WORKER
    case actionTypes.UPDATE_WORKER_REQUEST:
    return state.merge({
      processing: true,
    });
    case actionTypes.UPDATE_WORKER_SUCCESS:
      let workers = state.users.asMutable();
      workers = workers.map((worker) =>
        worker.id === action.worker.id ? {...action.worker, status: action.worker.status.toLowerCase() } : worker
      );
      return state.merge({
        processing: false,
        users: workers,
      });

    case actionTypes.UPDATE_WORKER_FAIL:
      return state.merge({
        processing: false,
      });

    case actionTypes.UPDATE_WORKER_ERROR:
      return state.merge({
        processing: false,
      });

    case actionTypes.USER_APPROVE_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.USER_APPROVE_SUCCESS:
      users = state.users.asMutable();
      users = users.map((user) =>
        user.id === action.user.id
          ? {
              ...user,
              isApproved: action.user.isApproved,
              status: USER_STATUSES[action.user.isApproved]
            }
          : user
      );
      return state.merge({
        processing: false,
        users: users
      });
    case actionTypes.USER_APPROVE_FAIL:
    case actionTypes.USER_APPROVE_ERROR:
      return state.merge({
        processing: false,
      });
    case actionTypes.UPDATE_FILTERS:
      filters = {
        ...state.search_options,
        ...action.filters,
      };
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
      return state.merge({
        search_options: filters,
      });


      case actionTypes.DELETE_USER_REQUEST:
        return state.merge({
          processing: true,
        });
      case actionTypes.DELETE_USER_SUCCESS:
        users = state.users.asMutable();
        users = users.filter((user) => user.id !== action.user.id);
        return state.merge({
          processing: false,
          users: users
        });
      case actionTypes.DELETE_USER_FAIL:
      case actionTypes.DELETE_USER_ERROR:
        return state.merge({
          processing: false,
        });

    case actionTypes.LOGOUT:
      return state.merge(initialState);

    default:
      return state;
  }
}
