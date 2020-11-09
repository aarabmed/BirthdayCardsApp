

const User = require('../models/user')
const validate = require('../utils/inputErrors');
const {signupInputs} = require('./inputs/account')




//! ----- RETRIEVE A SINGLE USER ----------
exports.getUser = async (req, res, next) => {
    const userId = req.body.userId;  

    const user = await User.findOne({_id:userId})
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
    const users = await User.find();
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
    const avatar = req.body.avatar
    const authority = req.body.authority;
    const userId = req.userId;

    const {userNameProperties} = signupInputs;

    const isError = [
        await validate(userName,userNameProperties),
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

    user.userName = userName;
    user.authority = authority;
    user.avatar = avatar;

    const newUser = await user.save();
    if(!newUser){
        return res.status(500).json({
            message:'Error while updating the user'
        })
    }
    return res.status(200).json({
        data:{userName:newUser.userName,authority:newUser.authority,avatar:newUser.avatar,updatedAt:newUser.updatedAt.toISOString()},
        message:'User updated successfully'
    })
}



//! ----- DELETE A USER ----------
exports.deleteUser = async (req, res, next) => {
    const userId = req.userId;
    const currentUserId = req.body.currentUserId

    const currentUser = await User.findOne({_id:currentUserId})
    
    if(currentUser.authority=='ADMIN'){
        const user = await User.findById(userId);
        if(userId===currentUserId){
            user.validToken =false;
        }
        user.status = false;
        const deletedUser = await user.save();

        return res.status(200).json({
            date:deletedUser,
            message:'User deleted successfully'
        })
    }

    return res.status(403).json({
        date:null,
        message:'Not authorised to delete another user'
    })
}

