import {createStore} from 'redux';
import appStore from './reducers';

const configureStore=()=>{
  const store= createStore(appStore);
  return store;
};

export default configureStore;
