import React, { useState } from 'react';
import moment from 'moment';
import {
  SelectionState,
  IntegratedSelection,
  SortingState,
  IntegratedSorting,
  RowDetailState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableSelection,
  VirtualTable,
  TableRowDetail,
  TableFixedColumns,
} from '@devexpress/dx-react-grid-material-ui';
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import JobItemWorkerGroup from './JobItemWorkerGroup';
import './Job.scss';
import { JobType, JOB_STATUSES } from '../../Constants/job';
import { actions } from '../../Services';
import { connect } from 'react-redux';
import history from '../../history';
import UpdatePODialog from './dialogs/UpdatePODialog';
import SearchInput from './SearchInput';
import { requestorLetter } from '../../Constants/letter';
import { toast } from 'react-toastify';

const RootConfirmed = (props) => (
  <Grid.Root {...props} style={{ height: '100%' }} />
);

const CustomCell = ({ content }) => (
  <div
    data-tag="allowRowEvents"
    style={{
      overflow: 'hidden',
      whiteSpace: 'normal',
      textOverflow: 'ellipses',
      wordBreak: 'break-word',
    }}
  >
    {content}
  </div>
);
const EmailCell = ({ job }) => (
  <a
    data-tag="allowRowEvents"
    style={{
      overflow: 'hidden',
      whiteSpace: 'normal',
      textOverflow: 'ellipses',
      wordBreak: 'break-word',
      color: 'rgba(0, 0, 0, 0.87)',
    }}
    href={requestorLetter(job.requestorEmail, job.requestorName, job.id, job.locations)}
  >
    {job.requestorName ? job.requestorName.substr(0, 20) : null}
  </a>
);

const Cell = (props) => {
  const { column, row } = props;
  if (row.workers.length < row.maxWorkers) {
    if (column.name === 'id') {
      return (
        <VirtualTable.Cell
          {...props}
          style={{ ...props.style, color: 'red' }}
          onClick={(_) => history.push(`/job/${row.id}`)}
        />
      );
    }
  }

  if (row.workers.length === row.maxWorkers) {
    if (column.name === 'id') {
      return (
        <VirtualTable.Cell
          {...props}
          style={{ ...props.style, color: 'green' }}
          onClick={(_) => history.push(`/job/${row.id}`)}
        />
      );
    }
  }
  if (column.name === 'requestorName') {
    return <VirtualTable.Cell {...props} />;
  }

  return (
    <VirtualTable.Cell
      {...props}
      onClick={(_) => history.push(`/job/${row.id}`)}
    />
  );
};

const JobStatusCell = ({ status }) => (
  <div className="d-flex align-items-center">
    <span
      className={`mr-2 circle-${JOB_STATUSES[status || 0].toLowerCase()}`}
    />
    {JOB_STATUSES[status || 0].match(/[A-Z][a-z]+|[0-9]+/g).join(" ")}
  </div>
);

const TableRow = ({ row, tableRow, children }) => {
  return (
    <VirtualTable.Row
      row={row}
      tableRow={tableRow}
      children={children}
      style={{
        cursor: 'pointer',
        height: '50px !important',
        maxHeight: '50px !important',
        overflow: 'hidden',
        padding: '.25rem',
      }}
    />
  );
};

const left_columns = [
  TableRowDetail.COLUMN_TYPE,
  TableSelection.COLUMN_TYPE,
  'id',
];

