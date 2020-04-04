import { updateTeacher } from "../actions/teachers"

const teacherReducerDefaultState = []

const teacherReducer = (state = teacherReducerDefaultState, action) =>{
    switch(action.type){
        case 'ADD_TEACHER':
            // console.log("TEACHER REDUCER CALLED")
        //  CHECK IF COURSE ALREADY EXISTS ONLY THEN SAVE IT...
            if(!state.find( teacher => teacher.name === action.teacher.name)){
                return [
                    ...state,
                    action.teacher
                ]
            }else{
                return state
            }
        case 'UPDATE_TEACHER':
            const { whomToUpdate,whatToUpdate} = action;
            // const updatedState = state;
            console.log(whomToUpdate)
            const updatedState = state.map(teacher => {
                if(teacher.username === whomToUpdate){
                    return {
                        ...teacher,
                        ...whatToUpdate
                    }
                }else{
                    return teacher
                }
            })
            return updatedState

        case 'CLEAR_TEACHERS':
            return []
        default:
            return state;
    }
}

export default teacherReducer;