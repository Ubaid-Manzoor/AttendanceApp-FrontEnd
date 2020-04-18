import React , { Component } from 'react';
import { connect } from 'react-redux';

import { getAndSetStudents } from '../../actions/students';
import { getAndSetTeachers } from '../../actions/teachers';
import getAndSetCourses from '../../actions/courses';

import { getRoleFromCookie, getUsernameFromCookie } from '../../helperFunction/getCookie';
import './_showAttendancePage.scss';

class ShowAttendance extends Component{

    constructor(){
        super();

        

        this.state = {
            courses: []
        }
    }

    componentDidMount = ()=>{

        const usersRole = getRoleFromCookie();
        if(usersRole === 'student'){
            const filter = {
                username : getUsernameFromCookie()
            }
            const projection = {
                courseEnrolled: true,
                roll_no: true
            }
            this.props.setStudent(filter, projection)
            .then(()=>{
                console.log(this.props.students);
                this.setState((prevState)=>{
                    return {
                        ...prevState,
                        courses : [].concat(this.props.students[0]['courseEnrolled'])
                    }
                })
            })
        }else if(usersRole === "teacher"){
            this.props.setTeacher()
        }
    }

    render(){
        const date = new Date();
        const currentMonth = date.getMonth();
        const months = ['January', 'February', 'March', 
                        'April', 'May', 'June', 'July', 
                        'August', 'September', 'October', 
                        'November', 'December'];
        
        return (
            <React.Fragment>
                <div className="MainBody SidePage">
                    <div className="Container ShowAttendanceContainer">
                        <div className="AttendanceContainer">
                            <header>
                                <div className="filterDiv">
                                    <div className="">
                                        <select
                                            id="all_or_one"
                                            name="all_or_one"
                                            // value=""
                                            // onChange=""
                                        >
                                            <option value="One">One</option>
                                            <option value="All">All</option>
                                        </select>
                                    </div>
                                    <div className="">
                                        <select
                                            id="course"
                                            name="course"
                                            // value=""
                                            // onChange=""
                                        >
                                            {   !!this.state.courses &&
                                                this.state.courses.map(course => {
                                                    return <option key={course} value={course}>{course}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="">
                                        <select
                                            id="month"
                                            name="month"
                                            // value=""
                                            // onChange=""
                                        >
                                            <option value={currentMonth} > {months[currentMonth]} </option>
                                            <option value={currentMonth - 1} > {months[ (currentMonth - 1 + 12) % 12 ]} </option>
                                            <option value={currentMonth - 2} > {months[ (currentMonth - 2 + 12) % 12 ]} </option>
                                            <option value={currentMonth - 3} > {months[ (currentMonth - 3 + 12) % 12 ]} </option>
                                            <option value={currentMonth - 4} > {months[ (currentMonth - 4 + 12) % 12 ]} </option>
                                            <option value={currentMonth - 5} > {months[ (currentMonth - 5 + 12) % 12 ]} </option>
                                        </select>
                                    </div>
                                </div>
                            </header>
                            <main>
                                <div className="container">
                                    {/* <table>
                                        <tr>
                                            <th>Roll No</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </table> */}
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state)=> {
    return {
        students : state.students,
        teachers : state.teachers,
        courses : state.courses
    }
}   

const mapDispatchToProps = (dispatch)=>{
    return {
        setStudent : (filter, projection)=> dispatch(getAndSetStudents(filter, projection)),
        setTeacher : (filter, projection)=> dispatch(getAndSetTeachers(filter, projection)),
        SetCourses : (filter, projection)=> dispatch(getAndSetCourses(filter, projection))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowAttendance);
