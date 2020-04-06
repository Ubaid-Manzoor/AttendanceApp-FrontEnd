const courseReducerDefaultState = []

const courseReducer = (state = courseReducerDefaultState, action) =>{
    switch(action.type){
        case 'ADD_COURSE':

        //  CHECK IF COURSE ALREADY EXISTS ONLY THEN SAVE IT...
            // console.log(action.course)
            if(!state.find( course => (course.name === action.course.name) && (course.department === action.course.department) )){
                return [
                    ...state,
                    action.course
                ]
            }else{
                return state
            }
        case 'CLEAR_COURSES':
            return []
        default:
            return state;
    }
}

export default courseReducer;