

import React, {Component, Fragment, useCallback, useState} from 'react';
import './Invoices.scss';
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
} from '@material-ui/core';
import { CONFIGURATION_TABLE } from '../../Constants/invoices';
import OptionsN2 from './dialog/OptionsN2';
import moment from "moment";
import history from "../../history";
import {getInvoices} from "../../Services/invoices/actions";
import {APPROVE, TABLE_HEADER} from "../../Constants/user";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {Link} from "react-router-dom";
import EditSharpIcon from '@material-ui/icons/EditSharp';
import HighlightOffSharpIcon from '@material-ui/icons/HighlightOffSharp';
import {actions} from "../../Services";
import {connect} from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import AddInvoiceSliderComponent from './InvoiceCreateSlide';
import NewPagination from '../../components/Pagination/Pagination';
import DeleteConf from './dialog/DeleteConf';
import { toast } from 'react-toastify';
import { action } from 'mobx';

interface Props {
    invoice?: any;
    handleSort?: (data: any) => void;
    orderBy?: string;
    orderByType?: boolean;
    getInvoices?: (id:number, data:any) => void;
    loading?: boolean; 
    deleteInvoice?: (id:number) => void;
    search_options?: any;
    retrive?: any;
    getConfiguration?: (id:number) => void;
    config?: any;
    updateConfig?: Function;

}
const ConfigurationTable: React.FC<Props> = ({
                                                 invoice,
                                                 handleSort,
                                                 orderBy,
                                                 orderByType,
                                                 getInvoices,
                                                 loading,
                                                 deleteInvoice,
                                                 search_options,
                                                 retrive,
                                                 getConfiguration,
                                                 config,
                                                 updateConfig
                                             }) => {

    const [showedAddInvoice, setShowedAddInvoice] = useState(null);
    const [showDel, setShowDel] = useState(null);
    const [rowId, setRowId] = useState(null);
    const [row, setRow] = useState(null);

    const  OpenInvoices = (id)=>{
        history.push(`/invoices/${id}`);
        //getInvoices(id, {});

    }
    const editInvoice = (id) => {
        getConfiguration(id);
        setShowedAddInvoice(true);
    };
    
    const closeEditInvoice = () => {
        setShowedAddInvoice(false);
    };
    
    const deactivate = (id) => {
       setShowDel(true);
       setRowId(id)
    }

    const closeDel = () => {
        setShowDel(false);
     }
     const submit = async (invoice) => {
        //this.props.createInvoice(this.state);   
        await updateConfig(config.id, invoice)
          .then(() => {
            toast.success('New invoices created!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            closeEditInvoice();
          })
          .catch((err) => {
            toast.error('Create new invoices error!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
        
      };

    const renderHeaderRow = useCallback(
        () =>
            CONFIGURATION_TABLE.map((headCell,index) => {
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
                                onClick={() => handleSort(headCell.value)}
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
            }),
        [orderBy, orderByType]
    );

    const renderBodyRow = useCallback(
        () =>
            invoice.map((row, index) => (
                //<div onClick={_=>OpenInvoices(row.id)} key={index}>
                
                <TableRow  className={'classes.tableBodyRow'} hover>
                    <TableCell onClick={_=>OpenInvoices(row.id)}>
                        {row.id}
                    </TableCell>
                    <TableCell onClick={_=>OpenInvoices(row.id)}>
                        {row.date ? moment(row.date).format('MM/DD/YY'): ""}
                    </TableCell>
                    <TableCell onClick={_=>OpenInvoices(row.id)}>
                        {row.departments && row.departments.map(dept =>(
                                dept + ' '
                            )
                        )}
                    </TableCell>
                    <TableCell onClick={_=>OpenInvoices(row.id)}>{row.timesheets_amount}</TableCell>
                    <TableCell onClick={_=>OpenInvoices(row.id)}>{row.po_amount}</TableCell>
                    <TableCell onClick={_=>OpenInvoices(row.id)}>{row.paid_amount}</TableCell>
                    <TableCell onClick={_=>OpenInvoices(row.id)}> {row.billing_cycle}</TableCell>
                    <TableCell onClick={_=>OpenInvoices(row.id)}>
                        
                        {row.job_types && row.job_types.map(types =>(
                                types + ' '
                            )
                        )}
                        
                    </TableCell>
                    <TableCell onClick={_=>OpenInvoices(row.id)}>{row.invoice_count}</TableCell>
                    <TableCell>
                        <div className="d-flex justify-content-between">
                          <Tooltip title={row.active ? 'Deactivate' : "Deactivated"} aria-label="Deactivate" arrow>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                             <div>
                                <div  className={'border-img'}>
                                  <button
                                        onClick={_ => deactivate(row.id)}
                                        style={{display: 'contents', cursor: 'pointer'}}>
                                    <HighlightOffSharpIcon style={{color: 'black'}} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Tooltip>
                          <Tooltip title="Edit" aria-label="edit" arrow>
                             <div style={{display: 'flex', alignItems: 'center'}}>
                              <div className={'border-img'}  onClick={_ => editInvoice(row.id)}>
                                  <EditSharpIcon style={{color: 'black'}} />
                                </div>
                              </div>
                          </Tooltip>
                       </div>
                    </TableCell>
                </TableRow>
                //</div>
            )),
        [invoice]
    );

    return (
            <div className="Invoices-table">
            {loading ? <LinearProgress /> : <div style={{ height: 4 }}/>}
                <Fragment>
                    <Paper>
                        <TableContainer style={{ borderRadius: '16px' }}>
                            <Table>
                                <TableHead style={{ background: '#fff' }}>
                                    <TableRow>
                                        {renderHeaderRow()}
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {renderBodyRow()}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <AddInvoiceSliderComponent
                        //createInvoice={updateInvoice}
                        submit={submit}
                        invoice={config}
                        showed={showedAddInvoice}
                        closeSlide={_=>closeEditInvoice()}
                    />
                    <DeleteConf 
                        id={rowId}
                        onClose={closeDel}
                        open={showDel}
                    />

                </Fragment>
            </div>
        );
    }
    function mapStateToProps({ invoices }) {
        return {
            loading: invoices.processing,
            search_options: invoices.search_options,
            config: invoices.conf,
        }

    }
    function mapDispatchToProps(dispatch) {
        return {
            dispatch,
            getInvoices: (id ,search_options) => dispatch(actions.InvoicesActions.getSubInvoices(id, search_options)),
            retrive: (search_options) => dispatch(actions.InvoicesActions.retrieve(search_options)),
            getConfiguration: (id) => dispatch(actions.InvoicesActions.getConfiguration(id)),
            updateConfig: (id, data) => dispatch(actions.InvoicesActions.updateInvoice(id, data)),
        };
    }
    export default  connect(mapStateToProps, mapDispatchToProps)(ConfigurationTable);
