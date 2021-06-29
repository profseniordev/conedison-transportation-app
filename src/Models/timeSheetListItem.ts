import { User, JobListItem } from './jobListItem';
import { LocationItem } from './locationItem';

interface TimesheetComment {
  createdAt: Date;
  author: string;
  comment: string;
}

export class TimeSheetListItem {
  id: string;
  requestDate: string;
  subcontractor: any;
  worker: User;
  confirmation: string;
  straightHours: number;
  calculatedTotal: number;
  overTimeHours: number;
  holidayHours: number;
  selected: boolean;
  job: JobListItem;
  locations: LocationItem;
  // electric: number;
  // gas: number;
  regHours?: number;
  overtimeHours?: number;
  po?: number;
  startDate?: Date;
  finishDate?: Date;
  totalHours?: number;
  supervisor?: string;
  requestor?: any;
  requestorName?: string;
  departmentName?: string;
  department?: any;
  confirmationNumber?: number;
  conEdisonTruck?: number;
  conEdisonSupervisor?: string;
  conEdisonSupervisorName?: string;
  supervisorName?: string;
  comments: TimesheetComment[];
  isVerified: boolean;
  paid?: boolean;
  workerPaid?: boolean;
  invoiced?: boolean;
  section?: number;
  account?: number;
  poet?: string;
  workRequest?: number;
  sign?: string;
  signatureName?: string;
  employeeNumber?: string;
  receipt: number;
  images?: string[];
  subcontractorName?: string;

  constructor() {
    this.worker = new User();
    this.job = new JobListItem();
    this.comments = [];
  }
}
