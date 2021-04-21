const ObjectID = require('mongodb').ObjectID
const {SubCategory} = require('../../models/category');
const Tag = require('../../models/tag');
const User = require('../../models/user');
const validate = require('../../utils/inputErrors');
const {authorities} = require('../../utils/authority')
const isBoolean = require('../../utils/toBoolean');

const {nameProperties,statusProperties,descriptionProperties,imageProperties,slugProperties} = require('../inputs/subCategory')

 

//! ----- RETRIEVE A SINGLE CATEGORY ----------
exports.getSubCategory = async (req, res, next) => {
    const id = req.params.id
    const categories = await SubCategory.findById({_id:id},{deleted:false})
    .populate([
        {path:"childrenSubCategory",select:"name ",model:'ChildrenSubCategory',match:{deleted:false},}
    ]);
    if(!categories){
        return res.status(404).json({
            data:[],
            message:'No category existed yet'
        })
    }
    return res.status(200).json({
        res:categories,
        message:'Opperation successed'
    })
}

//! ----- RETRIEVE ALL CATEGORIES ----------
exports.getAllSubCategories = async (req, res, next) => {
    const subCategories = await SubCategory.find({deleted:false}).populate([
        {path:'tags',select:'name _id',model:'Tag',match:{deleted:false}},
        {path:'childrenSubCategory',select:'name _id',model:'ChildrenSubCategory',match:{deleted:false},
            populate:{path:'tags',select:'name _id',model:'Tag',match:{deleted:false}}
        }
    ]);

    if(!subCategories){
        return res.status(404).json({
            data:[],
            message:'No sub category existed yet'
        })
    }
    return res.status(200).json({
        data:subCategories,
        message:'Opperation successed'
    })
}

 

//! ----- CREATE A NEW CATEGORY ----------
exports.createSubCategory = async (req, res, next) => {
    const currentUserId=req.body.currentUserId
    const name = req.body.name
    const slug = req.body.slug
    const description = req.body.description
    const tags = req.body.tags? JSON.parse(req.body.tags):[]
    const subChildren = req.body.subChildren? JSON.parse(req.body.subChildren):[]
    const subCategoryImage = req.file??''
    
    const isError = [
        await validate(name,nameProperties),
        await validate(slug,slugProperties),
        await validate(description,descriptionProperties),
        await validate(subCategoryImage,imageProperties),
    ].filter(e=>e!==true);

    if(isError.length){
        return res.status(500).json({
            errors:isError,
            message:"Invalid Input!",
        })
    }

    const newImage ={
        imageName: subCategoryImage.filename,
        path:subCategoryImage.path.replace(/\\/g,'/'),
        destination:subCategoryImage.destination,
        mimetype:subCategoryImage.mimetype
    }
    

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();

    const subCategory = await new SubCategory({
        name:newName,
        description,
        image:newImage,
        status:true,
        slug:newSlug,
        childrenSubCategory:subChildren,
        createdBy:currentUserId,
        tags
    })
    
    const savedSubCategory  = await subCategory.save();

    if(!savedSubCategory){
        return res.status(500).json({
            data:null,
            message:'Server failed to save the new sub category'
        })
    }

    if(tags.length){
        await Tag.updateMany({_id:tags},{$push:{"subCategory":savedSubCategory._id}})
    }

    
    return res.status(201).json({
        data:savedSubCategory,
        message:'Sub Category saved successfully'
    })
}



//! ----- EDIT A CATEGORY ----------
exports.updateSubCategory = async (req, res, next) => {

    console.log('REQ:',req.body)
    const currentUserId = req.body.currentUserId
    const subCategoryId = req.params.id;
    const name = req.body.name;
    const status = isBoolean(req.body.status);
    const slug = req.body.slug
    const description = req.body.description;
    const subCategoryImage = req.file??'';
    const tags = req.body.tags ? JSON.parse(req.body.tags):[]
    //const category = req.body.category??[]
    const subChildren = req.body.subChildren ? JSON.parse(req.body.subChildren):[]

    

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
        imageName: subCategoryImage && subCategoryImage.filename,
        path: subCategoryImage && subCategoryImage.path.replace(/\\/g,'/'),
        destination: subCategoryImage && subCategoryImage.destination,
        mimetype: subCategoryImage && subCategoryImage.mimetype
    }
    
    const subCategory = await SubCategory.findOne({_id:subCategoryId})

    if(!subCategory){
        return res.status(404).json({
            date:null,
            message:'Category not found'
        })
    }

    
    const newTags = tags.filter(t=>!subCategory.tags.includes(ObjectID(t)))
    const removedTags = subCategory.tags.filter(t=>!tags.includes(t.toString()))

    /*
    const removedSubChild = subCategory.children.filter(t=>!subChildren.includes(t.toString()))
    const newSubChild = subChildren.filter(t=>!subCategory.children.includes(ObjectID(t)))

     const removedCategory = subCategory.category.filter(t=>!category.includes(t.toString()))
    const newCategory = category.filter(t=>!subCategory.category.includes(ObjectID(t))) */

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.trim().split(' ').map(capitalize).join(' ');

    const newSlug= slug.trim().split(' ').join('-').toLowerCase();

    subCategory.name = newName;
    subCategory.description = description;
    subCategoryImage && (subCategory.image = newImage );
    subCategory.slug = newSlug;
    subCategory.status = status
    subCategory.tags=tags;
    subCategory.childrenSubCategory=subChildren
    subCategory.updatedBy=currentUserId
    // subCategory.category=category

    
    const updatedSubCategory  = await subCategory.save();

    removedTags.length && await Tag.updateMany({_id:removedTags},{$pull:{"subCategory":updatedSubCategory._id}});
    newTags.length && await Tag.updateMany({_id:newTags},{$pull:{"subCategory":updatedSubCategory._id}});

    /* removedSubChild.length && await SubCategoryChild.updateMany({_id:removedSubChild},{$pull:{"subCategory":updatedSubCategory._id}})
    newSubChild.length && await SubCategoryChild.updateMany({_id:newSubChild},{$push:{"subCategory":updatedSubCategory._id}}) */
    
    /* removedCategory.length && await Category.updateMany({_id:removedCategory},{$pull:{"subCategory":updatedSubCategory._id}}) 
    newCategory.length && await Category.updateMany({_id:newCategory},{$push:{"subCategory":updatedSubCategory._id}})  */

    if(!updatedSubCategory){
        return res.status(500).json({
            message:'Error while editing the sub category'
        })
    }
    return res.status(200).json({
        data:updatedSubCategory,
        message:'Sub Category updated successfully'
    })
}


//! ----- DELETE A CATEGORY ----------
exports.deleteSubCategory = async (req, res, next) => { 
    const subCategoryId = req.params.id;
    const currentUserId = req.body.currentUserId


    const currentUser = await User.findById(currentUserId)

    if(authorities.includes(currentUser.authority)){
        const subCategory = await subCategory.findOne({_id:subCategoryId})

        if(!subCategory){
            return res.status(404).json({
                date:null,
                message:'Sub category not found'
            })
        }

        subCategory.deleted = true;
        subCategory.deletedBy= currentUserId;
        const deletedSubCategory  = await subCategory.save();
        
        if(!deletedSubCategory){
            return res.status(500).json({
                data:null,
                message:'Server failed to delete the sub category'
            })
        }

        return res.status(200).json({
            data:deletedSubCategory,
            message:`Sub-Category ${subCategory.name} has been disabled successfully`
        })
    }

    return res.status(403).json({
        date:null,
        message:'Not authorised to delete a sub category'
    })
}

