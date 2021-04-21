const ObjectID = require('mongodb').ObjectID
const Card  =  require('../models/card');
const {Category,SubCategory,SubCategoryChild}  =  require('../models/category');
const User = require('../models/user');
const Tag = require('../models/tag');
const validate = require('../utils/inputErrors')
const isBoolean = require('../utils/toBoolean');
const {getPagination} = require('../utils/getPagination');
const {authorities}= require('../utils/authority')

const {titleProps,descProps,cardImageProps,cardSizeProps,statusProps,slugProperties} = require('./inputs/card');

//! ----- RETRIEVE A SINGLE CARD ----------
exports.getCard = async (req, res, next) => {
    const cardId = req.params.id
    const card = Card.findOne({_id:cardId});
    if(!card){
        return res.status(404).json({
            data:[],
            message:'Card not found'
        })
    }
    return res.status(200).json({
        data:card,
        message:'Operation succeed '
    })
}

//! ----- RETRIEVE ALL CARDS ----------
exports.getAllCards = async (req, res, next) => {
    const page = Number(req.query.page)||1;
    const size = Number(req.query.size)||10;

    const { limit,offset } = getPagination(page,size)

    const results = await Card.paginate({deleted:false},{offset,limit,sort:{createdAt:-1},populate:[
        {path:"tags",select:"name",model:'Tag',match:{deleted:false}},
        {path:"subCategory",select:"name",model:'SubCategory',match:{deleted:false}},
        {path:"subCategoryChild",select:"name",model:'ChildrenSubCategory',match:{deleted:false}},
        {path:"category",select:"name",model:'Category',match:{deleted:false}},
        {path:"createdBy",select:"userName",model:'User',match:{deleted:false}}
    ]})

    return res.status(200).json({
        data:results.docs,
        currentPage:results.page,
        hasNextPage:results.hasNextPage,
        hadPreviousPage:results.hasPrevPage,
        totalPages:results.totalPages,
        prevPage:results.prevPage,
    })
}

