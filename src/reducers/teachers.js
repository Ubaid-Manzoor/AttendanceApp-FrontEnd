const teacherReducerDefaultState = []

const teacherReducer = (state = teacherReducerDefaultState, action) =>{
    switch(action.type){
        case 'ADD_TEACHER':
            console.log("TEACHER REDUCER CALLED")
        //  CHECK IF COURSE ALREADY EXISTS ONLY THEN SAVE IT...
            if(!state.find( teacher => teacher.name === action.teacher.name)){
                return [
                    ...state,
                    action.teacher
                ]
            }else{
                return state
            }
        default:
            return state;
    }
}

export default teacherReducer;