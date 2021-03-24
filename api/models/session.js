const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    user:{
        type:Object,
        required:true
    },
    token:{
        type:String,
    }
    
},{timestamps: true}) 

module.exports=mongoose.model('Session',userSchema)