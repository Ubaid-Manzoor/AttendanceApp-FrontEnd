import { connect } from 'react-redux';
import React , { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { getUsernameFromCookie } from '../../helperFunction/getCookie';

import './_dashboard.scss';

class Dashboard extends Component{

  render(){
    const logginStatus = !!getUsernameFromCookie();
    
    if(logginStatus){
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

export default connect(mapStateToProps)(Dashboard);
