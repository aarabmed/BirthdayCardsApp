
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports=async (req,res,next)=>{
    const authHeader = req.get('Authorization')

    if(!authHeader){
        const error = {message:'Not Authenticated'};
        error.code=401;
        return res.json({error})
    }
    const token = authHeader.split(' ')[1];
    let decodedToken ;
        const key = process.env.SECRETCODE
        try {
            decodedToken = jwt.verify(token,key)
        } 
        catch (err) {
            const error = {message:'Not Authenticated'};
            error.code=401;
            return res.json({error})
        }
        

        if(!decodedToken){
            const error = {message:'Not Authenticated'};
            error.code=401;
            return res.json({error})
        }                                                               
    const user = await User.findById(decodedToken.userId);

    if(!user.validToken&&decodedToken){
        const error = {message:'Not Authenticated'};
        error.code=401;
        return res.json({error})
    }
    req.isAuth = true
    req.userId = decodedToken.userId
    next()
}