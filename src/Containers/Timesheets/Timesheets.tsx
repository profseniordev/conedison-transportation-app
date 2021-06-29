/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { actions } from '../../Services';
import { timesheetAPI } from '../../Services/API';
import './Timesheet.scss';
import {
  PAID_ONLY_STATUSES,
  VERIFIED_STATUSES,
  PER_PAGES,
} from '../../Constants/timesheet';
import Select from 'react-select';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import TimesheetsFilters from './TimesheetsFilters';
import TimesheetTable from './TimesheetTable';
import Pagination from '@material-ui/lab/Pagination';
import { MenuItem, Select as MaterialSelect } from '@material-ui/core';
import { JOB_STATUSES } from '../../Constants/job';
import history from '../../history';
import { useIsMount } from '../../Utils/hooks/useMount';
import DatePicker from '../../components/Picker/DatePicker';
import { setSelectedWorker } from '../../Services/timesheets/actions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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

const statuses = [
  {
    value: JOB_STATUSES.New,
    label: JOB_STATUSES[JOB_STATUSES.New],
  },
  {
    value: JOB_STATUSES.InProgress,
    label: JOB_STATUSES[JOB_STATUSES.InProgress],
  },
  {
    value: JOB_STATUSES.Completed,
    label: JOB_STATUSES[JOB_STATUSES.Completed],
  },
  {
    value: JOB_STATUSES.Billed,
    label: JOB_STATUSES[JOB_STATUSES.Billed],
  },
  {
    value: JOB_STATUSES.Cancelled,
    label: JOB_STATUSES[JOB_STATUSES.Cancelled],
  },
  {
    value: JOB_STATUSES.CancelledBillable,
    label: 'Cancelled Billable',
  },
  {
    value: JOB_STATUSES.Paid,
    label: JOB_STATUSES[JOB_STATUSES.Paid],
  },
];

interface Props {
  timesheets?: any;
  loading?: boolean;
  searchOptions?: any;
  retrieve?: () => void;
  updateFilters?: (search_options: any) => void;
  onSelectWorker?: (worker: any) => void;
  field_supervisor?: boolean;
  updateJobFilters?: (search_options: any) => void;
  is_supervisor?: boolean;
}

