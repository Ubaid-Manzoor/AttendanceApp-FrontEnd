import React, { Component } from 'react';
import { connect } from 'react-redux';

import './_teacherComponents.scss';
import { startUpdateTeacher } from '../../actions/teachers';
// import teacherReducer from '../../reducers/teachers';


class TeacherComponent extends Component {
    onButtonClick = (e) =>{
        console.log(e)
        console.log(this.props.isConfirmed)
        const whomToUpdate = this.props.username;
        const whatToUpdate = {
            "confirmed": (!this.props.isConfirmed)
        }
        this.props.updataTeacher(whomToUpdate,whatToUpdate)
    }

    render() {
        const { username ,name:teachersName , isConfirmed} = this.props
        return (
            <div className={`Component_Body ${isConfirmed ? "" : "Component_notConfirmed"}`}>
                <div className="Component_Container">
                    <div className="Component_Data">
                        <h2>
                            {teachersName}<span>({username})</span>
                        </h2>
                        {
                            (()=>{
                                if(!isConfirmed){
                                    return <button onClick={this.onButtonClick}>Confirm</button>
                                }else{
                                    return <button onClick={this.onButtonClick}>Unconfirmed</button>
                                }
                            })()
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        updataTeacher : (whomToUpdate,whatToUpdate)=> dispatch(startUpdateTeacher(whomToUpdate,whatToUpdate))
    }
}

export default connect(null,mapDispatchToProps)(TeacherComponent);