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
import './ReRoute.scss';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

class ReRoute extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      new_location_id: '',
      processing: false,
    };
  }

  confirm = () => {
    this.setState({
      processing: true,
    });
    this.props
      .updateJobWorker(this.props.job_id, this.props.job_worker_id, {
        status: 're_route',
        location_id: this.state.new_location_id,
      })
      .then(
        () => {
          this.setState({
            processing: false,
          });
          this.props.onClose();
        },
        () => {
          this.setState({
            processing: false,
          });
          this.props.onClose();
        }
      );
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      new_location_id: event.target.value,
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
          <DialogTitle className={'cancel-title'}>Re Route</DialogTitle>

          <DialogContent>
            {/*<Box className={'cancel-image-group'} mt={2} mb={2}>
                <img className={'cancel-image'} src={CancelJobReasonImg} alt="" />
                <img className={'close-icon'} src={CloseRedIcon} alt="" />
              </Box>*/}
            <Box mb={1}>
              <Typography variant="body2" color="textSecondary">
                Please select new location
              </Typography>
            </Box>
            <Box mb={3}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-label">
                  New Location
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name={'new_location_id'}
                  value={this.state.new_location_id}
                  onChange={this.handleChange}
                >
                  {this.props.locations.map((location, index) => {
                    return (
                      <MenuItem value={location.id} key={index}>
                        {location.address}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
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
              onClick={this.confirm}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    locations: state.jobs.location_job.locations,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateJobWorker: (job_id, job_worker_id, data) =>
      dispatch(
        actions.JobsActions.updateJobWorker(job_id, job_worker_id, data)
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReRoute);
