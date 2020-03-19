import { createStore, combineReducers, applyMiddleware } from 'redux';
import userReducer from '../reducers/user';
import courseReducer from '../reducers/course';
import thunk from 'redux-thunk';


export default () => {
  const store = createStore(
    combineReducers({
      user: userReducer,
      course: courseReducer
    }),
    applyMiddleware(thunk)
  );

  return store;
};