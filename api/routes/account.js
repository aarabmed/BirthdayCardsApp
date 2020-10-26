const express = require("express");
const auth = require("../middlewares/auth")
const router = express.Router();

// const  {getUser,getAllUsers,createUser, updateUser,deleteUser}= 
const accountController = require('../controllers/account')

router.get('/login',accountController.userLogin);
router.get('/logout',accountController.userLogout);
router.post('/signUp', accountController.createUser);


module.exports = router;