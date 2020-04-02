 import React from 'react';
 import ReactDOM from 'react-dom';
import AppRouter from './routers/AppRouter';

import {Provider} from 'react-redux'
import configureStore from './store/configureStore';
//  import { loginUser } from './actions/user';
//  import 'normalize.css/normalize.css';
import './styles/styles.scss';
import './styles/base/_base.scss'
// import Cookies from 'universal-cookie';
import { getAndSetUser } from '../src/actions/user'
import { getUsernameFromCookie} from './helperFunction/getCookie';

const store = configureStore();
const user = getUsernameFromCookie()

if(user){
  store.dispatch(getAndSetUser(getUsernameFromCookie()))
}

store.subscribe(()=>{
  // console.log(store.getState());
})

const jsx = (
<Provider store={store}>
  <AppRouter />
</Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));
