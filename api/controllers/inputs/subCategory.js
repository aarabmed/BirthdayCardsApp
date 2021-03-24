
module.exports={
    titleProperties:{
        inputName:'title',
        validation:[
            {
                isEmpty:false
            },
            {
                isLength:{min:5}
            }
            ,
            {
                isAlphabets:true,
            },
        ]
    },
    nameProperties:{
        inputName:'name',
        validation:[
            {
                isEmpty:false
            },
            {
                isLength:{min:3}
            }
            ,
            {
                isAlphabets:true,
            },
        ]
    },
    slugProperties:{
        inputName:'slug',
        validation:[
            {
                isEmpty:false
            },
            {
                isLength:{min:3}
            }
            ,
            {
                isAlphabets:true,
            },
        ]
    },
    descriptionProperties:{
        inputName:'description',
        validation:[
            {
                isEmpty:false
            }
        ]
    },
    imageProperties:{
        inputName:'subCategoryImage',
        validation:[
            {
                isImage:true
            }
        ]
    },
}