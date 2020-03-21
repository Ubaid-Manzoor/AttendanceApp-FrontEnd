/////////////////////////////// FOR TEACHERS ////////////////////////////////////////
export const setStudent = (name,confirmed) => ({
    type: 'ADD_STUDENT',
    student: {
        name,
        confirmed
    }
})


export const getAndSetStudents = () => {
    return (dispatch) => {
        fetch("http://localhost:5000/get_all_students",{
            method: 'POST'
        })
        .then(response => response.json())
        .then(response => {
            console.log("RESPONSE : ",response)
            response.allStudents.forEach(student => {
                dispatch(setStudent(student.name,student.confirmed))
            });
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
            console.log(response);
            const { status } = response;
            if(status){
                dispatch(updateStudent(whomToUpdate,whatToUpdate))
            } 
        })
    }
}



////////////////////////////// FOR TEACHERS END /////////////////////////////////////