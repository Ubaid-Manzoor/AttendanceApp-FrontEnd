import React ,{Component} from 'react';
import { connect } from 'react-redux';
import { getAndSetTeachers } from '../../actions/teachers'; 

import TeacherComponent from './TeacherComponent';
import { getAndSetDepartments } from '../../actions/department';

import setInputState from '../../genericFunctions/setInputState';
import handleSubmit from '../../genericFunctions/handleSubmit';
import clearMessage from '../../genericFunctions/clearMessage';

// import './_addTeacherPage.scss';
class AddTeacherPage extends Component{
    constructor(props){
        super(props);

        
        // console.log("CALLED")

        this.state = {
            data: {
                username: "",
                name: "",
                department: "",
                password: "",
                confirmPassword: "",
                "role": "teacher",
                "confirmed": true
            },
            errorsExists: false,
            errors:{
                username: "",
                password: "",
                name: "",
                confirmPassword: "",
                exists: "",
                otherError: ""
            },
            message: ""
        }
    }

    /////////////////////   INPUT HANDLERS ///////////////////////////

    onInputChange = (e)=>{
        const value = e.target.value;
        const name = e.target.id;
        setInputState.call(this,"data",name,value);
    }

    /////////////////////   INPUT HANDLERS ENDS ///////////////////////////



    /////////////////////   ERRORS HANDLERS ///////////////////////////


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
            exists: ""
        })
        this.setState({errorsExists: false});
    }


    applyAuthentication(){
        const data = this.state.data;
        return new Promise((resolve, reject)=>{
            if(data.username === ''){
                this.setErrors({username: "Fill the box"})
            }
            if(data.password === ''){
                this.setErrors({password: "Fill the box"})
            }
            if(data.name === ''){
                this.setErrors({name: "Fill the box"})
            }
            if(data.confirmPassword === ''){
                this.setErrors({confirmPassword: "Fill the box"})
            }else if(data['password'] !== data['confirmPassword']){
                this.setErrors({confirmPassword: "password did not match"})
            }
            resolve();
        })

    }

    /////////////////////   ERRORS HANDLERS ENDS ///////////////////////////



    //////////////////////  REQUEST RELATED FUNCTONS ///////////////////////////

    handleResponse = (response)=>{
        const { message , status } = response.result;

        if(response.status === 200){
            switch(status){
                case 201:
                    console.log(message)
                    this.setState({
                        message
                    },clearMessage.bind(this,3000))
                    this.props.setTeachers();
                    break;
                case 409:
                    this.setErrors({
                        exists:message
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
    }


    onSubmit = (e)=>{
        e.preventDefault();

        const url = "http://localhost:5000/signup";
        handleSubmit.call(this,url);
    }

    //////////////////////  REQUEST RELATED FUNCTONS ENDS ///////////////////////////


    ///////////////////// LIFE CYCLE FUNCTION ////////////////////////////////////////

    setDefaultState = ()=>{
        const department = this.props.departments[0]['name']
        setInputState.call(this,"data","department",department);
    }
    
    componentDidMount = ()=>{
        /***********************************************************/
        /* 
            FOR NOW I WILL FETCH ALL TEACHERS
            IN FUTURE I WILL FETCH FOR  A PARTICULAR SEMESTER AND DEPARTMENT
        */
       this.props.setTeachers()
       this.props.setDepartments()
       .then(()=>{this.setDefaultState()})
    }

    ///////////////////// LIFE CYCLE FUNCTION ENDS ////////////////////////////////////////


    render() {
        const listOfTeachers = this.props.teachers;
        const listOfDepartments = this.props.departments;

        return (
            <div className="MainBody AddTeacher_MainBody sidePage">
                <div className="Container AddTeacher_Container">
                    <div className="FormContainer AddTeacher_FormContainer">
                        <header>
                            <h1>Add Teacher</h1>
                        </header>
                        {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
                        {this.state.errors.exists && <span className="errorMessage">{this.state.errors.exists}</span>}
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
                                    Name Of Teacher
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
                                <label className="Label" htmlFor="department">Department</label>
                                <div className="selectDiv">
                                    <select 
                                        id="department"
                                        name="department"
                                        value={this.state.data.department}
                                        onChange={this.onInputChange}
                                    >
                                        {   !!listOfDepartments &&
                                            listOfDepartments.map( department =>{
                                                const { name } = department
                                                return <option key={name} value={name}>{name}</option>
                                            })
                                        }
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
                                Add Teacher
                            </button>
                        </form>
                    </div>
                </div>
                <div className="ListBlock">
                    <header>
                        <h2> All Teachers </h2>
                    </header>
                    <div className="MainContainer">
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
        teachers: state.teachers,
        departments: state.departments
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setTeachers : (filters,projection) => dispatch(getAndSetTeachers(filters,projection)),
        setDepartments: (filters,projection) => dispatch(getAndSetDepartments(filters,projection))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddTeacherPage);