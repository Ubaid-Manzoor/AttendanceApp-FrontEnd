import React , { Component } from 'react';
import { connect } from 'react-redux';

import { getAndSetTeachers } from '../../actions/teachers';
import getAndSetCourses from '../../actions/courses';
import { getUsernameFromCookie } from '../../helperFunction/getCookie';
import StudentComponent from './StudentComponent';

import setInputState from '../../genericFunctions/setInputState';
import clearMessage from '../../genericFunctions/clearMessage';

// import './_attendancePage.scss';


/**
 * NOTE :- 
 *  FOR THIS PAGE WE CANT USE ANY GENERIC FUNCTION 
 *  BCOZ HANDLING OF FILES IS DIFFERENT THAT SIMPLE DATA
 *  AND THEREFORE NEED DIFFERENT handleSubmit and makeReqeust
 */

class AttendancePage extends Component{
    constructor(props){
        super(props);        
        this.state = {
            isFetching: false,
            FetchingTime : 100 ,
            data: {
                image: undefined,
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

    //////////////////////////////////// INPUT HANDLERS ///////////////////////////////////////
    
    onFileInputChange = (e) => {
        const value = e.target.files[0];
        setInputState.call(this,"data","image",value)
    }

    getAndSetTeacherRelatedCourses = ()=>{
        const courseFilters ={
            teacherAssigned : this.props.teachers[0]['name']
        }
        const courseProjection = {}
        return this.props.setCourses(courseFilters, courseProjection);
    }
    
    onInputChange = (e)=>{
        const value = e.target.value;

        /* AT THIS POINT IT IS POSSIBLE COURSES IN THE STATE
        * IS JUST ONE COURSES WHICH WAS SELECTED WHILE MAKING ATTENDANCE
        * BCOZ WHEN WE MAKE ATTENDANCE WE JUST GET ATTENDANCE INFO OF A
        * SINGLE COURSE SO NOW WE ONLY HAVE DATA OF ONE COURSE IN STORE 
        * 
        * AND
        * 
        * => ON SWITCHING TO DIFFERENT COURSE 
        * WE FIRST NEED TO GET ALL THE COURSE AGAIN 
        */
       
        this.getAndSetTeacherRelatedCourses()
        .then(()=>{
            const currentSelectedCourse = this.props.courses.filter(course => course.name === value)[0]
            const { department } = this.props.teachers[0];
            const { name, semester } = currentSelectedCourse;
    
            setInputState.call(this,"data","courseData",{
                name,department,semester
            })
            .then(this.setTodaysAttendance)/* GET ATTENDANCE OF COURSE SELECTED IN DROP DOWN */
        })
        // console.log("run")
    }

    //////////////////////////////////// INPUT HANDLERS ENDS///////////////////////////////////////


    //////////////////////////////////// ERROR HANDLERS ///////////////////////////////////////


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
            fileError: "",
            otherError: ""
        })
        this.setState({errorsExists: false});
    }

    
    applyAuthentication(){
        const { image } = this.state.data;

        return new Promise((resovle,reject)=>{
            if(image === undefined){
                this.setErrors({fileError: "Upload a File"})
            }

            resovle();
        })

    }


    //////////////////////////////////// ERROR HANDLERS ENDS///////////////////////////////////////


    //////////////////////////////////// REQUEST RELATED FUNCTIONS ///////////////////////////////////////


    setTodaysAttendance = () => {
        const currentCourseName = this.state.data.courseData.name;
        /**
         *  We already have fetched the all related courses for the teacher
         * but still are making the request again because in the initial request
         * we dont get the attendance of course(bcoz it would have wasted the band-width)
         * now we only are fetch attendance of this course(which is selected) not for all of them
         */
        this.props.setCourses({
            "name": currentCourseName
        })

        .then(()=>{
            const AttendanceArray = this.props.courses[0]['attendance']
            
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
            this.setState({todaysAttendance})
        })

    }

    handleResponse = (response)=>{
        const { message , status } = response.result;
        if(response.status === 200){
            switch(status){
                case 201:
                    console.log(message)
                    this.setState(prevState => ({
                        messages: message
                    }),clearMessage.bind(this,3000))

                    // DISPLAY ATTENDANCE AFTER IT IS DONE
                    this.setTodaysAttendance()
                    break;
                case 400:
                    console.log(message)
                    this.setState(prevState => ({
                        messages: message
                    }))
                    break
                case 401:
                    console.log(message)
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            errors : {
                                ...prevState.errors,
                                otherError: message
                            }
                        }
                    })
                    break
                    default:
                        break
                    }
        }
    }


    makeRequest = (requestUrl) =>{
        let formData = new FormData();
        const { image, courseData }  = this.state.data;

        formData.append('file', image)
        formData.append("courseData",JSON.stringify(courseData));

        const options = {
            method: 'POST',
            body: formData
        }

        if(!this.state.errorsExists){
            fetch(requestUrl,options)
            .then(response => response.json())
            .then(response => this.handleResponse(response))
        }
    }
    
    
    
    onSubmit = (e)=>{
        e.preventDefault();

        /**
         * FIRST CLEAR ALL ERROR 
         * AND
         * APPLY AUTHENTICATION TO CHECK FOR ERRORS
        */
        this.clearAllErrors();
        this.applyAuthentication()
        .then(()=>{
            setTimeout(()=>{
                this.clearAllErrors();
            },3000)
        })
        /**
         * IF THERE IS NO ERRORS ONLY THEN 
         * MAKE THE REQUEST OTHERWISE DO NOTHING
         * 
         * AND 
         * 
         * THERE WILL BE SHOWING ERROR ON THE FORM IF ANY EXIST
        */
        .then(()=>{
            const url = "http://localhost:5000/initiate_attendence";
            this.makeRequest(url) 
        })
    }


    //////////////////////////////////// REQUEST RELATED FUNCTIONS ENDS///////////////////////////////////////



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
                // GET ALL TEACHER RELATED COURSES
                const relatedCourses = this.props.courses;
                if(relatedCourses){
                    this.setState(prevState =>{
                        return {
                            isFetching: true,
                            relatedCourses,
                            data: {
                                ...prevState.data,
                                courseData : {
                                    "name" : relatedCourses[0]['name'],
                                    "department" : relatedCourses[0]['department'],
                                    "semester" : relatedCourses[0]['semester']
                                }
                            }
                        }
                    })

                    // Show the attendance if already done
                    this.setTodaysAttendance();
                }
            })
        })
    }
    

    /////////////////////////////   RENDER FUNCTIONS ///////////////////////////////////////////

    render() {
    if(!this.state.isFetching){
        return (
            <div className="MainBody sidePage">
                <div className="Container">
                    <div className="FormContainer">
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
            <div className="MainBody sidePage">
                <div className="Container">
                    <div className="FormContainer">
                        <header>
                            <h1>
                                Attendance
                            </h1>
                        </header>
                        {this.state.messages && <span className="confirmationMessage">{this.state.messages}</span>}
                        {this.state.errors.otherError && <span className="errorMessage">{this.state.errors.otherError}</span>}
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
                                            id="image"
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
                <div className="ListBlock">
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
        setTeachers : (filters,projection) => dispatch(getAndSetTeachers(filters,projection)),
        setCourses : (filters,projection) => dispatch(getAndSetCourses(filters,projection))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AttendancePage);