import React ,{Component} from 'react';
import { connect } from 'react-redux';
import { getAndSetStudents } from '../../actions/students'; 

import './_addStudentPage.scss';
import StudentComponent from './StudentComponent';
import { getAndSetDepartments } from '../../actions/department';

class AddStudentPage extends Component{
    constructor(props){
        super(props);

        this.props.setStudents();
        this.props.setDepartments();

        this.state = {
            studentData: {
                username: "",
                name: "",
                roll_no: "",
                department: "",
                semester: 1,
                password: "",
                confirmPassword: ""
            },
            errorsExists: false,
            errors:{
                username: "",
                name: "",
                roll_no: "",
                password: "",
                confirmPassword: "",
                studentExist: "",
                otherError: ""
            },
            message: ""
        }
    }

    onInputChange = (e)=>{
        const value = e.target.value;
        const name = e.target.id;
        console.log(value,name)
        this.setState((prevState)=>{
            return {
                studentData: {
                    ...prevState.studentData,
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
            username: "",
            name: "",
            roll_no: "",
            password: "",
            otherError: "",
            confirmPassword: "",
            studentExists: ""
        })
        this.setState({errorsExists: false});
    }


    applyAuthentication(studentData){
        if(studentData.username === ''){
            this.setErrors({username: "Fill the box"})
        }
        if(studentData.name === ''){
            this.setErrors({name: "Fill the box"})
        }
        if(studentData.roll_no === ''){
            this.setErrors({name: "Fill the box"})
        }
        if(studentData.password === ''){
            this.setErrors({password: "Fill the box"})
        }
        if(studentData.confirmPassword === ''){
            this.setErrors({confirmPassword: "Fill the box"})
        }else if(studentData['password'] !== studentData['confirmPassword']){
            this.setErrors({confirmPassword: "password did not match"})
        }
    }

    waitTillStateChange(callback){
        this.setState(state => state,()=>{
                callback()
            }
        )
    }

    makeRequest = (studentData) =>{
        console.log(studentData)
        fetch('http://localhost:5000/signup',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(studentData)
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
                                this.props.setStudents();
                                break;
                            case 409:
                                this.setErrors({
                                    studentExists:message
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

        const studentData = {
            ...this.state.studentData,
            "role": "student",
            "confirmed": true
        };

        
        this.clearAllErrors();
        this.applyAuthentication(studentData);
        
        this.waitTillStateChange(()=>{
            if(!this.state.errorsExists){
                if(studentData.department === ""){
                    studentData["department"] = this.props.departments[0]['name']
                }
                
                delete studentData['confirmPassword']
                this.makeRequest(studentData) 
            }
        })

    }

    render() {
        const listOfStudents = this.props.students;
        const listOfDepartments = this.props.departments;
        // console.log(listOfStudents);
        // console.log(listOfStudents);
        return (
            <div className="AddStudent_MainBody sidePage">
                <div className="AddStudent_Container">
                    <div className="AddStudent_FormContainer">
                        <header>
                            <h1>Add Student</h1>
                        </header>
                        {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
                        {this.state.errors.studentExists && <span className="errorMessage">{this.state.errors.studentExists}</span>}
                        <form onSubmit={this.onSubmit}>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="username"
                                >
                                    Username Of Student
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="text"
                                            id="username"
                                            placeholder=""
                                            value={this.state.studentData.username}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.username && <span className="errorMessage">{this.state.errors.username}</span>}
                                </div>
                            </div>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="name"
                                >
                                    Name Of Student
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder=""
                                            value={this.state.studentData.name}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.name && <span className="errorMessage">{this.state.errors.name}</span>}
                                </div>
                            </div>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="roll_no"
                                >
                                    Roll Number Of Student
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="text"
                                            id="roll_no"
                                            placeholder=""
                                            value={this.state.studentData.roll_no}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.roll_no && <span className="errorMessage">{this.state.errors.roll_no}</span>}
                                </div>
                            </div>
                            <div>
                                <label className="Label" htmlFor="department">Department</label>
                                <div className="selectDiv">
                                    <select 
                                        id="department"
                                        name="department"
                                        value={this.state.studentData.department}
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
                                        value={this.state.studentData.semester}
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
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder=""
                                            value={this.state.studentData.password}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.password && <span className="errorMessage">{this.state.errors.password}</span>}
                                </div>
                            </div>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="confirmPassword"
                                >
                                    Confirm Password
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            placeholder=""
                                            value={this.state.studentData.confirmPassword}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.confirmPassword && <span className="errorMessage">{this.state.errors.confirmPassword}</span>}
                                </div>
                            </div>
                            <button className="Button">
                                Add Student
                            </button>
                        </form>
                    </div>
                </div>
                <div className="student_ListBlock">
                    <header>
                        <h2> All Students </h2>
                    </header>
                    <div className="student_MainContainer">
                        <ol>
                            {
                                listOfStudents.map(student =>{
                                    const {username, name, department, semester, confirmed} = student
                                    return <li 
                                            key={username}>
                                                <StudentComponent 
                                                    username={username} 
                                                    name={name} 
                                                    department={department} 
                                                    semester={semester} 
                                                    isConfirmed={confirmed} 
                                                    />
                                            </li>
                                })
                            }
                        </ol>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state)=>{
    return {
        students: state.students,
        departments: state.departments
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setStudents : () => dispatch(getAndSetStudents()),
        setDepartments: () => dispatch(getAndSetDepartments())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddStudentPage);