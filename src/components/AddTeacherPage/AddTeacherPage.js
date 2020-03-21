import React ,{Component} from 'react';
import { connect } from 'react-redux';
import { getAndSetTeachers } from '../../actions/teachers'; 

import './_addTeacherPage.scss';
import TeacherComponent from './TeacherComponent';

class AddTeacherPage extends Component{
    constructor(props){
        super(props);

        this.props.setTeachers();
        // console.log("CALLED")

        this.state = {
            teacherData: {
                username: "",
                name: "",
                password: "",
                confirmPassword: ""
            },
            errorsExists: false,
            errors:{
                username: "",
                password: "",
                name: "",
                confirmPassword: "",
                teacherExists: "",
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
                teacherData: {
                    ...prevState.teacherData,
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
            name: "",
            otherError: "",
            confirmPassword: "",
            teacherExists: ""
        })
        this.setState({errorsExists: false});
    }


    applyAuthentication(teacherData){
        if(teacherData.username === ''){
            this.setErrors({username: "Fill the box"})
        }
        if(teacherData.password === ''){
            this.setErrors({password: "Fill the box"})
        }
        if(teacherData.name === ''){
            this.setErrors({name: "Fill the box"})
        }
        if(teacherData.confirmPassword === ''){
            this.setErrors({confirmPassword: "Fill the box"})
        }else if(teacherData['password'] !== teacherData['confirmPassword']){
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

        const teacherData = {
            ...this.state.teacherData,
            "role": "teacher",
            "confirmed": true
        };

        this.clearAllErrors();
        this.applyAuthentication(teacherData);

        this.waitTillStateChange(()=>{

            if(!this.state.errorsExists){
                fetch('http://localhost:5000/signup',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(teacherData)
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
                                this.props.setTeachers();
                                break;
                            case 409:
                                this.setErrors({
                                    teacherExists:message
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
        const listOfTeachers = this.props.teachers;
        return (
            <div className="AddTeacher_MainBody sidePage">
                <div className="AddTeacher_Container">
                    <div className="AddTeacher_FormContainer">
                        <header>
                            <h1>Add Teacher</h1>
                        </header>
                        {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
                        {this.state.errors.teacherExists && <span className="errorMessage">{this.state.errors.teacherExists}</span>}
                        <form onSubmit={this.onSubmit}>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="username"
                                >
                                    Username Of Teacher
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="text"
                                            id="username"
                                            placeholder=""
                                            value={this.state.teacherData.username}
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
                                    Name Of Teacher
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder=""
                                            value={this.state.teacherData.name}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.name && <span className="errorMessage">{this.state.errors.name}</span>}
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
                                            value={this.state.teacherData.password}
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
                                            value={this.state.teacherData.confirmPassword}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.confirmPassword && <span className="errorMessage">{this.state.errors.confirmPassword}</span>}
                                </div>
                            </div>
                            <button className="Button">
                                Add Teacher
                            </button>
                        </form>
                    </div>
                </div>
                <div className="teacher_ListBlock">
                    <header>
                        <h2> All Teachers </h2>
                    </header>
                    <div className="teacher_MainContainer">
                        <ol>
                            {
                                listOfTeachers.map(teacher =>{
                                    const {username,name, confirmed} = teacher 
                                    return <li key={name}><TeacherComponent username={username} name={name} isConfirmed={confirmed} /></li>
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
        teachers: state.teachers
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setTeachers : () => dispatch(getAndSetTeachers())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddTeacherPage);