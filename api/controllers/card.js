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
    const cardId = req.params.cardId
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
    const page = req.body.page;
    const size = req.body.size;
    const { limit,offset } = getPagination(page,size)

    const results = await Card.paginate({},{offset,limit,sort:{createdAt:-1},populate:['tags','category']})
    
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
    const tags = req.body.tags;
    const cardImage = req.file;
    const cardSize = req.body.cardSize;
    const status = isBoolean(req.body.status);
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
        await validate(status,statusProps),
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
    const newTitle= title.split(' ').map(capitalize).join(' ');
    const newSlug= slug.split(' ').join('-').toLowerCase();
    
    const card = new Card({
        title:newTitle,
        slug:newSlug,
        description:description,
        category:categoryId,
        tags:tags,
        image:newImage,
        cardSize:cardSize,
        status:status,
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
    const tags = req.body.tags??[];
    const cardImage = req.file;
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

    const removedTags = card.tags.filter(t=>!tags.includes(t.toString()))

    const newTags = tags.filter(t=>!card.tags.includes(ObjectID(t)))


    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const newTitle= title.split(' ').map(capitalize).join(' ');
    const newSlug= slug.split(' ').join('-').toLowerCase();

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

    removedTags.length && await Tag.updateMany({_id:removedTags},{$pull:{"card":updatedCard._id}})
    newTags.length && await Tag.updateMany({_id:newTags},{$push:{"card":updatedCard._id}})


    if(updatedCard){
        return res.status(201).json({
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
    const currentUserId = req.currentUserId;
    const cardId = req.cardId;

    const currentUser = await User.findById(currentUserId)
    if(authorities.includes(currentUser.authority)){
        const card = await Card.findByIdAndUpdate({_id:cardId},{deleted:true,deletedBy:currentUser._id})
        if(!card){
            return res.status(500).json({
                message:'Error while deleting the card'
            })
        }
        return res.status(200).res({
            data:card,
            message:'Card deleted successfully'
        })
    }

    return res.status(403).json({
        message:'Not authorised to delete a card'
    })
}






