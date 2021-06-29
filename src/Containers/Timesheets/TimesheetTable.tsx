/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';
import moment from 'moment';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  Popover,
  IconButton,
  Box,
  makeStyles,
  Typography,
  MenuItem,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';
import {
  Dialog,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import {
  TABLE_HEADER,
  SUBCONTRACTOR_CELL_STYLES,
} from '../../Constants/timesheet';
import GetAppIcon from '@material-ui/icons/GetApp';
import EditIcon from '@material-ui/icons/Edit';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import HighlightOffSharpIcon from '@material-ui/icons/HighlightOffSharp';
import ReceiptIcon from '@material-ui/icons/Receipt';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Button from '../../components/Button/Button';
import history from '../../history';
import { connect } from 'react-redux';
import { actions } from '../../Services';
import { toast } from 'react-toastify';
interface Props {
  data?: any;
  downloadPdf?: (id: string, name: string) => void;
  handeleSort?: (data: any) => void;
  orderBy?: string;
  orderByType?: boolean;
  updateTimesheet?: (id, data) => any;
  deleteTimesheet?: (id) => any;
  permissions?: any;
  processing?: boolean;
}

const actionBtn = {
  width: 24,
  height: 24,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
  border: '1px solid #333333',
  borderRadius: 8,
  cursor: 'pointer',
};

const useStyles = makeStyles(() => ({
  paper: {
    '& .MuiPaper-rounded': {
      borderRadius: 16,
      padding: 8,
    },
  },
  tableHeaderCell: {
    // fontSize: '0.75rem',
  },
  tableBodyRow: {
    transition: '0.2s',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#cecece59',
    },
  },
  selected: {
    backgroundColor: "#cecece59 !important",
    "&:hover": {
      backgroundColor: "#cecece59 !important",
    },
  },
}));

