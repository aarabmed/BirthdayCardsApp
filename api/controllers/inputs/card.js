
module.exports ={
    titleProps:{
        inputName:'title',
        validation:[
            {
                isEmpty:false
            },
            {
                isAlphabets:true
            }
        ]
    },
    descProps:{
        inputName:'description',
        validation:[
            {
                isEmpty:false,
            }
        ]
    },
    cardImageProps:{
        inputName:'cardImage',
        validation:[
            {
                isImage:true
            }
        ]
    },
    cardSizeProps:{
        inputName:'cardSize',
        validation:[
            {
                isEmpty:false
            }
        ]
    },
    statusProps:{
        inputName:'status',
        validation:[
            {
                isBoolean:true,
            }
        ]
    },
    slugProperties:{
        inputName:'slug',
        validation:[
            {
                isEmpty:false
            },
            {
                isLength:{min:4}
            }
            ,
            {
                isAlphabets:true,
            },
        ]
    },
}
