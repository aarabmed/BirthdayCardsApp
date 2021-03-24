
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
    emailProperties:{
        inputName:'email',
        validation:[
            {
                isEmail:true
            }
        ]
    }
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
    emailProperties:{
        inputName:'email',
        validation:[
            {
                isEmail:true
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

