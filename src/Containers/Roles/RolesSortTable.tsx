/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';
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
  Menu,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { actions } from '../../Services';
import userStore from '../../Stores/userStore';
import { TABLE_HEADER, APPROVE, ROLES } from '../../Constants/user';
import history from '../../history';
import { toast } from 'react-toastify';

interface Props {
  data?: any;
  handleSort?: (data: any) => void;
  orderBy?: string;
  orderByType?: boolean;
  updateApprove: (id: any, approve: any) => any;
  deleteUser: (id: any) => any
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
    width: 200,
    '&:last-child': {
      textAlign: 'right',
    },
  },
  tableBodyCell: {
    maxWidth: 200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',

    '&:last-child': {
      textAlign: 'right',
    },
  },
}));

const RolesSortTable: React.FC<Props> = ({
  data,
  handleSort,
  orderBy,
  orderByType,
  updateApprove,
  deleteUser,
}) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const actions = [
    {
      id: 'approval',
      label: 'Approval',
    },
    {
      id: 'reject',
      label: 'Reject',
    },
    {
      id: 'edit',
      label: 'Edit',
    },
    {
      id: 'delete',
      label: 'Delete',
    },
    {
      id: 'resend_activation_email',
      label: 'Resend Activation Email',
    },
  ];

  const onAction = async (action) => {
    const userId = selectedRow.id;
    switch (action) {
      case 'approval':
        await updateApprove(userId, APPROVE.approved)
        .then(res => {
          toast.success('Approved!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch(error => {
          toast.error(error.error, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
        break;
      case 'reject':
       await updateApprove(userId, APPROVE.rejected)
       .then(res => {
        toast.success('Rejected!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(error => {
        toast.error(error.error, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
        break;
      case 'edit':
        history.push(`/profile/${userId}`);
        break;
      case 'delete':
        await deleteUser(userId)
          .then(res => {
            toast.success('Deleted!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          })
          .catch(error => {
            toast.error(error.error, {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
        break;
      case 'resend_activation_email':
        userStore.ActivateEmail(userId);
        break;
      default:
        break;
    }

    handleClose();
  };

  const handleRowClick = (id) => {
    history.push(`/profile/${id}`);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, row: any) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const renderRole = (roleId: number, index: number) => {
    const role = ROLES.find((role) => role.id === roleId);
    return role ? (
      <span className="badge badge-secondary p-2 mr-2 mb-2" key={index}>
        {role.name}
      </span>
    ) : null;
  };

  const renderHeaderRow = useCallback(
    () =>
      TABLE_HEADER.map((headCell, index) => {
        if (headCell.sortable) {
          return (
            <TableCell className={classes.tableHeaderCell} key={index}>
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
          return (
            <TableCell className={classes.tableHeaderCell} key={index}>
              {headCell.label}
            </TableCell>
          );
        }
      }),
    [orderBy, orderByType]
  );

  const renderBodyRow = useCallback(
    () =>
      data.map((row, index) => (
        row.roles.length > 0 && !row.roles.includes(9) &&
        <TableRow
          className={classes.tableBodyRow}
          key={index}
          onClick={() => handleRowClick(row.id)}
        >
          <TableCell className={classes.tableBodyCell}>{row.name}</TableCell>
          <TableCell className={classes.tableBodyCell}>{row.email}</TableCell>
          <TableCell>
            {Array.isArray(row.roles)
              ? row.roles.map((role, index) => renderRole(role, index))
              : null}
          </TableCell>
          <TableCell className={classes.tableBodyCell}>
            <span className="badge badge-pill badge-primary bg-color-primary py-2 px-3">
              {row.status === 'waiting_for_approval'
                ? 'Waiting Approval'
                : row.status === 'active'
                ? 'Approved'
                : 'Rejected'}
            </span>
          </TableCell>
          <TableCell className={classes.tableBodyCell}>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={(event) => handleOpenMenu(event, row)}
            >
              <MoreVertIcon />
            </IconButton>
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
      {selectedRow && (
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={true}
          onClose={handleClose}
        >
          {actions.map((action, index) => (
            <MenuItem key={index} onClick={() => onAction(action.id)}>
              {action.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateApprove: (id, approve) =>
      dispatch(actions.UsersActions.updateApprove(id, approve)),
    deleteUser: (id) => dispatch(actions.UsersActions.deleteUser(id)),
  };
}

export default connect(null, mapDispatchToProps)(RolesSortTable);
