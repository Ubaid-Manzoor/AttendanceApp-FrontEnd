import React , { Component } from 'react'
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom';
import { getUsernameFromCookie } from '../../helperFunction/getCookie';
import { setUser } from '../../actions/user'
import Cookies from 'universal-cookie';

import setInputState from '../../genericFunctions/setInputState';
import handleSubmit from '../../genericFunctions/handleSubmit';

import "./LoginPage.scss";
class LoginPage extends Component{
    constructor(props){
        super(props);

        //////////////////////STATE /////////////////////////////////////

        this.state={
            data: {
                username: "",
                password: "",
                remember_me: true
            },
            errorsExists: false,
            errors:{
                username: "",
                password: "",
                usernameOrPassword: "",
                unAuthorized: "",
                otherError: ""
            }
        }

        ///////////////////////////STATE ENDS //////////////////////////////////
    }


    ////////////////////////////////// INPUT HANDLERS ///////////////////////////

    onInputChange = (e)=>{
        const value = e.target.value;
        const name = e.target.id;

        setInputState.call(this,"data",name,value);
    }

    ////////////////////////////////// INPUT HANDLERS ENDS ///////////////////////////////



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
            usernameOrPassword: "",
            unAuthorized: "",
            otherError: ""
        })
        this.setState({errorsExists: false});
    }


    applyAuthentication(){
        const data = this.state.data;
        return new Promise((resolve,reject)=>{
            if(data.username === ''){
                this.setErrors({username: "Fill the box"})
            }
            if(data.password === ''){
                this.setErrors({password: "Fill the box"})
            }
            resolve();
        })
    }

    ///////////////////////ERROR HANDLERS END/////////////////////////////////////


    setCookies = (username,role) =>{
        const cookies = new Cookies();
        cookies.set("username",username);
        cookies.set("role",role);
    }


    ////////////////////LOGIN HANDLER /////////////////////////////////////

    handleResponse = (response)=>{
        const { message, status } = response.result;

        if(response['status'] === 200){
            switch(status){
                case 200:
                    const { username,role } = response.result.data;
                    // SET THE COOKIES TO BE USED TO CHECK 
                    //IF & WHICH USER IF LOGGEDIN 
                    this.setCookies(username,role);
                    // USED TO RE-RENDER SIDEBAR WHILE LOGIN  
                    this.props.setUser(response.result.data);
                    this.props.history.push('/');
                    break;
                case 401:
                    this.setErrors({usernameOrPassword: message})
                    break;
                case 403:
                    this.setErrors({usernameOrPassword: message})
                    break;
                default:
                    console.log("Unknown response")
                    break;
            }
        }else if(response.status === 400){
            const result = response.result;
            console.log(result.message);
        }
    }


    onSubmit = (e)=>{
        e.preventDefault();

        const url = "http://localhost:5000/login";
        handleSubmit.call(this,url);
    }


    //////////////////////////LOGIN HANDLER ENDS //////////////////////////////
    render(){
        const loggedIn = !!getUsernameFromCookie();
        if(!loggedIn){
            return (
                <div className="MainBody LoginMainBody">
                    <div className="Container LoginContainer">
                        <div className="FormContainer LoginFormContainer">
                            <header>
                                <h1>Account Login</h1>
                            </header>
                            {this.state.errors.usernameOrPassword && <p className="errorMessage">{this.state.errors.usernameOrPassword}</p>}
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
                                                placeholder=""
                                                value={this.state.username}
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
                                        PASSWORD
                                    </label>
                                    <div className="inputErrorDiv">
                                        <div className="inputDiv">
                                            <input 
                                                type="password"
                                                id="password"
                                                placeholder=""
                                                value={this.state.password}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                        {this.state.errors.password && <span className="errorMessage">{this.state.errors.password}</span>}
                                    </div>
                                </div>
                                <div className="LoginFooter">
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
    
                                    <div>Forgot Password?</div>   
                                </div>
    
                                <button className="Button LoginButton">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )

        }else{
            return <Redirect to="/" />
        }
    }
}

const mapStateToProps = (state) => {
    return {
      user: state.user
    };
  };

const mapDispatchToProps = (dispatch) => {
    return {
        setUser : (user)=> dispatch(setUser(user))
    }
}
  
export default connect(mapStateToProps,mapDispatchToProps)(LoginPage);
  