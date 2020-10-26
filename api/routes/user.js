const express = require("express");
const checkAuth = require("../middlewares/auth")
const router = express.Router();

// const  {getUser,getAllUsers,createUser, updateUser,deleteUser}= 
const userController = require('../controllers/user')


router.get("/",checkAuth, userController.getAllUsers);

router.get("/:userId",checkAuth, userController.getUser);

router.patch("/:userId",checkAuth, userController.updateUser);

router.post("/:userId",checkAuth, userController.deleteUser);

module.exports = router;