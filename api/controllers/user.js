

const User = require('../models/user')
const validate = require('../utils/inputErrors');
const {signupInputs} = require('./inputs/account')
const {authorities, valideAuthority}= require('../utils/authority')


//! ----- RETRIEVE A SINGLE USER ----------
exports.getUser = async (req, res, next) => {
    const userId = req.params.currentUserId;  
    const user = await User.findOne({_id:userId,deleted:false})
    if(!user){
        return res.status(404).json({
            date:null,
            message:'No user have been found with the provided ID, try again'
        })
    }

    const data= {
        userName:user.userName,
        authority:user.authority,
        status:user.status,
        avatar:user.avatar,
        email:user.email,
        createdAt:user.createdAt.toISOString(),
        updatedAt:user.updatedAt.toISOString()
    }

    return res.status(200).json({
        data,
        message:'Operation succeeded'
    })
}



//! ----- RETRIEVE ALL USERS ----------
exports.getAllUsers = async (req, res, next) => {
    
    const users = await User.find({deleted:false});
    if(!users.length){
        return res.status(404).json({
            date:null,
            message:'no user have been found, try again'
        })
    }

    const data = users.map(user=>({
                            ...user._doc,
                            createdAt:user.createdAt.toISOString(),
                            updatedAt:user.updatedAt.toISOString()
                        }))
    return res.status(200).json({
        data,
        message:'Operation succeeded'
    })


}





//! ----- EDIT A USER ----------

exports.updateUser = async (req, res, next) => {
    const userName = req.body.userName;
    const avatar = req.body.avatar;
    const email = req.body.email;
    const authority = req.body.authority;
    const userId = req.userId;
    const currentUserId=req.body.currentUserId

    const {userNameProperties,emailProperties} = signupInputs;

    const isError = [
        await validate(userName,userNameProperties),
        await validate(email,emailProperties),
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

    const currentUser = await User.findOne({_id:currentUserId})
    const userAuthority = authorities.find(elm=>elm===currentUser.authority)
    
    if(userAuthority){  
        if(userAuthority===user.authority||userAuthority==='ADMIN'&&user.authority==='SUPER_ADMIN'){
            return res.status(403).json({
                date:null,
                message:'Can not edit a user with the same or higher prevelige' 
            })
        }

        if(userAuthority==='ADMIN'&&user.authority==='USER'||userAuthority==='SUPER_ADMIN'&&user.authority==='USER'||userAuthority==='SUPER_ADMIN'&&user.authority==='ADMIN'){
            user.userName = userName;
            user.authority = authority;
            user.avatar = avatar;
            user.email = email
            const newUser = await user.save();    
            if(!newUser){
                return res.status(500).json({
                    message:'Error while updating the user'
                })
            }
            return res.status(200).json({
                data:{userName:newUser.userName,email:newUser.email,authority:newUser.authority,avatar:newUser.avatar,updatedAt:newUser.updatedAt.toISOString()},
                message:'User updated successfully'
            })
        }
    } 
    return res.status(403).json({
        date:null,
        message:'Not authorised to delete a user'
    })
}



//! ----- DELETE A USER ----------
exports.deleteUser = async (req, res, next) => {
    const userId = req.userId;
    const currentUserId = req.body.currentUserId

    const currentUser = await User.findOne({_id:currentUserId})

    const authority = authorities.find(elm=>elm===currentUser.authority)
    
    if(authority){
        
        if(authority===user.authority||authority==='ADMIN'&&user.authority==='SUPER_ADMIN'){
            return res.status(403).json({
                date:null,
                message:'Can not delete a user with the same or higher prevelige' 
            })
        }

        if(authority==='ADMIN'&&user.authority==='USER'||authority==='SUPER_ADMIN'&&user.authority==='USER'||authority==='SUPER_ADMIN'&&user.authority==='ADMIN'){
            user.status = false;
            const deletedUser = await user.save(); 
            return res.status(200).json({
                date:deletedUser,
                message:'User deleted successfully'
            })
        }
    }

    return res.status(403).json({
        date:null,
        message:'Not authorised to delete a user'
    })
}

