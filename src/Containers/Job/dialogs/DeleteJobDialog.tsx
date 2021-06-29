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
import Button from '../../../components/Button/Button';
import '../JobCreate.scss';
class DeleleJob extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      processing: false,
    };
  }

  confirmComplete = () => {
    console.log('fffff');
  };

  render() {
    return (
      <>
        <Dialog
          onClose={this.props.onClose}
          aria-labelledby="simple-dialog-title"
          open={this.props.open}
        >
          <DialogTitle className={'complete-title'}>Delete Job</DialogTitle>

          <DialogContent>
            <Box className="d-flex justify-content-center" mt={2} mb={2}>
              <div className="deleteJob" />
            </Box>
            <Box className={'complete-image-group'} mt={2} mb={2}>
              <Typography color="textSecondary">
                You really want to delete this job
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions className={'action-button-group'}>
            <Button
              color={'gray'}
              height={'48px'}
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
              height={'48px'}
              borderRadius={'20px'}
              textTransform={false}
              processing={this.state.processing}
              onClick={this.props.clicked}
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
  };
}

export default connect(null, mapDispatchToProps)(DeleleJob);
