import React, { PureComponent } from 'react';
import './billing.scss';
import HeaderBilling from "./components/HeaderBilling";
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import {actions} from "../../Services";
import BillingPagination from "./components/BillingPagination";
import BillingInfoRow from "./components/BillingInfoRow";
import { toast } from 'react-toastify';

class Billing extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      UpdatePODialog: false,
      po: this.props.jobs.po ,
      disableButtona: true,
      confirmedSelectedRows: [],
      unconfirmedSelectedRows: [],
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.props.initFilters();
    this.props.getAllJobs(null);
  }
  onPerPageChange = (event) => {
    let search_options = {
      ...this.props.search_options,
      page: 1,
      limit: event.target.value,
    };
    this.props.getAllJobs(search_options)
  };

  onPaginationChange = (event, page) => {
    let search_options = {
      ...this.props.search_options,
      page: page,
    };
    this.props.getAllJobs(search_options)
    if(this.ref.current) {this.ref.current.scrollTop = 0;}
  };

  renderValue = (value) => {
    return value;
  };

  showUpdatePODialog = () => {
    if (
        this.state.confirmedSelectedRows.length === 0 &&
        this.state.unconfirmedSelectedRows.length === 0
    ) {
      alert('Please select any job');
      return;
    }
    this.setState({
      UpdatePODialog: true,
    });
  };

  closeUpdatePODialog = () => {
    this.setState({
      UpdatePODialog: false,
    });
  };

  updatePO = (po,requisition, receipt) => {
    let job_ids = [
      ...this.state.confirmedSelectedRows,
      ...this.state.unconfirmedSelectedRows,
    ];
    this.props.updatePOS(job_ids, po, requisition, receipt).then(() => {
      this.setState({
        UpdatePODialog: false,
        po: po,
        unconfirmedSelectedRows: [],
        confirmedSelectedRows: [],
      });
    }).catch((error) => {
      let msg = error.error;
      if(msg.includes('SQL')) {
        msg = 'Error! Your data is invalid. The maximum limit is 30 characters or numbers.';
      }
      toast.error(msg, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });;
  };


  handleSelectUnconfirmedRow = (job_id) => {
    this.setState({disableButtona: false})
    let current_list = this.state.unconfirmedSelectedRows;
    if (current_list.includes(job_id)) {
      let index = current_list.indexOf(job_id);
      current_list.splice(index, 1);
    } else {
      current_list.push(job_id);
    }
    this.setState({

      unconfirmedSelectedRows: current_list,
    });
  };
  render() {
    const { loading, jobs, search_options} = this.props;
    return (
        <div className="billing-container">
          <HeaderBilling show={this.showUpdatePODialog}
                         open={this.state.UpdatePODialog}
                         close={this.closeUpdatePODialog}
                         updatePO={this.updatePO}
                         disableBtn={this.state.confirmedSelectedRows &&  this.state.confirmedSelectedRows.length === 0 && this.state.unconfirmedSelectedRows &&
                         this.state.unconfirmedSelectedRows.length === 0}

          />
          {loading ? <LinearProgress /> : <div style={{ height: 4 }}/>}
            <React.Fragment> 
              <div className="container-fluid billing-body">
                <div  ref={this.ref} className="billing-table-container">
                  {jobs.length !== 0 ?  jobs.map((job, index) => {
                    return (<BillingInfoRow  job={job}
                                              key={index}
                                              checked={this.state.unconfirmedSelectedRows.includes(job.id)}
                                               onCheckboxChange={(_) => this.handleSelectUnconfirmedRow(job.id)} />);
                            }): 
                   <div className='d-flex justify-center bcgr-white'>
                     <p>No jobs found</p>
                   </div>
                  }
                </div>
                <BillingPagination
                  search_options={search_options}
                  onPerPageChange={this.onPerPageChange}
                  onPaginationChange={this.onPaginationChange}
                  renderValue={this.renderValue}/>
              </div>
          </React.Fragment>
        </div> 
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    initFilters: () => dispatch(actions.BillingActions.initFilters()),
    getAllJobs: (search_options) => dispatch(actions.BillingActions.retrieve(search_options)),
    updatePOS: (job_ids, po_number, requisition, receipt) => dispatch(actions.BillingActions.updatePOS(job_ids, po_number, requisition, receipt)),
  };
}

function mapStateToProps(state) {
  return {
    loading: state.billing.processing,
    jobs: state.billing.jobs,
    search_options: state.billing.search_options,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Billing);
