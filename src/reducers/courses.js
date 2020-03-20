const courseReducerDefaultState = []

const courseReducer = (state = courseReducerDefaultState, action) =>{
    switch(action.type){
        case 'ADD_COURSE':

        //  CHECK IF COURSE ALREADY EXISTS ONLY THEN SAVE IT...
            if(!state.find( course => course.name === action.course.name)){
                return [
                    ...state,
                    action.course
                ]
            }else{
                return state
            }
        default:
            return state;
    }
}

export default courseReducer;