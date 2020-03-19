import React , { Component } from 'react';
// import { Link } from 'react-router-dom'
import './_dashboard.scss';
// import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
// import { getCookiesData } from '../../cookies/getCookiesData';
import { connect } from 'react-redux';
import { getAndSetUser } from '../../actions/user'
// import { Redirect } from 'react-router-dom';

import { getUsernameFromCookie } from '../../helperFunction/getCookie';
import Cookies from 'universal-cookie';
class Dashboard extends Component{

  constructor(props) {
    super(props);

    const logginStatus = this.checkLogginStatus();
    const cookies = new Cookies();
    console.log(cookies.getAll());
    this.state = {
      logginStatus
    }
  }


  componentDidMount = () => {
    if(this.state.logginStatus){
      this.props.getSetUser(getUsernameFromCookie());
    }
    const cookies = new Cookies();
    console.log(cookies.getAll());

  }

  checkLogginStatus = () =>{
    return !!(getUsernameFromCookie());
  }

  render(){
    if(this.state.logginStatus){
      return(
        <div className="dashboard-container">
          <h1>Welcome to the one click attendance app </h1>
          <p>Dashboard</p>
          <h1>{this.props.username}</h1>
          <h1>{this.props.role}</h1>
        </div>
      )
    }else{
      return <Redirect to="/login" />
    }      
  }
}

const mapStateToProps = (state) =>{
  return{
    username: state.user.username,
    role: state.user.role
  }
}


const mapDispatchToProps = (dispatch) => {
  return{
    getSetUser: (username) => dispatch(getAndSetUser(username))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);