import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Pagination from '@material-ui/lab/Pagination';
import { css } from '@emotion/core';
import FadeLoader from 'react-spinners/FadeLoader';
import { MenuItem, Select as MaterialSelect } from '@material-ui/core';
import NotificationItem from './NotificationItem';
import { connect } from 'react-redux';
import './notification.scss';
import actionRight from '../../Images/action-right.png';
import notificationStore from '../../Stores/notificationStore';
import NotificationsFilter from './NotificationsFilter';
import { NotificationType } from '../../Models';
import { actions } from '../../Services';

interface Props {
  notifications?: any[];
  loading?: boolean;
  getNotifications?: Function;
  updateFilterOptions?: Function;
  markNotificationsAsRead?: Function;
  deleteNotification?: Function;
}

interface State {
  notifications: any[];
  loading: boolean;
  isOptionMenuOpen: boolean;
  search_options: any;
}

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

export const PER_PAGES = [
  {
    label: 10,
    value: 10,
  },
  {
    label: 25,
    value: 25,
  },
  {
    label: 50,
    value: 50,
  },
  {
    label: 100,
    value: 100,
  },
];

class Notifications extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      loading: false,
      isOptionMenuOpen: false,
      search_options: {
        page: 1,
        limit: 100,
        totalPage: 0,
        total: 0,
        unread: false,
        notificationType: NotificationType.ALL,
      },
    };
  }

  componentDidMount() {
    this.props.getNotifications();
    // this.props.markNotificationsAsRead();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.notifications &&
      nextProps.notifications !== this.props.notifications
    ) {
      this.setState({
        notifications: nextProps.notifications,
        loading: nextProps.loading,
        search_options: nextProps.search_options,
      });
    }
  }

  onToggleOptionMenu() {
    const { isOptionMenuOpen } = this.state;
    this.setState({ isOptionMenuOpen: !isOptionMenuOpen });
  }

  setSelectedNotificationType(notificationType: NotificationType) {
    this.setState((state: any) => ({
      search_options: {
        ...state.search_options,
        page: 1,
        notifiableType: notificationType,
      },
    }));
    const search_options = {
      ...this.state.search_options,
      page: 1,
      notifiableType: notificationType,
    };
    this.props.updateFilterOptions(search_options);
  }

  onPerPageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState((state: any) => ({
      search_options: {
        ...state.search_options,
        limit: event.target.value,
      },
    }));
    const search_options = {
      ...this.state.search_options,
      limit: event.target.value,
    };
    this.props.updateFilterOptions(search_options);
  };

  onPaginationChange = (event, page: number) => {
    this.setState((state: any) => ({
      search_options: {
        ...state.search_options,
        page: page,
      },
    }));
    const search_options = {
      ...this.state.search_options,
      page: page,
    };
    this.props.updateFilterOptions(search_options);
  };

  handleChange = (event) => {
    let status = event.target.checked;
    this.setState((state: any) => ({
      search_options: {
        ...state.search_options,
        page: 1,
        unread: status,
      },
    }));
    const search_options = {
      ...this.state.search_options,
      page: 1,
      unread: status,
    };
    this.props.updateFilterOptions(search_options);
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

  public render() {
    const { notifications, loading } = this.state;
    const filteredNotifications = notifications.map((notification) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onCloseHandler={(notification) =>
          this.props.deleteNotification(notification.id)
        }
      />
    ));

    return (
      <div className="container notification-page py-4">
        <div className="row">
          <div className="col-sm-4 ">
            <NotificationsFilter
              onFilterItemSelect={(type) =>
                this.setSelectedNotificationType(type)
              }
            />
          </div>
          <div className="col-sm-8">
            <div className="box-item p-0 mb-0">
              <div className="box-item-header d-flex justify-content-between align-items-center px-4">
                <span>Notifications</span>
                <div className="d-flex align-items-center">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.search_options.unread}
                        onChange={(event) => this.handleChange(event)}
                        name="unread"
                      />
                    }
                    label="Unread"
                  />
                  <span
                    className="d-block d-sm-none"
                    onClick={() => this.onToggleOptionMenu()}
                  >
                    <img src={actionRight} alt="" />
                  </span>
                  {this.state.isOptionMenuOpen && (
                    <div className="notification-option">
                      <ul className="notification-option__list">
                        <li
                          className="notification-option__items"
                          onClick={() =>
                            this.setSelectedNotificationType(
                              NotificationType.ALL
                            )
                          }
                        >
                          All Notifications
                        </li>
                        <li
                          className="notification-option__items"
                          onClick={() =>
                            this.setSelectedNotificationType(
                              NotificationType.CANCEL_JOB
                            )
                          }
                        >
                          Canceling Jobs
                        </li>
                        <li
                          className="notification-option__items"
                          onClick={() =>
                            this.setSelectedNotificationType(
                              NotificationType.CREATE_JOB
                            )
                          }
                        >
                          Creating Jobs
                        </li>
                        <li
                          className="notification-option__items"
                          onClick={() =>
                            this.setSelectedNotificationType(
                              NotificationType.CREATE_INVOICE
                            )
                          }
                        >
                          Creating Invoices
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <FadeLoader css={override} color={'#36d7b7'} loading={loading} />
              <div className="box-content-notification">
                {filteredNotifications}
              </div>
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
                  value={this.state.search_options.limit}
                  renderValue={() =>
                    this.renderValue(this.state.search_options.limit)
                  }
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
                {this.state.search_options.page &&
                  `PAGE: ${this.state.search_options.page} of
              ${Math.ceil(
                this.state.search_options.total /
                  this.state.search_options.limit
              )}`}
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
                  page={+this.state.search_options.page}
                  count={Math.max(
                    0,
                    Math.ceil(
                      this.state.search_options.total /
                        this.state.search_options.limit
                    )
                  )}
                  onChange={this.onPaginationChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications.notifications,
    loading: state.notifications.processing,
    search_options: state.notifications.search_options,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getNotifications: () =>
      dispatch(actions.NotificationsActions.getNotifications()),
    // markNotificationsAsRead: () =>
    //   dispatch(actions.NotificationsActions.markNotificationsAsRead()),
    updateFilterOptions: (search_options) =>
      dispatch(actions.NotificationsActions.updateFilters(search_options)),
    deleteNotification: (id) => 
      dispatch(actions.NotificationsActions.deleteNotification(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
