import React from 'react';
import './_teacherComponent.scss';

const TeacherComponent = (props)=>{
    const { username,name, courseAssigned } = props;
    return(
        <div className="teacherMainDiv">
            <div className="teacherMainContainer">
                <div className="teacherData">
                    <header>
                        <h2>
                            {name}<span>({username})</span>
                        </h2>

                    </header>
                    <div className="teacherBody">
                        CourseAssigned : <h1>{courseAssigned}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherComponent;