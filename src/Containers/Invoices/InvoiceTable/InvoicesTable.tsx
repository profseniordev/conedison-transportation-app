import React, { Component, Fragment } from 'react';
import '../Invoices.scss';
import InvoicesTableRow from "./InvoicesTableRow"
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


const InvoicesTable = (props) => {
    const [subList, setSubList] = useState([]);

    useEffect(() => {
        props.getInvoices(props.match.params.id, {});
        setSubList(props.list);
    }, [subList]);

    const handleRowClick = (id) => {
        history.push(`/invoices/${props.match.params.id}/${id}`);
    }

    return (
        <div className='px-5 invoices-list-page'>
            <div className="page-header d-flex justify-content-between align-items-center">
                <div className='d-flex justify-content-between align-items-center'>
                    <div className="blue-bg mr-2" onClick={goBack}>
                        <ArrowBackIcon style={{ color: 'white' }} />
                    </div>
                    <div className="page-title-gray mr-1">Invoice configurations / </div>
                    <div className="page-title">Invoices</div>
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
            <InvoicesTableRow
                invoice={props.list}
                handleRowClick={handleRowClick}
            />
        </div>
    );

}

function mapStateToProps({ invoices }) {
    return {
        list: invoices.sublist,
        invoicesPagination: invoices.pagination,
        searchOptions: invoices.search_options,
        loading: invoices.processing,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        getInvoices: (id ,search_options) => dispatch(actions.InvoicesActions.getSubInvoices(id, search_options)),
        createInvoice: (data) => dispatch(actions.InvoicesActions.createInvoice(data)),
        // updateFilters: (search_options) =>
        //   dispatch(actions.TimesheetsActions.updateFilters(search_options)),
    };
}
export default  connect(mapStateToProps, mapDispatchToProps)(InvoicesTable);
