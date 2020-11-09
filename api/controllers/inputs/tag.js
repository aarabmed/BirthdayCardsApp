
module.exports ={
    nameProperties:{
        inputName:'name',
        validation:[
            {
                isEmpty:true
            },
            {
                isLength:{min:5}
            }
        ]
    },
}