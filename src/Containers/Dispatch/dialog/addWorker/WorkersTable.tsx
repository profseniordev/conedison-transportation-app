import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import VirtualizedTable from './VirtualizedTable';
import { stableSort, getSorting } from '../../../../Utils/sorting';
import './AddWorker.scss';

export class WorkersTable extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      order_by: 'calories',
      rows: props.rows || [],
      rows_filtered: [],
      selected: '',
      search_text: '',
    };
  }
  handleClickDriver = (driver) => {
    this.setState({
      selected: driver,
    });
    this.props.onSelected(this.state.rows_filtered[driver]);
  };

  updateDriversTable = () => {
    const { search_text } = this.state;

    let rows = this.state.rows;
    if (search_text && search_text.length > 1) {
      rows = rows.filter(
        (item) =>
          (item.id && ('#' + item.id).indexOf(search_text) >= 0) ||
          (item.name && item.name.toLowerCase().indexOf(search_text) !== -1) ||
          (item.phone_number &&
            item.phone_number.toString().toLowerCase().indexOf(search_text) !==
              -1)
      );
    }
    const rows_filtered = stableSort(
      rows,
      getSorting(this.state.order, this.state.order_by)
    );
    this.setState({ rows_filtered });
  };

  componentDidMount() {
    this.updateDriversTable();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search_text !== this.props.search_text) {
      this.setState({ search_text: nextProps.search_text }, () =>
        this.updateDriversTable()
      );
    }
    if (nextProps.drivers && nextProps.drivers !== this.props.drivers) {
      this.setState({ drivers: nextProps.drivers }, () =>
        this.updateDriversTable()
      );
    }
  }

  render() {
    const { rows_filtered, selected } = this.state;

    const createData = (row, index) => {
      return {
        name: row.name,
        id: '#' + row.id,
        select: index === selected ? <Icon color="primary">done</Icon> : ' ',
        type: row.type ? row.type : 'worker',
      };
    };

    const rows = [];
    rows_filtered.forEach((driver, i) => {
      rows.push(createData(driver, i));
    });

    return (
      <Paper style={{ height: 380, width: '100%' }}>
        <VirtualizedTable
          rowCount={rows.length}
          rowGetter={({ index }) => rows[index]}
          onSelected={this.handleClickDriver}
          columns={[
            {
              width: 120,
              label: 'ID #',
              dataKey: 'id',
            },
            {
              width: 280,
              label: 'DRIVER',
              dataKey: 'name',
            },
            {
              width: 40,
              dataKey: '',
            },
            {
              width: 60,
              label: '',
              dataKey: 'select',
            },
          ]}
        />
      </Paper>
    );
  }
}

export default WorkersTable;
