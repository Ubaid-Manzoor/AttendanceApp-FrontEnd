import React , { Component } from 'react';
import { connect } from 'react-redux';

import { getAndSetTeachers } from '../../actions/teachers';
import getAndSetCourses from '../../actions/courses';
import { getUsernameFromCookie } from '../../helperFunction/getCookie';
import StudentComponent from './StudentComponent';

import './_attendancePage.scss';


class AttendancePage extends Component{
    constructor(props){
        super(props);        
        this.state = {
            isFetching: false,
            FetchingTime : 100 ,
            Data: {
                classImage: undefined,
                courseData: {}
            },
            errorsExists: false,
            errors:{
                fileError: "",
                otherError: ""
            },
            messages: ""
        }
    }
    
    onFileInputChange = (e) => {
        const value = e.target.files[0];
        this.setState((prevState)=>{
            return {
                Data: {
                    ...prevState.Data,
                    classImage:value
                }
            }
        })
        
    }
    
    onInputChange = (e)=>{
        const value = e.target.value;
        const currentSelectedCourse = this.props.courses.filter(course => course.name === value)[0]
        const { department } = this.props.teachers[0];
        const { name, semester } = currentSelectedCourse;

        this.setState((prevState)=>{
            return {
                Data: {
                    ...prevState.Data, 
                    courseData: {
                        name,
                        department,
                        semester
                    }
                 }
            }
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
            roll_no: "",
            otherError: ""
        })
        this.setState({errorsExists: false});
    }

    
    applyAuthentication(Data){
        const { classImage } = Data

        if(classImage === undefined){
            this.setErrors({fileError: "Upload a File"})
        }
    }

    waitTillStateChange(callback){
        this.setState(state => state,()=>{
            callback()
            }
        )
    }


