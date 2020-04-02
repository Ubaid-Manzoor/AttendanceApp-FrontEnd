import React from 'react'
import { NavLink } from 'react-router-dom';

import './_beforeSigninLinks.scss'

const BeforeSigninLinks = () => (
      <div className="BeforeSigninLinks__wrapper">
        <button className=" button"><NavLink to="/login">Login</NavLink></button>
        <button className="button"><NavLink to="/signup">Signup</NavLink></button>
        <button className="button"><NavLink to="/help">Help</NavLink></button>
      </div> 
      
);
export default BeforeSigninLinks;
