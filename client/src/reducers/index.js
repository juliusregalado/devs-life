import { combineReducers } from 'redux';
import auth_reducer from './auth_reducer';
import errorReducer from './error_reducer';



export default combineReducers({
  auth: auth_reducer,
  errors: errorReducer
});