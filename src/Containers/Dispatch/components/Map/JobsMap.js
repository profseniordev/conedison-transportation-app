import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactMapboxGl, {
  Layer,
  Feature,
  Popup,
  MapContext,
} from 'react-mapbox-gl';
import workerImage from '../../../../Assets/map/worker-image.png';
import jobImage from '../../../../Assets/map/ellipse.png';
import 'mapbox-gl/dist/mapbox-gl.css';
import DetailsPopup from '../DetailsPopup';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
ReactMapboxGl.workerClass = MapboxWorker.default;

const MAPBOX_TOKEN =
  'pk.eyJ1IjoibGFjdXN0ZWNoIiwiYSI6ImNqM3p5djBnaDA2YmsycXA4aGhuM2lvejMifQ.dL2fI1F87JZo1VZiWP3HTQ';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
ReactMapboxGl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const Mapbox = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN,
  trackResize: true,
});

const driversLayout = {
  'icon-image': 'workerImg',
  'icon-size': 1,
  'icon-padding': 1,
  'icon-allow-overlap': true,
  'icon-rotate': { type: 'identity', property: 'rotation' },
  'icon-rotation-alignment': 'auto',
  'text-font': ['Lato Black'],
  'text-padding': 20,
  'text-anchor': 'top',
  'text-offset': [0, -6],
  'text-size': 10,
  'text-allow-overlap': true,
  'text-field': { type: 'identity', property: 'title' },
  'text-justify': 'center',
  'icon-offset': [0, -22],
  'text-letter-spacing': 0.15,
};
const driverImage = new Image();
driverImage.src = workerImage;
const driversImages = ['workerImg', driverImage];

const jobLayout = {
  'icon-image': 'jobImg',
  'icon-size': 1,
  'icon-padding': 1,
  'icon-allow-overlap': true,
  'icon-rotate': { type: 'identity', property: 'heading' },
  'text-font': ['Lato Black'],
  'text-padding': 10,
  'text-anchor': 'top',
  'text-offset': [0, -1.5],
  'text-size': 15,
  'text-allow-overlap': true,
  'text-field': { type: 'identity', property: 'title' },
  'text-justify': 'center',
  'icon-offset': [0, -14],
  'text-letter-spacing': 0.15,
};
const jobLocImage = new Image();
jobLocImage.src = jobImage;
const jobImages = ['jobImg', jobLocImage];

function JobsMap({ workers, locationJob }) {
  const [center, setCenter] = useState([-73.935242, 40.73061]);
  const [driverData, setDriverData] = useState(null);

  const handlerJobClick = () => {
    setCenter([locationJob.locations[0].lon, locationJob.locations[0].lat]);
  };

  const handlerDriverClick = (data) => {
    setCenter(data.lngLat);

    const props = data.features[0].properties;

    const payload = {
      id: props.worker_id,
      coordinates: { lng: props.lon, lat: props.lat },
      worker: {
        id: props.worker_id,
        worker_name: props.name,
        phone_number: props.phone_number,
        status: props.status,
      },
    };
    setDriverData(payload);
  };

  const onToggleHover = (cursor, { map }) => {
    map.getCanvas().style.cursor = cursor;
  };

  const resizeMap = (map) => {
    map.resize();
  };

  const clearDriverData = () => {
    setDriverData(null);
  };

  useEffect(() => {
    if (locationJob) {
      setCenter(locationJob.locations[0]);
      setDriverData(null);
    }
  }, [locationJob]);

  return (
    <Mapbox
      style="mapbox://styles/lacustech/ckjm45r9l1inm1ao9gsyie64b?optimize=true"
      containerStyle={{ flex: 1 }}
      center={center}
      flyToOptions={{ speed: 0.8 }}
      onClick={clearDriverData}
    >
      <MapContext.Consumer>
        {(map) => {
          if (locationJob) {
            resizeMap(map);
          }
        }}
      </MapContext.Consumer>
      <Layer
        type="symbol"
        id="available_drivers"
        layout={driversLayout}
        images={driversImages}
      >
        {workers.length > 0 &&
          workers.map((worker, index) => (
            <Feature
              key={worker.id}
              onClick={handlerDriverClick.bind(worker)}
              onMouseEnter={onToggleHover.bind(this, 'pointer')}
              onMouseLeave={onToggleHover.bind(this, '')}
              coordinates={[worker.lon, worker.lat]}
              properties={{
                worker_id: worker.worker_id,
                name: worker.worker_name,
                phone_number: worker.phone_number,
                heading: '',
                title: worker.worker_name,
                rotation: 0,
                lon: worker.lon,
                lat: worker.lat,
                status: worker.status,
              }}
            />
          ))}
      </Layer>
      <Layer
        type="symbol"
        id="locations_jobs"
        layout={jobLayout}
        images={jobImages}
      >
        {locationJob && (
          <Feature
            coordinates={[
              locationJob.locations[0].lon,
              locationJob.locations[0].lat,
            ]}
            onClick={handlerJobClick}
            onMouseEnter={onToggleHover.bind(this, 'pointer')}
            onMouseLeave={onToggleHover.bind(this, '')}
            properties={{
              job_id: locationJob.id,
              address: locationJob.locations[0].address,
              title: locationJob.id,
            }}
          />
        )}
      </Layer>
      {driverData && (
        <Popup
          offset={{
            'top-left': [12, -38],
            top: [0, 0],
            'top-right': [-12, -38],
          }}
          anchor="top"
          coordinates={driverData.coordinates}
          closeOnClick={true}
        >
          <div className="details-popup">
            <DetailsPopup worker={driverData.worker} />
          </div>
        </Popup>
      )}
    </Mapbox>
  );
}

function mapStateToProps({ jobs }) {
  return {
    workers: jobs.location_job ? jobs.location_job.workers : [],
    locationJob: jobs.location_job,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobsMap);
