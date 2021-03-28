const express = require("express");
const {ironSession} = require("next-iron-session");
const auth = require("../middlewares/auth")
const router = express.Router();

// const  {getUser,getAllUsers,createUser, updateUser,deleteUser}= 
const accountController = require('../controllers/account')


const session = ironSession({
    cookieName: "next-iron-session",
    password: "birthdayCards:MF54GAMun78FQVx@cluster0.ddbxz",
    cookieOptions: {
      // the next line allows to use the session in non-https environements
      secure: false,
    },
});

router.post('/login',session,accountController.userLogin);
router.patch('/new_password/:id',auth,accountController.updateUserPassword);
router.get('/logout',auth,accountController.userLogout);
router.post('/signup', accountController.createUser);


module.exports = router;