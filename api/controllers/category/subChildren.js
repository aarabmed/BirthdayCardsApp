
const {SubCategoryChild} = require('../../models/category');
const Tag = require('../../models/tag');
const User = require('../../models/user');
const validate = require('../../utils/inputErrors');
const isBoolean = require('../../utils/toBoolean');

const ObjectID = require('mongodb').ObjectID;

const {authorities} = require('../../utils/authority');

const {descriptionProperties,statusProperties,imageProperties,slugProperties,nameProperties} = require('../inputs/subChildren')



//! ----- RETRIEVE A SINGLE SUB-CATEGORY ----------
/* exports.getCategory = async (req, res, next) => {

} */

//! ----- RETRIEVE ALL SUB-CATEGORIES ----------
exports.getAllSubChildren = async (req, res, next) => {
    const subChildren = await SubCategoryChild.find({deleted:false}).populate({path:'tags',select:'name _id',model:'Tag',match:{deleted:false}});
    if(!subChildren){
        return res.status(404).json({
            data:[],
            message:'No sub category children existed yet'
        })
    }
    return res.status(200).json({
        data:subChildren,
        message:'Opperation successed'
    })
}

 

//! ----- CREATE A NEW SUB-CATEGORY ----------
exports.createSubCategoryChild = async (req, res, next) => {
    const currentUserId=req.body.currentUserId
    const name = req.body.name
    const slug = req.body.slug
    const description = req.body.description
    const tags =req.body.tags? JSON.parse(req.body.tags):[]
    const subCategoryChildImage = req.file??''
    
    
    const isError = [
        await validate(name,nameProperties),
        await validate(slug,slugProperties),
        await validate(description,descriptionProperties),
        await validate(subCategoryChildImage,imageProperties),
    ].filter(e=>e!==true);

    if(isError.length){
        return res.status(500).json({
            errors:isError,
            message:"Invalid Input!",
        })
    }

    const newImage ={
        imageName: subCategoryChildImage.filename,
        path:subCategoryChildImage.path.replace(/\\/g,'/'),
        destination:subCategoryChildImage.destination,
        mimetype:subCategoryChildImage.mimetype
    }
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.split(' ').map(capitalize).join(' ');
    const newSlug= slug.split(' ').join('-').toLowerCase();

    
    const subCategoryChild = await new SubCategoryChild({
        description,
        image:newImage,
        status:true,
        slug:newSlug,
        name:newName,
        createdBy:currentUserId,
        tags,
    })

    if(tags.length>0){
        await Tag.updateMany({_id:tags},{$push:{"SubCategoryChild":subCategoryChild._id}})
    }
    
    const savedSubCategoryChild  = await subCategoryChild.save();
    if(!savedSubCategoryChild){
        return res.status(500).json({
            data:null,
            message:'Server failed to save the new sub Category Child'
        })
    }
    return res.status(201).json({
        data:savedSubCategoryChild,
        message:'sub Category Child saved successfully'
    })
}



//! ----- EDIT A SUB-CATEGORY ----------
exports.updateSubCategoryChild = async (req, res, next) => {

    const subCategoryChildId = req.params.id;
    const currentUserId=req.body.currentUserId
    const slug = req.body.slug;
    const name = req.body.name
    const status = isBoolean(req.body.status);
    const description = req.body.description;
    const subCategoryChildImage = req.file??'';
    const tags = req.body.tags?JSON.parse(req.body.tags):[];
    


    const isError = [
        await validate(name,nameProperties),
        await validate(slug,slugProperties),
        await validate(status,statusProperties),
        await validate(description,descriptionProperties),
    ].filter(e=>e!==true);

    if(isError.length){
        return res.status(500).json({
            errors:isError,
            message:"Invalid Input!",
        })
    }

    
    
    const newImage ={
        imageName: subCategoryChildImage&&subCategoryChildImage.filename,
        path:subCategoryChildImage&&subCategoryChildImage.path.replace(/\\/g,'/'),
        destination:subCategoryChildImage&&subCategoryChildImage.destination,
        mimetype:subCategoryChildImage&&subCategoryChildImage.mimetype
    }

    
    
    const subCategoryChild = await SubCategoryChild.findOne({_id:subCategoryChildId})

    if(!subCategoryChild){
        return res.status(404).json({
            date:null,
            message:'Category not found'
        })
    }
    
     const removedTags = subCategoryChild.tags.filter(t=>!tags.includes(t.toString()))
    const newTags = tags.filter(t=>!subCategoryChild.tags.includes(ObjectID(t))) 
   
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.split(' ').map(capitalize).join(' ');
    const newSlug= slug.split(' ').join('-').toLowerCase();


   
    subCategoryChild.description = description;
    subCategoryChild.updatedBy=currentUserId
    subCategoryChild.slug = newSlug;
    subCategoryChild.name = newName;
    subCategoryChild.status = status;

    subCategoryChildImage && (subCategoryChild.image = newImage);
    subCategoryChild.tags = tags
    

    const updatedSubCategoryChild  = await subCategoryChild.save();

    removedTags.length && await Tag.updateMany({_id:removedTags},{$pull:{"childrenSubCategory":updatedSubCategoryChild._id}})
    newTags.length && await Tag.updateMany({_id:newTags},{$push:{"childrenSubCategory":updatedSubCategoryChild._id}})

    if(!updatedSubCategoryChild){
        return res.status(500).json({
            message:'Error while editing the sub category child'
        })
    }
    return res.status(201).json({
        data:updatedSubCategoryChild,
        message:'Sub category child updated successfully'
    })
}


//! ----- DELETE A CATEGORY ----------
exports.deleteSubCategoryChild = async (req, res, next) => {
    const subCategoryChildId = req.params.id;
    const currentUserId = req.body.currentUserId


    const currentUser = await User.findById(currentUserId)

    if(authorities.includes(currentUser.authority)){
        const subCategoryChild = await SubCategoryChild.findOne({_id:subCategoryChildId})

        if(!subCategoryChild){
            return res.status(404).json({
                date:null,
                message:'sub Category child not found'
            })
        }

        subCategoryChild.deleted = true;;
        subCategoryChild.deletedBy = currentUserId
        const deletedSubCategoryChild  = await subCategoryChild.save();
        
        if(!deletedSubCategoryChild){
            return res.status(500).json({
                data:null,
                message:'Server failed to delete the sub category child'
            })
        }

        return res.status(201).json({
            data:deletedSubCategoryChild,
            message:`Sub-Category child ${deletedSubCategoryChild.name} has been deleted successfully`
        })
    }

    return res.status(403).json({
        date:null,
        message:'Not authorised to delete a category'
    })
}

