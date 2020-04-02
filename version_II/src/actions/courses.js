const addCourse = (course)=>{
    return {
        type: "ADD_COURSE",
        course
    }
}

// Getting From Database and Setting in Redux Store

const getAndSetCourses = (filters={},projection={})=>{
    return (dispatch)=>{
        return new Promise((resolve,reject)=>{
            fetch('http://localhost:5000/get_all_courses',{
                method: ['POST'],
                body: JSON.stringify({
                    filters,
                    projection
                })
            })
            .then(response => response.json())
            .then(response => {
                response.allCourses.forEach(course => {
                    dispatch(addCourse(course))
                });
                resolve();
            })
            .catch(error => {
                console.log(error);
                return reject(new Error("Error : ",error));
            })
        })
    }
}

export default getAndSetCourses;