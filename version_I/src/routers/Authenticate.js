import React,{ Component } from 'react';
import { connect } from 'react-redux';
// import jwt_decode from 'jwt-decode';

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
            const role = "admin"
            // const { role } = jwt_decode(this.props.jwtToken);// We need to decode the Token
            if(role === "admin"){
                return true
            }else if(this.props.requiredRole === 'admin' && role === 'teacher'){
                return false
            }else if(this.props.requiredRole === 'teacher' && role === 'student'){
                return false
            }else{
                return true
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
    const mapToStateToProps = (state,props)=>({
        jwtToken:state.jwt
    })

    return connect(mapToStateToProps)(Authenticate);
}

