import { createStore, combineReducers, applyMiddleware } from 'redux';
import userReducer from '../reducers/user';
import courseReducer from '../reducers/courses';
import thunk from 'redux-thunk';


export default () => {
  const store = createStore(
    combineReducers({
      user: userReducer,
      courses: courseReducer
    }),
    applyMiddleware(thunk)
  );

  return store;
};