
const multer = require('multer');
const ObjectID = require('mongodb').ObjectID
const Card  =  require('../models/card');
const Tag  =  require('../models/tag');
const Category  =  require('../models/category');
const User = require('../models/user');

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
    const cards = Card.find();
    
    return res.status(200).json({
        data:cards,
        currentPage:'',
        nextPage:'',
        previousPage:'',
        
    })
}

//! ----- CREATE A CARD ----------
exports.createCard = async (req, res, next) => {
    const title = req.body.title;
    const description = req.body.discription;
    const categoryId = req.body.category;
    const tagId = req.body.tag;
    const cardImage = req.file;
    const cardSize = req.body.cardSize;
    const status = req.body.status;
    const imageErrors = [];
    const tagErrors = [];
    const categoryErrors = [];
    const arrayErrors =[]



    if(!cardImage){
        imageErrors.push('No image provided!')
    }

    const newTag = await Tag.findById(tagId);
    if(!newTag){
        tagErrors.push('Tag is not valid')
    }

    const newCategory = await Category.findById(categoryId);
    if(!newCategory){
        categoryErrors.push('Category is not valid')
    }

    const newImage ={
        imageName: cardImage.filename,
        path:cardImage.path,
        destination:cardImage.destination,
        mimetype:cardImage.mimetype
    }
    
    if(imageErrors.length){
        arrayErrors.push({imageError:imageErrors[0]})
    }
    if(tagErrors.length){
        arrayErrors.push({tagError:tagErrors[0]})
    }
    if(categoryErrors.length){
        arrayErrors.push({categoryError:categoryErrors[0]})
    }


    if(arrayErrors.length){
        return res.status(500).json({
            errors:arrayErrors,
            message:'Invalid inputs'
        })
    }

    const slug = title.split('-')[0].trim().toLowerCase().replace(/ /g,'-');
    
    const card = new Card({
        title:title,
        slug:slug,
        description:description,
        category:ObjectID(categoryId),
        tag:ObjectID(tagId),
        image:newImage,
        cardSize:cardSize,
        status:status,
        deleted:false,
    })

    const savedCard = await card.save();
    return res.status(201).json({
        data:savedCard,
        message:'Card created successfully'
    })
}

//! ----- EDIT A CARD ----------
exports.updateCard = async (req, res, next) => {
    const cardId= req.body.cardId
    const title = req.body.title;
    const description = req.body.discription;
    const categoryId = req.body.category;
    const tagId = req.body.tag;
    const cardImage = req.file;
    const cardSize = req.body.cardSize;
    const status = req.body.status;

    const imageErrors = [];
    const tagErrors = [];
    const categoryErrors = [];
    const arrayErrors =[]


    if(!cardImage){
        imageErrors.push('No image provided!')
    }

    const newTag = await Tag.findById(tagId);
    if(!newTag){
        tagErrors.push('Tag is not valid')
    }

    const newCategory = await Category.findById(categoryId);
    if(!newCategory){
        categoryErrors.push('Category is not valid')
    }

    const newImage ={
        imageName: cardImage.filename,
        path:cardImage.path,
        destination:cardImage.destination,
        mimetype:cardImage.mimetype
    }
    
    if(imageErrors.length){
        arrayErrors.push({imageError:imageErrors[0]})
    }
    if(tagErrors.length){
        arrayErrors.push({tagError:tagErrors[0]})
    }
    if(categoryErrors.length){
        arrayErrors.push({categoryError:categoryErrors[0]})
    }


    if(arrayErrors.length){
        return res.status(500).json({
            errors:arrayErrors,
            message:'Invalid inputs'
        })
    }
    const slug = title.split('-')[0].trim().toLowerCase().replace(/ /g,'-');
    
    const card = await Card.findById(cardId);
    if(!card){
        return res.status(404).json({
            message:'Card does not exist'
        })
    }

    card.title = title;
    card.slug = slug;
    card.description = description;
    card.category = ObjectID(categoryId);
    card.tag = ObjectID(cardId);
    card.image = newImage;
    card.cardSize = cardSize;
    card.status = status;

    const updatedCard = await card.save()

    if(updatedCard){
        return res.status(201).json({
            data:savedCard,
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






