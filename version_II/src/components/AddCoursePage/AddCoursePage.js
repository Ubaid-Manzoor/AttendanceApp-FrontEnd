import React , { Component } from 'react';
import { connect } from 'react-redux';

import { getAndSetDepartments } from '../../actions/department';
import { getAndSetTeachers } from '../../actions/teachers';


import  './_addCoursePage.scss';

class AddCoursePage extends Component{
    constructor(props){
        super(props);

        this.props.setTeachers();
        this.props.setDepartments();
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

    onInputChange = (e)=>{
        const value = e.target.value;
        const name = e.target.id;
        this.setState((prevState)=>{
            return {
                courseData: {
                    ...prevState.courseData,
                    [name]:value
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

    waitTillStateChange(callback){
        this.setState(state => state,()=>{
                callback()
            }
        )
    }

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
                                <label className="Label" htmlFor="teacher">Teacher Assigned</label>
                                <div className="selectDiv">
                                    <select 
                                        id="teacherAssigned"
                                        name="teacher"
                                        value={this.state.courseData.teacher}
                                        onChange={this.onInputChange}
                                    >
                                        {
                                            listOfTeachers.map( teacher =>{
                                                const { name } = teacher
                                                return <option key={name} value={name}>{name}</option>
                                            })
                                        }
                                    </select>
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
                                            listOfDepartments.map( department =>{
                                                const { name } = department
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

const mapStateToProps = (state)=>{
    return {
        departments: state.departments,
        teachers: state.teachers
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setTeachers : () => dispatch(getAndSetTeachers()),
        setDepartments: () => dispatch(getAndSetDepartments())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddCoursePage);