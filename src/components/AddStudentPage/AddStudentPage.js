import React ,{Component} from 'react';
import { connect } from 'react-redux';
import { getAndSetStudents } from '../../actions/students'; 

import './_addStudentPage.scss';
import StudentComponent from './StudentComponent';

class AddStudentPage extends Component{
    constructor(props){
        super(props);

        this.props.setStudents();
        // console.log("CALLED")

        this.state = {
            studentData: {
                username: "",
                password: "",
                confirmPassword: ""
            },
            errorsExists: false,
            errors:{
                username: "",
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
        }else if(studentData.password === ''){
            this.setErrors({password: "Fill the box"})
        }else if(studentData.confirmPassword === ''){
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
            console.log(this.state);
            if(!this.state.errorsExists){
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
        })

    }

    render() {
        const listOfStudents = this.props.students;
        console.log(listOfStudents)
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
                                    Password
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
                                    const {name, confirmed} = student
                                    return <li key={name}><StudentComponent name={name} isConfirmed={confirmed} /></li>
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
        students: state.students
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setStudents : () => dispatch(getAndSetStudents())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddStudentPage);