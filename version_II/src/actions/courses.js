const addCourse = (course)=>{
    return {
        type: "ADD_COURSE",
        course
    }
}

const clearCourse = ()=>{
    return {
        type: "CLEAR_COURSES"
    }
}
// Getting From Database and Setting in Redux Store

const getAndSetCourses = (filters={},projection={})=>{
    console.log("FILTERS : ",{filters,projection});
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

                console.log("ALL COURSES :: ",response.allCourses);
                dispatch(clearCourse());
                response.allCourses.forEach(course => {
                    dispatch(addCourse(course))
                });
                resolve();
            })
            .catch(error => {
                reject(error);
            })
        })
    }
}

export default getAndSetCourses;