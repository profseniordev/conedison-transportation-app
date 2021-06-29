import React, { Component, Fragment } from 'react';
import '../Invoices.scss';
import TimesheetsTableRow from "./TimesheetsTableRow"
import Button from "../../../components/Button/Button";
import {actions} from "../../../Services";
import {connect} from "react-redux";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import history from "../../../history";
import qs from 'query-string';
import { RouteProps } from 'react-router';
import { useState, useEffect } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';



interface Props {
    list?: any;
    getInvoices?: (search_options: any) => void;
    loading?: boolean;
    invoicesPagination?: any;
    createInvoice?: (data: any) => void;
}
const   goBack = () => {
    history.goBack();
};


const TimesheetsTable = (props) => {
    const [subList, setSubList] = useState([]);

    useEffect(() => {
        console.log(props.match.params.id, props.match.params.invoiceId);
        props.getTimesheets(props.match.params.id, props.match.params.invoiceId);
        setSubList(props.list);
    }, [subList]);


    return (
        <div className='px-5 invoices-list-page'>
            <div className="page-header d-flex justify-content-between align-items-center">
                <div className='d-flex justify-content-between align-items-center'>
                    <div className="blue-bg mr-2" onClick={goBack}>
                        <ArrowBackIcon style={{ color: 'white' }} />
                    </div>
                    <div className="page-title-gray mr-1">Invoice configurations / Invoices / </div>
                    <div className="page-title">Timesheets</div>
                </div>
                {/*<Button
                    color={'dark'}
                    width={'245px'}
                    borderRadius={'20px'}
                    textTransform={false}
                    // onClick={() => addInvoice()}
                >
                    Configure New
                </Button>*/}
            </div>
            {props.loading ? <LinearProgress /> : <div style={{ height: 4 }}/>}
            <TimesheetsTableRow
                timesheets={props.list}
            />
        </div>
    );

}

function mapStateToProps({ invoices }) {
    return {
        list: invoices.timesheets,
        invoicesPagination: invoices.pagination,
        searchOptions: invoices.search_options,
        loading: invoices.processing,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        getTimesheets: (conf_id, invoice_id) => dispatch(actions.InvoicesActions.getTimesheets(conf_id, invoice_id)),
    }
}
export default  connect(mapStateToProps, mapDispatchToProps)(TimesheetsTable);
