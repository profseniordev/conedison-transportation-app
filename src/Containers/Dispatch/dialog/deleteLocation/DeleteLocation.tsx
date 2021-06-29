import React, { Component } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Button from '../../../../components/Button/Button';
import { actions } from '../../../../Services';
import '../CancelJobReason/CancelJobReason.scss';
import CancelJobImg from '../../../../Assets/icons/cancel-job.svg';
import CloseRedIcon from '../../../../Assets/icons/close-red-icon.svg';
import { toast } from 'react-toastify';
import history from '../../../../history';
import { action } from 'mobx';

class CancelJob extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      processing: false,
    };
  }

  confirmCancel = () => {
    this.setState({
      processing: true,
    });
    this.props.deleteLocation(this.props.job_id, this.props.location_id)
      .then(() => {
        this.setState({
          processing: false,
        })
        this.props.onClose();
      }).catch((error) => {
        toast.error(error.error, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.setState({
          processing: false,
        })
        this.props.onClose();
      });
  };


  render() {
    return (
      <>
        <Dialog
          onClose={this.props.onClose}
          aria-labelledby="simple-dialog-title"
          open={this.props.open}
        >
          <DialogTitle className={'cancel-title'} style={{maxWidth: 365, maxHeight: 400}}>Are you sure you want to remove location?</DialogTitle>

          <DialogContent style={{overflowY: 'hidden'}}>
            <Box className={'cancel-image-group'} mt={2} mb={2}>
              <img className={'cancel-image'} src={CancelJobImg} alt="" />
              <img className={'close-icon'} src={CloseRedIcon} alt="" />
            </Box>
          </DialogContent>

          <DialogActions className={'action-button-group'}>
            <Button
              color={'gray'}
              width={'158px'}
              borderRadius={'20px'}
              textTransform={false}
              onClick={this.props.onClose}
            >
              Cancel
            </Button>
            <Button
              color={'dark'}
              width={'158px'}
              borderRadius={'20px'}
              textTransform={false}
              processing={this.state.processing}
              onClick={this.confirmCancel}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    deleteLocation: (job_id, location_id) => dispatch(actions.JobsActions.deleteJobLocation(job_id, location_id))
  };
}

export default connect(null, mapDispatchToProps)(CancelJob);
