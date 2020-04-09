import makeRequest from './makeRequest';


export default (self)=>{
    return (requestUrl)=>{
        /**
         * FIRST CLEAR ALL ERROR 
         * AND
         * APPLY AUTHENTICATION TO CHECK FOR ERRORS
         */
        self.clearAllErrors();
        self.applyAuthentication()

        /**
         * IF THERE IS NO ERRORS ONLY THEN 
         * MAKE THE REQUEST OTHERWISE DO NOTHING
         * 
         * AND 
         * 
         * THERE WILL BE SHOWING ERROR ON THE FORM IF ANY EXIST
         */
        .then(()=>{
            if(!self.state.errorsExists){
                console.log(self)
                console.log(self.state);
                const data = self.state.data;
                console.log(data)
                // const requestUrl = 'http://localhost:5000/add_course'; 
    
                /**
                 * TRY DELETING ANY THING THAT CAN COME IN DATA
                 * BUT SHOULD NOT BE SEND TO SERVER LIKE:- CONFIRM PASSWORD
                 */
    
                delete data['confirmPassword']
                
                makeRequest(requestUrl,data)
                .then(response => response.json())
                .then(response => self.handleResponse(response))
            }
        })

    }
}