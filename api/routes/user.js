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

 const  {getUser,getAllUsers, updateUser,deleteUser,upgradeUser,downgradeUser,setUserStatus}= require('../controllers/user')


router.get("/",checkAuth, getAllUsers);

router.get("/:id",checkAuth, getUser);

router.patch("/:id",checkAuth, updateUser);

router.patch("/status/:id",checkAuth, setUserStatus);

router.patch("/upgrade/:id",checkAuth, upgradeUser);

router.patch("/downgrade/:id",checkAuth, downgradeUser);

router.patch("/delete/:id",checkAuth, deleteUser);

module.exports = router;