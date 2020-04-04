import React, { useState } from 'react'
import {connect } from 'react-redux'
import './_sidebar.scss'

import BeforeSigninLinks from '../BeforeSigninLinks'
import AfterSigninLinks from '../AfterSigninLinks'
import { getUsernameFromCookie } from '../../helperFunction/getCookie';


const Sidebar = (props) => {
  
  //  FIRST GET USERNAME FROM STORE
  let loggedIn = !!(props.username);

  /* IF USERNAME IS NOT IN STORE IT CAN HAVE TWO REASONS
  1) THAT USER IS NOT LOGGED IN 
  2) SERVER IS DOWN
  */

  // WE WILL CHECK TO REASSURE  THAT USER IS NOT LOGGEDIN
  // AND TRY TO GET USERNAME FROM COOKIES 
  if(!loggedIn){
    loggedIn = !!getUsernameFromCookie();
  }
  return (
    <div className="sidepane">
         <div className="sidepaneLogo">
           <h1>Attendance App</h1>
        </div>
                
      <div>
        {!loggedIn ? (
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