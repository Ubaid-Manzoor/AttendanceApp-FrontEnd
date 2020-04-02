import React from 'react';

const CourseComponent = (props)=>{
    const { name,department , teacherAssigned } = props;
    
    return(
        <div className="courseMainDiv">
            <div className="courseMainContainer">
                <div className="courseData">
                    <header>
                        <h1>{name}</h1>
                    </header>
                    <div className="courseBody">
                        <p>
                            Department : <span>{department}</span>
                        </p>
                        <p>
                            TeacherAssigned : <span>{teacherAssigned}</span>
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default CourseComponent;