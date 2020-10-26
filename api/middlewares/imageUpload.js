const multer = require('multer');
const Category = require('../models/category');
const Card = require('../models/card')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        if(file.fieldname === 'cardImage'){
            return cb(null,'images/cards')
        }
        cb(null,'images/categories')
    },
    filename:async (req, file, cb)=>{
        let imageNumber;
        let recentItem = false;
        if(file.fieldname === 'cardImage')
            recentItem = await Card.find().sort({"_id" : -1}).limit(1);
        else{
            recentItem = await Category.find().sort({"_id" : -1}).limit(1);
        }

        
        if(recentItem.length){
            const index = recentItem[0].image.imageName.split('.')[0].split('-')[1];
            imageNumber = Number(index)+1
        }else{
            imageNumber = 0
        }
        const count = file.originalname.split('.').length
        const extention = file.originalname.split('.')[count-1]
        if(!recentItem){
            return cb(true,`image-${imageNumber}.${extention}`);
        }
        cb(null,`image-${imageNumber}.${extention}`);
    }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'){
        cb(null, true);
    }else{
        cb(null,false)
    }
}
module.exports=(value)=>(req, res, next) =>{
    const uploadFiles = multer({storage:fileStorage, fileFilter: fileFilter}).single(value);
    uploadFiles(req, res, err => {
        if (err instanceof multer.MulterError) { // A Multer error occurred when uploading.
            if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
            // ...
            }
        } else if (err) {
            // handle other errors
        }
    
        // Everything is ok.
        next();
    });
}