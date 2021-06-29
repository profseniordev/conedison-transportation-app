import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';

export class UpdatePODialog extends React.Component<any> {

  state: any;

  constructor(props) {
    super(props);
    this.state = {
      po_number: '',
      requisition: '',
      receipt: ''
    };
  }

  componentWillUnmount(): void {
    this.setState({
      po_number: '',
      requisition: '',
      receipt: ''
    });
  }

  close = () => {
    this.props.close();
  };

  confirm = () => {
    this.props.updatePOS(this.state.po_number, this.state.requisition, this.state.receipt);
  };

  handleChange = (event) => {
    this.setState({
      error: false,
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const processing = this.props.processing;
    return (
      <Dialog
        open={this.props.open}
        onClose={this.close}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update PO # / Requisition #</DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <DialogContentText></DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="PO #"
            name="po_number"
            fullWidth
            value={this.state.po_number}
            onChange={this.handleChange}
            inputProps={{ maxLength: 30 }}
          />
          <TextField
            margin="dense"
            label="Requisition #"
            name="requisition"
            fullWidth
            value={this.state.requisition}
            onChange={this.handleChange}
            inputProps={{ maxLength: 30 }}
          />
          {this.props.receiptUpdate && 
           <TextField
           margin="dense"
           label="Receipt #"
           name="receipt"
           fullWidth
           value={this.state.receipt}
           onChange={this.handleChange}
           inputProps={{ maxLength: 30 }}
         />}
        </DialogContent>
        <DialogActions style={{ paddingRight: '25px' }}>
          <Button
            onClick={this.close}
            variant={'outlined'}
            style={{ paddingLeft: 20 }}
          >
            Cancel
          </Button>
          <Button
            onClick={this.confirm}
            color="primary"
            disabled={processing}
            variant={'contained'}
          >
            {processing ? 'Loading' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    processing: state.jobs.update_po_number_processing,
  };
}

export default connect(mapStateToProps, null)(UpdatePODialog);
