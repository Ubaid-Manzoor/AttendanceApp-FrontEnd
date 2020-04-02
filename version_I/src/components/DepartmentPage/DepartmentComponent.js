import React, { Component } from 'react';
import { connect } from 'react-redux';

import './_departmentComponent.scss';
// import { startUpdateDepartment } from '../../actions/departments';
// import departmentReducer from '../../reducers/department';


class DepartmentComponent extends Component {
    render() {
        const { name:departmentName } = this.props
        return (
            <div className="departmentComponent_Body">
                <div className="departmentComponent_Container">
                    <div className="departmentComponent_Data">
                        <h2>
                            {departmentName}
                        </h2>
                    </div>
                </div>
            </div>
        )
    }
}

// const mapDispatchToProps = (dispatch)=>{
//     return {
//         updataTeacher : (whomToUpdate,whatToUpdate)=> dispatch(startUpdateDepartment(whomToUpdate,whatToUpdate))
//     }
// }

export default connect()(DepartmentComponent);