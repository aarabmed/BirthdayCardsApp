
exports.loginInputs ={
    userNameProperties:{
        inputName:'userName',
        validation:[
            {
                isEmpty:true
            }
        ]
    },
    passwordProperties:{
        inputName:'password',
        validation:[
            {
                isEmpty:true
            }
        ]
    },
}

exports.signupInputs ={
    userNameProperties:{
        inputName:'userName',
        validation:[
            {
                isEmpty:false
            },
            {
                isLength:{min:5,max:20}
            },
            {
                isMatch:{regex:'[!@#$%^&*(),.?":{}|<>]'}
            }
        ]
    },
    passwordProperties:{
        inputName:'password',
        validation:[
            {
                isEmpty:false
            },
            {
                isLength:{min:8}
            }
        ]
    },
    oldPasswordProperties:{
        inputName:'oldPassword',
        validation:[
            {
                isEmpty:false
            }
        ]
    },
}

