import React , { Component } from 'react';
import { connect } from 'react-redux';

import { getAndSetDepartments } from '../../actions/department';
import { getAndSetTeachers } from '../../actions/teachers';


import  './_addCoursePage.scss';

class AddCoursePage extends Component{
    constructor(props){
        super(props);

        this.state = {
            courseData: {
                name: "",
                department: "",
                semester: 1,
                teacherAssigned: ""
            },
            errorsExists: false,
            errors:{
                name: "",
                courseExist: "",
                otherError: ""
            },
            message: ""
        }
    }


    /////////////////// INPUT HANDLERS /////////////////////////////

    onInputChange = (e)=>{
        const value = e.target.value;
        const name = e.target.id;


        // FETCH ONLY TEACHER OF CORRESPONDING DEPARTMENT
        if(name === "department"){
            const teacherFilters = {
                "department": value
            };
            const teacherProjection = {};
            this.props.setTeachers(teacherFilters,teacherProjection);
        }

        this.setState((prevState)=>{
            return {
                courseData: {
                    ...prevState.courseData,
                    [name]:value
                }
            }
        })
    }

    /////////////////////// INPUT HANDLERS ENDS //////////////////////


    /////////////////////// ERROR HANDLERS //////////////////////////

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
            name: "",
            otherError: "",
            courseExist: ""
        })
        this.setState({errorsExists: false});
    }

    applyAuthentication(courseData){
        if(courseData.name === ''){
            this.setErrors({name: "Fill the box"})
        }
    }

    /////////////////////// ERROR HANDLERS ENDS ////////////////////////



    waitTillStateChange(callback){
        this.setState(state => state,()=>{
                callback()
            }
        )
    }

    /////////////////////// REQUEST RELATED FUNCTIONS //////////////////////

    makeRequest = (courseData) =>{
        console.log(courseData)
        fetch('http://localhost:5000/add_course',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(courseData)
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
        console.log("SUBMITTING")
        const courseData = this.state.courseData;

        this.clearAllErrors();
        this.applyAuthentication(courseData);

        this.waitTillStateChange(()=>{
            if(!this.state.errorsExists){
                if(courseData.department === ""){
                    courseData["department"] = this.props.departments[0]['name']
                }
                if(courseData.teacherAssigned === ""){
                    courseData["teacherAssigned"] = this.props.teachers[0]['name']
                }
                this.makeRequest(courseData) 
            }
        })

    }


    /////////////////////// REQUEST RELATED FUNCTIONS ENDS //////////////////////


    ////////////////////// LIFE CYCLE FUNCTIONS /////////////////////////////////

    componentDidMount = ()=>{
        console.log("CALLED!!");

        // AFTER COMPONENT MOUNT INSTANTLY GET ALL DEPARTMENT
        this.props.setDepartments()
        .then(()=>{

            // SET A DEFAULT DEPARTMENT IN STATE
            const defaultDepartment = this.props.departments[0].name;
            this.setState((prevState) =>({
                "courseData":{
                    ...prevState.courseData,
                    "department": defaultDepartment
                }
            }))

            const teacherFilters = {
                "department": defaultDepartment
            }
            const teacherProjection = {}
            this.props.setTeachers(teacherFilters, teacherProjection)
            
        })
    }

    ////////////////////// LIFE CYCLE FUNCTIONS ENDS /////////////////////////////////

    render() {
        const listOfDepartments = this.props.departments;
        const listOfTeachers = this.props.teachers;

        return (
            <div className="MainBody sidePage">
                <div className="Container">
                    <div className="FormContainer">
                        <header>
                            <h1>Add Course</h1>
                        </header>
                        {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
                        {this.state.errors.courseExist && <span className="errorMessage">{this.state.errors.courseExist}</span>}
                        <form onSubmit={this.onSubmit}>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="name"
                                >
                                    Name Of Course
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder=""
                                            value={this.state.courseData.name}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.name && <span className="errorMessage">{this.state.errors.name}</span>}
                                </div>
                            </div>
                            <div>
                                <label className="Label" htmlFor="department">Department</label>
                                <div className="selectDiv">
                                    <select 
                                        id="department"
                                        name="department"
                                        value={this.state.courseData.department}
                                        onChange={this.onInputChange}
                                    >
                                        {
                                            !!listOfDepartments &&
                                            listOfDepartments.map( department =>{
                                                const { name } = department
                                                return <option key={name} value={name}>{name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="Label" htmlFor="teacher">Teacher Assigned</label>
                                <div className="selectDiv">
                                    <select 
                                        id="teacherAssigned"
                                        name="teacher"
                                        value={this.state.courseData.teacher}
                                        onChange={this.onInputChange}
                                    >
                                        {
                                            !!listOfTeachers &&
                                            listOfTeachers.map( teacher =>{
                                                const { name } = teacher
                                                return <option key={name} value={name}>{name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="Label" htmlFor="semester">Semester</label>
                                <div className="selectDiv">
                                    <select 
                                        id="semester"
                                        name="semester"
                                        // value={this.state.courseData.semester}
                                        onChange={this.onInputChange}
                                    >
                                        <option  value="1">1</option>
                                        <option  value="2">2</option>
                                        <option  value="3">3</option>
                                        <option  value="4">4</option>
                                        <option  value="5">5</option>
                                        <option  value="6">6</option>
                                        <option  value="7">7</option>
                                        <option  value="8">8</option>
                                    </select>
                                </div>
                            </div>
                            <button className="Button">
                                Add Course
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

////////////////////// STUFF RELATED TO REDUX STORE /////////////////////

const mapStateToProps = (state)=>{
    return {
        departments: state.departments,
        teachers: state.teachers
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setTeachers : (filters,projection) => dispatch(getAndSetTeachers(filters,projection)),
        setDepartments: (filters,projection) => dispatch(getAndSetDepartments(filters,projection))
    }
}

////////////////////// STUFF RELATED TO REDUX STORE ENDS /////////////////////


export default connect(mapStateToProps,mapDispatchToProps)(AddCoursePage);