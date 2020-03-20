import React from 'react';

const CourseComponent = (props)=>{
    const { name, teacherAssigned } = props;
    
    return(
        <div className="courseMainDiv">
            <div className="courseMainContainer">
                <div className="courseData">
                    <header>
                        <h1>{name}</h1>
                    </header>
                    TeacherAssigned : <h1>{teacherAssigned}</h1>
                </div>
            </div>
        </div>
    )
}

export default CourseComponent;