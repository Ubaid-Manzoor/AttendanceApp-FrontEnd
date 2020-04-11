/**
 * this :- REPRESENT THE OBJECT WHICH IS USING THIS FUNCTION
 */
export default function(objName,key,value){
/**
 * objName : IS THE NAME OF OBJ WHICH STORE FORM DATA IN THE STATE
 * key,value : IS THE PAIR WE WANT TO SET IN TO OBJ objName IN THE STATE 
*/
    console.log(this.state);
    return new Promise((resolve,reject)=>{
        this.setState((prevState)=>{
            return {
                [objName]: {
                    ...prevState[objName],
                    [key]:value
                }
            }
        },resolve)
    })
}

