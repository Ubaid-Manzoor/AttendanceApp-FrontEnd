const courseReducerDefaultState = []

const courseReducer = (state = courseReducerDefaultState, action) =>{
    switch(action.type){
        case 'ADD_COURSE':
            return [
                ...state,
                action.course
            ]
        default:
            return state;
    }
}

export default courseReducer;