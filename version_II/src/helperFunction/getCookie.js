import Cookies from 'universal-cookie';

export const getUsernameFromCookie = ()=>{
    const cookies = new Cookies();
    return cookies.get('username')
}

export const getRoleFromCookie = ()=>{
    const cookies = new Cookies();
    return cookies.get('role');
}

