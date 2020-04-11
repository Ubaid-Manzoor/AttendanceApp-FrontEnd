export default function(reqeustUrl, dataToSend={}){
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        /**
         * EVEN IF dataToSend IS EMPTY IT WILL 
         * SIMPLY SEND AND EMPTY OBJECT & IT WILL WORK
         */
        body: JSON.stringify(dataToSend)

    }
    return fetch(reqeustUrl,options)
}