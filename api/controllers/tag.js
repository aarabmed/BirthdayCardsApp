
const validator = require('validator');
const Tag = require('../models/tag');
const User = require('../models/user');

//! ----- RETRIEVE A SINGLE TAG ----------
/* exports.getTag = async (req, res, next) => {

} */

//! ----- RETRIEVE ALL TAGS ----------
exports.getAllTags = async (req, res, next) => {
    const tags = await Tag.find();
    if(!tags){
        return res.status(404).json({
            data:[],
            message:'No tag existed yet'
        })
    }
    return res.status(200).json({
        data:tags,
        message:'Opperation successed'
    })
}


//! ----- CREATE A NEW TAG ----------
exports.createTag = async (req, res, next) => {
    const name = req.body.name
    const nameErrors =[];
    const errorsArray =[]
    const regex = /^[A-Za]+$/

    
    if(!validator.isLength(name,{min:5})){
        nameErrors.push("Tag name minimum lenght is 5 characters");
    }
    if(regex.test(name)){
        nameErrors.push("Tag name takes only alphabets");
    }


    if(nameErrors.length){
        errorsArray.push({name:nameErrors[0]})
    }
    

    if(errorsArray.length){
        return res.status(500).json({
            errors:errorsArray,
            message:"Invalid Input!",
        })
    }

    
    const newName= name.charAt(0).toUpperCase()+name.slice(1).toLowerCase();
    
    const tag = await new Tag({
        name:newName,
        status:true,
        slug:name.toLowerCase()
    })

    const savedTag  = await tag.save();
    if(!savedTag){
        return res.status(500).json({
            data:null,
            message:'Server failed to save the new tag'
        })
    }
    return res.status(201).json({
        data:savedTag,
        message:'tag saved successfully'
    })
}


//! ----- EDIT A TAG ----------
exports.updateTag = async (req, res, next) => {
    const tagId = req.body.tagId
    const name = req.body.name
    
    const nameErrors =[];
    const errorsArray =[]
    const regex = /^[A-Za]+$/

    
    if(!validator.isLength(name,{min:5})){
        nameErrors.push("Tag name minimum lenght is 5 characters");
    }
    if(regex.test(name)){
        nameErrors.push("Tag name takes only alphabets");
    }


    if(nameErrors.length){
        errorsArray.push({name:nameErrors[0]})
    }
    

    if(errorsArray.length){
        return res.status(500).json({
            errors:errorsArray,
            message:"Invalid Input!",
        })
    }

    
    const newName= name.charAt(0).toUpperCase()+name.slice(1).toLowerCase();
    
    const tag = await Tag.findOne({_id:tagId})

    tag.name = newName;
    tag.slug = newName.toLowerCase()

    const updatedTag  = await tag.save();

    if(!updatedTag){
        return res.status(500).json({
            data:null,
            message:'Server failed to update the current tag'
        })
    }
    return res.status(201).json({
        data:updatedTag,
        message:'Tag updated successfully'
    })
}



//! ----- DELETE A TAG ----------
exports.deleteTag = async (req, res, next) => {
    const tagId = req.body.tagId;
    const currentUserId = req.body.currentUserId
    

    const currentUser = await User.findById(currentUserId)
    if(currentUser.authority=='ADMIN'){
        const tag = await Tag.findOne({_id:tagId})
        if(!tag){
            return res.status(404).json({
                date:null,
                message:'Tag not found'
            })
        }

        tag.status = false;
        const deletedTag  = await tag.save();
        
        if(!deletedTag){
            return res.status(500).json({
                data:null,
                message:'Server failed to delete the selected tag'
            })
        }

        return res.status(201).json({
            data:deletedTag,
            message:`Tag ${tag.name} has been deleted successfully`
        })
    }
    return res.status(403).json({
        date:null,
        message:'Not authorised to delete a tag'
    })
}

