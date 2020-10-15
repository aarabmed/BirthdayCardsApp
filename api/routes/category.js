const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const  {getCategory,getAllCategories,createCategory, updateCategory,deleteCategory}= require('../controllers/category')


router.get("/all_categories", getAllCategories);

router.get("/category/:categoryId", getCategory);

router.post("/new_category",auth, createCategory);

router.patch("/edit/category/:categoryId",auth, updateCategory);

router.post("/delete/category/:categoryId",auth, deleteCategory);

module.exports = router;