import { put, all } from 'redux-saga/effects';
import * as AppActionTypes from '../Services/app/actionTypes';
import * as AppActions from '../Services/app/actions';
import * as WorkersActions from '../Services/workers/actions';
import * as JobsActions from '../Services/jobs/actions';
import * as SubcontractorsActions from '../Services/subcontractors/actions';
import * as ZonesActions from '../Services/zones/actions';
import * as UsersActions from '../Services/users/actions';
import * as NotificationsActions from '../Services/notifications/actions';
import HttpService from '../Services/HttpService';
import * as InvoicesActions from '../Services/invoices/actions';

export function* init() {
  try {
    console.log('INIT HERE');
    let token = localStorage.getItem('Token').replace('"', '').replace('"', '');
    HttpService.setToken(token);
    if (token) {
      yield all([
        yield put({
          // socket.io
          type: 'authenticate',
          token: token,
        }),
        yield put({ type: AppActionTypes.TOKEN_SUCCESS, token: token }),
        yield put(AppActions.retrieve()),
        yield put(AppActions.getPermissions()),
        yield put(AppActions.getRoles()),
        yield put(AppActions.getDepartments()),
        yield put(UsersActions.getNotifications()),
        yield put(UsersActions.retrieveUsers()),
        yield put(WorkersActions.retrieve()),
        yield put(SubcontractorsActions.retrieve()),
        yield put(ZonesActions.retrieve()),
        yield put(UsersActions.retrieve()),
        yield put(InvoicesActions.retrieve({})),
        yield put(JobsActions.updateFilters({})),
        yield put(JobsActions.initFilters()),
        yield put(NotificationsActions.getNotifications()),
      ]);
    } else {
      console.log('logouttt');
      yield put(AppActions.logout());
    }
  } catch (error) {}
}
