/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  makeStyles,
  TableSortLabel,
  Tooltip,
  MenuItem,
  Select,
} from '@material-ui/core';
import { actions } from '../../Services';
import { TABLE_HEADER } from '../../Constants/worker';
import { WORKER_TYPE, WORKER_STATUS } from './Workers';
import CloseIcon from '../../Images/close-regular.png';
import CEModal from '../Components/Modal/Modal.Component';
import authStore from '../../Stores/authStore';
import history from '../../history';

interface Props {
  data?: any;
  handleSort?: (data: any) => void;
  orderBy?: string;
  orderByType?: boolean;
  updateWorkerStatus?: (id: any, data: any) => void;
}

const useStyles = makeStyles(() => ({
  paper: {
    '& .MuiPaper-rounded': {
      borderRadius: 16,
      padding: 8,
    },
  },
  tableBodyRow: {
    transition: '0.2s',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#cecece59',
    },
  },
  tableHeaderCell: {
    width: 200
  },
  tableBodyCell: {
    maxWidth: 200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  workerName: {
    color: '#2F80ED',
    maxWidth: 200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const WorkersSortTable: React.FC<Props> = ({
  data,
  handleSort,
  orderBy,
  orderByType,
  updateWorkerStatus,
}) => {
  const classes = useStyles();

  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [workerName, setWorkerName] = useState(null);
  const [workerId, setWorkerId] = useState(null);
  const [status, setWorkerStatus] = useState(null);

  const handleRowClick = (id) => {
    history.push(`/workers/${id}`);
  };

  const handleChange = (
    event: React.ChangeEvent<{ value: unknown }>,
    id,
    name
  ) => {
    event.stopPropagation();
    setWorkerStatus(event.target.value);
    setWorkerId(id);
    setWorkerName(name);
    setShowWorkerModal(true);
  };

  const changeStatus = (id, status) => {
    updateWorkerStatus(id, { status: status });
    showModal(false);
  };

  const showModal = (show) => {
    setShowWorkerModal(show);
    setWorkerId(null);
    setWorkerName(null);
    setWorkerStatus(null);
  };

  const renderTableCellLabel = (label) => {
    if (label.length > 20) {
      return (
        <Tooltip title={label} placement="top">
          <div>{label.substr(0, 20)}...</div>
        </Tooltip>
      );
    } else {
      return label;
    }
  };

  const renderType = (workerTypes: number[]) => {
    let typeList = [];
    WORKER_TYPE.map((type) => (
      (workerTypes.find((item) => type.value === item)) ?
        typeList.push(type.label) : ''
    ));
    const typeString = typeList.join(', ');
    if(typeString.length > 20) {
      return (
        <Tooltip title={typeString} placement="top">
          <div>{typeString.substr(0, 20)}...</div>
        </Tooltip>
      );
    } else {
      return typeString;
    }
  };

  const renderHeaderRow = useCallback(
    () =>
      TABLE_HEADER.map((headCell) => {
        if (headCell.sortable) {
          return (
            <TableCell className={classes.tableHeaderCell}>
              <TableSortLabel
                active={orderBy === headCell.value}
                direction={
                  orderBy === headCell.value && orderByType ? 'asc' : 'desc'
                }
                onClick={() => handleSort(headCell.value)}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          );
        } else {
          return <TableCell className={classes.tableHeaderCell}>{headCell.label}</TableCell>;
        }
      }),
    [orderBy, orderByType]
  );

  const renderBodyRow = useCallback(
    () =>
      data.map((row) => (
        <TableRow className={classes.tableBodyRow} key={row.id} onClick={() => handleRowClick(row.id)}>
          <TableCell className={classes.tableBodyCell}>{row.uid}</TableCell>
          <TableCell className={classes.tableBodyCell}>
            {authStore.canDoWorkerAction() ? (
              <Select
                className={classNames({
                  'is-active': row.status.toLowerCase() === 'active',
                  'is-inactive': row.status.toLowerCase() === 'inactive',
                  'is-onhold': row.status.toLowerCase() === 'onhold',
                })}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={row.status.toLowerCase()}
                onChange={(e) => handleChange(e, row.id, row.name)}
              >
                {WORKER_STATUS.map((status, index) => (
                  <MenuItem key={index} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              row.status
            )}
          </TableCell>
          <TableCell className={classes.workerName}>
            {row.name}
          </TableCell>
          <TableCell className={classes.tableBodyCell}>{row.phoneNumber}</TableCell>
          <TableCell className={classes.tableBodyCell}>{row.email}</TableCell>
          <TableCell className={classes.tableBodyCell}>
            {Array.isArray(row.workerTypes)
              ? renderType(row.workerTypes)
              : null}
          </TableCell>
          <TableCell className={classes.tableBodyCell}>
            {row.subcontractorName &&
              renderTableCellLabel(row.subcontractorName)}
          </TableCell>
        </TableRow>
      )),
    [data]
  );

  return (
    <>
      <Paper style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>{renderHeaderRow()}</TableRow>
            </TableHead>
            <TableBody>{renderBodyRow()}</TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <CEModal
        show={showWorkerModal}
        onClose={() => showModal(false)}
        size="ce-modal-content"
      >
        <div>
          <div className="ce-flex-right">
            <span className="pull-right" onClick={() => showModal(false)}>
              <img src={CloseIcon} alt="" />
            </span>
          </div>
          <div className="text-center">
            <div className="m-3">
              <span>
                {`Are you sure to change `}
                <b>{workerName}</b>
                {` to `} <b>{status}</b> ?
              </span>
            </div>
            <div className="d-flex justify-content-between mx-2 mt-40 mb-25">
              <span
                className="btn ce-btn-modal-save mr-5"
                onClick={() => changeStatus(workerId, status)}
              >
                <span>Yes</span>
              </span>
              <span
                className="btn ce-btn-modal-cancel"
                onClick={() => showModal(false)}
              >
                <span>No</span>
              </span>
            </div>
          </div>
        </div>
      </CEModal>
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateWorkerStatus: (worker_id, data) =>
      dispatch(actions.WorkersActions.updateWorkerStatus(worker_id, data)),
  };
}

export default connect(null, mapDispatchToProps)(WorkersSortTable);
