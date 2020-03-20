import { createStore, combineReducers, applyMiddleware } from 'redux';
import userReducer from '../reducers/user';
import courseReducer from '../reducers/courses';
import teacherReducer from '../reducers/teachers';
import thunk from 'redux-thunk';


export default () => {
  const store = createStore(
    combineReducers({
      user: userReducer,
      courses: courseReducer,
      teachers: teacherReducer
    }),
    applyMiddleware(thunk)
  );

  return store;
};