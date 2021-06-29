import React, { Fragment, PureComponent } from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';
import TextsmsOutlinedIcon from '@material-ui/icons/TextsmsOutlined';
import PanoramaOutlinedIcon from '@material-ui/icons/PanoramaOutlined';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
  TABLE_HEADER,
  SUBCONTRACTOR_CELL_STYLES,
} from '../../../Constants/billing';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import history from '../../../history';
import { connect } from 'react-redux';
import { actions } from '../../../Services';
import SimpleReactLightbox from 'simple-react-lightbox';
import PreviewImage from '../../Components/ImageUpload/PreviewImage';
import { SRLWrapper } from 'simple-react-lightbox';
//import EditShift from '../../Dispatch/dialog/EditShift/EditShift';
import EditTime from '../dialog/EditTime';
import DisputeModal from '../dialog/DisputeModal';

/*const styles = makeStyles(() => ({
  paper: {
    '& .MuiPaper-rounded': {
      borderRadius: 16,
      padding: 8,
    },
  },
  tableHeaderCell: {
    // fontSize: '0.75rem',
  },
  tableBodyRow: {
    transition: '0.2s',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#cecece59',
    },
  },
}));*/
class JobsTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: props.page,
      isVerified: false,
      open: 0,
      disputeOpen: 0,
    };
    //this.openEdit = this.openEdit.bind(this);
    //this.closeEdit = this.closeEdit.bind(this);
  }

  verify = (id) => {
    const data = {isVerified: 1}
    this.props.updateTimesheet(id, data);
  } 

  openEdit = (id) => {
    this.setState({open: id});
  }

  closeEdit = (e) => {
    this.setState({open: 0});
  }

  openDisputeDialog = (id) => {
    this.setState({disputeOpen: id});
  }

  closeDisputeDialog = () => {
    this.setState({disputeOpen: 0});
  }

  render() {
    const {
      handeleSort,
      orderBy,
      orderByType,
      timesheets,
      jobStatus,
      disableDisputedBtn
    } = this.props;

    const renderTableCellLabel = (label) => {
      if (label.length > 15) {
        return (
          <Tooltip title={label} placement="top">
            <div>{label.substr(0, 15)}...</div>
          </Tooltip>
        );
      } else {
        return label;
      }
    };
    const renderStatus = (item) => {
      if (item === 'clocked_out') return 'Clocked out';
      if (item === 'clocked_in') return 'Clocked in';
    };

    const checkIsVerified = (value) => {
      return (
        <div>
          {value ? (
            <span
              className="badge badge-secondary p-2 mr-2 mt-1"
              style={{ backgroundColor: '#27AE60' }}
            >
              Verified
            </span>
          ) : (
            <span
              className="badge badge-secondary p-2 mr-2 mt-1"
              style={{ backgroundColor: 'EB5757' }}
            >
              Unverified
            </span>
          )}
        </div>
      );
    };

    return (
      <div className="billing-table-container" style={{overflowY: 'hidden'}}>
        <Fragment>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead style={{ background: '#F2F2F2' }}>
                  <TableRow>
                    {TABLE_HEADER.map((headCell) => {
                      /*if (headCell.sortable) {
                        return (
                          <TableCell
                            //className={classes.tableHeaderCell}
                            style={headCell.styles}
                          >
                            <TableSortLabel
                              active={orderBy === headCell.value}
                              direction={
                                orderBy === headCell.value && orderByType
                                  ? 'asc'
                                  : 'desc'
                              }
                              onClick={() => handeleSort(headCell.value)}
                            >
                              {headCell.label}
                            </TableSortLabel>
                          </TableCell>
                        );
                      } else {*/
                        return (
                          <TableCell 
                          key={headCell.label}
                          //className={classes.tableHeaderCell}
                          >
                            {headCell.label}
                          </TableCell>
                        );
                    // }
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timesheets && timesheets.map((row) => (
                    <TableRow
                      // onClick={() => handleRowClick(row.id)}
                      //className={classes.tableBodyRow}
                      key={row.id}
                    >
                      <TableCell>
                        {moment(row.start_at).format('MM/DD/YY [•] HH:mm')}
                      </TableCell>
                      <TableCell>
                        {moment(row.finish_at).format('MM/DD/YY [•] HH:mm')}
                      </TableCell>
                      <TableCell> 
                        <Link to={`/workers/${row.worker_id}`}>
                            {row.worker_name}
                        </Link>
                      </TableCell>
                      <TableCell style={SUBCONTRACTOR_CELL_STYLES}>
                        {row.subcontractorName &&
                          renderTableCellLabel(row.subcontractorName)}
                      </TableCell>
                      <TableCell>{row.total_hours}</TableCell>
                      <TableCell>{renderStatus(row.status)}</TableCell>
                      <TableCell>{checkIsVerified(row.verified)}</TableCell>
                      <TableCell>{row.total_due}</TableCell>
                      <TableCell>
                        <Tooltip title={disableDisputedBtn ? "Timesheet cannot be disputed at this stage" :"Dispute"} aria-label="dispute" arrow>
                          <div className={'dispute'}>
                            <button  onClick={_=>this.openDisputeDialog(row.id)}
                                          disabled={disableDisputedBtn}
                                          style={{display: 'contents', cursor: 'pointer'}}>
                                    <TextsmsOutlinedIcon style={{color: 'black'}} />
                                  </button>
                            {row.dispute_reason && <span>1</span>}
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell style={{width: 50}}>
                        <div className='actions-row'>
                          <Tooltip title={row.verified ? 'Verified' : "Verify"} aria-label="Verify" arrow>
                            <div style={{display: 'flex', alignItems: 'center', marginRight: -5}}>
                             <div>
                                <div  className={'open-real-timesheet'}>
                                  <button onClick={() => this.verify(row.id)}
                                          disabled={row.verified}
                                          style={{display: 'contents', cursor: 'pointer'}}>
                                    <VerifiedUserIcon style={{color: 'black'}} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Tooltip>
                          {row.images && row.images.length ? 
                          <Tooltip title="View Photo" aria-label="photo" arrow>
                              <div style={{width: '19px', marginTop: 1}}>
                                <SimpleReactLightbox>
                                  {row.images.map((image, index) => (
                                    <SRLWrapper>
                                      <div
                                        key={String(index)}
                                        className="img-wrapper"
                                        style={{ cursor: 'pointer' }}
                                      >
                                        {typeof image === 'string' ? (
                                          <div key={String(index)} className="mr-3">
                                            <div  className={'open-real-timesheet'} style={{marginTop: '6px'}}>
                                              <PanoramaOutlinedIcon style={{color: 'black'}} />
                                            </div>
                                            <div className="thumb-wrapper">
                                              <img src={`${image}`} alt="" />
                                            </div>
                                          </div>
                                        ) : (
                                          <div key={String(index)} className="mr-3">
                                            <PreviewImage url={URL.createObjectURL(image)} />
                                          </div>
                                        )}
                                      </div>
                                    </SRLWrapper>
                                  ))}
                                </SimpleReactLightbox>
                            </div>
                          </Tooltip> : null}
                          <Tooltip  title={this.props.cancelledJob ? 'Cancelled job' : "Edit"} aria-label="edit" arrow>
                             <div style={{display: 'flex', alignItems: 'center'}}>
                              <div className={'open-real-timesheet'}>
                                  <button onClick={_=>this.openEdit(row.id)}
                                      disabled={this.props.cancelledJob}
                                      style={{display: 'contents', cursor: 'pointer'}}>
                                   <EditSharpIcon style={{color: 'black'}} />
                                  </button>
                                </div>
                                {/*<EditShift
                                  open={this.state.open}
                                  onClose={this.closeEdit}
                                  shift={{timesheet: row, id: row.worker_id }}
                                  job_id={this.props.jobId}
                                />*/}
                              </div>
                          </Tooltip>
                       </div>
                      </TableCell>
                      <EditTime
                            open={this.state.open === row.id}
                            onClose={this.closeEdit}
                            timesheet={row}
                            />
                      <DisputeModal
                            jobId={this.props.jobId}
                            timesheetId={row.id}
                            disputedReason={row.dispute_reason}
                            jobStatus={jobStatus}
                            open={this.state.disputeOpen === row.id}
                            onClose={this.closeDisputeDialog}
                            />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Fragment>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateTimesheet: (id, data) => dispatch(actions.TimesheetsActions.update(id, data)),
  };
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobsTable);
