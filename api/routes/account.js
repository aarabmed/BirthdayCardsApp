const express = require("express");
const auth = require("../middlewares/auth")
const router = express.Router();

// const  {getUser,getAllUsers,createUser, updateUser,deleteUser}= 
const accountController = require('../controllers/account')

router.get('/login',accountController.userLogin);
router.get('/new_password',auth,accountController.updateUserPassword);
router.get('/logout',auth,accountController.userLogout);
router.post('/signUp', accountController.createUser);


module.exports = router;