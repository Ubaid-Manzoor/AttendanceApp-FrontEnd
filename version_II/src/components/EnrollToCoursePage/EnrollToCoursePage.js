import React , { Component } from 'react';
import { connect } from 'react-redux';

import { getAndSetStudents } from '../../actions/students';
import getAndSetCourses from '../../actions/courses';
import { getUsernameFromCookie } from '../../helperFunction/getCookie';
import setInputState from '../../genericFunctions/setInputState';

import './_enrollToCoursePage.scss';

class EnrollToCoursePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            isFetching: false,
            FetchingTime : 100 ,
            data: {
                studentImage: undefined
            },
            errorsExists: false,
            errors:{
                courseError: "",
                fileError: "",
                otherError: ""
            },
            messages: {} 
        }
    }


    ///////////////////////// INPUT HANDLERS //////////////////////////////
    
    onFileInputChange = (e) => {
        const value = e.target.files[0];
        // setInputState.call(this,"")
        this.setState((prevState)=>{
            return {
                data: {
                    ...prevState.data,
                    studentImage:value
                }
            }
        })
        
    }
    
    onInputChange = (e)=>{
        const name = e.target.id;
        const value = !(this.state.data.courseData[name]);

        this.setState((prevState)=>{
            return {
                data: {
                    ...prevState.data, 
                    courseData : {
                        ...prevState.data.courseData,
                        [name] : value
                    }
                 }
            }
        })
    }

    ///////////////////////// INPUT HANDLERS ENDS//////////////////////////////


    ///////////////////////// ERROR HANDLERS //////////////////////////////////

    setErrors = (toUpdate)=>{
        this.setState((prevState) =>{
            return {
                errors:{
                    ...prevState.errors,
                    ...toUpdate
                }
            }
        },()=> console.log(this.state.errors))
        this.setState({errorsExists: true});
    }
    
    clearAllErrors = ()=>{
        this.setErrors({
            roll_no: "",
            otherError: ""
        })
        this.setState({errorsExists: false});
    }

    
    applyAuthentication(){
        const data = this.state.data;

        const { courseData, studentImage } = data
        return new Promise((resolve,reject)=>{
            /**
             * Checking that has student aleast selected 
             * on course to enroll in
             */
            let courseDataError = true
    
            for( const key in courseData){
                if(courseData[key]){ courseDataError = false}
            }
    
            if(courseDataError){
                this.setErrors({courseError: "Atleast Select one course"})
            }
    
            /**
             * Checking if file have been uploaded or not
             */
            if(studentImage === undefined){
                this.setErrors({fileError: "Upload a File"})
            }
            resolve();
        })
    }


    ///////////////////////// ERROR HANDLERS ENDS//////////////////////////////////


    //////////////////////// REQUEST RELATED FUNCTIONS ////////////////////////////


    handleResponse = (responseArray)=>{
        /**
         * Array of response if send each for each course
         * which student option to select 
         */
        responseArray.forEach(response => {
            const { name } = response;
            const { message , status } = response.result;
            if(response.status === 200){
                switch(status){
                    case 201:
                        console.log(message)
                        setInputState.call(this,"messages",name,message)
                        break;
                    case 409:
                        console.log(message)
                        setInputState.call(this,"messages",name,message)
                        break
                    case 400:
                        this.setErrors({
                            otherError: message
                        })
                        console.log(message)
                        break;
                        default:
                            break
                        }
            }
        })
    }

    makeRequest = (requestUrl) =>{
        let formData = new FormData();
        const { studentImage, courseData }  = this.state.data;

        /**
         * Used formData only because we need to send file 
         * to server , it cant be dont otherwise
         */
        formData.append('file', studentImage)
        formData.append("courseData",JSON.stringify(courseData));
        formData.append("roll_no",this.props.students[0].roll_no)


        const options = {
            method: 'POST',
            body: formData
        }

        if(!this.state.errorsExists){
            fetch(requestUrl,options)
            .then(response => response.json())
            .then(responseArray => this.handleResponse(responseArray))
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

        /**
         * IF THERE IS NO ERRORS ONLY THEN 
         * MAKE THE REQUEST OTHERWISE DO NOTHING
         * 
         * AND 
         * 
         * THERE WILL BE SHOWING ERROR ON THE FORM IF ANY EXIST
        */
        .then(()=>{
            console.log("IN")
            const url = "http://localhost:5000/enroll_student"
            this.makeRequest(url); 
        })
        
        
        
    }
    
    //////////////////////// REQUEST RELATED FUNCTIONS ENDS////////////////////////////

    componentDidMount = ()=>{

        /* 
            Set Student Filters and Projection 
            to get only Specified part of current Student
        */

        const studentFilters = {
            username: getUsernameFromCookie()
        }
        const studentProjection = {
            "department": true,"semester": true, "roll_no": true
        }
        /* 
            Make a Asnc Request to get the student details
            Note :- It will return a Promise
        */
        this.props.setStudents(studentFilters,studentProjection)
        .then(()=>{

            /* 
                Now Set Filter and Projection to Get 
                Only Coures Related to the loogedIn Student
            */
            const loggedStudent = this.props.students[0];
            const { department, semester } =loggedStudent;

            const courseFilters = { department,semester }
            const courseProjection = { "name": true }

            /* 
                Make the Asnc Request to get the Courses 
            */
            this.props.setCourses(courseFilters, courseProjection)
            .then(()=> {

                /*
                    Set False For all Course in The State
                    "FALSE" represents that CheckBox is unchecked
                    and will be change to True when CheckBox is Checked
                */
                this.props.courses.forEach(course => {
                    this.setState(prevState => {
                        return {
                            data: {
                                ...prevState.data, 
                                courseData : {
                                    ...prevState.data.courseData,
                                    [course.name] : false
                                }
                                }
                        }
                    })
                });
                this.setState({isFetching: true})
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
                <div className="MainBody Enroll_MainBody sidePage">
                    <div className="Container Enroll_Container">
                        <div className="FormContainer Enroll_FormContainer">
                            <header>
                                <h1>
                                    Enroll<span>({this.props.students[0].roll_no})</span>
                                </h1>
                            </header>
                            {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
                            {this.state.errors.courseExist && <span className="errorMessage">{this.state.errors.courseExist}</span>}
                            <form onSubmit={this.onSubmit} encType="multipart/form-data">
                                <div>
                                    <div className="inputErrorDiv">
                                    {
                                            this.props.courses.map(course =>{
                                                const { name, department, semester } = course
                                                return <div key={ name+department+semester } className="courseCheckboxDiv">
                                                            <div>
                                                            <input
                                                                type="checkbox"
                                                                id={name}
                                                                placeholder=""
                                                                value={this.state.data[name]}
                                                                onChange={this.onInputChange}
                                                            />
                                                            </div>
                                                            <div>
                                                            <label 
                                                                className="Label"
                                                                htmlFor={name}
                                                            >
                                                                {name} {this.state.messages[name] && <span className="confirmationMessage" >{this.state.messages[name]}</span>}
                                                            </label>
                                                            </div>
                                                        </div>
                                            })
                                    }
                                    {this.state.errors.courseError && <span className="errorMessage">{this.state.errors.courseError}</span>}
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
                                                id="studentImage"
                                                placeholder=""
                                                onChange={this.onFileInputChange}
                                            />
                                        </div>
                                        {this.state.errors.fileError && <span className="errorMessage">{this.state.errors.fileError}</span>}
                                    </div>
                                </div>
                                <button className="Button">
                                    Enroll
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = (state)=>{
    return {
        students: state.students,
        courses: state.courses
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setStudents : (filters,projection) => dispatch(getAndSetStudents(filters,projection)),
        setCourses : (filters,projection) => dispatch(getAndSetCourses(filters,projection))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EnrollToCoursePage);