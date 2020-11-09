require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validate = require('../utils/inputErrors');
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
        return res.status(404).json({
            date:[],
            message:`the user name <<${userName}>> does not exist in the database`
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    
    if(!isPasswordValid){
        return res.status(401).json({
            date:null,
            message:"invalid password"
        })
    }

    const {authority,_id}= user;
    const userId =_id.toString();

    const token = await jwt.sign({userId,userName},process.env.JWT_SECRETCODE,{expiresIn:'15min'})
    user.validToken = true;
    await user.save();
    const data = {
        userId,
        userName,
        token,
        authority
    }
    return res.status(200).json({
        data,
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
    const userName = req.body.userName;
    const password = req.body.password;
    const {userNameProperties,passwordProperties} = signupInputs
    
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

    const hashPassword = await bcrypt.hash(password,12)

    const user = await new User({
        userName,
        password:hashPassword,
        avatar:'',
        authority:'ADMIN',
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
        userId : createdUser.id
    }
    return res.status(201).json({
        message:'user Created successfully',
        data
    })
}
