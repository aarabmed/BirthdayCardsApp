
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports=async (req,res,next)=>{
    
    const authHeader = req.get('Authorization')

    if(!authHeader){
        const error = new Error('Not Authenticated');
        error.code=401;
        throw error
    }
    const token = authHeader.split(' ')[1];
    let decodedToken ;
    try {
        decodedToken = jwt.verify(token,process.env.JWT_SECRETCODE)
    } 
    catch (err) {
        const error = new Error('Not Authenticated');
        error.code=401;
        throw error
    }
    

    if(!decodedToken){
        const error = new Error('Not Authenticated');
        error.code=401;
        throw error
    }
    const user = await User.findById(decodedToken.userId);

    if(!user.validToken&&decodedToken){
        const error = new Error('Not Authenticated');
        error.code=401;
        throw error
    }
    req.isAuth = true
    req.userId = decodedToken.userId
    next()
}