const columns = [
  {
    name: 'id',
    title: 'Confirmation Nr',
  },
  {
    name: 'jobType',
    title: 'Job Type',
    getCellValue: (row) => JobType[row.jobType],
  },
  {
    name: 'requestorName',
    title: 'Requestor',
    getCellValue: (row) => <EmailCell job={row} />,
  },
  {
    name: 'phoneNumber',
    title: 'Requestor Phone #',
    getCellValue: (row) => row.requestorPhone,
  },
  {
    name: 'created_at',
    title: 'Create Date',
    getCellValue: (row) => {
      return moment(row.created_at).format('MM/DD/YY HH:mm');
    },
  },
  {
    name: 'requestTime',
    title: 'Request Date/Time',
    getCellValue: (row) => {
      return moment(row.start_at).format('MM/DD/YY HH:mm');
    },
  },
  {
    name: 'location',
    title: 'Location',
    getCellValue: (row) => {
      let address = '';
      if (row.locations && row.locations.length > 0) {
        if (row.locations[row.locations.length - 1].hasOwnProperty('address')) {
          if (row.locations[row.locations.length - 1].address) {
            address = row.locations[row.locations.length - 1].address.substr(
              0,
              40
            );
          }
        }
      }
      return address;
    },
  },
  {
    name: 'jobStatus',
    title: 'Job Status',
    getCellValue: (row) => <JobStatusCell key='jobStatus' status={row.jobStatus} />,
  },
  {
    name: 'workers',
    title: 'Workers',
    getCellValue: (row) => row.workers.length,
  },
  {
    name: 'maxWorkers',
    title: 'Max',
  },
  {
    name: 'structure',
    title: 'Structure',
    getCellValue: (row) =>
      row.locations.length > 0
        ? row.locations[row.locations.length - 1].structure
        : '',
  },
  {
    name: 'reroute',
    title: 'ReRoute',
    getCellValue: (row) => (row.locations.length > 1 ? 'True' : 'False'),
  },
  {
    name: 'asap',
    title: 'ASAP',
    getCellValue: (row) => {
      if(row && row.created_at){
      const createTime = Date.parse(row.created_at.toString());
      const requestTime = Date.parse(row.start_at.toString());

      let diff = Math.abs(createTime - requestTime);
      diff = Math.floor((diff / (1000 * 60 * 60)) % 24);

      //console.log(diff);

      if (diff >= 1 && (row.status==='new' || row.status==='in_progress') ) {
        return 'True';
      } else {
        return 'False';
      }
    }
      /*const createTimeStampFromId = row.id.toString().substring(0, 8);
      const createDateTime = new Date(
        parseInt(createTimeStampFromId, 16) * 1000
      );

      if (
        Date.parse(row.requestTime) <
        createDateTime.setHours(createDateTime.getHours() + 4)
      ) {
        return 'True';
      }
      return 'False';*/
    },
  },
  {
    name: 'po',
    title: 'PO #',
    getCellValue: (row) => row.po,
  },
  {
    name: 'requisition',
    title: 'Requisition #',
    getCellValue: (row) => row.requisition,
  },
  {
    name: 'feeder',
    title: 'Feeder #',
    getCellValue: (row) => row.feeder,
  },
  {
    name: 'departmentName',
    title: 'Dept Name',
    getCellValue: (row) => row.departmentName,
  },
];

const tableColumnExtensions = [
  { columnName: 'id', width: '120px' },
  { columnName: 'jobType', width: '100px' },
  { columnName: 'createDate', width: '130px' },
  { columnName: 'requestorName', width: '180px' },
  { columnName: 'phoneNumber', width: '160px' },
  { columnName: 'requestTime', width: '150px' },
  { columnName: 'jobStatus', width: '180px' },
  { columnName: 'workers', width: '100px' },
  { columnName: 'maxWorkers', width: '100px' },
  { columnName: 'location', width: '300px' },
  { columnName: 'structure', width: '90px' },
  { columnName: 'reroute', width: '90px' },
  { columnName: 'asap', width: '90px' },
  { columnName: 'po', width: '100px' },
  { columnName: 'feeder', width: '100px' },
  { columnName: 'departmentName', width: '350px' },
];

interface Props {
  //processing: boolean;
  jobs: any;
  search_options: any;
  dispatchConfirmJobs: (job_ids: any) => Promise<any>;
  updateFilters: (search_options: any) => void;
  dispatchUpdatePOS: (job_ids: any, po_number: number, requisition: number) => Promise<any>;
  total_height: number;
  selectRow?: Function;
}

