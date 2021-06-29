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
import Button from '../../../components/Button/Button';
import { actions } from '../../../Services';
import '../../Dispatch/dialog/CancelJobReason/CancelJobReason.scss';
import CancelJobReasonImg from '../../../Assets/icons/cancel-job.svg';
import CloseRedIcon from '../../../Assets/icons/close-red-icon.svg';

class DeleteConf extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      processing: false,
    };
  }

  componentDidUpdate(prevProps) {
    if(this.props.id !== prevProps.id) {
      this.setState({
        reason: ''
      });
    }
  }

  confirmCancel = () => {
    this.setState({
      processing: true,
    });
    this.props
        .delete(this.props.id)
      .then(() => {
        this.setState({
          processing: false,
        });
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
          <DialogTitle className={'cancel-title'} style={{maxWidth: 365}}>Are you sure you want to disactivate invoice configuration?</DialogTitle>

          <DialogContent style={{overflowY: 'hidden'}}>
            <Box className={'cancel-image-group'} mt={2} mb={2}>
              <img className={'cancel-image'} src={CancelJobReasonImg} alt="" />
              <img className={'close-icon'} src={CloseRedIcon} alt="" />
            </Box>
            <div/>
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
    delete: (id) => dispatch(actions.InvoicesActions.deleteInvoice(id)),
  };
}

export default connect(null, mapDispatchToProps)(DeleteConf);
