import { createStore, combineReducers, applyMiddleware } from 'redux';
import userReducer from '../reducers/user';
import courseReducer from '../reducers/courses';
import teacherReducer from '../reducers/teachers';
import studentReducer from '../reducers/students';
import thunk from 'redux-thunk';


export default () => {
  const store = createStore(
    combineReducers({
      user: userReducer,
      courses: courseReducer,
      teachers: teacherReducer,
      students: studentReducer
    }),
    applyMiddleware(thunk)
  );

  return store;
};