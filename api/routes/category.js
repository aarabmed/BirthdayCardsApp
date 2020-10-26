const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth");
const uploadImage = require("../middlewares/imageUpload");
const  {getCategory,getAllCategories,createCategory, updateCategory,deleteCategory}= require('../controllers/category')


router.get("/", getAllCategories);

// router.get("/categories/:categoryId", getCategory);

router.post("/new",checkAuth,uploadImage('categoryImage'), createCategory);

router.patch("/:categoryId",checkAuth, updateCategory);

router.post("/:categoryId",checkAuth, deleteCategory);

module.exports = router;