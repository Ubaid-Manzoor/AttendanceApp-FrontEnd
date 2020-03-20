const addCourse = (course)=>{
    return {
        type: "ADD_COURSE",
        course
    }
}

// Getting From Database and Setting in Redux Store

const getAndSetCourses = ()=>{
    return (dispatch)=>{
        fetch('http://localhost:5000/get_all_courses',{
            method: ['POST']
        })
        .then(response => response.json())
        .then(response => {
            response.allCourses.forEach(course => {
                dispatch(addCourse(course))
            });
        })
    }
}

export default getAndSetCourses;