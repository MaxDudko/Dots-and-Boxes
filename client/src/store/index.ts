import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import createSagaMiddleware from 'redux-saga';
import { reducers, ReduxState } from './reducers';
import rootSaga from './sagas/index';

const sagaMiddleware = createSagaMiddleware();

// const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__();
const devTools = process.env.NODE_ENV === 'development' ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : null;

const middlewares = composeWithDevTools(
  applyMiddleware(sagaMiddleware),
);

export const store = createStore<ReduxState, any, any, any>(reducers, middlewares);

sagaMiddleware.run(rootSaga);
