import React , { Component } from 'react'
// import { Link } from 'react-router-dom'
import "./SignUpPage.scss"

class SignUpPage extends Component{
    constructor(props){
        super(props);

        /////////////////////STATE///////////////////////////////
        this.state={
            signup_data:{
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

    onUsernameChange = (e)=>{
        const username = e.target.value
        this.setState((prevState)=>{
            return {
                signup_data: {
                    ...prevState.signup_data,
                    username
                }
            }
        })
    }

    onPasswordChange = (e)=>{
        const password = e.target.value
        this.setState((prevState)=>{
            return {
                signup_data: {
                    ...prevState.signup_data,
                    password
                }
            }
        })
    }

    onConfirmPasswordChange = (e)=>{
        const confirm_password = e.target.value
        this.setState((prevState)=>{
            return {
                signup_data: {
                    ...prevState.signup_data,
                    confirm_password
                }
            }
        })
    }

    onRoleChange = (e)=>{
        const role = e.target.value;
        this.setState((prevState)=>{
            return {
                signup_data: {
                    ...prevState.signup_data,
                    role
                }
            }
        })
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


    applyAuthentication(user_data){
        if(user_data.username === ''){
            this.setErrors({username: "Fill the box"})
        }else if(user_data.password === ''){
            this.setErrors({password: "Fill the box"})
        }else if(user_data.confirm_password === ''){
            this.setErrors({confirmPassword: "Fill the box"})
        }else if(user_data['password'] !== user_data['confirm_password']){
            this.setErrors({confirmPassword: "password did not match"})
        }
    }

    ///////////////////////ERROR HANDLERS END/////////////////////////////////////


    /////////////////////SETSTATE CALLBACK/////////////////////////////////

    waitTillStateChange(callback){
        this.setState(state => state,()=>{
                callback()
            }
        )
    }

    ////////////////////SETSTATE CALLBACK END//////////////////////////////


    ///////////////////////SIGN UP HANDLER////////////////////////////////

    handleSubmit = (e)=>{
        e.preventDefault();
        const user_data = {...this.state.signup_data}

        this.clearAllErrors();

        this.applyAuthentication(user_data)

        delete user_data.confirm_password
        
        this.waitTillStateChange(()=>{
            // Try Signing Up
            if(!this.state.errorsExists){
                fetch('http://localhost:5000/signup',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user_data)
                })
                .then(response => response.json())
                .then((response) =>{
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
                })
                .catch((error)=>{
                    console.log(error)
                })
            }
        })
    }

    /////////////////////SIGNUP HANDLER END////////////////////////////////////

    render(){
        return (
            <div className="SignUpMainBody">
                <div className="SignUpContainer">
                    <div className="SignUpFormContainer">
                        <header>
                            <h1>Account SignUp</h1>
                        </header>
                        {this.state.errors.otherError && <span>this.state.errors.otherError</span>}
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <label      
                                    className="usernameLabel"
                                    htmlFor="username"
                                >
                                    USERNAME
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input 
                                            type="text"
                                            id="username"
                                            value={this.state.signup_data.username}
                                            onChange={this.onUsernameChange}
                                        />
                                    </div>
                                    {this.state.errors.username && <span>{this.state.errors.username}</span>}

                                </div>
                            </div>
                            <div>
                                <label className="roleLabel">ROLE</label>
                                <div className="selectDiv">
                                    <select 
                                        name="role"
                                        value={this.state.signup_data.role}
                                        onChange={this.onRoleChange}
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label 
                                    className="pwdLabel"
                                    htmlFor="password"
                                >
                                    PASSWORD
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input 
                                            type="password"
                                            id="password"
                                            value={this.state.signup_data.password}
                                            onChange={this.onPasswordChange}
                                        />
                                    </div>
                                    {this.state.errors.password && <span>{this.state.errors.password}</span>}

                                </div>
                            </div>
                            <div>
                                <label 
                                    className="pwdLabel"
                                    htmlFor="confirm-password"
                                >
                                    CONFIRM PASSWORD
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input 
                                            type="password"
                                            id="confirm-password"
                                            value={this.state.signup_data.confirm_password}
                                            onChange={this.onConfirmPasswordChange}
                                        />
                                    </div>
                                    {this.state.errors.confirmPassword && <span>{this.state.errors.confirmPassword}</span>}
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

                            <button className="SignUpButton">
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