import React, { Component, Fragment } from 'react';
import '../Invoices.scss';
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
import { INVOICES_TABLE } from '../../../Constants/invoices';
import history from "../../../history";
import {Link} from "react-router-dom";
class InvoiceTableRow extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        const { handeleSort, orderBy, orderByType, invoice } = this.props;
        return (
            <div className="Invoices-table mt-5">
                <Fragment>
                    <Paper>
                        <TableContainer style={{ borderRadius: '16px' }}>
                            <Table>
                                <TableHead style={{ background: '#fff' }}>
                                    <TableRow>
                                        {INVOICES_TABLE.map((headCell) => {
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
                                { invoice && invoice.length > 0 ?
                                    <TableBody>

                                        {invoice.map((row) => (
                                            <TableRow
                                                onClick={() => this.props.handleRowClick(row.id)}
                                                className={'classes.tableBodyRow'}
                                                hover={true}
                                            >
                                                <TableCell>
                                                    {row.date}
                                                </TableCell>
                                                <TableCell>
                                                    {row.departments}
                                                </TableCell>
                                                <TableCell>{row.job_types}</TableCell>
                                                <TableCell>{row.timesheets}</TableCell>

                                                <TableCell>{row.po}</TableCell>
                                                <TableCell>{row.paid}</TableCell>
                                                <TableCell> {row.regular_hours}</TableCell>
                                                <TableCell> {row.overtime_hours}</TableCell>
                                                <TableCell> {row.holiday_hours}</TableCell>
                                                <TableCell> {row.total_due}</TableCell>
                                                <TableCell>
                                                    <div className="d-flex justify-content-between">
                                                        <div className="border-img"
                                                             //onClick={this.OpenOptionalDialogs}
                                                             >
                                                            <div className="download-image"/>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    : <TableRow>
                                        <TableCell colSpan={11} align={'center'} style={{fontWeight: 500, fontSize: 14}}>
                                             No invoices yet
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
export default InvoiceTableRow;
