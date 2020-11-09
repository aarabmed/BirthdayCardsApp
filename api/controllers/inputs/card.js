
module.exports ={
    titleProps:{
        inputName:'Title',
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
                isImage:false
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
    }
}
