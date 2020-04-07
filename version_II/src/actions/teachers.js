/////////////////////////////// FOR TEACHERS ////////////////////////////////////////
export const setTeacher = (teacher) => ({
    type: 'ADD_TEACHER',
    teacher
})

const clearTeachers = () => ({
    type: 'CLEAR_TEACHERS'
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
                dispatch(clearTeachers());
                response.allTeachers.forEach(teacher => {
                    dispatch(setTeacher(teacher));
                });
                resolve();
            })
            .catch(error =>{
                reject(error);
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
            const { status } = response;
            if(status){
                dispatch(updateTeacher(whomToUpdate,whatToUpdate))
            } 
        })
    }
}



////////////////////////////// FOR TEACHERS END /////////////////////////////////////