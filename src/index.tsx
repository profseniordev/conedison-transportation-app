import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
// import { index } from './Stores/index';
import { getDeviceType } from './Utils/Common';
import store from './createStore';
import AppContext from './AppContext';
import history from './history';

(window as any).deviceType = getDeviceType();

ReactDOM.render(
    <AppContext.Provider value={{}}>
          <Provider store={store}>
            <Router history={history}>
              <App />
            </Router>
          </Provider>
    </AppContext.Provider>
  ,
  document.getElementById('root'));

serviceWorker.unregister();
