import jwt from 'jsonwebtoken'
import jwtDecode from "jwt-decode";
import nookies from 'nookies'
import moment from 'moment'

const checkAuth  = async (ctx)=>{
    let token = nookies.get(ctx).token;
    let decodedToken = null;
    let isAuth = null
    
    if(ctx){
        const key = process.env.SECRETCODE

        if(token && key){     
            try {
                decodedToken = jwt.verify(token,key)
            } 
            catch (err) {

                return isAuth=false
                
            }
        
            return isAuth=true
        }
    }else{ 
        
        try {
            decodedToken = jwtDecode(token);
            const expire = new Date(decodedToken.exp * 1000);
            //console.log('TOOOOOKEN-TIME:',moment.unix(decodedToken.exp).isAfter(new Date()))
            return isAuth = moment.unix(decodedToken.exp).isAfter(new Date())

        } catch (error) {
            return isAuth = false
        } 

    }
}

export default checkAuth