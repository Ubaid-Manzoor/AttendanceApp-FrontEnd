import React , { Component } from 'react';
import { connect } from 'react-redux';

import { getAndSetStudents } from '../../actions/students';
import getAndSetCourses from '../../actions/courses';
import { getUsernameFromCookie } from '../../helperFunction/getCookie';

import './_enrollToCoursePage.scss';


class EnrollToCoursePage extends Component{
    constructor(props){
        super(props);
        
        this.props.setCourses();
        this.props.setStudents();
        
        this.state = {
            isFetching: false,
            FetchingTime : 500 ,
            enrollData: {
                studentImage: undefined
            },
            errorsExists: false,
            errors:{
                roll_no: "",
                otherError: ""
            },
            message: ""
        }

        // const currentStudent = this.getCurrentStudent();
        // console.log(currentStudent); 
    }
    
    onFileInputChange = (e) => {
        const value = e.target.files[0];
        // const name =  e.target.id;

        console.log(value)

        this.setState((prevState)=>{
            return {
                enrollData: {
                    ...prevState.enrollData,
                    studentImage:value
                }
            }
        })
    }
    
    onInputChange = (e)=>{
        const name = e.target.id;
        const value = !this.state.enrollData[name];
        

        console.log("VALUE : " ,value,"NAME : ", name)
        this.setState((prevState)=>{
            return {
                enrollData: {
                    ...prevState.enrollData, 
                    courseData : {
                        ...prevState.enrollData.courseData,
                        [name] : value
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

    
    applyAuthentication(enrollData){
        if(enrollData.roll_no === ''){
            this.setErrors({roll_no: "Fill the box"})
        }
    }

    waitTillStateChange(callback){
        this.setState(state => state,()=>{
            callback()
            }
        )
    }

    makeRequest = () =>{
        // console.log(enrollData)

        let formData = new FormData();
        const { studentImage, courseData }  = this.state.enrollData;

        formData.append('file', studentImage)
        formData.append("courseData",JSON.stringify(courseData));
        formData.append("roll_no",this.state.currentStudent.roll_no)

        for(var pair of formData.entries()) {
            console.log(pair[0]+ ', '+ pair[1]); 
            }
        // console.log("FORMDATA :::::::::::: ", formData.getAll())
        fetch('http://localhost:5000/enroll_student',{
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
                                this.setState({
                                    message
                                })
                                break;
                                case 409:
                                this.setErrors({
                                    courseExist:message
                                })
                                console.log(message)
                                break;
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
                    
        onSubmit = (e)=>{
            e.preventDefault();
            
            this.clearAllErrors();
            // this.applyAuthentication(enrollData);
            
            this.waitTillStateChange(()=>{
                if(!this.state.errorsExists){
                    console.log(this.state)
                    this.makeRequest() 
                }
            })
            
        }
        
        getCurrentStudent = ()=>{
            const listOfStudents = this.props.students;
            const currentLoggedInUsername = getUsernameFromCookie();
            return listOfStudents.filter(student => {
                return student.username === currentLoggedInUsername
            })[0]
        }
    
        getStudentRelatedCourses = (department, semester) => {
            const listOfCourses = this.props.courses;
            return listOfCourses.filter(course => {
                return course.department === department && course.semester === semester
            })
        }

        componentDidMount = ()=>{
            let currentStudent = this.getCurrentStudent();

            this.timer = setInterval( () => {
                currentStudent = this.getCurrentStudent();
                this.setState(prevState => {
                    return {
                        currentStudent
                    }   
                },()=>{
                    if(this.state.currentStudent){
                        const relatedCourses = this.getStudentRelatedCourses(this.state.currentStudent.department, this.state.currentStudent.semester);
                        if(relatedCourses){
                            ///////////////  SETTING STATE FOR EACH COURSE //////////////////

                            relatedCourses.forEach(course => {
                                this.setState(prevState => {
                                    return {
                                        enrollData: {
                                            ...prevState.enrollData, 
                                            courseData : {
                                                ...prevState.enrollData.courseData,
                                                [course.name] : false
                                            }
                                         }
                                    }
                                })
                            });

                            ////////////////////////// END /////////////////////////////////
                            this.setState(prevState =>{
                                    return {
                                        isFetching: true,
                                        relatedCourses
                                    }
                                }
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
                                    Enroll<span>({this.state.currentStudent.roll_no})</span>
                                </h1>
                            </header>
                            {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
                            {this.state.errors.courseExist && <span className="errorMessage">{this.state.errors.courseExist}</span>}
                            <form onSubmit={this.onSubmit} encType="multipart/form-data">
                                <div>
                                    {
                                            this.state.relatedCourses.map(course =>{
                                                const { name, department, semester } = course
                                                return <div key={ name+department+semester } className="courseCheckboxDiv">
                                                            <div>
                                                            <input
                                                                type="checkbox"
                                                                id={name}
                                                                placeholder=""
                                                                value={this.state.enrollData[name]}
                                                                onChange={this.onInputChange}
                                                            />
                                                            </div>
                                                            <div>
                                                            <label 
                                                                className="Label"
                                                                htmlFor={name}
                                                            >
                                                                {name}
                                                            </label>
                                                            </div>
                                                        </div>
                                            })
                                    }
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
                                                // value={this.state.enrollData.studentImage}
                                                onChange={this.onFileInputChange}
                                            />
                                        </div>
                                        {/* {this.state.errors.name && <span className="errorMessage">{this.state.errors.name}</span>} */}
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
        setStudents : () => dispatch(getAndSetStudents()),
        setCourses : () => dispatch(getAndSetCourses())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(EnrollToCoursePage);