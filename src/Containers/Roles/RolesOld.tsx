import React from 'react';
import Select from 'react-select';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as CEIcon from '../../Utils/Icon';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import userStore from '../../Stores/userStore';
import { EROLES, APPROVE, ROLES } from '../../Constants/user';
import { observer } from 'mobx-react';
import { User } from '../../Models';
import { userAPI } from '../../Services/API';
import RolesAsyncSearch from '../Components/Controls/RolesAsyncSearch';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { css } from '@emotion/core';
import FadeLoader from 'react-spinners/FadeLoader';
import authStore from '../../Stores/authStore';
import './Roles.scss';
import { connect } from 'react-redux';
import * as actionsRedux from '../../Services';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  Dropdown,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

interface Props {
  history: any;
  users: any;
  loading: any;
  updateFilters: any;
  updateApprove: any;
}

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

const status = [
  {
    label: 'Approved',
    value: 'active',
  },
  {
    label: 'Rejected',
    value: 'rejected',
  },
  {
    label: 'Waiting Approval',
    value: 'waiting',
  },
];

const initialState = {
  searchParams: {
    status: '1',
    email: '',
    firstName: '',
    roles: [],
    statuses: [],
  },
  isImport: false,
  total_height: 0,
};

@observer
class RolesComponent extends React.Component<Props> {
  state: any;
  refInput: any;
  inputRef: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    this.state = initialState;
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.setState(initialState);
    const total_height = document.getElementById('root').clientHeight;
    this.setState({ total_height });
    this.fetchUsers();
  }

  toggleInactive = (active) => {
    if (active) {
      this.setState(
        (state: any) => ({
          searchParams: {
            ...state.searchParams,
            status: '0',
            page: 1,
          },
        }),
        this.fetchUsers
      );
    } else {
      this.setState(
        (state: any) => ({
          searchParams: {
            ...state.searchParams,
            status: '1',
            page: 1,
          },
        }),
        this.fetchUsers
      );
    }
  };

  onRoleSelect = (items) => {
    this.setState(
      (state: any) => ({
        searchParams: {
          ...state.searchParams,
          page: 1,
          roles: items ? items.map((role) => role.value.id) : [],
        },
      }),
      this.fetchUsers
    );
  };

  onStatusSelect = (items) => {
    this.setState(
      (state: any) => ({
        searchParams: {
          ...state.searchParams,
          page: 1,
          statuses: items ? items.map((status) => status.value) : [],
        },
      }),
      this.fetchUsers
    );
  };

  fetchUsers = () => {
    if (!authStore.isSuperAdmin()) {
      if (this.state.searchParams.roles) {
        this.state.searchParams.roles.filter(
          (item) =>
            item === EROLES.dispatcher || item === EROLES.dispatcher_supervisor
        );
      } else {
        this.state.searchParams.roles = [
          EROLES.dispatcher_supervisor,
          EROLES.dispatcher,
        ];

        if (authStore.isDispatchSupervisor()) {
          this.state.searchParams.roles.push(EROLES.worker);
        }
      }
    }
    //userStore.loadUsers(this.state.searchParams);
    this.props.updateFilters(this.state.searchParams);
  };

  onPaginationChange = (page: number) => {
    this.setState(
      (state: any) => ({ searchParams: { ...state.searchParams, page } }),
      this.fetchUsers
    );
  };

  onEdit = (id: string) => {
    this.setState(initialState);
    //this.props.updateFilters(this.state.searchParams);
    this.props.history.push({
      pathname: `/profile/${id}`,
      state: this.state,
    });
  };

  handleChangeFileExcel = async (e: any) => {
    this.setState({ isImport: true });
    let file = e.target.files[0];
    let fd = new FormData();
    fd.append('excel', file);
    await userAPI.importExcel(fd).then((res) => {
      this.setState({ isImport: false });
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

  triggerInputFile = () => {
    this.inputRef.current.click();
  };

  handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    this.setState(
      (state: any) => ({
        searchParams: { ...state.searchParams, [name]: value },
      }),
      this.fetchUsers
    );
  };

  render() {
    //console.log('users', this.props.users)
    const { isImport } = this.state;
    return (
      <div className="container roles-list-page">
        <div className="page-header d-flex flex-wrap justify-content-between align-items-center">
          <div className="page-title">Manage User Roles</div>
          <div className="action-new">
            <div className="d-flex roles-group align-items-center">
              <div className="roles-group__checkbox">
                <CheckboxComponent
                  id="zxcxz"
                  onChange={this.toggleInactive}
                  hasTitle="Show Inactive Users"
                  className="mr-3 pt-2 d-flex justify-content-end"
                  skipReceiveProps={true}
                  checked={
                    this.state.searchParams &&
                    this.state.searchParams.status &&
                    this.state.searchParams.status === '0'
                  }
                />
              </div>
              {/* <div className="roles-group__dropdown">
                <div className="d-block " style={{ width: 185 }}>
                  <RolesAsyncSearch
                    isMulti
                    onSelect={this.onRoleSelect}
                    placeholder={'All Roles'}
                    onlyDispatcher={!authStore.isSuperAdmin()}
                  />
                </div>
                <img className="d-inline d-md-none" src={Search} alt=""/>
              </div> */}
            </div>
            <div className="user-role-action">
              <Link className="goto-create-role" to={`/roles/create`}>
                <button className="btn-new btn btn-success btn-add">
                  Create new
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
        </div>
        <FadeLoader css={override} color={'#36d7b7'} loading={isImport} />

        <div className="scroll-mobile">
          <div className="div-table div-role-table table-responsive">
            <div className="div-header align-items-stretch">
              <div className="div-col flex-column align-items-start">
                <div>Name</div>
                <div className="ce-search-control">
                  <input
                    name={'firstName'}
                    className="ce-search-control-input"
                    onChange={this.handleChangeSearchParams}
                  ></input>
                </div>
              </div>
              <div className="div-col flex-column align-items-start">
                <div>Email</div>
                <div className="ce-search-control">
                  <input
                    className="ce-search-control-input"
                    name={'email'}
                    onChange={this.handleChangeSearchParams}
                  ></input>
                </div>
              </div>
              <div className="div-col flex-column align-items-start">
                <div>Roles</div>
                <div className="ce-search-control">
                  <RolesAsyncSearch
                    isMulti
                    onSelect={this.onRoleSelect}
                    placeholder={'All Roles'}
                    onlyDispatcher={!authStore.isSuperAdmin()}
                  />
                </div>
              </div>
              <div className="div-col flex-column align-items-start">
                <div>Status</div>
                <div className="ce-search-control">
                  <Select
                    onChange={this.onStatusSelect}
                    placeholder="All Status"
                    options={status}
                    isMulti
                  />
                </div>
              </div>
            </div>
            {this.props.loading ? (
              <LinearProgress />
            ) : (
              <div style={{ height: 4 }}></div>
            )}
            <div className="div-body">
              <div
                className="div-scroll"
                style={{
                  overflowY: 'scroll',
                  maxHeight: this.state.total_height - 400,
                }}
              >
                {this.props.users.map((user) => (
                  <Role
                    onEdit={this.onEdit}
                    user={user}
                    key={user.id}
                    updateApprove={this.props.updateApprove}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/*<div className="pagination-invoices">
          <PagingComponent
            activePage={this.state.searchParams.page}
            totalItemsCount={userStore.userLoader.total}
            onChangePage={this.onPaginationChange}
          />
              </div>*/}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users.users,
    loading: state.users.processingUsers,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateFilters: (search_options) =>
      dispatch(actionsRedux.actions.UsersActions.updateFilters(search_options)),
    updateApprove: (id, approve) =>
      dispatch(actionsRedux.actions.UsersActions.updateApprove(id, approve)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RolesComponent);

interface IRole {
  user: User;
  onEdit: (id: string) => void;
  updateApprove: (id: any, approve: any) => void;
}

class Role extends React.Component<IRole> {
  state = {
    menu: false,
    approved: 0,
    anchorEl: null,
    dropdownOpen: false,
  };

  onAction = async (action) => {
    switch (action) {
      case 'approval':
        this.onSetApproval();
        break;
      case 'reject':
        this.onSetRejected();
        break;
      case 'edit':
        this.props.onEdit(this.props.user.id);
        break;
      case 'delete':
        userStore.deleteUser(this.props.user.id);
        break;
      case 'resend_activation_email':
        userStore.ActivateEmail(this.props.user.id);
        break;
      default:
        break;
    }

    this.handleClose();
  };
  openMenu = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      menu: !this.state.menu,
    });
  };

  componentDidMount() {
    //alert(this.props.user.isApproved)
    this.setState({
      approved: this.props.user.isApproved,
    });
  }

  onSetApproval = () => {
    //let newUser = this.state.userNew;
    //newUser.isApproved = APPROVE.approved;
    this.setState({ approved: APPROVE.approved }, this.setApprovalLocal);
    //this.setApprovalLocal();
  };

  onSetRejected = () => {
    //let newUser = this.state.userNew;
    //newUser.isApproved = APPROVE.rejected;
    this.setState({ approved: APPROVE.rejected }, this.setRejectedLocal);
    //this.setRejectedLocal();
  };

  setApprovalLocal = () => {
    return this.props.updateApprove(this.props.user.id, APPROVE.approved);
  };

  setRejectedLocal = () => {
    return this.props.updateApprove(this.props.user.id, APPROVE.rejected);
  };

  renderRole = (roleId: number, index: number) => {
    const role = ROLES.find((role) => role.id === roleId);
    return role ? (
      <span className="badge badge-secondary p-2 mr-2" key={index}>
        {role.name}
      </span>
    ) : null;
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      menu: false,
    });
  };

  render() {
    const user = this.props.user;
    return (
      <div key={user.email} className="div-temp">
        <div className="div-item">
          <div className="div-col d-flex align-items-center">
            <img
              alt="avatar"
              className="avatar mr-3"
              style={{ objectFit: 'cover' }}
              src={`${process.env.REACT_APP_API_ENDPOINT}${user.avatar}`}
            />
            <span className="name-workers overflow-auto">{user.name}</span>
          </div>
          <div className="div-col overflow-auto ">{user.email}</div>
          <div className="div-col overflow-auto ">
            {Array.isArray(user.roles)
              ? user.roles.map((rule, index) => this.renderRole(rule, index))
              : null}
          </div>
          <div className="div-col d-flex justify-content-between">
            <div
              id="contextMore"
              className="d-flex align-items-center justify-content-end cursor-pointer"
            >
              <span className="badge badge-pill badge-primary bg-color-primary py-2 px-3">
                {this.state.approved === APPROVE.waiting
                  ? 'Waiting Approval'
                  : this.state.approved === APPROVE.approved
                  ? 'Approved'
                  : 'Rejected'}
              </span>
              <div style={{ position: 'relative' }}>
                {/*<ButtonDropdown isOpen={this.state.menu} toggle={this.openMenu}>
                <DropdownToggle color="link" style={{background: 'none', border: 'none'}} >
                <CEIcon.MoreIcon
                  onClick={this.openMenu}
                  style={{ width: '10px' }}
                  className="ml-3 contextMore"
                  width={5}
                  height={23}
                />
                </DropdownToggle>
                  <DropdownMenu className='menu'>
                    {actions.map((action, index) => (
                      <DropdownItem
                        onClick={() => this.onAction(action.id)}
                        className={user.isApproved === APPROVE.waiting ? "custom-context-item-role-last" : 'custom-context-item-role-last _approved' }>
                        {action.label}
                      </DropdownItem>
                    ))}
                </DropdownMenu>
                    </ButtonDropdown>*/}
                <CEIcon.MoreIcon
                  onClick={this.openMenu}
                  style={{ width: '10px' }}
                  className="ml-3 contextMore"
                  width={5}
                  height={23}
                />
                {this.state.menu && (
                  <Menu
                    id={`simple-menu-role${this.props.user.id}`}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                  >
                    {actions.map((action, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => this.onAction(action.id)}
                      >
                        {action.label}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
