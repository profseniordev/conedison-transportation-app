import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    withStyles,
    TableCell,
    Icon
} from '@material-ui/core';
import {
    AutoSizer,
    Column,
    Table
} from 'react-virtualized';

const styles = {
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    tableRow: {
        cursor: 'pointer',
    },
    tableSelectedRow:{
        background: "red"
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: "#F5F5FB",
        },
    },
    tableCell: {
        flex: 1,
    },
    noClick: {
        cursor: 'initial',
    },
};


export class VirtualizedTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            select: '',
        };
        this.selected         = this._selected.bind(this);

    }
    static defaultProps = {
        headerHeight: 48,
        rowHeight: 48,
    };
    _selected(index) {
        this.setState({
            select          : index
        });
        this.props.onSelected(index);
    }

    getRowClassName = ({ index }) => {
        const { classes } = this.props;
        return clsx(classes.tableRow, "getRowClassName", classes.flexContainer, {
            [classes.tableRowHover]: index !== -1,
        });
    };

    cellRenderer = ({ cellData, columnIndex }) => {
        const { classes, rowHeight, onRowClick } = this.props;
        let date = cellData;
        if(columnIndex===4){
            date = cellData===this.state.select? <Icon style={{color: "#2b5cbc", marginLeft: "-20px"}}>done</Icon>: ''
        }
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]: onRowClick == null,
                })}
                variant="body"
                style={{ height: rowHeight }}
                align='left'
            >
                {date}
            </TableCell>
        );
    };

    headerRenderer = ({ label }) => {
        const { headerHeight, classes } = this.props;

        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer)}
                variant="head"
                style={{ height: headerHeight }}
                align='left'
            >
                <span>{label}</span>
            </TableCell>
        );
    };

    render() {
        const { classes, columns, ...tableProps } = this.props;
        return (
            <AutoSizer>
                {({height, width }) => (
                    <Table height={height} width={width} {...tableProps} rowClassName={this.getRowClassName} onRowClick={({ index }) => this.selected(index)}>
                        {columns.map(({ dataKey, ...other }, index) => {
                            return (
                                <Column
                                    key={dataKey}
                                    headerRenderer={headerProps =>
                                        this.headerRenderer({
                                            ...headerProps,
                                            columnIndex: index,
                                        })
                                    }
                                    className={classes.flexContainer}
                                    cellRenderer={this.cellRenderer}
                                    dataKey={dataKey}
                                    {...other}
                                />
                            );
                        })}
                    </Table>
                )}
            </AutoSizer>
        );
    }
}

VirtualizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    headerHeight: PropTypes.number,
    rowHeight: PropTypes.number,
};


export default withStyles(styles)(VirtualizedTable);
