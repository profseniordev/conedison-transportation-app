import React, { Component } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '../../../components/Button/Button';
import '../../Dispatch/dialog/completeJob/CompleteJob.scss';
import CompleteJobImg from '../../../Assets/icons/complete-job.svg';
import { toast } from 'react-toastify';

class MarkAsBilled extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      processing: false,
    };
  }

  confirmCancel = () => {
    this.setState({
      processing: true,
    });
    this.props
      .confirm(this.props.jobId, this.props.status)
     
        this.setState({
          processing: false,
        });
        this.props.onClose();
  };

  render() {
    return (
      <>
        <Dialog
          onClose={this.props.onClose}
          aria-labelledby="simple-dialog-title"
          open={this.props.open}
        >
          <DialogTitle className={'cancel-title'} style={{maxWidth: 365}}>Are you sure you want to mark as billed?</DialogTitle>

          <DialogContent>
            <Box className={'complete-image-group'} mt={2} mb={2}>
              <img className={'complete-image'} src={CompleteJobImg} alt="" />
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
export default MarkAsBilled;
