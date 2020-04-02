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
        
        this.props.setTeachers({
            "username": getUsernameFromCookie()
        },{
            "name": true,
            "department": true
        })
        .then(() =>{
            console.log(this.props.teachers)
            const { name, department } = this.props.teachers[0]
            this.props.setCourses({
                "teacherAssigned": name,
                "department": department
            },{

            })
            .then(()=> console.log(this.props.courses))
        })
        .catch(error => {
            console.log(error);
        })
        
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
        // const name = e.target.id;
        const value = e.target.value;
        const { name:teachersName , department } = this.state.currentTeacher; 
        const relatedCourses = this.getTeacherRelatedCourses(department, teachersName)
        
        const currentSelectedCourse = relatedCourses.filter(course => course.name === value)[0]

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
        const todaysAttendance = AttendanceArray.filter(attendance => attendance.date === today )[0]['attendance_on_date']

        this.setState({todaysAttendance},()=> console.log(this.state))
    }
    
    onSubmit = (e)=>{
        e.preventDefault();
        this.clearAllErrors();
        this.makeRequest() 

        /// ATTENDANCE IS DONE
        this.getCurrentStudentAttendance()
    }
    
    getCurrentTeacher = ()=>{
        const listOfTeachers = this.props.teachers;
        const currentLoggedInUsername = getUsernameFromCookie();
        return listOfTeachers.filter(teacher => {
            return teacher.username === currentLoggedInUsername
        })[0]
    }

    getTeacherRelatedCourses = (department, teachersName) => {
        const listOfCourses = this.props.courses;
        return listOfCourses.filter(course => {
            return course.department === department && course.teacherAssigned === teachersName
        })
    }

    componentDidMount = ()=>{
        let currentTeacher = this.getCurrentTeacher();
        
        this.timer = setInterval( () => {
            currentTeacher = this.getCurrentTeacher();
            this.setState(prevState => {
                return {
                    currentTeacher
                }   
            },()=>{
                if(this.state.currentTeacher){
                    const relatedCourses = this.getTeacherRelatedCourses(this.state.currentTeacher.department, this.state.currentTeacher.name);
                    console.log(relatedCourses)
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
                            },
                            ()=> console.log(this.state)
                        )
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                }
            })
        },this.state.FetchingTime)
    }
    
    render() {
    if(!this.state.isFetching){
        return (
            <div className="Enroll_MainBody sidePage">
                <div className="Enroll_Container">
                    <div className="Enroll_FormContainer">
                        <header>
                            <h1>Add Course</h1>
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
                                Enroll<span>({this.state.currentTeacher.roll_no})</span>
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