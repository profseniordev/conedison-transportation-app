import React, { Component } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { MenuItem, Select as MaterialSelect } from '@material-ui/core';

const PER_PAGES = [
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


class BillingPagination extends Component {

  renderMenuItems = () => {
    return PER_PAGES.map((item, i) => (
      <MenuItem key={item.value} value={item.value}>
        {item.label}
      </MenuItem>
    ));
  };

  render() {
    const {limit, page, totalPage} = this.props.search_options;
    return (
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
            onChange={this.props.onPerPageChange}
            value={limit}
            renderValue={() => this.props.renderValue(limit)}
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
          {page && `PAGE: ${page} of ${totalPage}`}
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
            page={+page}
            count={Math.max(0, totalPage)}
            onChange={this.props.onPaginationChange}
          />
        </div>
      </div>
    );
  }
}
export default BillingPagination;
