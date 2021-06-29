import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CETSearchRadiusInput from '../Components/Controls/SearchRadiusInput.Component';
import SubcontractorMaterialAsyncSearch from '../Components/Controls/SubcontractorMaterialAsyncSearch';
import { WORKER_TYPE, WORKER_STATUS } from './Workers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: '100%',
      '& .MuiOutlinedInput-input': {
        padding: '12px 20px !important',
        color: '#808080',
      },
      '& .MuiAutocomplete-inputRoot': {
        paddingTop: 0,
        paddingBottom: 0,
      },
      '& .MuiAutocomplete-root': {
        width: '100% !important',
      },
      '& .MuiInputLabel-outlined': {
        transform: 'translate(14px, 14px)',
        fontSize: 14,
        backgroundColor: '#FFFFFF'
      },
      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
      }
    },
  })
);

const WorkersFilter = ({ handleChangeSearchParams, selectSubcontractor }) => {
  const classes = useStyles();

  const [status, setWorkerStatus] = React.useState('');
  const [type, setWorkerType] = React.useState('');

  const handleChangeStatus = (event) => {
    setWorkerStatus(event.target.value);
    handleChangeSearchParams(event);
  };

  const handleChangeType = (event) => {
    setWorkerType(event.target.value);
    handleChangeSearchParams(event);
  };

  return (
    <div style={styles.filtersStyles}>
      <div>
          <CETSearchRadiusInput
            name="searchWorkers"
            placeholder="Search by name, phone, email or number"
            onChange={handleChangeSearchParams}
          />
        </div>
      <div>
        <div>
          <FormControl className={classes.formControl}>
            <SubcontractorMaterialAsyncSearch
              onSelectSubcontractor={selectSubcontractor}
            />
          </FormControl>
        </div>
      </div>
      <div>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Status</InputLabel>
          <Select
            labelId="simple-select-outlined-label"
            id="simple-select-outlined"
            name="status"
            onChange={handleChangeStatus}
            value={status}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
              },
              getContentAnchorEl: null
            }}
          >
            <MenuItem value="">All</MenuItem>
            {WORKER_STATUS.map((status, index) => (
              <MenuItem key={index} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Worker Types</InputLabel>
          <Select
            labelId="simple-select-outlined-label"
            id="simple-select-outlined"
            name="workerTypes"
            onChange={handleChangeType}
            value={type}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
              },
              getContentAnchorEl: null
            }}
          >
            <MenuItem value="">All</MenuItem>
            {WORKER_TYPE.map((type, index) => (
              <MenuItem key={index} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

const styles = {
  filtersStyles: {
    backgroundColor: '#fff',
    borderRadius: '1rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    alignItems: 'end',
    gridGap: 20,
  },
  disabledFilterBtn: {
    background: '#BDBDBD',
    color: '#fff',
  },
};

export default WorkersFilter;
