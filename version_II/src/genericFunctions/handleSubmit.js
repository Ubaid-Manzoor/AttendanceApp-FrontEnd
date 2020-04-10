import makeRequest from './makeRequest';


export default function(requestUrl){
    /**
     * FIRST CLEAR ALL ERROR 
     * AND
     * APPLY AUTHENTICATION TO CHECK FOR ERRORS
     */
    this.clearAllErrors();
    this.applyAuthentication()

    /**
     * IF THERE IS NO ERRORS ONLY THEN 
     * MAKE THE REQUEST OTHERWISE DO NOTHING
     * 
     * AND 
     * 
     * THERE WILL BE SHOWING ERROR ON THE FORM IF ANY EXIST
     */
    .then(()=>{
        if(!this.state.errorsExists){
            console.log(this)
            console.log(this.state);
            const data = this.state.data;
            console.log(data)
            // const requestUrl = 'http://localhost:5000/add_course'; 

            /**
             * TRY DELETING ANY THING THAT CAN COME IN DATA
             * BUT SHOULD NOT BE SEND TO SERVER LIKE:- CONFIRM PASSWORD
             */

            delete data['confirmPassword']
            
            makeRequest(requestUrl,data)
            .then(response => response.json())
            .then(response => this.handleResponse(response))
        }
    })

}