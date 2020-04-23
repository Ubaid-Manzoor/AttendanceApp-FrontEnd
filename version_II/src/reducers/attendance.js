const attendanceReducerDefaultState = {}

const attendanceReducer = (state = attendanceReducerDefaultState, action)=>{
    switch(action.type){
        case 'SET_ATTENDANCE':
            return action.attendance
        case 'CLEAR_ATTENDANCE':
            return {}
        default:
            return state
    }
}

export default attendanceReducer;