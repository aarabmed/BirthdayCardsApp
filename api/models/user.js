const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
    },
    authority:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    },
    deleted:{
        type:Boolean,
        default:false
    },
    statusUpdatedBy:{
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
    validToken:{
        type:Boolean,
    }
    
},{timestamps: true}) 

module.exports=mongoose.model('User',userSchema)