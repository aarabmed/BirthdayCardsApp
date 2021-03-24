require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validate = require('../utils/inputErrors');

const {authorities, valideAuthority}= require('../utils/authority')
const {loginInputs, signupInputs} = require('./inputs/account')



//! ----- LOGIN A USER ----------
exports.userLogin = async (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;

    const {userNameProperties,passwordProperties} = loginInputs

    const isError = [
        await validate(userName,userNameProperties),
        await validate(password,passwordProperties),
    ].filter(e=>e!==true);

    if(isError.length){
        return res.status(500).json({
            errors:isError,
            message:'Invalid Input!'
        })
    }


    const user = await User.findOne({userName});
    if(!user){
        return res.json({
            date:[],
            status:404,
            message:`the user name <<${userName}>> does not exist in our database`
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    
    if(!isPasswordValid){
        return res.json({
            date:null,
            status:401,
            message:"invalid password"
        })
    }

    const {authority,_id,avatar}= user;
    const userId =_id.toString();
    const token = await jwt.sign({userId,userName},process.env.SECRETCODE,{expiresIn:'60min'})
    user.validToken = true;
    await user.save();
    const data = {
        userId,
        userName,
        token,
        authority,
        avatar,
        validToken:true,
    }

    req.session.set("user", { id: 20 });
    await req.session.save();
    
    return res.json({
        data,
        status:200,
        message:`${userName} is logged in successfully`
    })

} 



//! -----LOG OUT A USER ----------
exports.userLogout = async (req, res, next) => {
    const data = await User.findByIdAndUpdate({_id:req.body.userId},{validToken:false})
    
    if(data){
        return res.status(200).json({
            message:'User logged out successfully'
        })
    }
    return res.status(400).json({
        message:'Error while logging out, try again'
    })
    
} 


//! -----SET NEW PASSWORD ----------
exports.updateUserPassword = async (req, res, next) => {
    
    const oldPassword = req.body.oldPassword;
    const password = req.body.password;
    const userId = req.userId;

    const {passwordProperties,oldPasswordProperties} = signupInputs;

    const isError = [
        await validate(password,oldPasswordProperties),
        await validate(password,passwordProperties),
    ].filter(e=>e!==true);

    if(isError.length){
        return res.status(500).json({
            errors:isError,
            message:'Invalid Input!'
        })
    }

    const user = await User.findOne({_id:userId})
    if(!user){
        return res.status(404).json({
            message:'no user have been found, try again'
        })
    }

    const checkPassword = await bcrypt.compare(oldPassword,user.password)
    if(!checkPassword){
        return res.status().json({
            message:'Old password is incorrect'
        })
    }
    const hashPassword = await bcrypt.hash(password,12)
    user.password = hashPassword;

    const newUser = await user.save();
    if(!newUser){
        return res.status(500).json({
            message:'Error while updating the password'
        })
    }
    return res.status(200).json({
        data:{userName:newUser.userName,authority:newUser.authority,avatar:newUser.avatar,updatedAt:newUser.updatedAt.toISOString()},
        message:'password updated successfully'
    })
}



//! ----- CREATE A NEW USER ----------
exports.createUser = async (req, res, next) => {
    const userId = req.body.userId??'';
    const userName = req.body.userName;
    const password = req.body.password;
    const newAuthority = req.body.role;
    const email = req.body.email;
    const avatar = req.body.avatar
    const {userNameProperties,passwordProperties,emailProperties} = signupInputs

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        const error = {message:"Unauthorised, undefined user"}
        error.code = 400
        return res.status(400).json({
            error
        })
    }

    
    const isError = [
        await validate(userName,userNameProperties),
        await validate(password,passwordProperties),
        await validate(email,emailProperties),
    ].filter(e=>e!==true);
    
    let { authority } = await User.findById({_id:userId})

    const isAuthorised = authorities.includes(authority)
    const isValideAuthority = valideAuthority.includes(newAuthority)
    if(!isValideAuthority){
        isError.push({authority:`Error !!, authority of type ${newAuthority.toUpperCase()} is invalid`})
    }

    if(!isAuthorised){
        isError.push({error:`Unauthoried!!, an account of type ${authority} can not create an account of type ${newAuthority.toUpperCase()}`})
    }

    if(authority==='ADMIN'&&newAuthority==='SUPER_ADMIN'){
         isError.push({error:`Unauthoried!!, can not create a SUPER-ADMIN account with an account type ADMIN`})
    }

    if(isError.length){
        return res.json({
            status:500,
            errors:isError,
            message:'Invalid Input!'
        })
    }

    const hashPassword = await bcrypt.hash(password,12)

    const user = await new User({
        userName,
        password:hashPassword,
        avatar:`/assets/avatars/${avatar}.png`,
        status:true,
        email,
        authority:newAuthority.toUpperCase(),
        validToken:false
    })



    const userExisted = await User.findOne({userName});

    if(userExisted){
        return res.status(403).json({
            message:`The user ${userName} already exists`
        })
    }
    const createdUser = await user.save()
    const data = {
        userName : createdUser.userName,
        authority: createdUser.authority,
        createdAt: createdUser.createdAt.toISOString(),
        status:createdUser.status,
        email:createdUser.email,
        userId : createdUser.id,
        avatar:createdUser.avatar
    }
    return res.status(201).json({
        message:'user Created successfully',
        data
    })
}
