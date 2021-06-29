import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import getRootReducer from './Services/reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import { init } from './Services/app/actions';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

const sagaMiddleware = createSagaMiddleware();

const address = `${
  process.env.REACT_APP_NOTIFICATIONS_ADDRESS || '127.0.0.1:7777'
}`;
let socket = io(address, {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionDelayMax: 500,
  reconnectionAttempts: Infinity,
  transports: ['websocket'],
  secure: true,
});
function optimisticExecute(action, emit, next, dispatch) {
  emit(action.type, action);
  next(action);
}

let socketIoMiddleware = createSocketIoMiddleware(socket, ['server/', 'auth'], {
  execute: optimisticExecute,
});

const middlewares = [thunk, sagaMiddleware, socketIoMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger({ collapsed: true });
  middlewares.push(logger);
}

const enhancers = [applyMiddleware(...middlewares)];

const store = createStore(getRootReducer(), compose(...enhancers));

socket.on('unauthorized', function (error) {
  if (
    error.data.type === 'UnauthorizedError' ||
    error.data.code === 'invalid_token'
  ) {
    // redirect user to login page perhaps?
    console.log('Users token has expired');
  }
});
socket.on('reconnect', () => {
  console.log('SOCKET: reconnect');
  store.dispatch({ type: 'authenticate', token: store.getState().app.token });
});
socket.on('reconnect_attempt', () => {
  console.log('SOCKET: reconnect_attempt');
  socket.io.opts.transports = ['websocket'];
});
socket.on('notifications', (data) => {
  store.dispatch({ type: 'socket.notifications', data: data });
});
socket.on('jobUpdated', (data) => {
  store.dispatch({ type: 'socket.jobUpdated', data: data });
});

sagaMiddleware.run(rootSaga);

store.dispatch(init());

export default store;
