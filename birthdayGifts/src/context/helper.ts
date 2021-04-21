import checkAuth from '../common/auth'
import Router from "next/router";


export const withAuth = async (handler) =>{
   
   const isAuth = checkAuth();
   const oldRoute = Router.query.page
   if(isAuth){  
        return handler
   }

   return Router.push({pathname:'login',query:{'redirectTo':oldRoute}})
};