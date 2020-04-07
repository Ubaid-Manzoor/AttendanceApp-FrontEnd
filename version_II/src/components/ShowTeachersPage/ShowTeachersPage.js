import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getAndSetTeachers } from '../../actions/teachers';

import TeacherComponent from './TeacherComponent';
import './_showTeachersPage.scss';


class ShowTeachersPage extends Component {
    componentDidMount = ()=>{

        /**
         *  Set Projection to get only specific details
         *  of Teacher
         */
        const projection = {
            "username": true,
            "name": true,
            "department": true
        }

        /**
         * Make Request for all Teacher with 
         * Above Projection 
         */
        this.props.getTeachers({},projection)
    }
    render(){
        return(
            <div className="teacherBlock sidePage">
                <div className="teacherContainer">
                    <header className="mainHeader">
                        <h1>All Teachers</h1>
                    </header>
                    <header></header>
                    <div className="teacher_mainBody">
                        {this.props.teachers.map((teacher =>{
                            const {username, name, department, courseAssigned } = teacher;
                            return <TeacherComponent 
                                        key={username} 
                                        username={username} 
                                        name={name}
                                        department={department} 
                                        courseAssigned={courseAssigned} 
                                    />
                        }))}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        teachers : state.teachers
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        getTeachers: (filters, projection)=> dispatch(getAndSetTeachers(filters, projection))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ShowTeachersPage);