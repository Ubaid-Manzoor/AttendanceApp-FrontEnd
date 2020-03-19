// import Cookies from "universal-cookie";

// Expenses Reducer

const userReducerDefaultState = {
  username: null,
  role: null,
  password: null
};

export default (state = userReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_USER':
      const {username,password,role} = action.user;
      return {
        username,
        password,
        role
      }
    default:
      return state;
  }
};
