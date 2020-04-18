import React , { Component } from 'react'

import setInputState from '../../genericFunctions/setInputState';
import handleSubmit from '../../genericFunctions/handleSubmit';

import "./SignUpPage.scss"


//*****************************************************************************************
//*****************************************************************************************
//*****************************************************************************************


/**
 * NOT SURE THIS IS FULLY ERROR PRONE CHECK BEFORE 
 * UPDATING
 */
//*****************************************************************************************
//*****************************************************************************************
//*****************************************************************************************



class SignUpPage extends Component{
    constructor(props){
        super(props);

        /////////////////////STATE///////////////////////////////
        this.state={
            data:{
                username: "username",
                role: "student",
                password: "",
                confirm_password: "",
                remember_me: false,
            },
            errorsExists: false,
            errors: {
                username: "",
                password: "",
                confirmPassword: "",
                otherError: ""
            }
        }

        //////////////////////STATE END///////////////////////////
    }

    /////////////////////////INPUT HANDLERS////////////////////////////

    onInputChange = (e)=>{
        const value = e.target.value;
        const name = e.target.id;
        setInputState.call(this,"data",name,value);
    }

    ///////////////////////INPUT HANDLERS END//////////////////////////////
    

    ///////////////////////ERRORS HANDLERS//////////////////////////////////

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
            confirmPassword: "",
            otherError: ""
        })
        this.setState({errorsExists: false});
    }


    applyAuthentication(){
        const user_data = this.state.data;
        return new Promise((resolve,reject)=>{
            if(user_data.username === ''){
                this.setErrors({username: "Fill the box"})
            }
            if(user_data.password === ''){
                this.setErrors({password: "Fill the box"})
            }
            if(user_data.confirm_password === ''){
                this.setErrors({confirmPassword: "Fill the box"})
            }
            if(user_data['password'] !== user_data['confirm_password']){
                this.setErrors({confirmPassword: "password did not match"})
            }

            resolve();
        })
    }

    ///////////////////////ERROR HANDLERS END/////////////////////////////////////


    ///////////////////////SIGN UP HANDLER////////////////////////////////

    handleResponse = (response)=>{
        if(response['status'] === 200){
            const result = response.result;
            switch(result.status){
                case 201:
                    this.props.history.push('/login')
                    break;
                case 409:
                    this.setErrors({username: result.message})
                    break;
                case 422:
                    this.setErrors({otherError: result.message})
                    break;
                default:
                    console.log("Unknown Response!!")
                    break;
            }
        }else if(response['status'] === 400){
            const result = response.result;
            this.setErrors({otherError: result.message})
        }
    }

    onSubmit = (e)=>{
        e.preventDefault();

        const url = 'http://localhost:5000/signup';
        handleSubmit.call(this,url);
    }
    
    /////////////////////SIGNUP HANDLER END////////////////////////////////////

    render(){
        return (
            <div className="MainBody SignUpMainBody">
                <div className="Container SignUpContainer">
                    <div className="FormContainer SignUpFormContainer">
                        <header>
                            <h1>Account SignUp</h1>
                        </header>
                        {this.state.errors.otherError && <span>this.state.errors.otherError</span>}
                        <form onSubmit={this.onSubmit}>
                            <div>
                                <label      
                                    className="Label"
                                    htmlFor="username"
                                >
                                    USERNAME
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input 
                                            type="text"
                                            id="username"
                                            value={this.state.data.username}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.username && <span className="errorMessage">{this.state.errors.username}</span>}

                                </div>
                            </div>
                            <div>
                                <label className="Label">
                                    ROLE
                                </label>
                                <div className="selectDiv">
                                    <select 
                                        name="role"
                                        id="role"
                                        value={this.state.data.role}
                                        onChange={this.onInputChange}
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="password"
                                >
                                    PASSWORD
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input 
                                            type="password"
                                            id="password"
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
                                    htmlFor="confirm_password"
                                >
                                    CONFIRM PASSWORD
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input 
                                            type="password"
                                            id="confirm_password"
                                            value={this.state.data.confirm_password}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.confirmPassword && <span className="errorMessage">{this.state.errors.confirmPassword}</span>}
                                </div>
                            </div>
                            
                            <div className="SignUpFooter">
                                <div className="remember-me">
                                    <input 
                                        type="checkbox"
                                        id="remember_me"
                                    />
                                    <label 
                                        htmlFor="remember_me"
                                    >
                                        Remember Me
                                    </label>
                                </div>

                                <div>Account Already Exist?</div>   
                            </div>

                            <button className="Button SignUpButton">
                                SignUp
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUpPage;