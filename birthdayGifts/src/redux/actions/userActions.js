import {destroyCookie } from 'nookies';
import { USER } from "../defines";

export const setUser = (user) => ({
  type: USER.SET_USER,
  user,
});

export const removeUser = () => ({
  type: USER.REMOVE_USER,
},()=>{
  destroyCookie(null,'token',{
    path: '/'
   })
});

