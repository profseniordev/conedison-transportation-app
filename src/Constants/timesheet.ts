export const PAID_STATUSES = [
  { label: 'Paid', value: 'paid' },
  { label: 'Invoiced', value: 'invoiced' },
  { label: 'Worker Paid', value: 'workerPaid' },
];

export const PAID_ONLY_STATUSES = [
  { label: 'Invoice Paid Only', value: 'paidOnly' },
  { label: 'Invoiced Only', value: 'invoicedOnly' },
  { label: 'Paid Worker Only', value: 'paidWorkerOnly' },
  { label: 'Not Invoiced Only', value: 'notInvoicedOnly' },
];

export const VERIFIED_STATUSES = [
  { label: 'Verified Timesheets', value: 1 },
  { label: 'Unverified Timesheets', value: 0 },
];

export const PER_PAGES = [
  {
    label: 25,
    value: 25,
  },
  {
    label: 50,
    value: 50,
  },
  {
    label: 100,
    value: 100,
  },
];

export const SUBCONTRACTOR_CELL_STYLES = {
  maxWidth: 150,
  wordBreak: 'break-word',
} as React.CSSProperties;

export const TABLE_HEADER = [
  { label: 'Start Date', value: 'timesheets.start_at', sortable: true },
  { label: 'Finish Date', value: 'timesheets.finish_at', sortable: true },
  { label: 'Workers', value: 'timesheets.worker_id', sortable: true },
  { label: 'Subcontractor', value: 'companies.name', sortable: true, styles: SUBCONTRACTOR_CELL_STYLES },
  { label: 'Total Hrs', value: 'totalHours', sortable: true },
  { label: 'Confirmation №', value: 'timesheets.job_id', sortable: true },
  { label: 'PO#', value: 'jobs.po_number', sortable: true },
  { label: 'Job Status', value: 'timesheets.job_id', sortable: true },
  { label: 'Status', value: 'status', sortable: true },
  { label: 'Paid Status', value: 'paid', sortable: true },
  { label: 'Verified', value: 'verified', sortable: true },
  { label: 'Actions', value: 'actions' },
];
