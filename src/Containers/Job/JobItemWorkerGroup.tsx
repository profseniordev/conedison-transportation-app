import React from 'react';
import { isNullOrUndefined } from 'util';
import { JobListItem } from '../../Models/jobListItem';
import WorkerGroup from './RerouteWorker/WorkerGroup';
import { actions } from '../../Services';
import { connect } from 'react-redux';
interface Props {
  data?: JobListItem;
  search?: any;
  updateJobWorkers?: any;
  selectRow?: Function;
}

export class JobItemWorkerGroup extends React.Component<Props, any> {

  	filterWorkerByLocation = (locations = [], workers = []) => {
		//this.props.selectRow(true);
		let result = [];
      	let temp = [...workers];
      	// Filter worker by job location
		for (let j = 0; j < locations.length; j++) {
			const wks = temp.filter(item => item.location && locations[j].address && item.location.address === locations[j].address);
	        temp = temp.filter(item => item.location && locations[j].address && item.location.address !== locations[j].address);
	        result.push({ location: locations[j], workers: wks });
	    }

    	// Filter worker without location
	    const wokerWithoutLocation = temp.filter(item => !item.location.address);
    	if (wokerWithoutLocation.length > 0) {
        	result.push({ location: { location: '' }, workers: wokerWithoutLocation });
        	temp = temp.filter(item => item.location.address);
      	}

		// Filter worker with same location
	    for (let i = 0; i < temp.length; i++) {
	    	const wks = temp.filter(item => item.location.address === temp[i].location.address);
	        if (wks.length > 1) {
	        	result.push({ location: temp[i].location, workers: wks });
	        	temp = temp.filter(item => item.location.address !== temp[i].location.address);
	        }
		}

	    for (let i = 0; i < temp.length; i++) {
	    	result.push({ location: temp[i].location, workers: [temp[i]] });
	    }
	    return result;
	}


	public render() {
    	const { data, search } = this.props;
    	return (
    		<div className="box-item-body hover-item-body cursor-pointer">
	        	<WorkerGroup
		            groups={this.filterWorkerByLocation(data.locations, data.workers)}
		            jobId={data.id}
		            hasSeen={data.hasSeen}
		            onSaveSuccess={search}
		            jobDetail={data}
					noBorder={true}
					selectRow={this.props.selectRow}
					//updateJobWorkers={this.props.updateJobWorkers}
	          	/>
          	</div>
        );
  	}
}

function mapDispatchToProps(dispatch) {
	return {
	  dispatch,
	  updateJobWorkers: (job_id, worker) =>
		dispatch(actions.JobsActions.updateJobWorkers(job_id, worker)),
	};
  }

export default connect(null, mapDispatchToProps)(JobItemWorkerGroup);
