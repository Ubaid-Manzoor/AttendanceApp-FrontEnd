// import { updateTeacher } from "../actions/teachers"

const departmentReducerDefaultState = []

const departmentReducer = (state = departmentReducerDefaultState, action) =>{
    switch(action.type){
        case 'SET_DEPARTMENT':
            // console.log("INITIAL STATE ", state)
            // console.log("DEPARTMENT REDUCER CALLED")
        //  CHECK IF COURSE ALREADY EXISTS ONLY THEN SAVE IT...
            if(!state.find( department => department.name === action.department.name)){
                return [
                    ...state,
                    action.department
                ]
            }else{
                return state
            }
        case 'UPDATE_DEPARTMENT':
            const { whomToUpdate,whatToUpdate} = action;
            // console.log(whomToUpdate)
            const updatedState = state.map(department => {
                if(department.name === whomToUpdate){
                    return {
                        ...department,
                        ...whatToUpdate
                    }
                }else{
                    return department
                }
            })
            return updatedState
        default:
            return state;
    }
}

export default departmentReducer;