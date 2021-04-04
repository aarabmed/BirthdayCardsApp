

const User = require('../models/user')
const validate = require('../utils/inputErrors');
const {signupInputs} = require('./inputs/account')
const {authorities, valideAuthority}= require('../utils/authority');
const toBoolean = require('../utils/toBoolean');


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
    const userId = req.userId
    const users = await User.find({deleted:false,_id:{$ne:userId}});
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
    const userId = req.params.id;
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

//! ----- SET USER STATUS ----------
exports.setUserStatus = async (req, res, next) => {
    const status = toBoolean(req.body.status);
    const userId = req.params.id;
    const currentUserId=req.body.currentUserId

    const {statusProperties} = signupInputs;

    const isError = [
        await validate(status,statusProperties),
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
                message:`You can not ${status?'activate':'desactivate'} a user with the same or higher prevelige`
            })
        }

        if(userAuthority==='ADMIN'&&user.authority==='REGULAR'||userAuthority==='SUPER_ADMIN'&&user.authority==='REGULAR'||userAuthority==='SUPER_ADMIN'&&user.authority==='ADMIN'){
            user.status = status;
            user.statusUpdatedBy = currentUser._id
            const newUser = await user.save();    
            if(!newUser){
                return res.status(500).json({
                    message:`Error while ${status?'activating':'desactivating'} the user`
                })
            }
            return res.status(200).json({
                data:{userName:newUser.userName,updatedAt:newUser.updatedAt.toISOString()},
                message:`User ${status?'activated':'desactivated'} successfully`
            })
        }
    } 
    return res.status(403).json({
        date:null,
        message:`Not authorised to ${status?'activate':'desactivate'} a user`
    })
}

//! ----- UPGRADE A USER ----------
exports.upgradeUser = async (req, res, next) => {
    const role = req.body.role;
    const currentUserId=req.body.currentUserId
    const userId = req.params.id;
    let isError=[]
    const authority = valideAuthority.find(elm=>elm===role)
    
    
    if(!authority)isError.push({authority:'Authority selected is not valid!'})

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
    const currentUserAuthority = authorities.find(elm=>elm===currentUser.authority)

    if(currentUserAuthority){  
        if(currentUserAuthority===user.authority){
            return res.status(403).json({
                date:null,
                message:'You can not upgrade a user with the same prevelige' 
            })
        }

        if(currentUserAuthority==='ADMIN'&&user.authority==='SUPER_ADMIN'){
            return res.status(403).json({
                date:null,
                message:'You can not upgrade a user with higher prevelige' 
            })
        }

        if(currentUserAuthority==='ADMIN'&&user.authority==='REGULAR'||currentUserAuthority==='SUPER_ADMIN'&&user.authority==='REGULAR'||currentUserAuthority==='SUPER_ADMIN'&&user.authority==='ADMIN'){
            user.authority = role
            user.updatedBy = currentUserId
            const newUser = await user.save();    
            if(!newUser){
                return res.status(500).json({
                    message:'Error while upgrading the user'
                })
            }
            return res.status(200).json({
                data:{authority:newUser.authority,updatedAt:newUser.updatedAt.toISOString()},
                message:'User upgraded successfully'
            })
        }
    } 
    return res.status(403).json({
        date:null,
        message:'Not authorised to upgrade a user'
    })
}

//! ----- DOWNGRADE A USER ----------
exports.downgradeUser = async (req, res, next) => {
    const role = req.body.role;
    const currentUserId=req.body.currentUserId
    const userId = req.params.id;
    let isError=[]
    const authority = valideAuthority.find(elm=>elm===role)
    
    if(!authority)isError.push({authority:'Authority selected is not valid!'})

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
    const currentUserAuthority = authorities.find(elm=>elm===currentUser.authority)
    
    if(currentUserAuthority){  
        if(currentUserAuthority===user.authority){
            return res.status(403).json({
                date:null,
                message:'You can not downgrade a user with the same prevelige' 
            })
        }

        if(currentUserAuthority==='ADMIN'&&user.authority==='SUPER_ADMIN'){
            return res.status(403).json({
                date:null,
                message:'You can not downgrade a user with higher prevelige' 
            })
        }

        if(currentUserAuthority==='ADMIN'&&user.authority==='REGULAR'||currentUserAuthority==='SUPER_ADMIN'&&user.authority==='REGULAR'||currentUserAuthority==='SUPER_ADMIN'&&user.authority==='ADMIN'){
            user.authority = role
            user.updatedBy = currentUserId
            const newUser = await user.save();    
            if(!newUser){
                return res.status(500).json({
                    message:'Error while upgrading the user'
                })
            }
            return res.status(200).json({
                data:{authority:newUser.authority,updatedAt:newUser.updatedAt.toISOString()},
                message:'User downgraded successfully'
            })
        }
    } 
    return res.status(403).json({
        date:null,
        message:'Not authorised to downgrade a user'
    })
}


//! ----- DELETE A USER ----------
exports.deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    const currentUserId = req.body.currentUserId

    const currentUser = await User.findOne({_id:currentUserId})
    const user = await User.findOne({_id:userId})
    const authority = authorities.find(elm=>elm===currentUser.authority)
    
    if(authority){
        
        if(authority===user.authority||(authority==='ADMIN'&&user.authority==='SUPER_ADMIN')){
            return res.status(403).json({
                date:null,
                message:'Can not delete a user with the same or higher prevelige' 
            })
        }

        if(authority==='ADMIN'&&user.authority==='REGULAR'||authority==='SUPER_ADMIN'&&user.authority==='REGULAR'||authority==='SUPER_ADMIN'&&user.authority==='ADMIN'){
            
            user.deleted = true;
            user.deletedBy = currentUser._id
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

