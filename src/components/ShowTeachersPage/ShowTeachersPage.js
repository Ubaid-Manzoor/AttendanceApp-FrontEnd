import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getAndSetTeachers } from '../../actions/teachers';

import TeacherComponent from './TeacherComponent';
import './_showTeachersPage.scss';


class ShowTeachersPage extends Component {
    constructor(props){
        super(props);
        this.props.getTeachers();
    }
    
    render(){
        const listOfTeachers = this.props.teachers;
        return(
            <div className="teacherBlock sidePage">
                <div className="teacherContainer">
                    <header className="mainHeader">
                        <h1>All Teachers</h1>
                    </header>
                    <header></header>
                    <div className="teacher_mainBody">
                        {listOfTeachers.map((teacher =>{
                            const {username, name, courseAssigned } = teacher;
                            return <TeacherComponent key={username} username={username} name={name} courseAssigned={courseAssigned} />
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
        getTeachers: ()=> dispatch(getAndSetTeachers())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ShowTeachersPage);