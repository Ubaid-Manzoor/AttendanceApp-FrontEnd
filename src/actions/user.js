/////////////////////////// FOR  ALL USERS ////////////////////////////////////

export const setUser = (username,password,role) => ({
  type: 'SET_USER',
  user:{
    username,
    password,
    role
  }
})

export const getAndSetUser = ((username)=>{
  console.log("USERNAME :", username)
  return (dispatch)=>{
        fetch('http://localhost:5000/get_user',{
          method: 'POST',
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          const { _id:name, password, role} = data;
          console.log("NAME: ",name)
          dispatch(setUser(name,password,role))
        })
  }
})


/////////////////////////////// FOR ALL USERS END ///////////////////////////////////


