const setAttendance = (attendance)=> ({
    type: 'SET_ATTENDANCE',
    attendance
})

const clearAttendance = ()=> ({
    type: 'CLEAR_ATTENDANCE'
})

const getAndSetAttendance = (filters={}) =>{
    console.log(filters)
    return (dispatch) => {
        return new Promise((resolve,reject)=>{
            fetch("http://localhost:5000/getAttendance",{
                method: 'POST',
                body: JSON.stringify(filters)
            })
            .then(response => response.json())
            .then(response => {
                const { data:attendance } = response['result'];

                dispatch(clearAttendance());
                dispatch(setAttendance(attendance))
                resolve();
            })
            .catch((error)=>{
                reject(error);
            })
        })
    }
}

export default getAndSetAttendance;