
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports=(req,res,next)=>{
    
    const authHeader = req.get('Authorization')
    if(!authHeader){
        req.isAuth = false
       return next()
    }
    const token = authHeader.split(' ')[1];
    let decodedToken ;
    try {
        decodedToken = jwt.verify(token,process.env.JWT_SECRETCODE)
    } 
    catch (error) {
        req.isAuth = false
        return next()
    }
    
    if(!decodedToken){
        req.isAuth = false
        return next()
    }
    const user = User.findById(decodedToken.userId);
    if(!user.validToken&&decodedToken){
        req.isAuth = false
        return next()
    }
    req.isAuth = true
    req.userId = decodedToken.userId
    next()
}