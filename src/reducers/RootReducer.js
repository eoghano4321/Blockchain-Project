// reducers/index.js
import { combineReducers } from 'redux';
import userReducer from './UserReducer';

const RootReducer = combineReducers({
  user: userReducer,
  // add more reducers for additional slices
});

export default RootReducer;
