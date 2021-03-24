const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth");
const  {getTag,getAllTags,createTag, updateTag,deleteTag}= require('../controllers/Tag')


router.get("/", getAllTags);

// router.get("/tags/:tagId", getTag);

router.post("/new",checkAuth, createTag);

router.patch("/:tagId",checkAuth,checkAuth, updateTag);

router.post("/:tagId",checkAuth, deleteTag);

module.exports = router;