
const {Category} = require('../../models/category');
const User = require('../../models/user');
const validate = require('../../utils/inputErrors');
const {authorities}= require('../../utils/authority')
const isBoolean = require('../../utils/toBoolean');

const {nameProperties,statusProperties,descriptionProperties,imageProperties,slugProperties} = require('../inputs/category')

//! ----- RETRIEVE A SINGLE CATEGORY ----------
exports.getCategory = async (req, res, next) => {
    const id = req.params.id
    const categories = await Category.findById({_id:id},{deleted:false})
    .populate([
        {path:"subCategory",select:"name ",model:'SubCategory',match:{deleted:false},}
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
exports.getAllCategories = async (req, res, next) => {
    const categories = await Category.find({deleted:false})
        .populate([
            {path:"subCategory",select:"name ",model:'SubCategory',match:{deleted:false},
                populate:[{
                    path:"childrenSubCategory",
                    select:"name",
                    match:{deleted:false},
                    populate:{
                        path:"tags",
                        select:"name",
                        match:{deleted:false},
                    },
                },{
                    path:"tags",
                    select:"name",
                    match:{deleted:false},
                }],
            }
        ]);
    if(!categories){
        return res.status(404).json({
            data:[],
            message:'No category existed yet'
        })
    }
    return res.status(200).json({
        data:categories,
        message:'Opperation successed'
    })
}

 

//! ----- CREATE A NEW CATEGORY ----------
exports.createCategory = async (req, res, next) => {

    const currentUserId=req.body.currentUserId
    const name = req.body.name
    const slug = req.body.slug
    const description = req.body.description
    let subCategory = req.body.subCategory ? JSON.parse(req.body.subCategory):[]
    const categoryImage = req.file??''
    
    const isError = [
        await validate(name,nameProperties),
        await validate(slug,slugProperties),
        await validate(description,descriptionProperties),
        await validate(categoryImage,imageProperties),
    ].filter(e=>e!==true);

    if(isError.length){
        return res.status(500).json({
            errors:isError,
            message:"Invalid Input!",
        })
    }

    const newImage ={
        imageName: categoryImage.filename,
        path:categoryImage.path.replace(/\\/g,'/'),
        destination:categoryImage.destination,
        mimetype:categoryImage.mimetype
    }
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();

    const category = await new Category({
        name:newName,
        description,
        image:newImage,
        status:true,
        slug:newSlug,
        subCategory,
        createdBy:currentUserId
    })

    const savedCategory  = await category.save();
    if(!savedCategory){
        return res.status(500).json({
            data:null,
            message:'Server failed to save the new category'
        })
    }

    ///await SubCategory.updateMany({_id:subCategory},{$push:{"category":savedCategory._id}})
    
    return res.status(201).json({
        data:savedCategory,
        message:'Category saved successfully'
    })
}



//! ----- EDIT A CATEGORY ----------
exports.updateCategory = async (req, res, next) => {
    const currentUserId=req.body.currentUserId
    const categoryId = req.params.id;
    const name = req.body.name;
    const slug = req.body.slug
    const description = req.body.description;
    const status = isBoolean(req.body.status);
    const categoryImage = req.file??'';
    let subCategory = req.body.subCategory ? JSON.parse(req.body.subCategory):[]

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
        imageName: categoryImage && categoryImage.filename,
        path:categoryImage && categoryImage.path.replace(/\\/g,'/'),
        destination:categoryImage && categoryImage.destination,
        mimetype:categoryImage && categoryImage.mimetype
    }
    
    const category = await Category.findOne({_id:categoryId})

    if(!category){
        return res.status(404).json({
            date:null,
            message:'Category not found'
        })
    }
    
    



    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();

    category.name = newName;
    category.description = description;
    category.slug = newSlug;
    category.status = status;
    categoryImage && (category.image = newImage);
    category.subCategory = subCategory;
    category.updatedBy=currentUserId;



    const updatedCategory  = await category.save();
    if(!updatedCategory){
        return res.status(500).json({
            message:'Error while editing the category'
        })
    }


    /* removedSubCategory.length && await SubCategory.updateMany({_id:removedSubCategory},{$pull:{"category":updatedCategory._id}})
    newSubCategory.length && await SubCategory.updateMany({_id:newSubCategory},{$push:{"category":updatedCategory._id}})
 */
    return res.status(200).json({
        data:updatedCategory,
        message:'Category updated successfully'
    })
}


//! ----- DELETE A CATEGORY ----------
exports.deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    const currentUserId = req.body.currentUserId

    const currentUser = await User.findById(currentUserId)

    if(authorities.includes(currentUser.authority)){
        const category = await Category.findOne({_id:categoryId})

        if(!category){
            return res.status(404).json({
                date:null,
                message:'Category not found'
            })
        }

        category.deleted = true;
        category.deletedBy=currentUserId

       
        const deletedCategory  = await category.save();
        if(!deletedCategory){
            return res.status(500).json({
                data:null,
                message:'Server failed to delete the category'
            })
        }

        return res.status(200).json({
            data:deletedCategory,
            message:`Category ${category.name} has been deleted successfully`
        })
    }

    return res.status(403).json({
        date:null,
        message:'Not authorised to delete a category'
    })
}

