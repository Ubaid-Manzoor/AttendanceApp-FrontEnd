import React, { Component } from 'react'
import { connect } from 'react-redux';
import getAndSetCourses from '../../actions/courses';

import CourseComponent from './CourseComponent';
import './_course.scss';


class ShowCoursesPage extends Component {
    componentDidMount = ()=>{
        /**
         *  Set Projection to get only specific details
         *  of Courses
         */
        const projection = {
            "name": true,
            "department": true,
            "semester": true,
            "teacherAssigned": true
        }

        /**
         * Make Request for all Courses with 
         * Above Projection 
         */
        this.props.getCourses({},projection)
    }
    render(){
        return(
            <div className="courseBlock sidePage">
                <div className="courseContainer">
                    <header className="mainHeader">
                        <h1>All Course</h1>
                    </header>
                    <header></header>
                    <div className="mainBody">
                        {this.props.courses.map((course =>{
                            const {name, department, teacherAssigned } = course;
                            return <CourseComponent 
                                        key={name+department} 
                                        department={department} 
                                        name={name} 
                                        teacherAssigned={teacherAssigned} 
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
        courses : state.courses
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        getCourses: (filters, projection)=> dispatch(getAndSetCourses(filters, projection))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ShowCoursesPage);