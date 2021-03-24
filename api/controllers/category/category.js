
const {Category} = require('../../models/category');
const User = require('../../models/user');
const validate = require('../../utils/inputErrors');
const {authorities}= require('../../utils/authority')

const {nameProperties,titleProperties,descriptionProperties,imageProperties,slugProperties} = require('../inputs/category')

//! ----- RETRIEVE A SINGLE CATEGORY ----------
/* exports.getCategory = async (req, res, next) => {

} */

//! ----- RETRIEVE ALL CATEGORIES ----------
exports.getAllCategories = async (req, res, next) => {
    const categories = await Category.find()
        .populate([
            {path:"subCategory",select:"tags name -_id",
                populate:{
                    path:"children",
                    select:"tags"
                }
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
    const title = req.body.title
    const name = req.body.name
    const slug = req.body.slug
    const description = req.body.description
    const subCategory = req.body.subCategory??[]
    const categoryImage = req.file

    
    
    const isError = [
        await validate(name,nameProperties),
        await validate(title,titleProperties),
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
    const newName= name.split(' ').map(capitalize).join(' ');
    const newSlug= slug.split(' ').join('-').toLowerCase();
    const newTitle= title.split(' ').map(capitalize).join(' ');

    const category = await new Category({
        title:newTitle,
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
    const categoryId = req.body.categoryId;
    const title = req.body.title
    const name = req.body.name;
    const slug = req.body.slug
    const description = req.body.description;
    const categoryImage = req.file;
    const subCategory = req.body.subCategory??[]

    const isError = [
        await validate(name,nameProperties),
        await validate(title,titleProperties),
        await validate(slug,slugProperties),
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
    
    

    // const removedSubCategory = category.subCategory.filter(t=>!subCategory.includes(t))
    // const newSubCategory = subCategory.filter(t=>!category.subCategory.includes(ObjectID(t)))

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newName= name.split(' ').map(capitalize).join(' ');
    const newSlug= slug.split(' ').join('-').toLowerCase();
    const newTitle= title.split(' ').map(capitalize).join(' ');

    category.name = newName;
    category.title = newTitle;
    category.description = description;
    category.slug = newSlug;
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

    if(authorities.includes(currentUser.authority)){
        const category = await Category.findOne({_id:categoryId})

        if(!category){
            return res.status(404).json({
                date:null,
                message:'Category not found'
            })
        }

        category.status = false;
        category.deletedBy=currentUserId
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

