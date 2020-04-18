const clearMessage = function(time){
    setTimeout(()=>{
        this.setState({message: ""})
    },time)
}

export default clearMessage;