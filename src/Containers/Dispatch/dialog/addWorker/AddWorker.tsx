import React, { Component } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { connect } from 'react-redux';
import WorkersTable from './WorkersTable';
import Button from '../../../../components/Button/Button';
import { actions } from '../../../../Services';
import Search from '../../../../components/Search/Search';
import {toast} from 'react-toastify';


const styles = {
  dialog: {
    padding: 24,
  },
};

class AddWorker extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      entity_id: '',
      entity_type: 'worker', // worker | company
      search: '',
    };
  }

  onSelected = (worker) => {
    this.setState({
      entity_id: worker.id,
      entity_type: worker.type ? worker.type : 'worker',
    });
  };

  onSearchUpdate = (value) => {
    let search_value = value.search.trim();
    search_value = search_value.toLowerCase();
    this.setState({ search: search_value });
  };

  handleCancel = () => {};

  assign = () => {
    if (this.state.entity_id !== '') {
      this.props
        .addWorker(this.props.job_id, {
          entity_id: this.state.entity_id,
          entity_type: this.state.entity_type,
          job_worker_id: this.props.job_worker_id,
        })
        .then(() => {
          this.props.onClose();
        })
        .catch(error => {
          toast.error(error.error, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };

  render() {
    const { workers, companies } = this.props;
    if (workers.length === 0) {
      return null;
    }
    let rows = workers.asMutable();

    companies.forEach((company) => {
      rows.push({
        id: company.id,
        name: company.name,
        type: 'company',
      });
    });

    return (
      <Dialog
        onClose={this.props.onClose}
        aria-labelledby="simple-dialog-title"
        open={this.props.open}
      >
        <DialogTitle className={'assign-dialog-title'}>
          Assign worker
        </DialogTitle>

        <DialogContent className={'assign-dialog-content'}>
          <Search
            dialog={true}
            updateFilters={this.onSearchUpdate}
            placeholder={'Search by name, phone number'}
            instant={true}
          />
          <WorkersTable
            rows={rows}
            onSelected={this.onSelected}
            search_text={this.state.search}
          />
        </DialogContent>

        <DialogActions style={styles.dialog} className={'assign-container-btn'}>
          <Button
            color={'gray'}
            width={'158px'}
            textTransform={true}
            onClick={this.props.onClose}
          >
            CANCEL
          </Button>
          <Button
            color={'blue'}
            width={'158px'}
            textTransform={true}
            onClick={this.assign}
            processing={this.props.processing}
            disabled={!this.state.entity_id}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    workers: state.workers.workers,
    companies: state.subcontractors.subcontractors,
    processing: state.jobs.add_worker_processing,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    addWorker: (job_id, options) =>
      dispatch(actions.JobsActions.addWorker(job_id, options)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddWorker);
