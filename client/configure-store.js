import {createStore, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import ReduxThunk from 'redux-thunk'
import appStore from './reducers';

const configureStore=()=>{
  const store= createStore(appStore, applyMiddleware(promiseMiddleware(),ReduxThunk));
  return store;
};

export default configureStore;
