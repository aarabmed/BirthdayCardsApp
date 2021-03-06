
module.exports ={
    nameProperties:{
        inputName:'name',
        validation:[
            {
                isEmpty:true
            },
            {
                isLength:{min:4}
            }
        ]
    },
    statusProperties:{
        inputName:'status',
        validation:[
            {
                isBoolean:true
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
                isLength:{min:5}
            }
            ,
            {
                isAlphabets:true,
            },
        ]
    }
}