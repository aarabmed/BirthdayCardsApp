require('dotenv').config();
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user')


//! ----- LOGIN A USER ----------
exports.userLogin = async (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;
    const userNameErrors = [];
    const passwordErrors=[];
    const arrayErrors=[];

    if(validator.isEmpty(userName,{ignore_whitespace:true})){
        userNameErrors.push("Enter your user Name");
    }
    if(validator.isEmpty(password,{ignore_whitespace:true})){
        passwordErrors.push("Enter your password");
    }

    if(passwordErrors.length){
        arrayErrors.push({passwordError:passwordErrors[0]})
    }

    if(userNameErrors.length){
        arrayErrors.push({userNameError:userNameErrors[0]})
    }

    if(arrayErrors.length){
        return res.status(500).json({
            errors:arrayErrors,
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


//! ----- CREATE A NEW USER ----------
exports.createUser = async (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;
    const userNameErrors = [];
    const passwordErrors=[];
    const arrayErrors=[];
  
    if(!validator.isLength(userName,{min:4})){
        userNameErrors.push("user name is very short! minimum 4 letters are allowed")
    }
    if(userName.match('[!@#$%^&*(),.?":{}|<>]')){
        userNameErrors.push("special characters are not allowed on the user name")
    }


    if(!validator.isLength(password,{min:6})){
        passwordErrors.push("password is very weak! minimum lenght is 6 charactere");
    }

    if(passwordErrors.length){
        arrayErrors.push({passwordError:passwordErrors[0]})
    }
    if(userNameErrors.length){
        arrayErrors.push({userNameError:userNameErrors[0]})
    }

    if(arrayErrors.length){
        return res.status(500).json({
            errors:arrayErrors,
            message:'Invalid input'
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
