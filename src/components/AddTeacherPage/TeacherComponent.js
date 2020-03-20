import React, { Component } from 'react';
import { connect } from 'react-redux';

import './_teacherComponents.scss';
// import teacherReducer from '../../reducers/teachers';


class TeacherComponent extends Component {
//     constructor(props){
//         super(props);

//         this.state = {
//             "teachersName": teachersName,
//             "isConfirmed" : isConfirmed
//         }
//     }

    render() {
        const { name:teachersName , isConfirmed} = this.props
        return (
            <div className={`teacherComponent_Body ${isConfirmed ? "" : "notConfirmed"}`}>
                <div className="teacherComponent_Container">
                    <div className="teacherComponent_Data">
                        <h2>
                            {teachersName}
                        </h2>
                        {
                            (()=>{
                                if(!isConfirmed){
                                    return <button>Confirm</button>
                                }else{
                                    return <button>Unconfirmed</button>
                                }
                            })()
                        }
                    </div>
                </div>
            </div>
        )
    }
}



export default connect()(TeacherComponent);