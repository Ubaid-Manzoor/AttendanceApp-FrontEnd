import Cookies from 'universal-cookie';

const getCookiesData = ()=>{
    const cookies = new Cookies();
    const { username,role } = cookies.getAll();
    return {
        username,
        role
    }
}

export {getCookiesData};