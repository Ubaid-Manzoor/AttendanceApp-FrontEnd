import React, { Component } from 'react'
import { connect } from 'react-redux';
import getAndSetCourses from '../../actions/courses';

import CourseComponent from './CourseComponent';
import './_course.scss';


class ShowCoursesPage extends Component {
    constructor(props){
        super(props);
        this.props.getCourses();
    }
    
    render(){
        const listOfCourses = this.props.courses;
        return(
            <div className="courseBlock sidePage">
                <div className="courseContainer">
                    <header className="mainHeader">
                        <h1>All Course</h1>
                    </header>
                    <header></header>
                    <div className="mainBody">
                        {listOfCourses.map((course =>{
                            const {name, teacherAssigned } = course;
                            return <CourseComponent key={name} name={name} teacherAssigned={teacherAssigned} />
                        }))}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        courses : state.courses
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        getCourses: ()=> dispatch(getAndSetCourses())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ShowCoursesPage);