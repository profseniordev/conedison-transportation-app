import React, { useState } from 'react';
import { JobListItem, JobLocation } from '../../../Models/jobListItem';
//import JobPin from './jobPin.png';
import JobPin from './marker-gg.png';
import { InfoWindow, Marker } from 'react-google-maps';
import { formatDate, FORMATES } from '../../../Utils/Date';
import { JobType } from '../../../Constants/job';
import Button from '@material-ui/core/Button';
import history from '../../../history';
declare var google: any;

type IProps = {
  jobItem: JobListItem;
  position: JobLocation | { lat: number; lng: number };
  onJobClick?: Function;
};

const JobLocationMaker: React.FC<IProps> = ({
  jobItem,
  position,
  onJobClick,
}) => {
  const [isShow, setIsShow] = useState(false);
  const jobDate = formatDate(jobItem.requestTime, FORMATES.date);
  const jobTime = formatDate(jobItem.requestTime, FORMATES.time);
  const address =
    (jobItem.location ? jobItem.location.address : undefined) ||
    (jobItem.locations && jobItem.locations.length > 0
      ? jobItem.locations[0].address
      : '');

  let viewJob = () => {
    history.push(`/job/${jobItem.id}`);
  };
  let show = () => {
    setIsShow(true);
  };
  let close = () => {
    setIsShow(false);
  };

  return (
    <Marker
      position={position}
      icon={{ url: JobPin, scaledSize: new google.maps.Size(30, 50) }}
      onClick={show}
      onDblClick={viewJob}
    >
      {isShow && (
        <InfoWindow onCloseClick={close}>
          <div className="d-flex align-items-center">
            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <p style={{ margin: 0 }}>{JobType[jobItem.jobType]}</p>
                <p style={{ margin: 0 }}>{`${jobDate} ${jobTime}`}</p>
              </div>
              <div style={{ marginTop: 10 }}>{address}</div>
              <Button
                variant="outlined"
                onClick={viewJob}
                style={{ width: '100%', marginTop: 10 }}
              >
                View
              </Button>
            </div>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default JobLocationMaker;
