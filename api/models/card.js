const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
    title : {
        type:String,
        required:true,
    },
    slug :{
        type:String,
        required:true,
    },
    description :{
        type:String,
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'category'
    },
    tag:{
        type:Schema.Types.ObjectId,
        ref:'tag'
    },
    image:{
        type:Object,
        required:true
    },
    cardSize:[{
        type:String,
    }],
    status:{
        type:Boolean,
        required:true
    },
    deleted:{
        type:Boolean,
        required:true
    }
},{timestamps: true})

module.exports = mongoose.model('Card',cardSchema)