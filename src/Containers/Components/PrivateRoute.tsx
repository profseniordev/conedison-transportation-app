import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import authStore from '../../Stores/authStore';
import { CurrentLocation } from '../../Models/geoLocation';
import mapStore from '../../Stores/mapStore';

interface Props {
  component: any;
  path?: string;
  exact?: boolean;
  location?: any;
}

class PrivateRoute extends React.Component<Props> {
  componentDidMount(): void {
    navigator.geolocation.getCurrentPosition(function (position) {
      const currentLocation: CurrentLocation = {
        Longtitude: position.coords.longitude,
        Latitude: position.coords.latitude,
      };
      mapStore.setCurrentLocation(currentLocation);
    });
  }
  render() {
    const { component: Component, ...rest } = this.props;

    (window as any).prevLocation = this.props.location;

    return (
      <Route
        {...rest}
        render={(props) => {
          if (authStore.logged) {
            if (props.location.pathname === '/') {
              return <Redirect to="/job-grid" />;
            } else {
              return <Component {...props} />;
            }
          } else {
            return <Redirect to="/login" />;
          }
        }}
      />
    );
  }
}

export default PrivateRoute;
