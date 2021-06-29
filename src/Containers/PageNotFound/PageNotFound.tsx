import React, { Component } from 'react';
import { Box, Typography } from '@material-ui/core';
import Button from '../../components/Button/Button';
import './PageNotFound.scss';
import NotFoundImg from '../../Assets/icons/404.svg';
import history from '../../history';

class PageNotFound extends Component<any> {
  // constructor(props) {
  //   super(props);
  // }

  goBack = () => {
    history.goBack();
  };

  render() {
    return (
      <>
        <Box className="not-found-page">
          <Box textAlign="center" mt={4}>
            <img src={NotFoundImg} alt="" />
            <Box textAlign="center">
              <Typography className="title" variant="h5">
                Page not found!
              </Typography>
              <Typography
                className="description"
                variant="body2"
                color="textSecondary"
              >
                Page not found. Contact your administrator
              </Typography>
            </Box>
            <Box mt={3}>
              <Button
                color={'dark'}
                width={'158px'}
                borderRadius={'20px'}
                textTransform={false}
                onClick={this.goBack}
              >
                Go Back
              </Button>
            </Box>
          </Box>
        </Box>
      </>
    );
  }
}

export default PageNotFound;
