import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { getRoleFromCookie } from '../helperFunction/getCookie'

export default (WrappedComponent) => {
    class Authenticate extends Component {
        state = {
            isAuthenticated: false
        }
        
        componentDidMount() {
            this.checkAndRedirect()
        }


        checkAndRedirect() {
            if(this.isAuthenticated()){
                this.setState( {isAuthenticated : true} )
            }else{
                this.setState( {isAuthenticated : false} )
                this.props.history.push('/')
            }
        }

        isAuthenticated(){
            const role = getRoleFromCookie();

            /**
             * Page will be only rendered if role === requiredRole
             * 
             * That will make sure Page will not be acessed if the user is not 
             *the required user
             */
            if(role === this.props.requiredRole){
                return true
            }else{
                return false
            }
        }

        render(){
            return(
                <React.Fragment>
                    {this.state.isAuthenticated && <WrappedComponent {...this.props} />}
                </React.Fragment>
            )
        }
    }

    return connect()(Authenticate);
}

