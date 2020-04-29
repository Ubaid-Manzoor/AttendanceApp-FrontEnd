import React , { Component } from 'react';
import { connect } from 'react-redux';

import { getAndSetStudents } from '../../actions/students';
import { getAndSetTeachers } from '../../actions/teachers';
import getAndSetAttendance from '../../actions/attendance';
import getAndSetCourses from '../../actions/courses';
import handleSubmit from '../../genericFunctions/handleSubmit';
import clearMessage from '../../genericFunctions/clearMessage';
import setInputState from '../../genericFunctions/setInputState';

import { getRoleFromCookie, getUsernameFromCookie } from '../../helperFunction/getCookie';
import './_showAttendancePage.scss';

class ShowAttendance extends Component{

    constructor(){
        super();
        this.state = {
            courses: [],
            data: {},
            errors: {},
            errorsExists : false,
            status: "notReady"
        }

    }

    onInputChange = (e)=>{
        const value = e.target.value;
        const name = e.target.id;

        /**
         * We need to make sure table should not render 
         * until setAttendance is called and done
         */

         console.log(value,name)
        this.setState({status: "notReady"})

        setInputState.call(this,"data",name,value)
        .then(()=>{
            this.props.setAttendance(this.state.data)
            .then(()=>{
                this.setState({status: "ready"})
            })
        })
    }

    setErrors = (toUpdate)=>{
        this.setState((prevState) =>{
            return {
                errors:{
                    ...prevState.errors,
                    ...toUpdate
                }
            }
        })
        this.setState({errorsExists: true});
    }

    clearAllErrors = ()=>{
        this.setErrors({
            course: ""
        })
        this.setState({errorsExists: false});
    }

    applyAuthentication(){
        const data = this.state.data; 
        return new Promise((resolve, reject)=>{
            if(data.course === undefined){
                this.setErrors({course: "Not Enrolled in any Course!"})
                reject();
            }else{
                resolve();
            }
        })
    }

    setDefaultFilters = ()=>{
        const date = new Date();
        return new Promise((resolve, reject)=>{
            this.setState((prevState)=>{
                const role = getRoleFromCookie();
                if(role === 'student'){
                    return {
                        ...prevState,
                        data: {
                            all_or_one: "one",
                            course: this.state.courses[0],
                            month: date.getMonth(),
                            department: this.props.students[0]['department'],
                            semester: this.props.students[0]['semester'],
                            roll_no: this.props.students[0]['roll_no'],
                            role
                        }
                    }
                }else{
                    return {
                        ...prevState,
                        data: {
                            all_or_one: "all",
                            course: this.state.courses[0],
                            month: date.getMonth(),
                            department: this.props.teachers[0]['department'],
                            teacherAssigned : this.props.teachers[0]['name'],
                            role
                        }
                    }
                }
            },resolve)
        })
    }

