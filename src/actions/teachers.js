/////////////////////////////// FOR TEACHERS ////////////////////////////////////////
export const setTeacher = (name,isConfirmed,courseAssigned) => ({
    type: 'ADD_TEACHER',
    teacher: {
        name,
        isConfirmed,
        courseAssigned
    }
})


export const getAndSetTeachers = () => {
    return (dispatch) => {
        fetch("http://localhost:5000/get_all_teachers",{
            method: 'POST'
        })
        .then(response => response.json())
        .then(response => {
            console.log("RESPONSE : ",response)
            response.allTeachers.forEach(teacher => {
                dispatch(setTeacher(teacher.name,teacher.isConfirmed,"Subject"))
            });
        })
    }
}   

export const updateTeacher = (toUpdate) => ({
    type: 'UPDATE_TEACHER',
    toUpdate: {
        ...toUpdate
    }   
});

export const startUpdateTeacher = () => {
    return (dispatch) => {
        fetch()
    }
}



////////////////////////////// FOR TEACHERS END /////////////////////////////////////