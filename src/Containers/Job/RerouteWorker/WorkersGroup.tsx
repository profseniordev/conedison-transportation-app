import React from 'react';
import { actions } from '../../../Services';
import { connect } from 'react-redux';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class WorkersGroup extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      groups: [],
    };
  }

  componentDidMount(): void {
    this.init();
  }

  componentDidUpdate(prevProps): void {
    if (prevProps.job !== this.props.job) {
      this.init();
    }
  }

  init() {
    this.initGroups();
  }

  initGroups = () => {
    let locations = this.props.job.locations;
    let workers = this.props.job.workers;
    let result = [];
    let temp = [...workers];
    if (!this.props.workerId) {
      // Filter worker by job location
      for (let j = 0; j < locations.length; j++) {
        const wks = temp.filter(
          (item) =>
            item.location &&
            locations[j] &&
            item.location.address === locations[j].address
        );
        temp = temp.filter(
          (item) =>
            item.location &&
            locations[j] &&
            item.location.address !== locations[j].address
        );
        result.push({ location: locations[j], workers: wks });
      }

      // Filter worker without location
      const wokerWithoutLocation = temp.filter(
        (item) => !item.location.address
      );
      if (wokerWithoutLocation.length > 0) {
        result.push({
          location: { location: '' },
          workers: wokerWithoutLocation,
        });
        temp = temp.filter((item) => item.location.address);
      }

      // Filter worker with same location
      for (let i = 0; i < temp.length; i++) {
        const wks = temp.filter(
          (item) => item.location.address === temp[i].location.address
        );
        if (wks.length > 1) {
          result.push({ location: temp[i].location, workers: wks });
          temp = temp.filter(
            (item) => item.location.address !== temp[i].location.address
          );
        }
      }
      for (let i = 0; i < temp.length; i++) {
        result.push({ location: temp[i].location, workers: [temp[i]] });
      }
      console.log('result', result);
      this.setState({ groups: result });
    } else {
      // Filter worker without location
      const wokerWithoutLocation = temp.filter(
        (item) => !item.location.address
      );
      if (wokerWithoutLocation.length > 0) {
        result.push({
          location: { location: '' },
          workers: wokerWithoutLocation,
        });
        temp = temp.filter((item) => item.location.address);
      }

      // Filter worker with same location
      for (let i = 0; i < temp.length; i++) {
        const wks = temp.filter(
          (item) => item.location.address === temp[i].location.address
        );
        if (wks.length > 1) {
          result.push({ location: temp[i].location, workers: wks });
          temp = temp.filter(
            (item) => item.location.address !== temp[i].location.address
          );
        }
      }
      for (let i = 0; i < temp.length; i++) {
        result.push({ location: temp[i].location, workers: [temp[i]] });
      }
      this.setState({ groups: result });
    }
  };

  render() {
    const groups = this.state.groups;
    return (
      <Accordion expanded={true}>
        {groups.map((group, key) => {
          return (
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id={`panel1bh-header-${key}`}
              key={key}
            >
              <p>test</p>
            </AccordionSummary>
          );
        })}
        <AccordionDetails>
          <p>test</p>
        </AccordionDetails>
      </Accordion>
    );
  }
}

function mapStateToProps(state) {
  return {};
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateJobWorkers: (job_id, worker) =>
      dispatch(actions.JobsActions.updateJobWorkers(job_id, worker)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkersGroup);
