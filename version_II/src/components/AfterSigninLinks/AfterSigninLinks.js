import React, {Component} from 'react'
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import './_afterSigninLinks.scss'
import logout from '../../helperFunction/logout';

import { getRoleFromCookie } from '../../helperFunction/getCookie';
 

class AfterSigninLinks extends Component{
  render(){
    const userRole = getRoleFromCookie();
    return(
      <div className="after-signin-nav">
        <div className="user-profile-div">
            <a href="/" className="user-image">
              <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53474/atom_profile_01.jpg" alt="User"/>
            </a>
            <p className="username">Ubaid Manzoor</p>
        </div>
        <div className="sidepane-nav">
          <div className='navigation'>
            { userRole === 'student' && 
              <React.Fragment>
                <Link to="/enroll" className='navigation-item'>Enroll To Course</Link>
                <Link to="/showAttendance" className='navigation-item'>Show Attendance</Link>
                {/* <Link to="/attendance" className='navigation-item'>Attendance</Link> */}
              </React.Fragment>
            }
            { 
              userRole === 'teacher' &&
              <React.Fragment>
                <Link to="/attendance" className='navigation-item'>Attendance</Link>
                <Link to="/showAttendance" className='navigation-item'>Show Attendance</Link>
                <Link to="/message" className="navigation-item">Message</Link>
              </React.Fragment>
            }
            {
              userRole === 'admin' && 
              <React.Fragment>
                <Link to="/department" className="navigation-item">Add Department</Link>
                <Link to="/addCourse" className="navigation-item">Add Course</Link>
                <Link to="/addTeacher" className="navigation-item">Add Teacher</Link>
                <Link to="/addStudent" className="navigation-item">Add Student</Link>
                <Link to="/showTeachers" className="navigation-item">Show Teachers</Link>
                <Link to="/showCourses" className="navigation-item">Show Courses</Link>
                <Link to="/message" className="navigation-item">Message</Link>
              </React.Fragment>
            }
            <a href="/" className='navigation-item' onClick={logout}>Logout</a>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    username: state.user.username,
    userRole: state.user.role
  }
}

export default connect(mapStateToProps)(AfterSigninLinks);  