    handleResponse = (response)=>{
        const {message, data , status } = response.result;

        if(response.status === 200){
            switch(status){
                case 200:
                    // this.setState({
                    //     message
                    // },clearMessage.bind(this,3000))
                    console.log(data);
                    break;
                case 409:
                    this.setErrors({
                        exists:message
                    })
                    break;
                case 400:
                    this.setErrors({
                        otherError: message
                    })
                    break;
                default:
                    break
            }
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
                roll_no: true,
                department: true,
                semester: true
            }

            /**
             * Set the Student using Filter and Projection
             */
            this.props.setStudent(filter, projection)
            .then(()=>{
                /**
                 * Set the Course That Student is EnrolledIn.
                 */
                const coursesEnrolled = this.props.students[0]['courseEnrolled'] 
                                                                                ? 
                                                                                this.props.students[0]['courseEnrolled'] 
                                                                                : [] 
                this.setState((prevState)=>{
                    return {
                        ...prevState,
                        courses : [].concat(coursesEnrolled)
                    }
                },()=>{
                    this.setDefaultFilters()
                    /**
                     * When Default State is Set ,
                     * First make sure there is not Error
                     * Then :-make the request to 
                     * get the attendance for default filters
                     */
                    .then(()=>this.applyAuthentication())
                    .then(()=>{
                        this.props.setAttendance(this.state.data)
                        .then(()=>{
                            this.setState({status: "ready"})
                            console.log(this.props.attendance);
                        })
                    })
                    .catch(()=>{
                        console.log(this.state);
                    })
                })
            })
        }else if(usersRole === "teacher"){
            const filter = {
                username : getUsernameFromCookie()
            }
            const projection = {
                courseAssigned: true,
                department: true,
                name: true
            }

            /**
             * Set the Teacher using Filter and Projection
             */
            this.props.setTeacher(filter, projection)
            .then(()=>{
                /**
                 * Set the Course That Teacher is Assigned To.
                 */
                const courseAssigned = this.props.teachers[0]['courseAssigned'] 
                                                                                ? 
                                                                                this.props.teachers[0]['courseAssigned'] 
                                                                                : [] 
                this.setState((prevState)=>{
                    return {
                        ...prevState,
                        courses : [].concat(courseAssigned)
                    }
                },()=>{
                    this.setDefaultFilters()
                    /**
                     * When Default State is Set ,
                     * First make sure there is not Error
                     * Then :-make the request to 
                     * get the attendance for default filters
                     */
                    .then(()=>this.applyAuthentication())
                    .then(()=>{
                        this.props.setAttendance(this.state.data)
                    })
                    .catch(()=>{
                        console.log(this.state);
                    })
                })
            })
        }
    }

    render(){
        const date = new Date();
        const currentMonth = date.getMonth();
        const months = ['January', 'February', 'March', 
                        'April', 'May', 'June', 'July', 
                        'August', 'September', 'October', 
                        'November', 'December'];
        const attendance = this.props.attendance;
        
        return (
            <React.Fragment>
                <div className="MainBody SidePage ShowAttendanceMainPage">
                    {this.state.errors.course && <p className="errorMessage">{this.state.errors.course}</p>}
                    <div className="Container ShowAttendanceContainer">
                        <div className="AttendanceContainer">
                            <header>
                                <div className="filterDiv">
                                    {
                                        getRoleFromCookie() === "student" &&
                                        <div className="">
                                            <select
                                                id="all_or_one"
                                                name="all_or_one"
                                                value={this.state.data.all_or_one}
                                                onChange={this.onInputChange}
                                            >
                                                <option value="one">One</option>
                                                <option value="all">All</option>
                                            </select>
                                        </div>
                                    }
                                    <div className="">
                                        <select
                                            id="course"
                                            name="course"
                                            value={this.state.data.course}
                                            onChange={this.onInputChange}
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
                                            value={this.state.data.month}
                                            onChange={this.onInputChange}
                                        >
                                            <option value={currentMonth} > {months[currentMonth]} </option>
                                            <option value={(currentMonth - 1 + 12) % 12} > {months[ (currentMonth - 1 + 12) % 12 ]} </option>
                                            <option value={(currentMonth - 2 + 12) % 12} > {months[ (currentMonth - 2 + 12) % 12 ]} </option>
                                            <option value={(currentMonth - 3 + 12) % 12} > {months[ (currentMonth - 3 + 12) % 12 ]} </option>
                                            <option value={(currentMonth - 4 + 12) % 12} > {months[ (currentMonth - 4 + 12) % 12 ]} </option>
                                            <option value={(currentMonth - 5 + 12) % 12} > {months[ (currentMonth - 5 + 12) % 12 ]} </option>
                                        </select>
                                    </div>
                                </div>
                            </header>
                            <main>
                                <div className="container">
                                    {
                                        this.state.data['all_or_one'] === "one" && this.state.status === 'ready'

                                        ?      /**
                                                    FOR SINGLE STUDENT
                                                */                                  
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th> Roll No </th>
                                                        {

                                                            attendance[Object.keys(attendance)[0]] ? attendance[Object.keys(attendance)[0]].map(data =>{
                                                                return <th key={data.day}>{data.day}</th>
                                                            })
                                                            :
                                                            <th>Days...</th>
                                                        }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {Object.keys(attendance)[0] && <td>{Object.keys(attendance)[0]}</td>}
                                                        {
                                                            attendance[Object.keys(attendance)[0]] && attendance[Object.keys(attendance)[0]].map(data =>{
                                                                return <td key={data.day}>{data.present ? "P" : 'A'}</td>
                                                            })
                                                        }
                                                    </tr>
                                                </tbody>
                                            </table>

                                        :   /**
                                                FOR FULL CLASS
                                            */
                                           <table>
                                                <thead>
                                                    <tr>
                                                        <th> Roll No </th>
                                                        <th> Classes Attended </th>
                                                        <th> Total Classes </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        Object.keys(attendance).map(roll_no =>{
                                                            return <tr key={roll_no}>
                                                                        <td>{roll_no}</td>
                                                                        <td>{attendance[roll_no]['totalClassesAttended']}</td>
                                                                        <td>{attendance[roll_no]['totalClasses']}</td>
                                                                    </tr>
                                                        })
                                                    }
                                                    
                                                </tbody>
                                            </table>
                                    }
                                    
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
        courses : state.courses,
        attendance : state.attendance
    }
}   

const mapDispatchToProps = (dispatch)=>{
    return {
        setStudent : (filter, projection)=> dispatch(getAndSetStudents(filter, projection)),
        setTeacher : (filter, projection)=> dispatch(getAndSetTeachers(filter, projection)),
        setAttendance : (filters)=> dispatch(getAndSetAttendance(filters)),
        SetCourses : (filter, projection)=> dispatch(getAndSetCourses(filter, projection))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowAttendance);
