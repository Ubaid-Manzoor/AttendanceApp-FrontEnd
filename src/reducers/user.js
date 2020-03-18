// Expenses Reducer

const userReducerDefaultState = {
  username: undefined,
  role: undefined,
  password: undefined
};

export default (state = userReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_USER':
      const {username,password,role} = action.user;
      console.log(action)
      console.log("USRNAME111 " , username);
      return {
        username,
        password,
        role
      }
    default:
      return state;
  }
};
