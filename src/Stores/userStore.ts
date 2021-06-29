import { observable, action } from 'mobx';
import { DepartmentViewModel } from '../Models/departmentViewModel';
import { userAPI } from '../Services/API';
import { User } from '../Models';
import authStore from './authStore';

const emptyPagination = { page: 1, totalPage: 0, total: 0, limit: 10 };

class UserStore {
  @observable Departments: Array<DepartmentViewModel>;
  @observable users: User[];
  @observable userLoader = emptyPagination;
  @observable user: User;
  @observable me: User;
  @observable notifications: any;

  constructor() {
    this.users = [];
    this.user = new User();
    this.me = new User();
  }

  @action async updateUserApprove(id: string, approv: number) {
    await userAPI.approve(id, approv);
    this.users = this.users.map((user: User) => {
      if (user.id === id) {
        return {
          ...user,
          isApproved: approv,
        };
      }
      return user;
    });
  }

  @action async deleteUser(id: string) {
    await userAPI.delete(id);
    this.users = this.users.filter((user: User) => user.id !== id);
  }

  @action async loadUser(id: string) {
    const { data: user } = await userAPI.user(id);

    if (!user) {
      this.user = new User();
    }
    this.user = user as User;
  }

  @action async loadMe() {
    if (authStore.logged) {
      const { data: user } = await userAPI.me();
      if (!user) {
        this.me = new User();
      }
      this.me = user as User;
    }
  }

  @action async ActivateEmail(id: string) {
    await userAPI.sendActivateEmail(id);
  }
  
  @action updateMeLocal(me: User) {
    this.me = {
      ...this.me,
      ...me,
    };
  }

  @action updateUserLocal(user: User) {
    this.user = {
      ...this.user,
      ...user,
    };
  }

  @action async loadUsers(params: any = {}) {
    const {
      data: { results, page, totalPage, total, limit },
    } = await userAPI.users(params);
    if (!results) {
      this.users = [];
      return;
    }

    this.users = results as User[];
    this.userLoader = { page, totalPage, total, limit };
  }


  @action loadDepartment = async () => {
    if (this.Departments == null) {
      this.Departments = new Array<DepartmentViewModel>();
      const { data } = await userAPI.departments();
      if (data.length > 0) {
        data.forEach((department) => {
          this.Departments.push(department as DepartmentViewModel);
        });
      }
    }
  };

  // @action async importUsersExcel(file: File) {
  //   let fd = new FormData();
  //   fd.append('excel', file);

  //   await userAPI.importExcel(fd);
  //   this.users = this.users.map((user: User) => {
  //     return user;
  //   });
  // }
}
export default new UserStore();
