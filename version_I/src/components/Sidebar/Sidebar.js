import React from 'react'
import {connect } from 'react-redux'
import './_sidebar.scss'

import BeforeSigninLinks from '../BeforeSigninLinks'
import AfterSigninLinks from '../AfterSigninLinks'


// const loggedin = false;

const Sidebar = (props) => {
  return (

    <div className="sidepane">
         <div className="sidepaneLogo">
           <h1>Attendance App</h1>
        </div>
                
      <div>
        {!props.username ? (
          <BeforeSigninLinks />
        ) : (
            <AfterSigninLinks />
          )}
      </div>
    </div>


  )
};

const mapStateToProps = (state) => {
  return {
    username: state.user.username 
  };
};

export default connect(mapStateToProps)(Sidebar);