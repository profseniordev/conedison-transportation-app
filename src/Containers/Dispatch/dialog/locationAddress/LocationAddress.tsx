import React, { Component } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import AttachmentIcon from '@material-ui/icons/Attachment';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import LocationsAsyncSearch from '../../../Components/Controls/LocationsAsyncSearch';
import CustomButton from '../../../../components/Button/Button';
import { actions } from '../../../../Services';
import { jobAPI } from '../../../../Services/API';
import PreviewImage from '../../../Components/ImageUpload/PreviewImage';

import './LocationAddress.scss';

class LocationAddress extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      locationId: null,
      address: '',
      lat: 0,
      lon: 0,
      structure: '',
      max_workers: 1,
      note: '',
      processing: false,
      images: [],
      isAddMode: true,
      isLocation: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.location && props.location.id !== state.locationId) {
      return {
        locationId: props.location.id,
        address: props.location.address,
        lat: props.location.lat,
        lon: props.location.lon,
        structure: props.location.structure,
        note: props.location.note,
        images: [],
        isAddMode: props.isAddMode,
        isLocation: true,
      };
    }
    return null;
  }

  handleChangeStructure = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      structure: event.target.value,
    });
  };

  handleChangeComments = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      note: event.target.value,
    });
  };

  selectLocation = (item) => {
    if (item) {
      this.setState({
        lat: item.value.lat,
        lon: item.value.lng,
        address: item.value.address,
        isLocation: true,
      });
    } else {
      this.setState({
        lat: 0,
        lon: 0,
        address: '',
        isLocation: false
      }, () =>  console.log(this.state.isLocation));
    }
  };

  save = async () => {
    this.setState({
      processing: true,
    });

    let files = [];
    if (this.state.images.length > 0) {
      const formData = new FormData();
      this.state.images.forEach((image, index) =>
        formData.append('images_' + index, image)
      );
      files = (await jobAPI.uploadImages(formData)).data;
    }

    if (this.state.isAddMode) {
      this.props
        .addJobLocation(this.props.job_id, {
          lat: this.state.lat,
          lon: this.state.lon,
          address: this.state.address,
          structure: this.state.structure,
          note: this.state.note,
          max_workers: this.state.max_workers,
          files: files,
        })
        .then((res) => {
          this.setState({
            processing: false,
          });
          this.props.dispatch(
            actions.JobsActions.updateJobWorker(
              this.props.job_id,
              this.props.job_worker_id,
              {
                status: 're_route',
                location_id: res.job.locations[res.job.locations.length - 1].id,
              }
            )
          );
          this.props.onClose();
        });
    } else {
      this.props
        .updateJobLocation(
          this.props.job_id,
          {
            lat: this.state.lat,
            lon: this.state.lon,
            address: this.state.address,
            structure: this.state.structure,
            note: this.state.note,
            max_workers: this.state.max_workers,
            files: files,
          },
          this.state.locationId
        )
        .then((res) => {
          this.setState({
            processing: false,
          });
          this.props.dispatch(
            actions.JobsActions.updateJobWorker(
              res.job.id,
              this.props.job_worker_id,
              {
                status: 're_route',
                location_id: this.state.locationId,
              }
            )
          );
          this.props.onClose();
        });
    }
  };

  handleUploadFile = (event) => {
    this.setState({
      images: [...this.state.images, ...event.target.files],
    });
  };

  removeImage = (idx) => {
    const newImages = [...this.state.images];
    if (idx > -1) {
      newImages.splice(idx, 1);
    }
    this.setState({
      images: newImages,
    });
  };

  render() {
    return (
      <Dialog
        className={'location-address-dialog'}
        onClose={this.props.onClose}
        aria-labelledby="simple-dialog-title"
        open={this.props.open}
      >
        <DialogTitle>
          <Box className={'dialog-title'}>
            <Box>
              <Typography className={'title'} variant="h6">
                Location Address
              </Typography>
              <Typography
                className={'description'}
                variant="body2"
                color="textSecondary"
              >
                Fill Details about this Location
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              className={'close-button'}
              size="small"
              onClick={this.props.onClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent className={'dialog-content'}>
          <Box mb={2}>
            <Box width="100%" mb={2}>
              <InputLabel htmlFor="location-address">
                Location Address
              </InputLabel>
              <LocationsAsyncSearch
                onSelect={this.selectLocation}
                defaultInputValue={this.state.address}
              />
            </Box>
            <Grid container spacing={1}>
              {this.props.job && this.props.job.type === 'Parking' && (
                <Grid container item xs={6}>
                  <InputLabel htmlFor="location-structure">
                    Structure
                  </InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="structure"
                    value={this.state.structure}
                    onChange={this.handleChangeStructure}
                  />
                </Grid>
              )}
            </Grid>

            <Box mt={2}>
              <InputLabel htmlFor="image-upload" style={{ color: '#BDBDBD' }}>
                Upload the necessary photos for the selected location
              </InputLabel>
              <Box display="flex" alignItems="flex-start">
                <Box mr={3}>
                  <label className="upload-button">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<AttachmentIcon />}
                    >
                      Browse Files
                      <input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        hidden
                        onChange={this.handleUploadFile}
                      />
                    </Button>
                  </label>
                </Box>
                <Box className="preview-images">
                  <div className="d-flex flex-wrap">
                    {this.state.images.map((image, index) =>
                      typeof image === 'string' ? (
                        <div key={String(index)} className="mr-2">
                          <PreviewImage
                            url={`${image}`}
                            onRemove={() => this.removeImage(index)}
                          />
                        </div>
                      ) : (
                        <div key={String(index)} className="mr-2">
                          <PreviewImage
                            url={URL.createObjectURL(image)}
                            onRemove={() => this.removeImage(index)}
                          />
                        </div>
                      )
                    )}
                  </div>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box>
            <InputLabel htmlFor="comments">comments*</InputLabel>
            <TextField
              className={'comments'}
              fullWidth
              variant="outlined"
              id="comments"
              value={this.state.note}
              placeholder="Enter your comments"
              onChange={this.handleChangeComments}
            />
          </Box>
        </DialogContent>

        <DialogActions className={'action-button-group'}>
          <CustomButton
            color={'gray'}
            width={'158px'}
            borderRadius={'20px'}
            textTransform={false}
            onClick={this.props.onClose}
          >
            Cancel
          </CustomButton>
          <CustomButton
            disabled={!this.state.isLocation && this.state.isAddMode || (this.state.structure === '' && this.props.job && this.props.job.type === 'Parking')}
            color={'dark'}
            width={'158px'}
            borderRadius={'20px'}
            textTransform={false}
            onClick={this.save}
            processing={this.state.processing}
          >
            Save Changes
          </CustomButton>
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
    addJobLocation: (job_id, options) =>
      dispatch(actions.JobsActions.addJobLocation(job_id, options)),
    updateJobLocation: (job_id, options, location_id) =>
      dispatch(
        actions.JobsActions.updateJobLocation(job_id, options, location_id)
      ),
    reRoute: (worker_job_id, worker_id, location) =>
      dispatch(
        actions.JobsActions.updateJobWorker(worker_job_id, worker_id, location)
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationAddress);