const TimesheetTable: React.FC<Props> = ({
  data,
  downloadPdf,
  handeleSort,
  orderBy,
  orderByType,
  updateTimesheet,
  permissions,
  deleteTimesheet,
  processing
}) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState("");

  const handleClick = (e, row) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const onPdfClick = (id, name) => {
    downloadPdf(id, name);
  };

  const handleRowClick = (id) => {
    history.push(`/timesheets/${id}/edit`);
  };

  const openDeleteModal = (show) => {
    setOpen(show);
  }

  const confirmDelete = (id) => {
    deleteTimesheet(id).then(() => {
      setAnchorEl(null);
      openDeleteModal(false);
    }).catch((error) => {
      toast.error(error.error, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setAnchorEl(null);
      openDeleteModal(false);
    })
  }

  const checkIsVerified = useCallback((value) => {
    return (
      <div>
        {value ? (
          <span
            className="badge badge-secondary p-2 mr-2 mt-1"
            style={{ backgroundColor: '#27AE60' }}
          >
            Verified
          </span>
        ) : (
          <span
            className="badge badge-secondary p-2 mr-2 mt-1"
            style={{ backgroundColor: 'EB5757' }}
          >
            Unverified
          </span>
        )}
      </div>
    );
  }, []);

  const renderPaidTypes = useCallback((item) => {
    return (
      <div>
        {item.paid && item.paid !== '0' ? (
          <span className="badge badge-secondary p-2 mr-2 mt-1">Invoice Paid</span>
        ) : null}
        {item.workerPaid && item.workerPaid !== '0' ? (
          <span className="badge badge-secondary p-2 mr-2 mt-1">
            Worker Paid
          </span>
        ) : null}
        {item.invoiced && item.invoiced !== '0' ? (
          <span className="badge badge-secondary p-2 mr-2 mt-1">Invoiced</span>
        ) : null}
      </div>
    );
  }, []);

  const renderStatus = useCallback((item) => {
    if (item === 'clocked_out') return 'Clocked out';
    if (item === 'clocked_in') return 'Clocked in';
  }, []);

  const renderTableCellLabel = (label) => {
    if (label.length > 15) {
      return (
        <Tooltip title={label} placement="top">
          <div>{label.substr(0, 15)}...</div>
        </Tooltip>
      );
    } else {
      return label;
    }
  };

  const renderHeaderRow = useCallback(
    () =>
      TABLE_HEADER.map((headCell, index) => {
        if (headCell.sortable) {
          return (
            <TableCell
              key={index}
              className={classes.tableHeaderCell}
              style={headCell.styles}
            >
              <TableSortLabel
                active={orderBy === headCell.value}
                direction={
                  orderBy === headCell.value && orderByType ? 'asc' : 'desc'
                }
                onClick={() => handeleSort(headCell.value)}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          );
        } else {
          return (
            <TableCell key={index} className={classes.tableHeaderCell}>
              {headCell.label}
            </TableCell>
          );
        }
      }),
    [orderBy, orderByType]
  );

  const renderBodyRow = useCallback(
    () =>
      data.map((row) => (
        <TableRow
          onClick={() => handleRowClick(row.id) }
          selected={selectedRow && selectedRow.id === row.id}
          classes={{selected: classes.selected,}}
          className={classes.tableBodyRow}
          key={row.id}
        >
          <TableCell>
            {moment(row.startDate).format('MM/DD/YY [•] HH:mm')}
          </TableCell>
          <TableCell>
            {moment(row.finishDate).format('MM/DD/YY [•] HH:mm')}
          </TableCell>
          <TableCell>{row.worker_name}</TableCell>
          <TableCell style={SUBCONTRACTOR_CELL_STYLES}>
            {row.subcontractorName &&
              renderTableCellLabel(row.subcontractorName)}
          </TableCell>
          <TableCell>{row.totalHours}</TableCell>
          <TableCell>{row.confirmationNumber}</TableCell>
          <TableCell>{row.po}</TableCell>
          <TableCell>{row.job_status}</TableCell>
          <TableCell>{renderStatus(row.status)}</TableCell>
          <TableCell>{renderPaidTypes(row)}</TableCell>
          <TableCell>{checkIsVerified(row.isVerified)}</TableCell>
          <TableCell onClick={(e) => handleClick(e, row)}>
            <div style={actionBtn}>•••</div>
          </TableCell>
        </TableRow>
      )),
    [data, selectedRow]
  );

  return (
    <>
      <Paper style={{borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>{renderHeaderRow()}</TableRow>
            </TableHead>
            <TableBody>{renderBodyRow()}</TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {selectedRow && (
        <>
        <Popover
          id={'row-popover'}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          className={classes.paper}
        >
          <Box display="flex" flexDirection="column">
            <MenuItem onClick={() => handleRowClick(selectedRow.id)}>
              <Box display="flex" alignItems="center">
              <IconButton>
                  <EditIcon />
                </IconButton>
                <Typography>Edit Timesheet</Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() =>
                onPdfClick(selectedRow.id, selectedRow.worker_name)
              }
            >
              <Box display="flex" alignItems="center">
              <IconButton>
                  <GetAppIcon />
                </IconButton>
                <Typography>Download .pdf</Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() =>
                updateTimesheet(selectedRow.id, {...selectedRow, isVerified: 1})
              }
            >
              <Box display="flex" alignItems="center">
              <IconButton>
                  <VerifiedUserIcon />
                </IconButton>
                <Typography>Timesheet Verified</Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() =>
                updateTimesheet(selectedRow.id, {...selectedRow, workerPaid: 1})
              }
            >
              <Box display="flex" alignItems="center">
              <IconButton>
                  <DoneIcon />
                </IconButton>
                <Typography>Worker Paid</Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() =>
                updateTimesheet(selectedRow.id, {...selectedRow, invoiced: 1})
              }
            >
              <Box display="flex" alignItems="center">
                <IconButton>
                  <ReceiptIcon />
                </IconButton>
                <Typography>Invoiced</Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() =>
                updateTimesheet(selectedRow.id, {...selectedRow, paid: 1})
              }
            >
              <Box display="flex" alignItems="center">
              <IconButton>
                  <DoneAllIcon />
                </IconButton>
                <Typography>Invoice Paid</Typography>
              </Box>
            </MenuItem>
            {permissions.includes('delete_timesheets') &&
            <Tooltip title={(selectedRow.paid || selectedRow.isVerified || selectedRow.workerPaid || selectedRow.invoiced) ? "The timesheet cannot be deleted if it is verified, paid, or billed" : ""}  aria-label="delete" arrow>
              <div>
            <MenuItem
              disabled={selectedRow.paid || selectedRow.isVerified || selectedRow.workerPaid || selectedRow.invoiced}
              onClick={() =>
                openDeleteModal(true)
                //deleteTimesheet(selectedRow.id)
              }
            >
              <Box display="flex" alignItems="center">
              <IconButton>
                  <HighlightOffSharpIcon />
                </IconButton>
                <Typography>Delete Timesheet</Typography>
              </Box>
            </MenuItem>
            </div>
            </Tooltip>
          }
          </Box>
        </Popover>
        <Dialog
          onClose={() => openDeleteModal(false)}
          aria-labelledby="simple-dialog-title"
          open={open}
        >
          <DialogTitle className={'cancel-title'} style={{maxWidth: 365}}>
            You will NOT be able to revert this action. Are you sure you want to delete this Timesheet?
          </DialogTitle>
          <DialogActions className={'action-button-group'}>
            <Button
              color={'gray'}
              width={'158px'}
              borderRadius={'20px'}
              textTransform={false}
              onClick={() => openDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              color={'dark'}
              width={'158px'}
              borderRadius={'20px'}
              textTransform={false}
              processing={processing}
              onClick={() => confirmDelete(selectedRow.id)}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        </>
      )}
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateTimesheet: (id, data) => dispatch(actions.TimesheetsActions.update(id, data)),
    deleteTimesheet: (id) => dispatch(actions.TimesheetsActions.deleteTimesheet(id)),
  };
}

function mapStateToProps(state) {
  return {
    permissions: state.app.permissions,
    processing: state.timesheets.processing,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimesheetTable);
