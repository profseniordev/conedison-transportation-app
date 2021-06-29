import React, { Component } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import Button from '../../../../components/Button/Button';
import { actions } from '../../../../Services';
import '../completeJob/CompleteJob.scss';
import CompleteJobImg from '../../../../Assets/icons/complete-job.svg';

class ReviveJob extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      processing: false,
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.job_id !== prevProps.job_id) {
      this.setState({
        reason: '',
      });
    }
  }

  confirmRevive = () => {
    if (this.props.setComplete) {
      this.props.setComplete();
    }
    this.setState({
      processing: true,
    });
    this.props
      .updateJobStatus(this.props.job_id, {
        status: 'revive',
      })
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
          <DialogTitle className={'complete-title'}>Revive Job?</DialogTitle>

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
              onClick={this.confirmRevive}
            >
              Revive
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
    updateJobStatus: (job_id, data) =>
      dispatch(actions.JobsActions.updateJobStatus(job_id, data)),
  };
}

export default connect(null, mapDispatchToProps)(ReviveJob);
