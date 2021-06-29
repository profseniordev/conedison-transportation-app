import * as actionTypes from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  notifications: [],
  processing: false,
  search_options: {
    page: 1,
    limit: 100,
    totalPage: 0,
    total: 0,
    unread: false,
  },
});

let filters;
let notifications;

export default function (state = initialState, { type, ...action }) {
  switch (type) {
    case actionTypes.GET_NOTIFICATIONS_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.GET_NOTIFICATIONS_SUCCESS:
      filters = {
        ...state.search_options,
        ...action.filters,
      };
      return state.merge({
        processing: false,
        notifications: action.notifications,
        search_options: filters,
      });
    case actionTypes.GET_NOTIFICATIONS_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.GET_NOTIFICATIONS_ERROR:
      return state.merge({
        processing: false,
      });

    case actionTypes.MARK_NOTIFICATIONS_READ_REQUEST:
      return state.merge({
        processing: true,
      });
    case actionTypes.MARK_NOTIFICATIONS_READ_SUCCESS:
      filters = {
        ...state.search_options,
        ...action.filters,
      };
      return state.merge({
        processing: false,
        notifications: action.notifications,
        search_options: filters,
      });
    case actionTypes.MARK_NOTIFICATIONS_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.MARK_NOTIFICATIONS_ERROR:
      return state.merge({
        processing: false,
      });

    case actionTypes.DELETE_NOTIFICATION_REQUEST:
      return state.merge({
        processing: true,
       });
    case actionTypes.DELETE_NOTIFICATION_SUCCESS:
      notifications = state.notifications.asMutable();
      notifications = [...notifications.filter(notification => notification.id !== action.result.id)]
      return state.merge({
        processing: false,
        notifications: notifications,
        search_options: filters,
      });
    case actionTypes.DELETE_NOTIFICATION_FAIL:
      return state.merge({
        processing: false,
      });
    case actionTypes.DELETE_NOTIFICATION_ERROR:
      return state.merge({
        processing: false,
      });

    case actionTypes.UPDATE_FILTER_OPTIONS:
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
