import { observable, action } from 'mobx';
import { createBrowserHistory } from 'history';
import { authAPI } from '../Services/API';
import { User } from '../Models';
import axios from 'axios';
import { EROLES } from '../Constants/user';
import { toast } from 'react-toastify';


class AuthStore {
  @observable logged: boolean;
  @observable token: string;
  @observable currentUser: User;
  @observable processing: boolean;

  constructor() {
    this.logged = false;
    this.token = '';
    this.currentUser = null;
    this.processing = false;
    const logged = localStorage.getItem('Logged');
    const token = localStorage.getItem('Token');
    const currentUser = localStorage.getItem('CurrentUser');
    if (logged) {
      this.logged = JSON.parse(logged);
    }
    if (token) {
      this.token = JSON.parse(token);
    }
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
  }

  canDoJobAction() {
    if (
      this.currentUser &&
      this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.requestor) ||
        this.currentUser.roles.includes(EROLES.department_supervisor) ||
        this.currentUser.roles.includes(EROLES.dispatcher) ||
        this.currentUser.roles.includes(EROLES.dispatcher_supervisor) ||
        this.currentUser.roles.includes(EROLES.superadmin))
    ) {
      return true;
    }
    return false;
  }

  canCancelJob() {
    if (
      this.currentUser &&
      this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.department_supervisor) ||
        this.currentUser.roles.includes(EROLES.dispatcher) ||
        this.currentUser.roles.includes(EROLES.dispatcher_supervisor) ||
        this.currentUser.roles.includes(EROLES.superadmin))
    ) {
      return true;
    }
    return false;
  }

  canAccessLimitDept() {
    if (
      this.currentUser &&
      this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.requestor) ||
        this.currentUser.roles.includes(EROLES.department_supervisor) ||
        this.currentUser.roles.includes(EROLES.coned_billing_admin))
    ) {
      if (
        this.currentUser.roles.includes(EROLES.dispatcher) ||
        this.currentUser.roles.includes(EROLES.dispatcher_supervisor) ||
        this.currentUser.roles.includes(EROLES.billing) ||
        this.currentUser.roles.includes(EROLES.superadmin)
      ) {
        return false;
      }
      return true;
    }
    return false;
  }

  canAccessInvoice() {
    if (
      this.currentUser &&
      this.currentUser.roles && // 7,4,8
      (this.currentUser.roles.includes(EROLES.billing) ||
        this.currentUser.roles.includes(EROLES.coned_billing_admin) ||
        this.currentUser.roles.includes(EROLES.superadmin))
    ) {
      return true;
    }
    return false;
  }

  canAccessRoles() {
    if (
      this.currentUser &&
      this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.dispatcher_supervisor) ||
        this.currentUser.roles.includes(EROLES.superadmin))
    ) {
      return true;
    }
    return false;
  }

  canDoTimesheetAction(action: string = null) {
    if (
      this.currentUser &&
      this.currentUser.roles && // 7,4,8,3
      (this.currentUser.roles.includes(EROLES.billing) ||
        this.currentUser.roles.includes(EROLES.coned_billing_admin) ||
        this.currentUser.roles.includes(EROLES.superadmin) ||
        (action === 'edit' &&
          this.currentUser.roles.includes(EROLES.coned_field_supervisor)))
    ) {
      return true;
    }
    return false;
  }

  isSuperAdmin() {
    if (
      this.currentUser &&
      this.currentUser.roles &&
      this.currentUser.roles.includes(EROLES.superadmin)
    ) {
      return true;
    }
    return false;
  }

  isConedUser() {
    const conedRoles = [EROLES.requestor, EROLES.department_supervisor, EROLES.coned_field_supervisor, EROLES.coned_billing_admin];
    if (
      this.currentUser &&
      this.currentUser.roles &&
      this.currentUser.roles.some(r=> conedRoles.includes(r))
    ) {
      return true;
    }
    return false;
  }

  isDispatchSupervisor() {
    if (
      this.currentUser &&
      this.currentUser.roles &&
      this.currentUser.roles.includes(EROLES.dispatcher_supervisor)
    ) {
      return true;
    }
    return false;
  }

  canAssignWorker() {
    if (
      this.currentUser &&
      this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.dispatcher) ||
        this.currentUser.roles.includes(EROLES.dispatcher_supervisor) ||
        this.currentUser.roles.includes(EROLES.superadmin))
    ) {
      return true;
    }
    return false;
  }

  canAccessWorker() {
    if (
      this.currentUser &&
      this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.dispatcher) ||
        this.currentUser.roles.includes(EROLES.dispatcher_supervisor) ||
        this.currentUser.roles.includes(EROLES.superadmin))
    ) {
      return true;
    }
    return false;
  }

  canDoWorkerAction() {
    if (
      this.currentUser &&
      this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.dispatcher_supervisor) ||
        this.currentUser.roles.includes(EROLES.superadmin))
    ) {
      return true;
    }
    return false;
  }

  hasCESolutionRole() {
    const CESRoles = [
      // 5,6,7,8
      EROLES.dispatcher,
      EROLES.dispatcher_supervisor,
      EROLES.billing,
      EROLES.superadmin,
    ];
    if (
      this.currentUser &&
      this.currentUser.roles &&
      this.currentUser.roles.some((r) =>
        CESRoles.includes(EROLES.dispatcher_supervisor)
      )
    ) {
      return true;
    }
    return false;
  }

  canAccessSubContractor() {
    if (
      this.currentUser &&
      this.currentUser.roles &&
      (this.currentUser.roles.includes(EROLES.dispatcher) ||
        this.currentUser.roles.includes(EROLES.dispatcher_supervisor) ||
        this.currentUser.roles.includes(EROLES.superadmin))
    ) {
      return true;
    }
    return false;
  }

  @action setLogin(
    isLogged: boolean,
    token: string = '',
    currentUser: User = null
  ) {
    this.logged = isLogged;
    this.token = token;
    this.currentUser = currentUser;
    axios.defaults.headers['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('Logged', JSON.stringify(this.logged));
    localStorage.setItem('Token', JSON.stringify(this.token));
    localStorage.setItem('CurrentUser', JSON.stringify(this.currentUser));
  }

  @action login = async (params: any) => {
    this.processing = true;
    const {
      data: { token, payload },
    } = await authAPI.login(params);
    if (payload.hasOwnProperty('error')) {
      console.log(payload.error.response.data.error);
      toast.info(payload.error.response.data.error);
      this.processing = false;
    } else {
      this.setLogin(true, token, payload);
      let currentHideNav = (window.innerWidth < 800);
      console.log()
      if (currentHideNav) {
        createBrowserHistory({ forceRefresh: true }).push('/map');
      }
      else{
        createBrowserHistory({ forceRefresh: true }).push('/job-grid');
      }
      this.processing = false;
    }
  };
}
export default new AuthStore();
