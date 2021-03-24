const express = require("express");
const {ironSession} = require("next-iron-session");

const session = ironSession({
    cookieName: "next-iron-session",
    password: "MF54GAMun78FQVx@ddbxz",
    cookieOptions: {
      // the next line allows to use the session in non-https environements
      secure: false,
    },
});

const checkAuth = require("../middlewares/auth")
const router = express.Router();

 const  {getUser,getAllUsers, updateUser,deleteUser}= require('../controllers/user')


router.get("/", getAllUsers);

router.get("/:userId", getUser);

router.patch("/:userId",checkAuth, updateUser);

router.post("/:userId",checkAuth, deleteUser);

module.exports = router;