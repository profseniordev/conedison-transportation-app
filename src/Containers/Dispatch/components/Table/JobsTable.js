import React, { PureComponent } from 'react';
import { Table, TableBody, TablePagination } from '@material-ui/core';
import NewJob from './NewJob';
import JobsFilter from '../Filter/JobsFilter';
import { connect } from 'react-redux';
import { actions } from '../../../../Services';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import { withStyles } from '@material-ui/core';
import moment from 'moment';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#FFFFFF',
  },
}))(TableCell);

class JobsTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: props.page,
      jobs: props.jobs || []
    };
  }

  componentDidUpdate(prevProps) {
    if(prevProps.page && prevProps.page !== this.props.page){
      this.setState({
        page: this.props.page
      })
    }
  }

  componentWillReceiveProps(nextProps, prevProps) {
    if (nextProps.jobs && nextProps.jobs !== this.props.jobs) {
      this.setState(
        {
            jobs: nextProps.jobs,
        });
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      ...this.state,
      page: newPage,
    });
    this.props.updateFilters({ page: newPage + 1 });
  };

  handleChangeRowsPerPage = (event) => {
    this.props.updateFilters({ per_page: event.target.value });
  };

  render() {
    return (
      <div className="wrapper-table-jobs">
        <JobsFilter />
        <div className={'table-job'}>
          <TableContainer>
            <Table
              aria-labelledby="tableTitle"
              size={'medium'}
              className={'table'}
              stickyHeader
            >
              <TableHead style={{ backgroundColor: '#FFFFFF' }}>
                <TableRow>
                  <StyledTableCell align="left" style={{ paddingLeft: '13px' }}>
                    ID
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    Driver Assigned
                  </StyledTableCell>
                  <StyledTableCell align="left">Location</StyledTableCell>
                  <StyledTableCell align="left">ETA & Lateness</StyledTableCell>
                  <StyledTableCell align="left"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.jobs.map((job, index) => (
                  (index>0 &&( moment(this.state.jobs[index].start_at).isAfter(this.state.jobs[index-1].start_at, 'day') || moment(this.state.jobs[index].start_at).isBefore(this.state.jobs[index-1].start_at, 'day') ) ) ?
                     <> 
                        <TableRow><TableCell colSpan={5} style={{background: '#333333', height: '8px'}}></TableCell></TableRow> 
                        <NewJob key={job.id} job={job} index={index}/> 
                      </> :
                        <NewJob key={job.id} job={job} index={index}/>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
              component="div"
              className="pagination"
              count={this.props.total}
              rowsPerPage={this.props.per_page}
              page={this.state.page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateFilters: (filters) =>
      dispatch(actions.JobsActions.updateLocationsFilters(filters)),
  };
}

function mapStateToProps(state) {
  return {
    jobs: state.jobs.jobs_locations,
    page: state.jobs.locations_search_options.page,
    per_page: state.jobs.locations_search_options.per_page,
    total: state.jobs.total,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(JobsTable);
