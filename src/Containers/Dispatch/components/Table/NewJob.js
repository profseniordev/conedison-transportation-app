import React, {PureComponent} from 'react';
import {actions} from "../../../../Services";
import {connect} from "react-redux";
import Job from "./Job";
import moment from 'moment-timezone';

class NewJob extends PureComponent {
    handleClick = () => {
        this.props.retrieve(this.props.job);
    };

    update = (id, options) => {
        // this.props.update(id, options);
    };

    isASAP = () => {
      const createTime = Date.parse(this.props.job.created_at.toString());
      //const createTime = Date.parse(new Date().toString());
      const requestTime = Date.parse(this.props.job.start_at.toString());

      let diff = Math.abs(createTime - requestTime);
      diff = Math.floor((diff / (1000 * 60 * 60)) % 24);

      if(diff >= 1 && this.props.job.status==='pending'){
          return true;
      } else {
          return false;
      }

    }

    render() {
        const job = this.props.job;
        if(job == null){
            return null;
        }
        return (
            <Job  key={job.id}
                  row={job}
                  isSelected={this.props.selected}
                  handleClick={this.handleClick}
                  updateRide={this.update}
                  has_red_line={this.props.has_red_line}
                  asap={this.isASAP()}
            />
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        retrieve: (job_location) => dispatch(actions.JobsActions.retrieveLocationJob(job_location)),
        // update: (ride_id, options) => dispatch(actions.JobsActions.update(ride_id, options)),
    }
}

function mapStateToProps(state, ownProps)
{
    let jobs = state.jobs.jobs_locations;
    let job = ownProps.job;
    let selected_id = state.jobs.selected_location_id;
    let selected = false;
    if(selected_id && job.id === selected_id) {
        selected = true;
    }

    let red_lane = false;
    let index = ownProps.index;
    if(index > 0 && jobs[index - 1]) {
        let now = moment().valueOf();
        let prev_value = moment(jobs[index - 1].start_at).valueOf();
        let this_value = moment(job.start_at).valueOf();
        if(prev_value < now && now < this_value) {
            red_lane = true;
        }
    }

    return {
        job     : job,
        selected : selected,
        has_red_line: red_lane
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewJob);
