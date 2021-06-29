/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../Services';
import './Invoices.scss';
import { useIsMount } from '../../Utils/hooks/useMount';
import ConfigurationTable from './ConfigurationTable';
import AddInvoiceSliderComponent  from './InvoiceCreateSlide';
import Header from './HeaderInvoices';
import Button from '../../components/Button/Button';
import RolesSortTable from "../Roles/RolesSortTable";
import NewPagination from '../../components/Pagination/Pagination';
import { toast } from 'react-toastify';



interface Props {
  invoices?: any;
  getInvoices?: (search_options: any) => void;
  loading?: boolean;
  id:number;
  invoicesPagination?: any;
  createInvoice?: any;
  search_options?: any;
  has_access?: boolean;
  // updateFilters?: (any) => void;
}


const Invoices: React.FC<Props> = ({
                                     getInvoices,
                                     invoices,
                                     id,
                                     search_options,
                                     has_access,
                                     // loading,
                                     // invoicesPagination,
                                     createInvoice,
                                   }) => {

  const firstRender = useIsMount();

  const [showedAddInvoice, setShowedAddInvoice] = useState(null);
  const [searchParams] = useState({
    page: 1,
  });
  const [order, setOrder] = useState({ order_by: 'uid', order_by_type: true });
  const divElement = useRef(null);

  // const getLink = (invoice) => {
  //   if (
  //     invoice.departments.some((department) => execute.includes(department))
  //   ) {
  //     return `/invoices/${invoice.id}`;
  //   }
  //   return `/invoices/${invoice.id}/info`;
  // };

  const fetchInvoices = () => {
    getInvoices(invoices.searchOptions);
  };

  const addInvoice = () => {
    setShowedAddInvoice(true);
  };

  const closeInvoice = () => {
    setShowedAddInvoice(false);
  };

  const setTableSize = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const create = urlParams.get('create');
    if (create) {
      setShowedAddInvoice(true);
    }
  };

  const submit = async (invoice) => {
    //this.props.createInvoice(this.state);   
    await createInvoice(invoice)
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
        closeInvoice();
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

  // const downloadFile = async (id: string) => {
  //   const response = await invoiceAPI.download(id);
  //   const url = window.URL.createObjectURL(new Blob([response.data]));
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', `${id} - invoice.exel`);
  //   document.body.appendChild(link);
  //   link.click();
  // };

  useEffect(() => {
    setTableSize();
    fetchInvoices();
  }, []);

  /*useEffect(() => {
    if (!firstRender) {
      fetchInvoices();
    }
  }, [searchParams]);*/

  const handleSort = (value) => {
    console.log(value +'value ')
    if (order.order_by === value) {
      setOrder({
        ...order,
        order_by_type: !order.order_by_type,
      });
    } else {
      setOrder({
        order_by: value,
        order_by_type: true,
      });
    }
    console.log(order.order_by + " fffff  " + order.order_by_type + " ffffffffffff  " )
  };

  
  const onPerPageChange = (event) => {
    let search_option = {
      ...search_options,
      page: 1,
      limit: event.target.value,
    };
    console.log(search_option)
    getInvoices(search_option)
  };

const   onPaginationChange = (event, page) => {
    let search_option = {
      ...search_options,
      page: page,
    };
    console.log(search_option)

    getInvoices(search_option) 
  };


  return (
      <div className="px-5 invoices-list-page" ref={divElement}>
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">Invoice configurations</div>
          {has_access && 
          <Button
              color={'dark'}
              width={'245px'}
              borderRadius={'20px'}
              textTransform={false}
              onClick={() => addInvoice()}
          >
            Configure New Invoice
          </Button> }
        </div>
        <Header/>
        <ConfigurationTable
            invoice={invoices}
            handleSort={handleSort}
            orderBy={order.order_by}
            orderByType={order.order_by_type}/>
        {showedAddInvoice ? (
            <AddInvoiceSliderComponent
                submit={submit}
               // updateInvoices={fetchInvoices}
                showed={showedAddInvoice}
                closeSlide={() => closeInvoice()}
            />
        ) : null
      }
       <NewPagination
                  search_options={search_options}
                  onPerPageChange={onPerPageChange}
                  onPaginationChange={onPaginationChange}
                  //renderValue={renderValue}
                  />
      </div>
  );
};

function mapStateToProps( state ) {
  return {
    invoices: state.invoices.list,
    invoicesPagination: state.invoices.pagination,
    search_options: state.invoices.search_options,
    loading: state.invoices.processing,
    id: state.invoices.sublist.id,
    has_access: state.app.user
      ? [1, 2, 3, 4].some((r) => !state.app.user.roles.includes(r))
      : false,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getInvoices: (search_options) =>
        dispatch(actions.InvoicesActions.retrieve(search_options)),

    getSubInvoices: (id, search_options) =>
        dispatch(actions.InvoicesActions.getSubInvoices(id,search_options)),

    createInvoice: (data) =>
        dispatch(actions.InvoicesActions.createInvoice(data)),
    // updateFilters: (search_options) =>
    //   dispatch(actions.TimesheetsActions.updateFilters(search_options)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoices);
