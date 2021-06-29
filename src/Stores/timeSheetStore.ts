import { observable, action } from 'mobx';
import { TimeSheetListItem } from '../Models/timeSheetListItem';
import { timesheetAPI } from '../Services/API';
import moment from 'moment';

class TimeSheetStore {
  @observable list: Array<any>;
  @observable timesheet: any;

  constructor() {
    this.addList();
    this.timesheet = new TimeSheetListItem();
  }

  addList() {
    if (this.list == null) {
      this.list = new Array<any>();
    }
  }

  @action async getTimesheet(id: string) {
    const response = await timesheetAPI.load(id);
    this.timesheet = {
      ...this.timesheet,
      ...response.data,
    } as TimeSheetListItem;
  }

  @action clearTimesheet() {
    this.timesheet = new TimeSheetListItem();
  }

  @action async updateLocal(name: string, value: any) {
    this.timesheet = {
      ...this.timesheet,
      [name]: value,
    };
  }

  @action async getTimesheetTotalHours(startDate, endDate, timesheetId) {
    startDate = moment(startDate);
    endDate = moment(endDate);

    if (startDate.isAfter(endDate)) {
      [startDate, endDate] = [endDate, startDate];
    }

    const total =
      Math.round((endDate.diff(startDate, 'minute') / 60) * 100) / 100;

    // todo check
    // const response = await timesheetAPI.getTimesheetTotalHours(startDate, endDate, timesheetId)
    // const { total } = response.data;

    this.timesheet.totalHours = total;

    return total;
  }

  @action async update(id: string, timesheet: any) {
    const response = await timesheetAPI.update(id, timesheet);
    this.timesheet = {
      ...this.timesheet,
      ...response.data,
    } as TimeSheetListItem;
    return response;
  }

  @action async create(timesheet: any) {
    const response = await timesheetAPI.create(timesheet);
    this.timesheet = {
      ...this.timesheet,
      ...response.data,
    } as TimeSheetListItem;
    return response;
  }
}
export default new TimeSheetStore();
