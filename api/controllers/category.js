const validator = require('validator');
const multer = require('multer');
const Category = require('../models/category');
const User = require('../models/user');
const validate = require('../utils/inputErrors');
const {nameProperties,descriptionProperties,imageProperties} = require('./inputs/category')

//! ----- RETRIEVE A SINGLE CATEGORY ----------
/* exports.getCategory = async (req, res, next) => {

} */

//! ----- RETRIEVE ALL CATEGORIES ----------
exports.getAllCategories = async (req, res, next) => {
    const categories = await Category.find();
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
    
    const name = req.body.name
    const description = req.body.description
    const categoryImage = req.file
    
    
    const isError = [
        await validate(name,nameProperties),
        await validate(description,descriptionProperties),
        await validate(categoryImage,imageProperties),
    ].filter(e=>e!==true);

    if(isError.length){
        return res.status(500).json({
            errors:errorsArray,
            message:"Invalid Input!",
        })
    }

    const newImage ={
        imageName: categoryImage.filename,
        path:categoryImage.path,
        destination:categoryImage.destination,
        mimetype:categoryImage.mimetype
    }
    

    const newName= name.charAt(0).toUpperCase()+name.slice(1).toLowerCase();
    
    const category = await new Category({
        name:newName,
        description,
        image:newImage,
        status:true,
        slug:name.toLowerCase()
    })

    const savedCategory  = await category.save();
    if(!savedCategory){
        return res.status(500).json({
            data:null,
            message:'Server failed to save the new category'
        })
    }
    return res.status(201).json({
        data:savedCategory,
        message:'Category saved successfully'
    })
}



//! ----- EDIT A CATEGORY ----------
exports.updateCategory = async (req, res, next) => {
    const categoryId = req.body.categoryId;
    const name = req.body.name;
    const description = req.body.description;
    const categoryImage = req.body.categoryImage;

    const isError = [
        await validate(name,nameProperties),
        await validate(description,descriptionProperties),
        await validate(categoryImage,imageProperties),
    ].filter(e=>e!==true);

    if(isError.length){
        return res.status(500).json({
            errors:errorsArray,
            message:"Invalid Input!",
        })
    }

    
    const newImage ={
        imageName: categoryImage.filename,
        path:categoryImage.path,
        destination:categoryImage.destination,
        mimetype:categoryImage.mimetype
    }
    
    const category = await Category.findOne({_id:categoryId})

    if(!category){
        return res.status(404).json({
            date:null,
            message:'Category not found'
        })
    }
    

    const newName= name.charAt(0).toUpperCase()+name.slice(1).toLowerCase();

    category.name = newName;
    category.description = description;
    category.image = newImage;
    category.slug = name.toLowerCase();



    const updatedCategory  = await category.save();
    if(!updatedCategory){
        return res.status(500).json({
            message:'Error while editing the category'
        })
    }
    return res.status(201).json({
        data:updatedCategory,
        message:'Category updated successfully'
    })
}


//! ----- DELETE A CATEGORY ----------
exports.deleteCategory = async (req, res, next) => {
    const categoryId = req.body.categoryId;
    const currentUserId = req.userId


    const currentUser = await User.findById(currentUserId)

    if(currentUser.authority=='ADMIN'){
        const category = await Category.findOne({_id:categoryId})

        if(!category){
            return res.status(404).json({
                date:null,
                message:'Category not found'
            })
        }

        category.status = false;
        const deletedCategory  = await category.save();
        
        if(!deletedCategory){
            return res.status(500).json({
                data:null,
                message:'Server failed to delete the category'
            })
        }

        return res.status(201).json({
            data:deletedCategory,
            message:`Category ${category.name} has been deleted successfully`
        })
    }

    return res.status(403).json({
        date:null,
        message:'Not authorised to delete a category'
    })
}

