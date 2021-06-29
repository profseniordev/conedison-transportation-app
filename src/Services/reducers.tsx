import { combineReducers } from 'redux';

// import reducers
import AppReducer from './app/reducer';
import JobsReducer from './jobs/reducer';
import WorkersReducer from './workers/reducer';
import TimesheetsReducer from './timesheets/reducer';
import SubcontractorsReducer from './subcontractors/reducer';
import ZonesReducer from './zones/reducer';
import UsersReducer from './users/reducer';
import InvoicesReducer from './invoices/reducer';
import BillingReducer from './billing/reducer';
import NotificationsReducer from './notifications/reducer';
import ReportsReducer from './reports/reducer';

const getRootReducer = () => {
  const reducers = {
    app: AppReducer,
    jobs: JobsReducer,
    workers: WorkersReducer,
    timesheets: TimesheetsReducer,
    subcontractors: SubcontractorsReducer,
    zones: ZonesReducer,
    users: UsersReducer,
    invoices: InvoicesReducer,
    billing: BillingReducer,
    notifications: NotificationsReducer,
    reports: ReportsReducer,
  };

  return combineReducers(reducers);
};
export default getRootReducer;
