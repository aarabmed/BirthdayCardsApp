const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const  {getTag,getAllTags,createTag, updateTag,deleteTag}= require('../controllers/Tag')


router.get("/all_tags", getAllTags);

router.get("/tag/:tagId", getTag);

router.post("/new_tag",auth, createTag);

router.patch("/edit/tag/:tagId",auth, updateTag);

router.post("/delete/Tag/:tagId",auth, deleteTag);

module.exports = router;