/////////////////////////////// FOR TEACHERS ////////////////////////////////////////
export const setTeacher = (teacher) => ({
    type: 'ADD_TEACHER',
    teacher
})


export const getAndSetTeachers = (filters={}, projection={}) => {
    console.log("Filters : ",filters, "Projection : ", projection);
    return (dispatch) => {
        return new Promise((resolve, reject)=>{
            fetch("http://localhost:5000/get_all_teachers",{
                method: 'POST',
                body: JSON.stringify({
                    filters,
                    projection
                })
            })
            .then(response => response.json())
            .then(response => {
                response.allTeachers.forEach(teacher => {
                    // const { username, name, department, confirmed} = teacher;
                    dispatch(setTeacher(teacher))
                });
                resolve();
            })
            .catch(error =>{
                reject(new Error('Error : ',error))
            })
        })
    }
}   

export const updateTeacher = (whomToUpdate,whatToUpdate) => ({
    type: 'UPDATE_TEACHER',
    whatToUpdate,
    whomToUpdate
});

export const startUpdateTeacher = (whomToUpdate,whatToUpdate) => {
    
    console.log("ToUPdata",whatToUpdate)
    return (dispatch) => {
        fetch('http://localhost:5000/update_teacher',{
            method:['POST'],
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                whomToUpdate,
                whatToUpdate
            })
        })
        .then(response => response.json())
        .then(response => {
            // console.log(response);
            const { status } = response;
            if(status){
                dispatch(updateTeacher(whomToUpdate,whatToUpdate))
            } 
        })
    }
}



////////////////////////////// FOR TEACHERS END /////////////////////////////////////