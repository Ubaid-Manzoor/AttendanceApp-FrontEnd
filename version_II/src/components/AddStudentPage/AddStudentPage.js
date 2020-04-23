import React ,{Component} from 'react';
import { connect } from 'react-redux';
import { getAndSetStudents } from '../../actions/students'; 

import StudentComponent from './StudentComponent';
import { getAndSetDepartments } from '../../actions/department';

import setInputState from '../../genericFunctions/setInputState';
import handleSubmit from '../../genericFunctions/handleSubmit';
import clearMessage from '../../genericFunctions/clearMessage';
// import './_addStudentPage.scss';

class AddStudentPage extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: {
                username: "",
                name: "",
                roll_no: "",
                department: "",
                semester: 1,
                password: "",
                confirmPassword: "",
                "role": "student",
                "confirmed": true
            },
            errorsExists: false,
            errors:{
                username: "",
                name: "",
                roll_no: "",
                password: "",
                confirmPassword: "",
                exists: "",
                otherError: ""
            },
            message: ""
        }
    }

    /////////////////////// INPUT HANDLER /////////////////////////////////

    onInputChange = (e)=>{
        const value = e.target.value;
        const name = e.target.id;
        console.log(value,name);
        setInputState.call(this,"data",name,value)
    }
    /////////////////////// INPUT HANDLER ENDS /////////////////////////////////


    /////////////////////// ERROR HANDLERS //////////////////////////////////

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
            exists: ""
        })
        this.setState({errorsExists: false});
    }


    applyAuthentication(){
        const data = this.state.data;

        return new Promise((resolve,reject)=>{
            if(data.username === ''){
                this.setErrors({username: "Fill the box"})
            }
            if(data.name === ''){
                this.setErrors({name: "Fill the box"})
            }
            if(data.roll_no === ''){
                this.setErrors({roll_no: "Fill the box"})
            }
            if(data.password === ''){
                this.setErrors({password: "Fill the box"})
            }
            if(data.confirmPassword === ''){
                this.setErrors({confirmPassword: "Fill the box"})
            }else if(data['password'] !== data['confirmPassword']){
                this.setErrors({confirmPassword: "password did not match"})
            }
            resolve()
        })
    }


    /////////////////////// ERROR HANDLERS ENDS //////////////////////////////////



    //////////////////////  REQUEST RELATED FUNCTONS ///////////////////////////

    handleResponse = (response)=>{
        const { message , status } = response.result;

        if(response.status === 200){
            switch(status){
                case 201:
                    this.setState({
                        message
                    },clearMessage.bind(this,3000))
                    this.props.setStudents();
                    break;
                case 409:
                    this.setErrors({
                        exists:message
                    })
                    break;
                case 400:
                    this.setErrors({
                        otherError: message
                    })
                    break;
                default:
                    break
            }
        }
    }

    onSubmit = (e)=>{
        e.preventDefault();

        const url = 'http://localhost:5000/signup';
        handleSubmit.call(this,url);
    }

    //////////////////////  REQUEST RELATED FUNCITONS ENDS ///////////////////////////


    ///////////////////// LIFE CYCLE FUNCTION ////////////////////////////////////////
    setDefaultState = ()=>{
        const department = this.props.departments[0]['name']
        setInputState.call(this,"data","department",department);
    }


    componentDidMount = ()=>{
        /***********************************************************/
        /* 
            FOR NOW I WILL FETCH ALL STUDENT 
            IN FUTURE I WILL FETCH FOR  A PARTICULAR COURSE AND DEPARTMENT
        */
        this.props.setStudents();
        this.props.setDepartments()
        .then(()=>{this.setDefaultState()})
    }

    ///////////////////// LIFE CYCLE FUNCTION ENDS ////////////////////////////////////////


    render() {
        const listOfStudents = this.props.students;
        const listOfDepartments = this.props.departments;

        return (
            <div className="MainBody sidePage">
                <div className="Container">
                    <div className="FormContainer">
                        <header>
                            <h1>Add Student</h1>
                        </header>
                        {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
                        {this.state.errors.exists && <span className="errorMessage">{this.state.errors.exists}</span>}
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
                                            value={this.state.data.username}
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
                                            value={this.state.data.name}
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
                                            value={this.state.data.roll_no}
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
                                        value={this.state.data.department}
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
                                <label className="Label" htmlFor="semester">Semester</label>
                                <div className="selectDiv">
                                    <select 
                                        id="semester"
                                        name="semester"
                                        value={this.state.data.semester}
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
                                            value={this.state.data.password}
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
                                            value={this.state.data.confirmPassword}
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
                <div className="ListBlock">
                    <header>
                        <h2> All Students </h2>
                    </header>
                    <div className="MainContainer">
                        <ol>
                            {
                                !!listOfStudents &&
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
        setStudents : (filters,projection) => dispatch(getAndSetStudents(filters,projection)),
        setDepartments: (filters,projection) => dispatch(getAndSetDepartments(filters,projection))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddStudentPage);