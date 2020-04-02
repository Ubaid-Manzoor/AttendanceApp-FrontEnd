import Cookies from 'universal-cookie';


export default  ()=>{
    const cookies = new Cookies();
    cookies.remove('username');
    cookies.remove('role');

}