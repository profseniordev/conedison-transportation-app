export const WORKER_STATUS = [
    'Assigned',
    'Enroute',
    'Location',
    'Secure',
    'End Of Shift',
    'Review',
    'Can Not Secure',
    'Completed',
    'Crew Arrived'
];

export const WORKER_STATUSES = [
    { 
        label: 'Assigned',
        value: 'assigned'
    },
    {
        label: 'En Route',
        value: 'en_route',
    },
    {
        label: 'On Location',
        value: 'on_location',
    },
    {
        label: 'Secure',
        value: 'secured',
    },
    {
        label: 'Crew arrived',
        value: 'crew_arrived',
    },
    {
        label: 'Cannot secure',
        value: 'cannot_secure',
    },
    /*{
        label: 'Redispatch',
        value: 'revive',
        reason_required: true,
    },*/
    {
        label: 'Confirm Review',
        value: 'review_finished',
    },
    {
        label: 'Completed',
        value: 'review_finished',
    }

]

export const WORKERS_STATUS = [
    'assigned',
    'en_route',
    'on_location',
    'secured',
    'crew_arrived',
    'review',
    'can_not_Secure',
    'review_finished',
    'cannot_secure',
    'сompleted',
]

export const WORKER_STATUS_HISTORY = [
    'New',
    'Enroute',
    'OnLocation',
    'Secure',
    'End Of Shift',
    'Review',
    'Can Not Secure',
    'Complete',
    'Crew arrived',
];
export const TABLE_HEADER = [
    { label: 'Employee #', value: 'uid', sortable: true },
    { label: 'Status', value: 'status', sortable: true },
    { label: 'Worker Name', value: 'name', sortable: true },
    { label: 'Phone Number', value: 'phoneNumber', sortable: true },
    { label: 'E-mail', value: 'email', sortable: true },
    { label: 'Worker Types', value: 'workerTypes', sortable: false },
    { label: 'Subcontractor', value: 'subcontractorName', sortable: true }
];

export const PER_PAGES = [
    {
        label: 10,
        value: 10,
    },
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
