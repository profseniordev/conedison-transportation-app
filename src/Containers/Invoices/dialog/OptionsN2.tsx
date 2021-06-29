import React, { Component } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core';
import { connect } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import '../Invoices.scss';
import Button from '../../../components/Button/Button';


class AddWorker extends Component<any> {
  state: any;
  constructor(props) {
    super(props);
    this.state = {
      invoice: {
        id: 21,
        date_created: '11/11/19',
        date_of_service: '03/09/21',
        departments: 'Gas - Bronx',
        section: '0881',
        po: '0000001',
        billed: 'Yes',
        Coned_Ed_Ticket: '014876411',
        Requestor: 'John Doe',
        Request_Time: '9:00',
        Supervisor: 'John Smith',
        CE_Solutions: 'Some Solution',
        JOB_TICKET: '000014',
        Location_Address: '3 Leame Close, Hull, HU3 6ND',
        Muni: 'Muni',
        Flagger_Name: 'Flagger  Name',
        Flagger_Emloyee: 'Emloyee #1453',
        T_S_RECEIVED: 'Yes',
        Start_Date_Time: '11/11/19 - 03:00',
        Finish_Date_Time: '11/11/19 - 09:00',
        Hour_Break_Taken: '2',
        Hour_Break_Taken_2: '5',
        Total_HRS_Worked: '6h',
        Regular_Hours: '16h',
        OT: 'OT',
        Total_Invoice_Amount: '$425',
        Holiday_Hours: '2h',
      },
      invoices_1: [
        { label: 'Date Of Service', value: '03/09/21' },
        { label: 'Departments', value: 'Gas - Bronx' },
        { label: 'Section #', value: '#0881' },
        { label: 'PO #', value: '0000001' },
        { label: 'Billed', value: 'Yes' },
      ],
      invoices_2: [
        { label: 'Coned Ed Ticket #', value: '014876411' },
        { label: 'Requestor', value: 'John Doe' },
        { label: 'Request Time', value: '09:00' },
        { label: 'Supervisor', value: 'John Smith' },
        { label: 'CE Solutions ', value: 'Some Solution' },
      ],
      invoices_3: [
        { label: 'JOB TICKET#', value: '000014' },
        {
          label: 'Location Address & Cross Street',
          value: '3 Leame Close, Hull, HU3 6ND',
        },
        { label: 'Muni', value: 'Muni' },
        { label: 'Flagger  Name', value: 'Some name' },
        { label: 'Flagger Emloyee #', value: 'Emloyee #1453' },
      ],
      invoices_4: [
        { label: 'T/S RECEIVED', value: 'Yes' },
        { label: 'Start Date/Time', value: '11/11/19 - 03:00' },
        { label: 'End Date/Time', value: '11/11/19 - 09:00' },
        { label: '1/2 Hour Break Taken', value: '2' },
        { label: '1/2 Hour Break Taken', value: '5' },
      ],
      invoices_5: [
        { label: 'Total HRS Worked', value: '6h' },
        { label: 'Regular Hours', value: '16h' },
        { label: 'OT', value: 'OT' },
        { label: 'Total Invoice Amount', value: 'OT' },
        { label: 'Holiday Hours', value: '2h' },
      ],
    };
  }

  render() {
    const {
      invoice,
      invoices_1,
      invoices_2,
      invoices_3,
      invoices_4,
      invoices_5,
    } = this.state;
    return (
      <Dialog
        onClose={this.props.onClose}
        aria-labelledby="simple-dialog-title"
        open={this.props.open}
      >
        <div className="d-flex justify-content-between align-items-center m-4">
          <div>
            <div className="h4">
              {' '}
              Invoice #{invoice.id} ({invoice.date_created})
            </div>
            <div className="text-12">Below are the details of the invoice</div>
          </div>
          <div
            className="border-close"
            style={{ cursor: 'pointer' }}
            onClick={this.props.onClose}
          >
            <CloseIcon fontSize="large" />
          </div>
        </div>
        <div className="horisontal-line" />
        <DialogContent className={'assign-dialog-content'}>
          <div>
            {invoices_1.map((invoice, index) => {
              return (
                <div className="d-flex justify-content-between" key={index}>
                  <div className="label">{invoice.label}</div>
                  <div className="value"> {invoice.value}</div>
                </div>
              );
            })}
          </div>

          <div className="horisontal-line" />
          <div>
            {invoices_2.map((invoice, index) => {
              return (
                <div className="d-flex justify-content-between" key={index}>
                  <div className="label">{invoice.label}</div>
                  <div className="value"> {invoice.value}</div>
                </div>
              );
            })}
          </div>

          <div className="horisontal-line" />
          <div>
            {invoices_3.map((invoice, index) => {
              return (
                <div className="d-flex justify-content-between" key={index}>
                  <div className="label">{invoice.label}</div>
                  <div className="value"> {invoice.value}</div>
                </div>
              );
            })}
          </div>

          <div className="horisontal-line" />
          <div>
            {invoices_4.map((invoice, index) => {
              return (
                <div className="d-flex justify-content-between" key={index}>
                  <div className="label">{invoice.label}</div>
                  <div className="value"> {invoice.value}</div>
                </div>
              );
            })}
          </div>

          <div className="horisontal-line" />
          <div>
            {invoices_5.map((invoice, index) => {
              return (
                <div className="d-flex justify-content-between" key={index}>
                  <div className="label">{invoice.label}</div>
                  <div className="value"> {invoice.value}</div>
                </div>
              );
            })}
          </div>
          <div className="horisontal-line" />
        </DialogContent>

        <DialogActions
          className={'assign-container-btn justify-content-between'}
        >
          <Button
            color={'gray'}
            width={'158px'}
            height={'48px'}
            borderRadius={'24px'}
            textTransform={false}
            onClick={this.props.onClose}
          >
            Cancel
          </Button>
          <Button
            color={'dark'}
            width={'158px'}
            height={'48px'}
            borderRadius={'24px'}
            textTransform={false}
            processing={this.state.processing}
            // onClick={this.confirmComplete}
          >
            Excel Export
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(null, null)(AddWorker);