const Timesheets: React.FC<Props> = ({
  timesheets,
  loading,
  searchOptions,
  retrieve,
  updateFilters,
  onSelectWorker,
  field_supervisor,
  updateJobFilters,
  is_supervisor
}) => {
  const divElement = useRef(null);
  const pagElem = useRef(null);
  const filtersElem = useRef(null);
  const headerElement = useRef(null);

  const firstRender = useIsMount();

  const [tableHeight, setTableHeight] = useState(0);

  const [searchParams, setSearchParams] = useState(searchOptions);

  const loadTimesheetsWithDelayReset = (type: string = null) => {
    updateFilters({ ...searchParams, page: 1 });
  };

  const handleChangeSelectSearchParams = (name) => {
    return (item) => {
      setSearchParams((state: any) => ({
        ...state,
        [name]: item ? item.value : '',
      }));
    };
  };

  const handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    setSearchParams((state: any) => ({
      ...state,
      [name]: value,
    }));
  };

  const onPaginationChange = (event, value: number) => {
    updateFilters({ ...searchParams, page: value });
  };

  const onPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchParams((state: any) => ({
      ...state,
      per_page: event.target.value,
    }));
  };

  const dateChange = (data) => {
    setSearchParams((state: any) => ({
      ...state,
      from_datetime: data.from_datetime,
      to_datetime: data.to_datetime,
    }));
  };

  const downloadPdf = async (id: string, name: string) => {
    const response = await timesheetAPI.downloadPdf(id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name} - timesheet.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  const renderValue = (value) => {
    return value;
  };

  const renderMenuItems = () => {
    return PER_PAGES.map((item, i) => (
      <MenuItem key={item.value} value={item.value}>
        {item.label}
      </MenuItem>
    ));
  };

  const setTableSize = () => {
    const total_height = divElement.current.clientHeight;
    const pagH = pagElem.current.clientHeight;
    const filtersH = filtersElem.current.clientHeight;
    const headerH = headerElement.current.clientHeight;

    setTableHeight(total_height - pagH - filtersH - headerH - 190);
  };

  const handeleSort = (value) => {
    if (searchParams.order_by === value) {
      setSearchParams({
        ...searchParams,
        order_by_type: !searchParams.order_by_type,
      });
    } else {
      setSearchParams({
        ...searchParams,
        order_by: value,
        order_by_type: true,
      });
    }
  };

  const handleWorkerSelect = ({ worker, data }) => {
    if (worker.label) {
      onSelectWorker(worker);
    } else {
      onSelectWorker(null);
    }
    const { name, value } = data;
    setSearchParams((state: any) => ({
      ...state,
      [name]: value,
    }));
  };

  useEffect(() => {
    setTableSize();
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    if (jobId) {
      setSearchParams((state: any) => ({
        ...state,
        job_id: jobId,
        confirmation: '',
        shift_id: '',
        page: 1,
      }));
    } else {
      setSearchParams((state: any) => ({
        ...state,
        job_id: '',
        confirmation: '',
        shift_id: '',
        page: 1,
      }));
    }
  }, []);

  useEffect(() => {
    if (!firstRender) {
      loadTimesheetsWithDelayReset();
    }
  }, [searchParams]);

  return (
    <div className="timesheet-list-page" ref={divElement}>
      <div
        ref={headerElement}
        className="container-fluid d-flex justify-content-between align-items-center sub-header"
      >
        <div className="page-title timesheet-title">Timesheets</div>
        <div className="row w-100 ml-5 justify-content-end">
          {is_supervisor && (
            <FormControlLabel
                  control={
                    <Checkbox
                      checked={field_supervisor}
                      onChange={(event) =>{
                        handleChangeSearchParams({
                          target: {
                            name: 'field_supervisor',
                            value: event.target.checked,
                          },
                        });
                        updateJobFilters({
                          'field_supervisor':
                           event.target.checked
                        })}
                      }
                      name="unassigned"
                    />
                  }
                  label="View All Dept Timesheets"
            />
          )}
          <div className="col-auto mt-sm-1 mt-md-0">
            <button
              type="button"
              className="btn btn-success btn-add"
              onClick={() => history.push(`/timesheets/create`)}
            >
              Create New
            </button>
          </div>

          <div className="mt-1 mx-3" style={{ width: 225, display: 'flex' }}>
            <DatePicker
              updated={dateChange}
              from_datetime={searchParams.from_datetime}
              to_datetime={searchParams.to_datetime}
            />
          </div>

          <div className="mt-1 mx-3" style={{ width: 225 }}>
            <Select
              isClearable
              options={VERIFIED_STATUSES}
              placeholder={'Verified Status'}
              onChange={(item) =>
                handleChangeSearchParams({
                  target: {
                    name: 'verifiedStatus',
                    value: item ? item.value : null,
                  },
                })
              }
              bl
            />
          </div>
          <div className="mt-1 mx-3" style={{ width: 193 }}>
            <Select
              isClearable
              options={PAID_ONLY_STATUSES}
              placeholder={'Paid Status'}
              onChange={handleChangeSelectSearchParams('paidOnlyStatus')}
            />
          </div>

          <div className="mt-1 mx-3" style={{ width: 170 }}>
            <Select
              isClearable
              options={statuses}
              placeholder={'Job Status'}
              onChange={handleChangeSelectSearchParams('jobStatus')}
            />
          </div>
        </div>
      </div>

      {loading ? <LinearProgress /> : <div style={{ height: 4 }}></div>}

      <div
        className="container-fluid timesheet-body"
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <div ref={filtersElem}>
          <TimesheetsFilters
            handleWorkerSelect={handleWorkerSelect}
            handleChangeSearchParams={handleChangeSearchParams}
            searchParams={searchParams}
          />
        </div>
        <div
          style={{
            overflowY: 'scroll',
            maxHeight: `${tableHeight}px`,
            overflowX: 'hidden',
          }}
        >
          {Array.isArray(timesheets.results) &&
            timesheets.results.length > 0 && (
              <TimesheetTable
                orderBy={searchParams.order_by}
                orderByType={searchParams.order_by_type}
                data={timesheets.results}
                downloadPdf={downloadPdf}
                handeleSort={handeleSort}
              />
            )}
        </div>

        <div ref={pagElem} style={paginationStyles}>
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
              onChange={onPerPageChange}
              value={searchParams.per_page}
              renderValue={() => renderValue(searchParams.per_page)}
            >
              {renderMenuItems()}
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
            {timesheets.current_page &&
              `PAGE: ${timesheets.current_page} of
              ${Math.ceil(timesheets.total / timesheets.per_page)}`}
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
              page={+timesheets.current_page}
              count={Math.max(
                0,
                Math.ceil(timesheets.total / timesheets.per_page)
              )}
              onChange={onPaginationChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps({ timesheets, jobs, app }) {
  return {
    timesheets: timesheets.timesheets,
    searchOptions: timesheets.search_options,
    loading: timesheets.processing,
    field_supervisor: jobs.search_options.field_supervisor,
    is_supervisor: app.user
      ? [3].some((r) => app.user.roles.includes(r))
      : false,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    retrieve: () => dispatch(actions.TimesheetsActions.retrieve()),
    updateFilters: (search_options) =>
      dispatch(actions.TimesheetsActions.updateFilters(search_options)),
    onSelectWorker: (worker) => setSelectedWorker(worker),
    updateJobFilters: (search_options) =>
      dispatch(actions.JobsActions.updateFilters(search_options))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Timesheets);
