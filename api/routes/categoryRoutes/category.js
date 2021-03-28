const express = require("express");
const router = express.Router();
const checkAuth = require("../../middlewares/auth");
const uploadImage = require("../../middlewares/imageUpload");
const  {getCategory,getAllCategories,createCategory, updateCategory,deleteCategory}= require('../../controllers/category/category')


router.get("/", getAllCategories);

// router.get("/categories/:categoryId", getCategory);

router.post("/new",uploadImage('categoryImage'),checkAuth, createCategory);

router.patch("/:id",uploadImage('categoryImage'),checkAuth, updateCategory);

router.patch("/delete/:id",checkAuth, deleteCategory);


module.exports = router;