export default (self)=>{
    /**
     * self :- REPRESENT THE OBJECT WHICH IS USING THIS FUNCTION
     */
    return (objName,key,value)=>{
        /**
         * objName : IS THE NAME OF OBJ WHICH STORE FORM DATA IN THE STATE
         * key,value : IS THE PAIR WE WANT TO SET IN TO OBJ objName IN THE STATE 
        */
       console.log(self.state);
        self.setState((prevState)=>{
            return {
                [objName]: {
                    ...prevState[objName],
                    [key]:value
                }
            }
        })
    }
}

