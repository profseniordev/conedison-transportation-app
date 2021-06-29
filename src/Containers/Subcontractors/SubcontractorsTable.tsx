/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
} from '@material-ui/core';
import { TABLE_HEADER } from '../../Constants/subcontractors';
import './Subcontractors.scss';

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
}));

function SubcontractorsTable({ data, onRowClick }) {
  const classes = useStyles();

  const renderHeaderRow = useCallback(
    () =>
      TABLE_HEADER.map((headCell, index) => (
        <TableCell key={index}>{headCell.label}</TableCell>
      )),
    []
  );

  const renderBodyRow = useCallback(
    () =>
      data.map((row) => (
        <TableRow
          onClick={() =>
            onRowClick(
              row.id,
              row.subcontractor,
              row.subcontractor.subcontractorName,
              row.workers,
              row.workerIds,
              row.subcontractor.firstName,
              row.subcontractor.lastName,
              row.subcontractor.email,
              row.subcontractor.phoneNumber,
            )
          }
          className={classes.tableBodyRow}
          key={row.id}
        >
          <TableCell>{row.id}</TableCell>
          <TableCell>
            {row.subcontractor && row.subcontractor.firstName}
          </TableCell>
          <TableCell>
            {row.subcontractor && row.subcontractor.lastName}
          </TableCell>
          <TableCell>{row.subcontractor && row.subcontractor.email}</TableCell>
          <TableCell>
            {row.subcontractor && row.subcontractor.phoneNumber}
          </TableCell>
          <TableCell>{row.workers.length}</TableCell>
          <TableCell>
            {row.subcontractor && row.subcontractor.subcontractorName}
          </TableCell>
          <TableCell>
            {(row.subcontractor && row.subcontractor.isOnline) ? 
                <div className='status'><div className='online'></div>Online</div>
              : <div className='status'><div className='offline'></div>Offline</div>
          }
          </TableCell>
        </TableRow>
      )),
    [data]
  );

  return (
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
  );
}

export default SubcontractorsTable;
