import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './App.scss';
import { AppTitle } from './AppTitle';
import CalendarAssignWorker from './Containers/Components/Calendars/Calendar.AssignWorker';
import PrivateRoute from './Containers/Components/PrivateRoute';
import Invoices from './Containers/Invoices/Invoices';
import Job from './Containers/Job/Job';
import JobGrid from './Containers/Job/JobGrid';
import JobCreateComponent from './Containers/Job/JobCreate';
import JobDetailsComponent from './Containers/Job/JobDetails';
import JobEdit from './Containers/Job/JobEdit';
import CEMap from './Containers/Maps/Map';
import Dispatch from './Containers/Dispatch/Dispatch';
import MenuCE from './Containers/Menus/MenuCE';
import Notifications from './Containers/Notifications/Notifications';
import MyProfileComponent from './Containers/Profile/MyProfile.Component';
import ProfileComponent from './Containers/Profile/Profile.Component';
import CreateUser from './Containers/Registrations/CreateUser';
import LoginComponent from './Containers/Registrations/Login';
import RecoveryPasswordComponent from './Containers/Registrations/RecoveryPassword';
import RecoveryPasswordSuccessComponent from './Containers/Registrations/RecoveryPasswordSuccess';
import SignUpComponent from './Containers/Registrations/SignUp';
import SignUpSuccessComponent from './Containers/Registrations/SignUpSuccess';
import ActivateSuccessComponent from './Containers/Registrations/ActivateSuccess';
import ActivateAccountComponent from './Containers/Registrations/ActivateAccount';
import RolesComponent from './Containers/Roles/Roles';
import Subcontractors from './Containers/Subcontractors/Subcontractors';
// import Subcontractors from './Containers/Subcontractors/SubcontractorsOld';

import TimesheetEdit from './Containers/Timesheets/TimesheetEdit';
import TimesheetCreate from './Containers/Timesheets/TimesheetCreate';

import Timesheets from './Containers/Timesheets/Timesheets';

// import Timesheets from './Containers/Timesheets/TimesheetOld';

import WorkerCreateComponent from './Containers/Workers/WorkerCreate';
import RoleCreateComponent from './Containers/Roles/RoleCreate';
import WorkerDetailsComponent from './Containers/Workers/WorkerDetails';
import Workers from './Containers/Workers/Workers';
import './index.scss';

import RestorePassword from './Containers/Registrations/RestorePassword';
import InvoiceDetailsFull from './Containers/Invoices/InvoiceDetailsFull';
import InvoicesTable from './Containers/Invoices/InvoiceTable/InvoicesTable';
import TimesheetsTable from './Containers/Invoices/TimesheetsTable/TimesheetsTable';

import PageNotFound from './Containers/PageNotFound/PageNotFound';
import Billing from './Containers/Billing/Billing';

import Reports from './Containers/Reports/Reports';
// @ts-ignore
// @ts-nocheck
class App extends PureComponent {
  render() {
    return (
      <div className="App" style={{ overflow: 'hidden' }}>
        <AppTitle title="CE Solution" />
        <Switch>
          <PrivateRoute exact path="/" component={JobGrid} />
          <Route exact path="/login" component={LoginComponent} />
          <Route
            exact
            path="/activate"
            component={ActivateAccountComponent}
          />
          <Route
            exact
            path="/login/activate"
            component={ActivateSuccessComponent}
          />
          <Route
            exact
            path="/login/activateworker"
            component={ActivateSuccessComponent}
          />
          <Route exact path="/signup" component={SignUpComponent} />
          <Route
            exact
            path="/signup/success"
            component={SignUpSuccessComponent}
          />
          <Route exact path="/recovery" component={RecoveryPasswordComponent} />
          <Route
            exact
            path="/recovery/success"
            component={RecoveryPasswordSuccessComponent}
          />
          <Route exact path="/restore/:token" component={RestorePassword} />
          <>
          <MenuCE />
          <PrivateRoute exact path="/map" component={CEMap} />
          <PrivateRoute exact path="/map/:id" component={CEMap} />
          <PrivateRoute path="/dispatch" component={Dispatch} />
          <PrivateRoute path="/billing" component={Billing} />
          <PrivateRoute exact path="/invoices" component={Invoices} />
          <PrivateRoute path="/subcontractors" component={Subcontractors} />
          <PrivateRoute exact path="/timesheets" component={Timesheets} />
          <PrivateRoute exact path="/workers" component={Workers} />
          <PrivateRoute exact path="/job-grid" component={JobGrid} />
          <PrivateRoute exact path="/job" component={Job} />
          <PrivateRoute path="/job/create" component={JobCreateComponent} />
          <PrivateRoute path="/job/:id/copy" component={JobCreateComponent} />
          <PrivateRoute
            path="/job/:id/assignworker"
            component={CalendarAssignWorker}
          />
          <PrivateRoute path="/job/:id/edit" component={JobEdit} />
          <PrivateRoute path="/job/:id" component={JobDetailsComponent} />
          <PrivateRoute
            path="/workers/create"
            component={WorkerCreateComponent}
          />
          <PrivateRoute
            path="/workers/:id"
            component={WorkerDetailsComponent}
          />
          <PrivateRoute path="/timesheets/:id/edit" component={TimesheetEdit} />
          <PrivateRoute
            exact
            path="/timesheets/create"
            component={TimesheetCreate}
          />
          <PrivateRoute path="/notifications" component={Notifications} />
          <PrivateRoute exact path="/roles" component={RolesComponent} />
          <PrivateRoute path="/roles/create" component={RoleCreateComponent} />
          <PrivateRoute path="/profile/:id" component={ProfileComponent} />
          <PrivateRoute path="/profile" component={MyProfileComponent} />
          <PrivateRoute exact path="/invoices/:id" component={InvoicesTable} />
          <PrivateRoute exact path="/invoices/:id/:invoiceId" component={TimesheetsTable} />
          <PrivateRoute path="/reports" component={Reports} />
          <PrivateRoute
            path="/invoices/:id/timesheets/:jobType"
            component={InvoiceDetailsFull}
          />
          {/*<PrivateRoute path="/invoices/:id" component={InvoiceDetailsFull} />*/}
          <PrivateRoute path="/createuser" component={CreateUser} />
          </>
          <Route path="*" component={PageNotFound} />
        </Switch>
        <ToastContainer
          position={toast.POSITION.BOTTOM_RIGHT}
          autoClose={20000}
        />
      </div>
    );
  }
}

export default App;
