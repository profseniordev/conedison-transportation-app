import React, { Component, Fragment } from 'react';
import '../Invoices.scss';
import './Timesheets.scss';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    // Tooltip,
} from '@material-ui/core';
import { TIMESHEETS_TABLE } from '../../../Constants/invoices';
import history from "../../../history";
import {Link} from "react-router-dom";
class TimesheetsTableRow extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        const { handeleSort, orderBy, orderByType, timesheets } = this.props;
        return (
            <div className="Invoices-table mt-5">
                <Fragment>
                    <Paper>
                        <TableContainer style={{ borderRadius: '16px' }}>
                            <Table>
                                <TableHead style={{ background: '#fff' }}>
                                    <TableRow>
                                        {TIMESHEETS_TABLE.map((headCell) => {
                                            if (headCell.sortable) {
                                                return (
                                                    <TableCell className={'classes.tableHeaderCell'}>
                                                        <TableSortLabel
                                                            active={orderBy === headCell.value}
                                                            direction={
                                                                orderBy === headCell.value && orderByType
                                                                    ? 'asc'
                                                                    : 'desc'
                                                            }
                                                            onClick={() => handeleSort(headCell.value)}
                                                        >
                                                            {headCell.label}
                                                        </TableSortLabel>
                                                    </TableCell>
                                                );
                                            } else {
                                                return (
                                                    <TableCell className={'classes.tableHeaderCell'}>
                                                        {headCell.label}
                                                    </TableCell>
                                                );
                                            }
                                        })}
                                    </TableRow>
                                </TableHead>
                                { timesheets && timesheets.length > 0 ?
                                    <TableBody>

                                        {timesheets.map((row) => (
                                            <TableRow
                                                className={'classes.tableBodyRow'}
                                            >
                                                {/*<TableCell>{row.id}</TableCell>*/}
                                                <TableCell>{row.start_at}</TableCell>
                                                <TableCell>{row.finish_at}</TableCell>
                                                <TableCell>{row.department}</TableCell>
                                                <TableCell>{row.section}</TableCell>
                                                <TableCell>{row.po}</TableCell>
                                                <TableCell>{row.billed}</TableCell>
                                                <TableCell>{row.requestor}</TableCell>
                                                <TableCell>{row.request_time}</TableCell>
                                                <TableCell>{row.supervisor}</TableCell>
                                                <TableCell>{row.location}</TableCell>
                                                <TableCell>{row.muni}</TableCell>
                                                <TableCell>{row.flagger_name}</TableCell>
                                                <TableCell>{row.regular_hours}</TableCell>
                                                <TableCell>{row.holiday_hours}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    : <TableRow>
                                        <TableCell colSpan={11} align={'center'} style={{fontWeight: 500, fontSize: 14}}>
                                             No timesheets yet
                                        </TableCell>
                                      </TableRow> }
                            </Table>
                        </TableContainer>
                    </Paper>
                </Fragment>

            </div>
        );
    }
}
export default TimesheetsTableRow;
