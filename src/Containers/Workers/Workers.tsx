import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from '@material-ui/lab/Pagination';
import { MenuItem, Select as MaterialSelect } from '@material-ui/core';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import WorkersFilter from './WorkersFilter';
import WorkersSortTable from './WorkersSortTable';
import { actions } from '../../Services';
import { workerAPI } from '../../Services/API';
import { JobType } from '../../Constants/job';
import { PER_PAGES } from '../../Constants/worker';

import './Workers.scss';

const paginationStyles = {
  borderTop: '1px solid rgb(224, 224, 224)',
  paddingTop: 20,
  paddingBottom: 20,
  backgroundColor: '#fff',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
};

export const WORKER_TYPE = [
  {
    label: 'Parking',
    value: JobType.Parking,
  },
  {
    label: 'Flagging',
    value: JobType.Flagging,
  },
  {
    label: 'Signage',
    value: JobType.Signage,
  },
];

export const WORKER_STATUS = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
  {
    label: 'OnHold',
    value: 'onhold',
  },
];

class Workers extends React.Component<any> {
  details = {} as any;
  timer = null;
  state = {
    workersOnPage: [],
    searchParams: {} as any,
    loading: false,
    workers: [],
    workers_filtered: [],
    total_height: 0,
    currentPage: 1,
    limit: 100,
    total: 0,
    order_by: 'uid',
    order_by_type: true,
  };
  inputRef: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    this.state = {
      workersOnPage: [],
      searchParams: {},
      loading: props.loading || false,
      workers: props.workers || [],
      workers_filtered: [],
      total_height: 0,
      currentPage: 1,
      limit: 10,
      total: 0,
      order_by: 'uid',
      order_by_type: true,
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    const total_height = document.getElementById('root').clientHeight;
    this.setState({ total_height });

    this.props.getAllWorkers();
    this.updateWorkersTable();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.workers && nextProps.workers !== this.props.workers) {
      this.setState(
        {
          workers: nextProps.workers,
          loading: nextProps.loading,
        },
        () => this.updateWorkersTable()
      );
    }
  }

  selectSubcontractor = (subcontractor) => {
    this.setState(
      (state: any) => ({
        searchParams: {
          ...state.searchParams,
          subcontractorId: subcontractor ? [subcontractor.value.id] : [],
        },
      }),
      this.updateWorkersTable
    );
  };

  handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    if (name === 'workerTypes') {
      this.setState(
        (state: any) => ({
          searchParams: {
            ...state.searchParams,
            workerTypes: value ? [value] : [],
          },
        }),
        this.updateWorkersTable
      );
    } else {
      this.setState(
        (state: any) => ({
          searchParams: { ...state.searchParams, [name]: value },
        }),
        this.updateWorkersTable
      );
    }
  };

  onPerPageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState(
      {
        limit: event.target.value,
      },
      () => this.updateWorkersTable()
    );
  };

  onPaginationChange = (event, page: number) => {
    this.setState(
      {
        currentPage: page,
      },
      () => this.updateWorkersTable()
    );
  };

  handleChangeFileExcel = async (e: any) => {
    this.setState({ loading: true });
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append('excel', file);
    await workerAPI.importExcel(fd).then((res) => {
      this.setState({ loading: false });
      if (res.status === 200) {
        toast.success('Workers import successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
  };

  triggerInputFile = () => {
    this.inputRef.current.click();
  };

  updateWorkersTable = () => {
    const { searchParams } = this.state;
    const { currentPage, limit } = this.state;
    const { order_by, order_by_type } = this.state;

    let workers = [...this.state.workers];

    workers = workers.sort((a, b) => {
      if (a[order_by] < b[order_by]) {
        return order_by_type ? -1 : 1;
      }

      if (a[order_by] > b[order_by]) {
        return order_by_type ? 1 : -1;
      }
      return 0;
    });

    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key] && searchParams[key].length > 0) {
        workers = workers.filter((item) => {
          if (key === 'workerTypes') {
            return item[key] && item[key].indexOf(searchParams[key][0]) >= 0;
          } else if (key === 'status') {
            return (
              item[key] &&
              item[key].toLowerCase() === searchParams[key].toLowerCase()
            );
          } else if (key === 'subcontractorId') {
            return item[key] && item[key] === searchParams[key][0];
          } else {
            let names;
            let emails;
            let phoneNumbers;
            //if (item['name']) {
              names =  item['name']
                .toLowerCase()
                .includes(searchParams[key].toLowerCase());
            //} else if (item['email']) {
              emails =  item['email']
                .toLowerCase()
                .includes(searchParams[key].toLowerCase());
            //} else if (item['phoneNumber']) {
              phoneNumbers = item['phoneNumber']
                .toLowerCase()
                .includes(searchParams[key].toLowerCase());
            //}
            return emails || names || phoneNumbers;
          }
          return false;
        });
      }
    });

    this.setState({ total: workers.length });

    const start = (currentPage - 1) * limit;
    const end = currentPage * limit;
    workers = workers.slice(start, end);
    this.setState({ workers_filtered: workers });
  };

  handleSort = (value) => {
    if (this.state.order_by === value) {
      this.setState(
        {
          order_by_type: !this.state.order_by_type,
        },
        () => this.updateWorkersTable()
      );
    } else {
      this.setState(
        {
          order_by: value,
          order_by_type: true,
        },
        () => this.updateWorkersTable()
      );
    }
  };

  renderMenuItems = () => {
    return PER_PAGES.map((item, i) => (
      <MenuItem key={item.value} value={item.value}>
        {item.label}
      </MenuItem>
    ));
  };

  renderValue = (value) => {
    return value;
  };

  render() {
    const { loading, workers_filtered } = this.state;

    return (
      <div className="container-fluid workers-list-page">
        <div className="page-header sub-header">
          <div className="page-title">Workers</div>
          <div>
            <WorkersFilter
              handleChangeSearchParams={this.handleChangeSearchParams}
              selectSubcontractor={this.selectSubcontractor}
            />
          </div>
          <div className="user-role-action d-flex align-items-center">
            <Link className="goto-create-role mr-3" to={`/workers/create`}>
              <button className="btn-new btn btn-success btn-add">
                Add New
              </button>
            </Link>
            <input
              className="input-excel"
              accept=".xls,.xlsx"
              ref={this.inputRef}
              type="file"
              onChange={this.handleChangeFileExcel}
            />
            <button
              className="btn-import btn btn-success btn-add bg-color-primary"
              onClick={this.triggerInputFile}
            >
              Import from Excel
            </button>
          </div>
        </div>
        {loading ? <LinearProgress /> : <div style={{ height: 4 }}></div>}
        <div className="container-fluid workers-body">
          <div
            style={{
              overflowY: 'scroll',
              maxHeight: this.state.total_height - 270,
              overflowX: 'hidden',
            }}
          >
            {Array.isArray(workers_filtered) && workers_filtered.length > 0 && (
              <WorkersSortTable
                orderBy={this.state.order_by}
                orderByType={this.state.order_by_type}
                data={workers_filtered}
                handleSort={this.handleSort}
              />
            )}
          </div>
          <div style={paginationStyles}>
            <div
              style={{
                paddingLeft: 16,
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'flex-start',
              }}
            >
              Per page:{' '}
              <MaterialSelect
                style={{ marginLeft: 20 }}
                onChange={this.onPerPageChange}
                value={this.state.limit}
                renderValue={() => this.renderValue(this.state.limit)}
              >
                {this.renderMenuItems()}
              </MaterialSelect>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {this.state.currentPage &&
                `PAGE: ${this.state.currentPage} of
              ${Math.ceil(this.state.total / this.state.limit)}`}
            </div>
            <div
              style={{
                paddingRight: 16,
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <Pagination
                page={+this.state.currentPage}
                count={Math.max(
                  0,
                  Math.ceil(this.state.total / this.state.limit)
                )}
                onChange={this.onPaginationChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    workers: state.workers.workers,
    loading: state.workers.processing,
    search_options: state.workers.search_options,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getAllWorkers: () => dispatch(actions.WorkersActions.retrieve()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Workers);
