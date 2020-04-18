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
            /**
             * IF there setTimeOut is set we need to clear it
             * OTHERWISE 
             * There will be a Memory Leak
             */
            clearTimeout(this.errorTimeOut);

            const data = this.state.data;

            /**
             * TRY DELETING ANY THING THAT CAN COME IN DATA
             * BUT SHOULD NOT BE SEND TO SERVER LIKE:- CONFIRM PASSWORD
             */

            const notAllowed = ['confirmPassword']

            /**
             * ONLY ALLOW THE DATA WHICH IS NOT IN 
             * NOT ALLOWED ARRAY
             */
            const filterData = Object.keys(data)
                               .filter(key => notAllowed.includes(key) ? false : true)
                               .reduce((obj, key)=>{
                                    obj[key] = data[key]
                                    return obj;
                               },{});

            makeRequest(requestUrl,filterData)
            .then(response => response.json())
            .then(response => this.handleResponse(response))
        }else{
            /**
             * Errors should not stay on page forever,
             * So after 3sec of errors are showen on The Page,
             * I should call clearAllErrors() to clear them 
             */
            this.errorTimeOut = setTimeout(()=>{
                this.clearAllErrors();
            },3000)
        }
    })

}