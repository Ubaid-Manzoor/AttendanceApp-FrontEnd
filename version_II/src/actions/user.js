/////////////////////////// FOR  ALL USERS ////////////////////////////////////

export const setUser = (user) => ({
  type: 'SET_USER',
  user
})

export const getAndSetUser = ((username)=>{
  return (dispatch)=>{
        return new Promise((resolve, reject)=>{
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
          .then(user => {
            // RENAME ID TO USERNAME 
            user['username'] = user['_id']
            /** 
            *  REMOVE PASSWORD BECAUSE WE DONT 
            *  NEED PASSWORD IN FRONTEND
            *  AND PASSWORD SHOULD NOT BE SAVED IN COOKIES
            */
            delete user['password']
            dispatch(setUser(user))

            resolve();
          })
          .catch(error => {
            reject(error);
          })
        })
  }
})


/////////////////////////////// FOR ALL USERS END ///////////////////////////////////


