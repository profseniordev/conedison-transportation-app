import React from 'react';
import CETSearchInput from '../Components/Controls/SearchInput.Component';
import { WorkerAsyncSearch } from '../Components/Controls/WorkerAsyncSearch';

function TimesheetsFilters({
  handleChangeSearchParams,
  handleWorkerSelect,
  searchParams,
}) {
  const localWorker = localStorage.getItem('timesheets.filters.worker')
    ? JSON.parse(localStorage.getItem('timesheets.filters.worker'))
    : null;

  return (
    <div style={styles.filtersStyles}>
      <div>
        <span>Worker</span>
        <div>
          <WorkerAsyncSearch
            current_value={localWorker}
            isClearable={true}
            searchParams={{ onlyTimesheetRelated: true }}
            placeholder="Enter First Letters..."
            onSelect={(item) => {
              handleWorkerSelect({
                worker: { ...item },
                data: {
                  name: 'worker',
                  value: item ? item.value.id : '',
                },
              });
            }}
          />
        </div>
      </div>
      <div>
        <span>Subcontractor</span>
        <CETSearchInput
          title={searchParams.subcontractorName}
          name="subcontractorName"
          placeholder="Search by Subcontractor"
          onChange={handleChangeSearchParams}
        />
      </div>
      <div>
        <span>Confirmation #</span>
        <CETSearchInput
          title={searchParams.confirmation}
          name="confirmation"
          placeholder="00000000"
          onChange={handleChangeSearchParams}
        />
      </div>
      <div>
        <span>Shift ID</span>
        <CETSearchInput
          title={searchParams.shift_id}
          name="shift_id"
          placeholder="00000000"
          onChange={handleChangeSearchParams}
        />
      </div>
      <div>
        <span>PO #</span>
        <div>
          <CETSearchInput
            title={searchParams.po}
            name="po"
            placeholder="000000"
            onChange={handleChangeSearchParams}
          />
        </div>
      </div>
    </div>
  );
}
const styles = {
  filtersStyles: {
    padding: '1rem',
    backgroundColor: '#fff',
    marginBottom: '1rem',
    borderRadius: '1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    alignItems: 'end',
    gridGap: 20,
  },
  disabledFilterBtn: {
    background: '#BDBDBD',
    color: '#fff',
  },
};

export default TimesheetsFilters;
