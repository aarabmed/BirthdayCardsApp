const express = require("express");
const {ironSession} = require("next-iron-session");
const router = express.Router();
const auth = require("../middlewares/auth")

const session = ironSession({
    cookieName: "next-iron-session",
    password: "birthdayCards:MF54GAMun78FQVx@cluster0.ddbxz",
    cookieOptions: {
      // the next line allows to use the session in non-https environements
      secure: false,
    },
});

router.get("/me",session, async (req,res)=>{
    if(!req.session.get('user')){
        return res.json({
            session:null,
            message:'you are not sign in',
            status:401
        })
    }
    return res.json({
        session:req.session.get('user'),
        status:200
    })
});

module.exports = router;