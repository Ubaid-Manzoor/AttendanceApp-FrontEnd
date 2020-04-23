import { createStore, combineReducers, applyMiddleware } from 'redux';
import userReducer from '../reducers/user';
import courseReducer from '../reducers/courses';
import teacherReducer from '../reducers/teachers';
import studentReducer from '../reducers/students';
import departmentReducer from '../reducers/department';
import attendanceReducer from '../reducers/attendance';
import thunk from 'redux-thunk';


export default () => {
  const store = createStore(
    combineReducers({
      user: userReducer,
      courses: courseReducer,
      teachers: teacherReducer,
      students: studentReducer,
      departments: departmentReducer,
      attendance: attendanceReducer
    }),
    applyMiddleware(thunk)
  );

  return store;
};