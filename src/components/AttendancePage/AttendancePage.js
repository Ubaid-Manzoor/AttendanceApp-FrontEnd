import React , { Component } from 'react';
import { connect } from 'react-redux';

import { getAndSetTeachers } from '../../actions/teachers';
import getAndSetCourses from '../../actions/courses';
import { getUsernameFromCookie } from '../../helperFunction/getCookie';

import './_attendancePage.scss';


class AttendancePage extends Component{
    constructor(props){
        super(props);
        
        this.props.setCourses();
        this.props.setTeachers();
        
        this.state = {
            isFetching: false,
            FetchingTime : 100 ,
            Data: {
                classImage: undefined,
                course: ""
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
        const name = e.target.id;
        const value = e.target.value;

        this.setState((prevState)=>{
            return {
                Data: {
                    ...prevState.Data, 
                    [name] : value
                 }
            }
        },()=>{console.log( this.state.Data)})
    }

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

    
    applyAuthentication(Data){
        console.log(Data)
        // const { courseData} = Data

        // if(classImage === undefined){
            // this.setErrors({fileError: "Upload a File"})
        // }
    }

    waitTillStateChange(callback){
        this.setState(state => state,()=>{
            callback()
            }
        )
    }


    makeRequest = () =>{
        let formData = new FormData();
        const { classImage, course }  = this.state.Data;

        formData.append('file', classImage)
        formData.append("course",course);

        console.log(formData.get('file'))
        console.log(formData.get('course'))
        
        this.applyAuthentication(this.state.Data);
        this.waitTillStateChange(()=>{    
            if(!this.state.errorsExists){
                fetch('http://localhost:5000/initiate_attendence',{
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(response => {
                    console.log(response)

                        // const { name } = response;
                        // const { message , status } = response.result;
                        // console.log(name)
                        // if(response.status === 200){
                        //     switch(status){
                        //         case 201:
                        //             console.log(message)
                        //             this.setState(prevState => ({
                        //                 messages: {
                        //                     ...prevState.messages,
                        //                     [name]: message
                        //                 }
                        //             }))
                        //             break;
                        //         case 409:
                        //             console.log(message)
                        //             this.setState(prevState => ({
                        //                 messages: {
                        //                     ...prevState.messages,
                        //                     [name]: message
                        //                 }
                        //             }))
                        //             break
                        //         case 400:
                        //             this.setErrors({
                        //                 otherError: message
                        //             })
                        //             console.log(message)
                        //             break;
                        //             default:
                        //                 break
                        //             }
                        // }
                    })
            }
        })
    }
                    
        onSubmit = (e)=>{
            e.preventDefault();
            this.clearAllErrors();
            this.makeRequest() 
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
            console.log(listOfCourses);
            // clearInterval(this.timer);
            // this.timer = null;
            return listOfCourses.filter(course => {
                return course.department === department && course.teacherAssigned === teachersName
            })
        }

        componentDidMount = ()=>{
            let currentTeacher = this.getCurrentTeacher();
            console.log(this.props.courses)
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
                                            course: relatedCourses[0]['name']
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
                            {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
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
                                                // value={this.state.Data.classImage}
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
        setTeachers : () => dispatch(getAndSetTeachers()),
        setCourses : () => dispatch(getAndSetCourses())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AttendancePage);