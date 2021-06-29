
// import actions
import * as AppActions from './app/actions';
import * as JobsActions from './jobs/actions';
import * as WorkersActions from './workers/actions';
import * as SupervisorsActions from './supervisors/actions';
import * as TimesheetsActions from './timesheets/actions';
import * as SubcontractorsActions from './subcontractors/actions';
import * as ZonesActions from './zones/actions';
import * as UsersActions from './users/actions';
import * as InvoicesActions from './invoices/actions';
import * as BillingActions from './billing/actions';
import * as NotificationsActions from './notifications/actions';
import * as ReportActions from './reports/actions';

//import actionTypes
import * as AppActionTypes from './app/actionTypes';
import * as JobsActionTypes from './jobs/actionTypes';
import * as WorkersActionTypes from './workers/actionTypes';
import * as SupervisorsActionTypes from './supervisors/actionTypes';
import * as TimesheetsActionTypes from './timesheets/actionTypes';
import * as SubcontractorsActionTypes from './subcontractors/actionTypes';
import * as UsersActionsTypes from './users/actionTypes';
import * as InvoicesActionsTypes from './invoices/actionTypes';
import * as BillingActionsTypes from './billing/actionTypes';
import * as NotificationsActionsTypes from './notifications/actionTypes';
import * as ReportActionsTypes from './reports/actionTypes';

export const actions =  {
  AppActions,
  JobsActions,
  WorkersActions,
  SupervisorsActions,
  TimesheetsActions,
  SubcontractorsActions,
  ZonesActions,
  UsersActions,
  InvoicesActions,
  BillingActions,
  NotificationsActions,
  ReportActions
};

export const ActionTypes = {
  AppActionTypes,
  JobsActionTypes,
  WorkersActionTypes,
  SupervisorsActionTypes,
  TimesheetsActionTypes,
  SubcontractorsActionTypes,
  UsersActionsTypes,
  InvoicesActionsTypes,
  BillingActionsTypes,
  NotificationsActionsTypes,
  ReportActionsTypes
};

export default {actions, ActionTypes};
export {
  userService,
} from './user.service';


