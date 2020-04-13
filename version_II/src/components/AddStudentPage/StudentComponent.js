import React, { Component } from 'react';
import { connect } from 'react-redux';

import './_studentComponents.scss';
import { startUpdateStudent } from '../../actions/students';
// import teacherReducer from '../../reducers/teachers';


class StudentComponent extends Component {
//     constructor(props){
//         super(props);

//         this.state = {
//             "teachersName": teachersName,
//             "isConfirmed" : isConfirmed
//         }
//     }
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
        const { username,name, department, semester , isConfirmed} = this.props
        return (
            <div className={`Component_Body ${isConfirmed ? "" : "Component_notConfirmed"}`}>
                <div className="Component_Container">
                    <div className="Component_Data">
                        <h2>
                            {username}
                            <span>
                                ({name})
                            </span>
                        </h2>
                        <div>
                            <h3>{department}-{semester}</h3>
                        </div>
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
        updataTeacher : (whomToUpdate,whatToUpdate)=> dispatch(startUpdateStudent(whomToUpdate,whatToUpdate))
    }
}

export default connect(null,mapDispatchToProps)(StudentComponent);