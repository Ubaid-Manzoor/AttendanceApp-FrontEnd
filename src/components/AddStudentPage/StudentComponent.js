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
        const whomToUpdate = this.props.name;
        const whatToUpdate = {
            "confirmed": (!this.props.isConfirmed)
        }
        this.props.updataTeacher(whomToUpdate,whatToUpdate)
    }

    render() {
        const { name:teachersName , isConfirmed} = this.props
        return (
            <div className={`studentComponent_Body ${isConfirmed ? "" : "notConfirmed"}`}>
                <div className="studentComponent_Container">
                    <div className="studentComponent_Data">
                        <h2>
                            {teachersName}
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
        updataTeacher : (whomToUpdate,whatToUpdate)=> dispatch(startUpdateStudent(whomToUpdate,whatToUpdate))
    }
}

export default connect(null,mapDispatchToProps)(StudentComponent);