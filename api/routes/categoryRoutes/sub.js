const express = require("express");
const router = express.Router();
const checkAuth = require("../../middlewares/auth");
const uploadImage = require("../../middlewares/imageUpload");
const  {getAllSubCategories,createSubCategory, updateSubCategory,deleteSubCategory}= require('../../controllers/category/sub')


router.get("/", getAllSubCategories);

// router.get("/categories/:categoryId", getCategory);

router.post("/new",uploadImage('subCategoryImage'), createSubCategory);

router.patch("/:id",uploadImage('subCategoryImage'),checkAuth, updateSubCategory);

router.patch("/delete/:id",checkAuth, deleteSubCategory);

module.exports = router;