import React, { Component } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Button from '../../../../components/Button/Button';
import { actions } from '../../../../Services';
import './EditShift.scss';
import FormControl from '@material-ui/core/FormControl';
import moment from 'moment';
import { toast } from 'react-toastify';

class EditShift extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      new_location_id: '',
      processing: false,
      start_at: props.shift.timesheet
        ? props.shift.timesheet.start_at
        : props.shift.start_at,
      finish_at: props.shift.timesheet
        ? props.shift.timesheet.finish_at
        : props.shift.finish_at,
    };
  }
  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    if (this.props.shift !== prevProps.shift) {
      this.init();
    }
  }

  componentDidMount(): void {
    this.init();
  }

  init() {
    const props = this.props;
    this.setState({
      start_at: props.shift.timesheet
        ? props.shift.timesheet.start_at
        : props.shift.start_at,
      finish_at: props.shift.timesheet
        ? props.shift.timesheet.finish_at
        : props.shift.finish_at,
    });
  }

  confirm = () => {
    this.setState({
      processing: true,
    });
    this.props
      .updateJobWorker(this.props.job_id, this.props.shift.id, {
        status: 'edit',
        start_at: this.state.start_at,
        finish_at: this.state.finish_at,
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
      ).catch(error => {
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
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.name]: event.target.value,
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
          <DialogTitle>Shift Edit</DialogTitle>
          <DialogContent>
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                You can change start and end of work time
              </Typography>
            </Box>
            <div className="d-flex flex-column">
              <FormControl className="mb-4">
                <TextField
                  id={'edit_shift_start_at'}
                  label="Start Datetime"
                  type="datetime-local"
                  variant={'outlined'}
                  name={'start_at'}
                  onChange={this.handleChange}
                  value={
                    this.state.start_at
                      ? moment(this.state.start_at).format('YYYY-MM-DDTHH:mm')
                      : null
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              <FormControl>
                <TextField
                  id={'edit_shift_finish_at'}
                  label="Finish Datetime"
                  type="datetime-local"
                  variant={'outlined'}
                  name={'finish_at'}
                  onChange={this.handleChange}
                  value={
                    this.state.finish_at
                      ? moment(this.state.finish_at).format('YYYY-MM-DDTHH:mm')
                      : null
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{ inputProps: {
                    min: moment(this.state.start_at).format('YYYY-MM-DDThh:mm'),
                    //max: moment(this.state.start_at).add(14, 'hours').format('YYYY-MM-DDThh:mm')
                  }}}
                />
              </FormControl>
            </div>
          </DialogContent>

          <DialogActions className={'action-button-group'}>
            <Button
              color={'gray'}
              width={'158px'}
              height={'48px'}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditShift);
