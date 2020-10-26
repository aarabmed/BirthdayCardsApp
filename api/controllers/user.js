
const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/user')




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
        ...user._doc,
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
    const oldPassword = req.body.oldPassword;
    const password = req.body.password;
    const avatar = req.body.avatar
    const authority = req.body.authority;
    const userId = req.body.userId;

    const userNameErrors = [];
    const passwordErrors=[];
    const arrayErrors=[];
    
    
    if(userName.match('[!@#$%^&*(),.?":{}|<>]')){
        userNameErrors.push("special characters are not allowed on the user name")
    }
    if(validator.isLength(userName,{min:4})){
        userNameErrors.push("invalid user! minimum 4 letters are allowed")
    }

    if(validator.isLength(password,{min:6})){
        passwordErrors.push("invalid password value! minimum lenght is 6 charactere");
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

    const user = User.findOne({_id:userId})
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

    user.userName = userName;
    user.password = hashPassword;
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
    const userId = req.body.userId;
    const currentUserId = req.body.currentUserId
    

    const currentUser = await User.findOne({_id:currentUserId})
    
    if(currentUser.authority=='ADMIN'){
        const user = await User.findById(userId);
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

