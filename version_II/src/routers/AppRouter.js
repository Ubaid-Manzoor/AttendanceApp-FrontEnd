import React , { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Authenticate from './Authenticate';


import Help from '../components/Help'
import _404Page from '../components/_404Page';
import Sidebar from '../components/Sidebar'
import Dashboard from '../components/Dashboard'
import LoginPage from '../components/LoginPage';
import SignUpPage from '../components/SignUpPage';
import AddStudentPage from '../components/AddStudentPage';
import AddTeacherPage from '../components/AddTeacherPage';
import AttendancePage from '../components/AttendancePage';
import MessagePage from '../components/MessagePage';
import AddCoursePage from '../components/AddCoursePage';
import ShowCoursesPage from '../components/ShowCoursesPage';
import ShowTeachersPage from '../components/ShowTeachersPage';
import AddDepartmentPage from '../components/AddDepartmentPage';
import EnrollToCoursePage from '../components/EnrollToCoursePage';
import ShowAttendancePage from '../components/showAttendancePage';


/**
 * Authenticate is a HOC which take input a Component
 * and will render it only if requiredRole match the role of 
 * user currently loginIn.
 */


const AuthHelp = Authenticate(Help)
const AuthAttendance = Authenticate(AttendancePage)
const AuthMessage = Authenticate(MessagePage)
const AuthAddTeacher = Authenticate(AddTeacherPage)
const AuthAddStudent = Authenticate(AddStudentPage)
const AuthAddCourse = Authenticate(AddCoursePage)
const AuthShowTeachers = Authenticate(ShowTeachersPage)
const AuthShowCourses = Authenticate(ShowCoursesPage)
const AuthAddDepartment = Authenticate(AddDepartmentPage)
const AuthEnrollCourse = Authenticate(EnrollToCoursePage)

class AppRouter extends Component{

  

  render() {
    return (
      <BrowserRouter>
        <div className="fullBody">
          <Sidebar />
          <Switch>
            <Route 
              path="/" 
              component={Dashboard} exact={true} />
            >
            <Route 
              path="/login" 
              component={LoginPage} 
            />
            <Route 
              path="/signup" 
              component={SignUpPage} />
            <Route 
              path="/help" 
              render={ (routeProps)=>(< AuthHelp requiredRole="teacher" {...routeProps} />) } 
            />
            <Route 
              path="/attendance" 
              render={ (routeProps)=>(< AuthAttendance requiredRole="teacher" {...routeProps} />) } 
            />
            <Route 
              path="/message" 
              render={ (routeProps)=>(< AuthMessage requiredRole="admin" {...routeProps} />) } 
            />
            <Route 
              path="/addTeacher" 
              render={ (routeProps)=>(< AuthAddTeacher requiredRole="admin" {...routeProps} />) } 
            />
            <Route 
              path="/addStudent" 
              render={ (routeProps)=>(< AuthAddStudent requiredRole="admin" {...routeProps} />) } 
            />
            <Route 
              path="/addCourse" 
              render={ (routeProps)=>(< AuthAddCourse requiredRole="admin" {...routeProps} />) } 
            />
            <Route 
              path="/showTeachers" 
              render={ (routeProps)=>(< AuthShowTeachers requiredRole="admin" {...routeProps} />) } 
            />
            <Route 
              path="/showCourses" 
              render={ (routeProps)=>(< AuthShowCourses requiredRole="admin" {...routeProps} />) } 
            />
            <Route 
              path="/department" 
              render={ (routeProps)=>(< AuthAddDepartment requiredRole="admin" {...routeProps} />) } 
            />
            <Route 
              path="/enroll" 
              render={ (routeProps)=>(< AuthEnrollCourse requiredRole="student" {...routeProps} />) } 
            />
            <Route
              path="/showAttendance"
              component={ShowAttendancePage}
            />
            <Route 
              component={ _404Page } 
            />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default AppRouter;