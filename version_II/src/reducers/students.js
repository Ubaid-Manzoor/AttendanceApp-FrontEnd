const studentReducerDefaultState = []

const studentReducer = (state = studentReducerDefaultState, action) =>{
    switch(action.type){
        case 'ADD_STUDENT':
        //  CHECK IF COURSE ALREADY EXISTS ONLY THEN SAVE IT...
            if(!state.find( student => student.username === action.student.username)){
                return [
                    ...state,
                    action.student
                ]
            }else{
                return state
            }
        case 'UPDATE_STUDENT':
            const { whomToUpdate,whatToUpdate} = action;
            const updatedState = state.map(student => {
                if(student.username === whomToUpdate){
                    return {
                        ...student,
                        ...whatToUpdate
                    }
                }else{
                    return student
                }
            })
            return updatedState
        case 'CLEAR_STUDENTS':
            return []
        default:
            return state;
    }
}

export default studentReducer;