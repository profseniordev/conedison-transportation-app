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
import './Redispatch.scss';
import CancelJobReasonImg from '../../../../Assets/icons/cancel-job.svg';
import CloseRedIcon from '../../../../Assets/icons/close-red-icon.svg';
import { toast } from 'react-toastify';


class Redispatch extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      processing: false,
    };
  }

  componentDidUpdate(prevProps) {
    if(this.props.job_id !== prevProps.job_id) {
      this.setState({
        reason: ''
      });
    }
  }

  confirmRedispatch = () => {
    this.setState({
      processing: true,
    });
    this.props.updateJobWorker(this.props.job_id, this.props.job_worker_id, {
        status: 'revive',
        note: this.state.reason,
      })
      .then(() => {
        this.setState({
          processing: false,
        });
        this.props.onClose();
      }).catch((err) => {
        //const message = JSON.parse(JSON.stringify(err)).error;
        this.setState({
          processing: false,
        });
        toast.error("Cannot change worker status for completed job", {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        this.props.onClose();
      })
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      reason: event.target.value,
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
          <DialogTitle className={'revive-title'}>Revive</DialogTitle>

          <DialogContent>
            <Box className={'revive-image-group'} mt={2} mb={2}>
              <img className={'cancel-image'} src={CancelJobReasonImg} alt="" />
              <img className={'close-icon'} src={CloseRedIcon} alt="" />
            </Box>
            <Box mb={1}>
              <Typography variant="body2" color="textSecondary">
                Please write the reason here...
              </Typography>
            </Box>
            <Box mb={3}>
              <TextField
                id="outlined-multiline-static"
                className={'comments-field'}
                label="comment"
                multiline
                variant="outlined"
                value={this.state.reason}
                onChange={this.handleChange}
              />
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
              onClick={this.confirmRedispatch}
            >
              Redispatch
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
    updateJobWorker: (job_id, job_worker_id, data) => dispatch(actions.JobsActions.updateJobWorker(job_id, job_worker_id, data))
  };
}

export default connect(null, mapDispatchToProps)(Redispatch);