const JobGridTable: React.FC<Props> = ({
  //processing,
  jobs,
  search_options,
  dispatchConfirmJobs,
  updateFilters,
  dispatchUpdatePOS,
  total_height,
  selectRow
}) => {
  const RowDetail = ({ row }) => (
    <JobItemWorkerGroup
      data={row}
      search={() => search(state.searchParams, true)}
      selectRow={selectRow}
    />
  );
  
  const [state, setState] = useState({
    searchParams: search_options,
    initSearch: true,
    page: 0,
    po: 100101,
    selectedRows: [],
    confirmedSelectedRows: [],
    unconfirmedSelectedRows: [],
    showFilter: true,
    showUpdatePODialog: false,
  });

  
const compareRequestor = (a, b) => {
  const priorityA = a.props.job.requestorName;
  const priorityB = b.props.job.requestorName;
  if (priorityA === priorityB) {
    return 0;
  }
  return (priorityA < priorityB) ? -1 : 1;
};

const compareJobStatus = (a, b) => {

    if (a.props.status[0] === b.props.status[0] && a.props.status[1] === b.props.status[1]) {
      return 0;
    }
    if (a.props.status[0] === b.props.status[0] && a.props.status[1] !== b.props.status[1]) {
      return (a.props.status[1] < b.props.status[1]) ? -1 : 1;
    }

    return (a.props.status[0] < b.props.status[0]) ? -1 : 1;
  };
  
  const [integratedSortingColumnExtensions] = useState([
      { columnName: 'requestorName', compare: compareRequestor },
      { columnName: 'jobStatus', compare: compareJobStatus },
    ]);

  const showModal = () => {
    if(state.confirmedSelectedRows.length > 0) {
      setState({
        ...state,
        showUpdatePODialog: true,
      });
    } else {
      alert("Please select any job");
    }
  };

  const closeModal = () => {
    setState({
      ...state,
      showUpdatePODialog: false,
    });
  };

  const search = async (params: any, keepPage = false) => {
    const searchParams = { ...params, ...(!keepPage && { page: 0 }) };
    setState({ ...state, searchParams });
    updateFilters(searchParams);
  };

  const handleSelectConfirmedRow = (row) => {
    setState({
      ...state,
      confirmedSelectedRows: row,
    });
    //const ids = [];
    //row.map((index) => ids.push(jobs && jobs[index] ? jobs[index].id : null));
  };

  const confirmJobs = async () => {
    if (state.unconfirmedSelectedRows.length === 0) {
      alert('Please select any job');
      return;
    }

    let job_ids = [];
    state.unconfirmedSelectedRows.forEach((job_index) => {
      job_ids.push(jobs[job_index].id);
    });
    dispatchConfirmJobs(job_ids).then(() => {
      setState({ ...state, unconfirmedSelectedRows: [] });
    });
  };

  const updatePOS = (po_number, requisition) => {
    let job_ids = [];
    state.confirmedSelectedRows.forEach((job_index) => {
      job_ids.push(jobs[job_index].id);
    });
    dispatchUpdatePOS(job_ids, po_number, requisition).then(() => {
      setState({
        ...state,
        showUpdatePODialog: false,
        unconfirmedSelectedRows: [],
        confirmedSelectedRows: [],
      });
    }).catch((error) => {
      let msg = error.error;
      if(msg.includes('SQL')) {
        msg = 'Error! Your data is invalid. The maximum limit is 30 characters or numbers.';
      }
      toast.error(msg, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  return (
    <div className={'table-grid'}>
      <UpdatePODialog
        open={state.showUpdatePODialog}
        close={closeModal}
        updatePOS={updatePOS}
      />
      <div className="box-item">
        <div className="bg-white p-3" style={{ height: 'auto' }}>
          <SearchInput
            title="Acknowledged"
            show_icon={false}
            show_confirm_button={false}
            confirmJobs={confirmJobs}
            showModal={showModal}
            onValueChange={search}
            search_value={state.searchParams.search}
          />
        </div>
        <div
          className="box-item-body"
          style={{ height: `${total_height - 150}px` }}
        >
          <Grid rows={jobs} columns={columns} rootComponent={RootConfirmed}>
            <SelectionState
              selection={state.confirmedSelectedRows}
              onSelectionChange={handleSelectConfirmedRow}
            />
            <IntegratedSelection />
            <RowDetailState />
            <SortingState />
            <IntegratedSorting
              columnExtensions={integratedSortingColumnExtensions}
            />
            <VirtualTable
              height="auto"
              cellComponent={Cell}
              rowComponent={TableRow}
              columnExtensions={tableColumnExtensions}
            />
            <TableHeaderRow showSortingControls />
            <TableSelection showSelectAll />
            <TableRowDetail contentComponent={RowDetail} />
            <TableFixedColumns leftColumns={left_columns} />
          </Grid>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    search_options: state.jobs.search_options,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getJobs: () => dispatch(actions.JobsActions.retrieve()),
    dispatchConfirmJobs: (job_ids) => dispatch(actions.JobsActions.confirmJobs(job_ids)),
    updateFilters: (search_options) => dispatch(actions.JobsActions.updateFilters(search_options)),
    dispatchUpdatePOS: (job_ids, po_number, requisition) => dispatch(actions.JobsActions.updatePOS(job_ids, po_number, requisition)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobGridTable);
