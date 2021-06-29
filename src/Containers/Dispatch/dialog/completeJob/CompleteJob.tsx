import React, { Component } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Button from '../../../../components/Button/Button';
import { actions } from '../../../../Services';
import './CompleteJob.scss';
import CompleteJobImg from '../../../../Assets/icons/complete-job.svg';

class CompleteJob extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      processing: false,
    };
  }

  confirmComplete = () => {
    if (this.props.setComplete) {
      this.props.setComplete();
    }
    this.setState({
      processing: true,
    });
    this.props
      .updateJobStatus(this.props.job_id, {
        status: 'complete',
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
          <DialogTitle className={'complete-title'}>Complete Job?</DialogTitle>

          <DialogContent>
            <Box className={'complete-image-group'} mt={2} mb={2}>
              <img className={'complete-image'} src={CompleteJobImg} alt="" />
            </Box>
            <Box className={'complete-image-group'} mt={2} mb={2}>
              <Typography color="textSecondary">
                Has the work been completed?
              </Typography>
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
              onClick={this.confirmComplete}
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
    updateJobStatus: (job_id, options) =>
      dispatch(actions.JobsActions.updateJobStatus(job_id, options)),
  };
}

export default connect(null, mapDispatchToProps)(CompleteJob);
