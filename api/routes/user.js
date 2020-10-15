const express = require("express");
const auth = require("../middlewares/auth")
const router = express.Router();

const  {getUser,getAllUsers,createUser, updateUser,deleteUser}= require('../controllers/user')


router.get("/all_users",auth, getAllUsers);

router.get("/user/:userId",auth, getUser);

router.post("/new_user",auth, createUser);

router.patch("/edit/user/:userId",auth, updateUser);

router.post("/delete/user/:userId",auth, deleteUser);

module.exports = router;