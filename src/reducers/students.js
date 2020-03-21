import { updateStudent } from "../actions/students"

const studentReducerDefaultState = []

const studentReducer = (state = studentReducerDefaultState, action) =>{
    switch(action.type){
        case 'ADD_STUDENT':
            console.log("TEACHER REDUCER CALLED")
        //  CHECK IF COURSE ALREADY EXISTS ONLY THEN SAVE IT...
            if(!state.find( student => student.name === action.student.name)){
                return [
                    ...state,
                    action.student
                ]
            }else{
                return state
            }
        case 'UPDATE_STUDENT':
            const { whomToUpdate,whatToUpdate} = action;
            // const updatedState = state;
            console.log(whomToUpdate)
            const updatedState = state.map(student => {
                if(student.name === whomToUpdate){
                    return {
                        ...student,
                        ...whatToUpdate
                    }
                }else{
                    return student
                }
            })
            return updatedState
        default:
            return state;
    }
}

export default studentReducer;