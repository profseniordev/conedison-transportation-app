import BaseAPIService from './base.service';
import { AxiosResponse } from 'axios';
import { APPROVE } from '../../Constants/user';
import { User } from '../../Models';

export class UserAPI extends BaseAPIService {
  async create(user, params = {}): Promise<AxiosResponse<any>> {
    return await this.api.post('/user/create', user, params, true);
  }

  async roles(params = {}): Promise<AxiosResponse<any>> {
    return await this.api.get('/roles', params);
  }

  async users(params: any): Promise<AxiosResponse<any>> {
    return await this.api.get('/user/users', params);
  }

  async supervisors(params: any): Promise<AxiosResponse<any>> {
    return await this.api.get('/supervisors', params);
  }

  async user(id: string): Promise<AxiosResponse<any>> {
    return await this.api.get(`/user/${id}`);
  }

  async me(): Promise<AxiosResponse<any>> {
    return await this.api.get(`/user`);
  }

  async notifications(): Promise<AxiosResponse<any>> {
    return await this.api.get('/user/notifications');
  }

  async update(user: User): Promise<AxiosResponse<any>> {
    console.log('user update: ', user);
    const fd = new FormData();
    for (const [key, value] of Object.entries(user)) {
      console.log(`${key}: ${value}`);
      if (key === 'avatar' && value.size > 0) {
        console.log(typeof value);
        console.log(value.size);
        fd.append(key, value);
      } else {
        fd.append(key, JSON.stringify(value));
      }
    }
    fd.forEach((pair) => console.log(pair + ', ' + pair));
    return await this.api.put(`/user`, fd, {});
  }

  async updateNotification(data: any): Promise<AxiosResponse<any>> {
    console.log(' update: ', data);
    return await this.api.put(`/user/notifications`, data, {});
  }

  async departments(): Promise<AxiosResponse<any>> {
    return await this.api.get('/departments');
  }

  async approve(id, approve = APPROVE.waiting): Promise<AxiosResponse<any>> {
    return await this.api.post('/user/approve', {
      id,
      approve,
    });
  }

  async delete(id): Promise<AxiosResponse<any>> {
    return await this.api.delete(`/user/${id}`, {});
  }

  async createRole(user, params = {}): Promise<AxiosResponse<any>> {
    return await this.api.post('/user/role', user, params, true);
  }

  async importExcel(dataFile): Promise<AxiosResponse<any>> {
    return await this.api.post(`/user/import-excel`, dataFile);
  }

  async sendActivateEmail(id) {
    return await this.api.post(`/user/send-activate-email/${id}`, {should_reset_password: true});
  }
}

export default new UserAPI();
