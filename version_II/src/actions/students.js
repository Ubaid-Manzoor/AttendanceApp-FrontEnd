/////////////////////////////// FOR TEACHERS ////////////////////////////////////////
export const setStudent = (student) => ({
    type: 'ADD_STUDENT',
    student
})


const clearStudents = ()=> ({
    type: 'CLEAR_STUDENTS'
})

export const getAndSetStudents = (filters={},projection={}) => {
    return (dispatch) => {
        return new Promise((resolve,reject)=>{
            fetch("http://localhost:5000/get_all_students",{
                method: 'POST',
                body: JSON.stringify({
                    filters,
                    projection
                })
            })
            .then(response => response.json())
            .then(response => {
                dispatch(clearStudents());
                response.allStudents.forEach(student => {
                    dispatch(setStudent(student))
                });

                resolve();
            })
            .catch((error)=>{
                reject(error);
            })
        })
    }
}   

export const updateStudent = (whomToUpdate,whatToUpdate) => ({
    type: 'UPDATE_STUDENT',
    whatToUpdate,
    whomToUpdate
});

export const startUpdateStudent = (whomToUpdate,whatToUpdate) => {
    console.log("ToUPdata",whatToUpdate)
    return (dispatch) => {
        fetch('http://localhost:5000/update_student',{
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
                dispatch(updateStudent(whomToUpdate,whatToUpdate))
            } 
        })
    }
}



////////////////////////////// FOR TEACHERS END /////////////////////////////////////