//! ----- CREATE A CARD ----------
exports.createCard = async (req, res, next) => {
    const currentUserId = req.body.currentUserId
    const title = req.body.title;
    const slug = req.body.slug
    const description = req.body.description;
    const categoryId = req.body.category;
    const tags = req.body.tags?JSON.parse(req.body.tags):[];
    const cardImage = req.file;
    const cardSize = req.body.cardSize;
    //const status = isBoolean(req.body.status);
    const subCategoryId = req.body.subCategory;
    const subCategoryChildId = req.body.subCategoryChild
    let isError = [];
    
   
    if(categoryId){
        const newCategory = await Category.findById(categoryId);

        if(!newCategory){
            isError.push({category:'Category is not valid'})
        }
    }

    
    if(subCategoryId){
        const subCategory = await SubCategory.findById(subCategoryId);

        if(!subCategory){
            isError.push({subCategory:'Sub Category is not valid'})
        }
    }

    if(subCategoryChildId){
        const subCategoryChild = await SubCategoryChild.findById(subCategoryChildId);

        if(!subCategoryChild){
            isError.push({subCategoryChild:'Sub Category child is not valid'})
        }
    }

    const newImage ={
        imageName: cardImage.filename,
        path:cardImage.path.replace(/\\/g,'/'),
        destination:cardImage.destination,
        mimetype:cardImage.mimetype
    }
    
    
    isError = [
        ...isError,
        await validate(title,titleProps),
        await validate(cardImage,cardImageProps),
        await validate(cardSize,cardSizeProps),
        await validate(slug,slugProperties),
    ].filter(e=>e!==true);


    
    if(isError.length){
        return res.status(500).json({
            errors:isError,
            message:'Invalid Input!'
        })
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newTitle= title.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();


    const card = new Card({
        title:newTitle,
        slug:newSlug,
        description:description,
        category:categoryId,
        tags:tags,
        image:newImage,
        cardSize:cardSize,
        status:true,
        subCategory:subCategoryId,
        subCategoryChild:subCategoryChildId,
        deleted:false,
        createdBy:currentUserId
    })


    const savedCard = await card.save();
    if(savedCard){
        return res.status(201).json({
            data:savedCard,
            message:'Card updated successfully'
        })
    }
    return res.status(500).json({
        message:'Error while saving the new card'
    })
}

//! ----- EDIT A CARD ----------
exports.updateCard = async (req, res, next) => {
    const currentUserId=req.body.currentUserId
    const cardId= req.params.id
    const title = req.body.title;
    const slug = req.body.slug
    const description = req.body.description;
    const categoryId = req.body.category;
    const subCategoryId = req.body.subCategory;
    const subCategoryChildId = req.body.subCategoryChild;
    const tags = req.body.tags?JSON.parse(req.body.tags):[];
    const cardImage = req.file??'';
    const cardSize = req.body.cardSize;
    const status = isBoolean(req.body.status);
    let isError = []

    if(categoryId){
        const newCategory = await Category.findById(categoryId);

        if(!newCategory){
            isError.push({category:'Category is not valid'})
        }
    }

    if(subCategoryId){
        const subCategory = await SubCategory.findById(subCategoryId);

        if(!subCategory){
            isError.push({subCategory:'Sub Category is not valid'})
        }
    }

    if(subCategoryChildId){
        const subCategoryChild = await SubCategoryChild.findById(subCategoryChildId);

        if(!subCategoryChild){
            isError.push({subCategoryChild:'Sub Category child is not valid'})
        }
    }
    

    
    isError = [
        ...isError,
        await validate(title,titleProps),
        await validate(slug,slugProperties),
        await validate(cardSize,cardSizeProps),
        await validate(status,statusProps),
    ].filter(e=>e!==true);
    
    if(isError.length){
        return res.status(500).json({
            errors:isError,
            message:'Invalid Input!'
        })
    }


    const newImage ={
        imageName: cardImage && cardImage.filename,
        path: cardImage && cardImage.path.replace(/\\/g,'/'),
        destination: cardImage && cardImage.destination,
        mimetype: cardImage && cardImage.mimetype
    }

    
    const card = await Card.findById(cardId);
    if(!card){
        return res.status(404).json({
            message:'Card does not exist'
        })
    }


    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newTitle= title.trim().split(' ').map(capitalize).join(' ');
    const newSlug= slug.trim().split(' ').join('-').toLowerCase();

    card.title = newTitle;
    card.slug = newSlug;
    card.description = description;
    card.category = categoryId =='' ? undefined:categoryId ;
    card.subCategory = subCategoryId =='' ?undefined:subCategoryId;
    card.subCategoryChild = subCategoryChildId =='' ?undefined:subCategoryChildId
    card.tags = tags;
    cardImage && (card.image = newImage);
    card.cardSize = cardSize;
    card.status = status;
    card.updatedBy= currentUserId

    const updatedCard = await card.save()


    if(updatedCard){
        return res.status(200).json({
            data:updatedCard,
            message:'Card updated successfully'
        })
    }
    return res.status(500).json({
        message:"Error while editing the card"
    })
    
}

//! ----- DELETE A CARD ----------
exports.deleteCard = async (req, res, next) => {
    const currentUserId = req.body.currentUserId;
    const cardId = req.params.id;

    const currentUser = await User.findById(currentUserId)
    if(authorities.includes(currentUser.authority)){
        const card = await Card.findByIdAndUpdate({_id:cardId},{deleted:true,deletedBy:currentUser._id})
        if(!card){
            return res.status(500).json({
                message:'Error while deleting the card'
            })
        }
        return res.status(200).json({
            data:card,
            message:'Card deleted successfully'
        })
    }

    return res.status(403).json({
        message:'Not authorised to delete a card'
    })
}