    makeRequest = () =>{
        let formData = new FormData();
        const { classImage, courseData }  = this.state.Data;

        formData.append('file', classImage)
        formData.append("courseData",JSON.stringify(courseData));
        
        this.applyAuthentication(this.state.Data);

        // SETSTATE IS ASNC FUNCTION SO WE NEED TO WAIT UNTILL 
        //ALL SETSTATE ARE DONE CHANGING STATE
        this.waitTillStateChange(()=>{    
            if(!this.state.errorsExists){
                fetch('http://localhost:5000/initiate_attendence',{
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(response => {
                        const { message , status } = response.result;
                        if(response.status === 200){
                            switch(status){
                                case 201:
                                    console.log(message)
                                    this.setState(prevState => ({
                                        messages: message
                                    }))
                                    break;
                                case 400:
                                    console.log(message)
                                    this.setState(prevState => ({
                                        messages: message
                                    }))
                                    break
                                    default:
                                        break
                                    }
                        }
                })
                this.props.setCourses();
            }
        })
    }
    
    getCurrentStudentAttendance = () => {
        const relatedCourses = this.state.relatedCourses;
        const currentCourseName = this.state.Data.courseData.name;
        const AttendanceArray = relatedCourses.filter(course => course.name === currentCourseName)[0]['attendance']
        // GET TODAYS DATE
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        let todaysAttendance;

        /// fall to catch if attendance not done yet
        try{
            todaysAttendance = AttendanceArray.filter(attendance => attendance.date === today )[0]['attendance_on_date']
        }catch{
            todaysAttendance = false;
        }
        this.setState({todaysAttendance},()=> console.log(this.state))
    }
    
    onSubmit = (e)=>{
        e.preventDefault();

        // CLEAR ALL EXISTING ERROR TO START NEW
        this.clearAllErrors();

        // MAKE REQUEST TO MAKE ATTENDANCE
        this.makeRequest() 

        // DISPLAY ATTENDANCE AFTER IT IS DONE
        this.getCurrentStudentAttendance()
    }


    componentDidMount = ()=>{
        
        // CREATE TEACHER FILTERS & PEOJECTION FOR BACKEND USE
        const teacherFilters = {
            "username": getUsernameFromCookie()
        }
        const teacherProjection = {
            "name": true,
            "department": true
        }
        
        // Request will be made to backend with filters & projection 
        //to get current Teacher
        this.props.setTeachers(teacherFilters,teacherProjection) //WILL RETURN A PROMISE
        .then(() =>{
            const { name, department } = this.props.teachers[0]

        // CREATE COURSE FILTERS & PEOJECTION FOR BACKEND USE

            const courseFilters = {
                "teacherAssigned": name,
                "department": department
            }
            const courseProjection = {}
            
            // Request will be made to backend with filter & projection 
            //to get course assigned to current Teacher
            this.props.setCourses(courseFilters,courseProjection) //WILL RETURN A PROMISE
            .then(()=>{
                const relatedCourses = this.props.courses;
                if(relatedCourses){
                    this.setState(prevState =>{
                            return {
                                isFetching: true,
                                relatedCourses,
                                Data: {
                                    ...prevState.Data,
                                    courseData : {
                                        "name" : relatedCourses[0]['name'],
                                        "department" : relatedCourses[0]['department'],
                                        "semester" : relatedCourses[0]['semester']
                                    }
                                }
                            }
                        })

                        // Show the attendance if already done
                        this.getCurrentStudentAttendance();
                }
            })
        })
    }
    
    render() {
    if(!this.state.isFetching){
        return (
            <div className="Enroll_MainBody sidePage">
                <div className="Enroll_Container">
                    <div className="Enroll_FormContainer">
                        <header>
                            <h1>Attendance</h1>
                        </header>
                        <form>
                            <div>
                                <p>Fetching ....</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }else{
        return (
            <div className="Enroll_MainBody sidePage">
                <div className="Enroll_Container">
                    <div className="Enroll_FormContainer">
                        <header>
                            <h1>
                                Attendance
                            </h1>
                        </header>
                        {this.state.messages && <span className="confirmationMessage">{this.state.messages}</span>}
                        {this.state.errors.courseExist && <span className="errorMessage">{this.state.errors.courseExist}</span>}
                        <form onSubmit={this.onSubmit} encType="multipart/form-data">
                            <div>
                                <label className="Label" htmlFor="course">Course</label>
                                <div className="selectDiv">
                                    <select 
                                        id="course"
                                        name="course"
                                        onChange={this.onInputChange}
                                    >
                                        {
                                            this.state.relatedCourses.map( course =>{
                                                const { name } = course
                                                return <option key={name} value={name}>{name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="name"
                                >
                                    Upload Image
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="file"
                                            id="classImage"
                                            placeholder=""
                                            onChange={this.onFileInputChange}
                                        />
                                    </div>
                                    {this.state.errors.fileError && <span className="errorMessage">{this.state.errors.fileError}</span>}
                                </div>
                            </div>
                            <button className="Button">
                                make Attendance
                            </button>
                        </form>
                    </div>
                </div>
                <div className="student_ListBlock">
                <header>
                    <h2> All Students </h2>
                </header>
                {this.state.todaysAttendance && 
                    <div className="student_MainContainer">
                        <ol>
                            {
                                this.state.todaysAttendance.map(attendance =>{
                                    const {roll_no, status} = attendance
                                    return <li 
                                            key={roll_no}>
                                                <StudentComponent 
                                                    roll_no={roll_no}
                                                        status={status}
                                                    />
                                            </li>
                                })
                            }
                        </ol>
                    </div>
                }
            </div>
            </div>
        )
    }
    }
}

const mapStateToProps = (state)=>{
    return {
        teachers: state.teachers,
        courses: state.courses
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setTeachers : (filters={},projection) => dispatch(getAndSetTeachers(filters,projection)),
        setCourses : (filters={},projection={}) => dispatch(getAndSetCourses(filters,projection))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AttendancePage);