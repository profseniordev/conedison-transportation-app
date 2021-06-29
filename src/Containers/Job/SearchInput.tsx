import * as React from 'react';
import Button from '@material-ui/core/Button';
import { actions } from '../../Services';
import { connect } from 'react-redux';
import history from '../../history';
import Search from '../../components/Search/Search';

class SearchInput extends React.PureComponent<any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sortASAP = () => {
    this.props.sortASAP();
  };

  onValueChange = (params) => {
    this.props.onValueChange(params);
  };

  render() {
    const props = this.props;

    const createJob = () => {
      history.push('/job/create');
    };

    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'fit-content'
        }}
      >
        <Search
          updateFilters={this.onValueChange}
          placeholder={'Search ...'}
          instant={true}
          search_value={props.search_value}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {props.canDoJobAction && (
            <>
              {props.show_confirm_button && (
                <Button
                  variant="contained"
                  onClick={props.confirmJobs}
                  style={{
                    marginRight: 10,
                    width: 125,
                    overflow: 'hidden',
                    color: !props.confirm_jobs_processing
                      ? '#FFFFFF'
                      : '#dbdede',
                    backgroundColor: !props.confirm_jobs_processing
                      ? '#37a568'
                      : 'grey',
                    borderColor: !props.confirm_jobs_processing
                      ? '#37a568'
                      : 'grey',
                    cursor: !props.confirm_jobs_processing
                      ? 'pointer'
                      : 'not-allowed',
                  }}
                  disabled={props.confirm_jobs_processing}
                >
                  {props.confirm_jobs_processing ? 'Loading' : 'Acknowledge'}
                </Button>
              )}
              <Button
                variant="outlined"
                style={{ overflow: 'hidden', marginRight: 10 }}
                onClick={props.showModal}
              >
                Update PO# / Requisition#
              </Button>
              <Button
                variant="outlined"
                style={{
                  overflow: 'hidden',
                  marginRight: 10,
                }}
                onClick={createJob}
              >
                Create Job
              </Button>
              <Button
                variant="outlined"
                style={{ overflow: 'hidden', marginRight: 10 }}
                onClick={this.sortASAP}
              >
                Sort ASAPs
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    confirm_jobs_processing: state.jobs.confirm_jobs_processing,
    stats: state.jobs.stats,
    canDoJobAction: state.app.user
      ? [1, 2, 5, 6, 8].some((r) => state.app.user.roles.includes(r))
      : false,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    sortASAP: () => dispatch(actions.JobsActions.sortASAP()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchInput);
