const express = require("express");
const router = express.Router();
const checkAuth = require("../../middlewares/auth");
const uploadImage = require("../../middlewares/imageUpload");
const  {getCategory,getAllCategories,createCategory, updateCategory,deleteCategory}= require('../../controllers/category/category')


router.get("/", getAllCategories);

// router.get("/categories/:categoryId", getCategory);

router.post("/new",uploadImage('categoryImage'), createCategory);

router.post("/:categoryId", updateCategory);

router.post("/:categoryId",checkAuth, deleteCategory);


module.exports = router;