export const SUBCONTRACTOR_CELL_STYLES = {
  maxWidth: 150,
  wordBreak: 'break-word',
} as React.CSSProperties;

export const TABLE_HEADER = [
  { label: 'Start Date & Time', value: 'billing.start_at', sortable: true },
  { label: 'Finish Date & Time  ', value: 'billing.finish_at', sortable: true },
  { label: 'Worker', value: 'billing.worker_id', sortable: true },
  { label: 'Subcontractor', value: 'companies.name', sortable: true },
  { label: 'Total Hrs', value: 'hrs', },
  { label: 'Paid Status', value: 'paid', sortable: true },
  { label: 'Verified', value: 'verified', sortable: true },
  { label: 'Total Due', value: 'total_due', sortable: true },
  { label: 'Dispute', value: 'dispute', sortable: true  },
  { label: 'Actions', value: 'actions' },
];

export const VERIFIED_STATUS = [
  { label: 'Unverified', value: 'unverified' },
  { label: 'Verified', value: 'verified' },
  { label: 'Disp. By ConEd', value: 'coned' },
  { label: 'Approved', value: 'approved' },
  { label: 'Billed', value: 'billed', }
];

export const BILLING_STATUS = [
  { label: 'Pending Biller Approval', value: 'timesheets_pending_approval' },
  { label: 'Timesheet Verified - Pending Con-Ed Approval', value: 'timesheets_verified' },
  { label: 'Coned Disputed', value: 'coned_disputed' },
  { label: 'Coned Approved', value: 'coned_approved' },
  { label: 'Ready for invoicing', value: 'ready_for_invoicing' },
  { label: 'Billed', value: 'billed', }
];

export const BILLING_CYCLE = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Daily', value: 'daily' },
];