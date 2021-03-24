const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    name : {
        type:String,
        required:true,
    },
    description :{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true
    },
    image:{
        type:Object,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    deletedBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    subCategory:[{
        type:Schema.Types.ObjectId,
        ref:'SubCategory'
    }],
},{timestamps: true})




const SubCategorySchema = new Schema({
    title : {
        type:String,
        required:true,
    },
    name : {
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    image:{
        type:Object,
        required:true
    },

    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    deletedBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    
    childrenSubCategory:[{
        type:Schema.Types.ObjectId,
        ref:'ChildrenSubCategory'
    }],
    tags:[{
        type:Schema.Types.ObjectId,
        ref:'Tag'
    }],
    status:{
        type:Boolean,
        required:true
    },
},{timestamps: true})


const SubCategoryChildSchema = new Schema({
    title : {
        type:String,
        required:true,
    },
    name : {
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true
    },
    image:{
        type:Object,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    deletedBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    tags:[
        {
            type:Schema.Types.ObjectId,
            ref:'Tag'
        }
    ],
    status:{
        type:Boolean,
        required:true
    },
},{timestamps: true})

module.exports ={
    Category : mongoose.model('Category',CategorySchema),
    SubCategory : mongoose.model('SubCategory',SubCategorySchema),
    SubCategoryChild :mongoose.model('ChildrenSubCategory',SubCategoryChildSchema)
} 
    