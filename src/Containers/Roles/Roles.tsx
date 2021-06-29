/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import { MenuItem, Select as MaterialSelect } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { EROLES, PER_PAGES } from '../../Constants/user';
import { userAPI } from '../../Services/API';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { css } from '@emotion/core';
import FadeLoader from 'react-spinners/FadeLoader';
import authStore from '../../Stores/authStore';
import './Roles.scss';
import { connect } from 'react-redux';
import RolesFilter from './RolesFilter';
import RolesSortTable from './RolesSortTable';
import LinearProgress from '@material-ui/core/LinearProgress';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

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

interface Props {
  users: any;
  loading: boolean;
}

const RolesComponent: React.FC<Props> = ({ users, loading }) => {
  const inputRef = useRef(null);

  const [isImport, setIsImport] = useState(false);

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [limit, setLimit] = useState(100);

  const [currentPage, setCurrentPage] = useState(1);

  const [order, setOrder] = useState({ order_by: 'uid', order_by_type: true });

  const [totalHeight, setTotalHeight] = useState(0);

  const [total, setTotal] = useState(0);

  const [searchParams, setSearchParams] = useState({
    email: '',
    name: '',
    roles: [],
    statuses: [],
  });

  useEffect(() => {
    setTotalHeight(document.getElementById('root').clientHeight);
    fetchUsers();
  }, []);

  const onRoleSelect = (items) => {
    setSearchParams({
      ...searchParams,
      roles: items ? items.map((role) => role.value.id) : [],
    });
    fetchUsers();
  };

  const fetchUsers = () => {
    const { order_by, order_by_type } = order;

    let fusers = [...users];

    fusers = fusers.sort((a, b) => {
      if (a[order_by] < b[order_by]) {
        return order_by_type ? -1 : 1;
      }

      if (a[order_by] > b[order_by]) {
        return order_by_type ? 1 : -1;
      }
      return 0;
    });

    if (!authStore.isSuperAdmin()) {
      if (searchParams.roles) {
        searchParams.roles.filter(
          (item) =>
            item === EROLES.dispatcher || item === EROLES.dispatcher_supervisor
        );
      } else {
        searchParams.roles = [EROLES.dispatcher_supervisor, EROLES.dispatcher];

        if (authStore.isDispatchSupervisor()) {
          searchParams.roles.push(EROLES.worker);
        }
      }
    }

    Object.keys(searchParams).forEach((key, index) => {
      if (searchParams[key] && searchParams[key].length > 0) {
        fusers = fusers.filter((item) => {
          if (key === 'roles') {
            return (
              item[key] &&
              searchParams[key].filter((role) => item[key].includes(role))
                .length > 0
            );
          } else if (key === 'statuses') {
            return (
              item['status'] && searchParams[key].indexOf(item['status']) >= 0
            );
          } else {
            return (
              (item['name'] &&
                item['name']
                  .toLowerCase()
                  .includes(searchParams[key].toLowerCase())) ||
              (item['email'] &&
                item['email']
                  .toLowerCase()
                  .includes(searchParams[key].toLowerCase()))
            );
          }
        });
      }
    });

    setTotal(fusers.length);

    const start = (currentPage - 1) * limit;
    const end = currentPage * limit;
    fusers = fusers.slice(start, end);
    setFilteredUsers(fusers);
  };

  const onPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLimit(+event.target.value);
  };

  const onPaginationChange = (event, page: number) => {
    setCurrentPage(page);
  };

  const renderMenuItems = () => {
    return PER_PAGES.map((item, i) => (
      <MenuItem key={item.value} value={item.value}>
        {item.label}
      </MenuItem>
    ));
  };

  const renderValue = (value) => {
    return value;
  };

  const handleChangeFileExcel = async (e: any) => {
    setIsImport(true);
    let file = e.target.files[0];
    let fd = new FormData();
    fd.append('excel', file);
    await userAPI.importExcel(fd).then((res) => {
      setIsImport(false);
      if (res.status === 200) {
        toast.success('Users import successfully!', {
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

  const triggerInputFile = () => {
    inputRef.current.click();
  };

  const handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleSort = (value) => {
    if (order.order_by === value) {
      setOrder({
        ...order,
        order_by_type: !order.order_by_type,
      });
    } else {
      setOrder({
        order_by: value,
        order_by_type: true,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [order, searchParams, currentPage, users]);

  return (
    <div className="container-fluid roles-list-page">
      <div className="page-header">
        <div className="page-title">Manage User Roles</div>
        <div>
          <RolesFilter
            handleChangeSearchParams={handleChangeSearchParams}
            handleRoleChange={onRoleSelect}
            onlyDispatcher={!authStore.isSuperAdmin()}
          />
        </div>
        <div className="user-role-action d-flex align-items-center">
          <Link className="goto-create-role" to={`/roles/create`}>
            <button className="btn-new btn btn-success btn-add w-140">
              Create new
            </button>
          </Link>
          {!authStore.isConedUser() && 
          <Link className="goto-create-role" to={`/workers/create`}>
            <button className="btn-new btn btn-success btn-add ml-20 w-140">
              Add Worker
            </button>
          </Link>
          }
          <input
            className="input-excel"
            accept=".xls,.xlsx"
            ref={inputRef}
            type="file"
            onChange={handleChangeFileExcel}
          />
          <button
            className="btn-import btn btn-success btn-add bg-color-primary"
            onClick={triggerInputFile}
          >
            Import from Excel
          </button>
        </div>
      </div>
      <FadeLoader css={override} color={'#36d7b7'} loading={isImport} />

      {loading ? <LinearProgress /> : <div style={{ height: 4 }}></div>}

      <div className="container-fluid page-body">
        <div
          style={{
            overflowY: 'scroll',
            maxHeight: totalHeight - 270,
            overflowX: 'hidden',
          }}
        >
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 && (
            <RolesSortTable
              data={filteredUsers}
              handleSort={handleSort}
              orderBy={order.order_by}
              orderByType={order.order_by_type}
            />
          )}
        </div>
        <div style={paginationStyles}>
          <div className="pagination-select">
            Per page:{' '}
            <MaterialSelect
              style={{ marginLeft: 20 }}
              onChange={onPerPageChange}
              value={limit}
              renderValue={() => renderValue(limit)}
            >
              {renderMenuItems()}
            </MaterialSelect>
          </div>
          <div className="pagination-pages">
            {currentPage &&
              `PAGE: ${currentPage} of
                ${Math.ceil(total / limit)}`}
          </div>
          <div className="pagination-control">
            <Pagination
              page={+currentPage}
              count={Math.max(0, Math.ceil(total / limit))}
              onChange={onPaginationChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    users: state.users.users,
    loading: state.users.processingUsers,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RolesComponent);
