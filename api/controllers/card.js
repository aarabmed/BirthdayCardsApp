
const multer = require('multer');
const ObjectID = require('mongodb').ObjectID
const Card  =  require('../models/card');
const Category  =  require('../models/category');
const User = require('../models/user');
const validate = require('../utils/inputErrors')
const isBoolean = require('../utils/toBoolean');
const {getPagination} = require('../utils/getPagination');
const {titleProps,descProps,cardImageProps,cardSizeProps,statusProps} = require('./inputs/card');

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
    const title = req.body.title;
    const description = req.body.description;
    const categoryId = req.body.category;
    const tags = req.body.tags;
    const cardImage = req.file;
    const cardSize = req.body.cardSize;
    const status = isBoolean(req.body.status);
    let isError = [];
    
   
    const newCategory = await Category.findById(categoryId);
    if(!newCategory){
        isError.push({category:'Category is not valid'})
    }

    const newImage ={
        imageName: cardImage.filename,
        path:cardImage.path,
        destination:cardImage.destination,
        mimetype:cardImage.mimetype
    }
    

    isError = [
        ...isError,
        await validate(title,titleProps),
        await validate(description,descProps),
        await validate(cardImage,cardImageProps),
        await validate(cardSize,cardSizeProps),
        await validate(status,statusProps),
    ].filter(e=>e!==true);


    
    if(isError.length){
        return res.status(500).json({
            errors:isError,
            message:'Invalid Input!'
        })
    }

    
    const card = new Card({
        title:title,
        slug:title.split('-')[0].trim().toLowerCase().replace(/ /g,'-'),
        description:description,
        category:ObjectID(categoryId),
        tags:tags.map(t=>(ObjectID(t.key))),
        image:newImage,
        cardSize:cardSize,
        status:status,
        deleted:false,
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
    const cardId= req.body.cardId
    const title = req.body.title;
    const description = req.body.description;
    const categoryId = req.body.category;
    const tags = req.body.tags;
    const cardImage = req.file;
    const cardSize = req.body.cardSize;
    const status = isBoolean(req.body.status);
    let isError = []


    const newCategory = await Category.findById(categoryId);
    if(!newCategory){
        isError.push({category:'Category is not valid'})
    }

    
    isError = [
        ...isError,
        await validate(title,titleProps),
        await validate(description,descProps),
        await validate(cardImage,cardImageProps),
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
        imageName: cardImage.filename,
        path:cardImage.path,
        destination:cardImage.destination,
        mimetype:cardImage.mimetype
    }

    
    const card = await Card.findById(cardId);
    if(!card){
        return res.status(404).json({
            message:'Card does not exist'
        })
    }

    card.title = title;
    card.slug = title.split('-')[0].trim().toLowerCase().replace(/ /g,'-');
    card.description = description;
    card.category = ObjectID(categoryId);
    card.tags = tags.map(t=>(ObjectID(t.key)));
    card.image = newImage;
    card.cardSize = cardSize;
    card.status = status;

    const updatedCard = await card.save()

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
    const cardId = req.body.cardId;

    const currentUser = await User.findById(currentUserId)
    if(currentUser.authority=='ADMIN'){
        const card = await Card.findByIdAndUpdate({_id:cardId},{deleted:true})
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






