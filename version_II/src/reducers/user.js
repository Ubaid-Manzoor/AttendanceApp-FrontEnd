// import Cookies from "universal-cookie";

// Expenses Reducer

const userReducerDefaultState = {
  user: {}
};

export default (state = userReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.user
    default:
      return state;
  }
};
