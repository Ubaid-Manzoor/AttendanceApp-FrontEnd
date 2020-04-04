export const setDepartment = (name) => ({
    type: 'SET_DEPARTMENT',
    department: {
        name
    }
})


export const getAndSetDepartments = () => {
    return (dispatch) => {
        return new Promise((resolve, reject)=>{
            fetch("http://localhost:5000/get_all_departments",{
                method: 'POST'
            })
            .then(response => response.json())
            .then(response => {
                // console.log("RESPONSE : ",response)
                response.allDepartments.forEach(department => {
                    dispatch(setDepartment(department.name))
                });

                resolve();
            })
            .catch((error)=>{
                reject(error);
            })
        })
    }
}