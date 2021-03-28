const express = require("express");
const router = express.Router();
const checkAuth = require("../../middlewares/auth");
const uploadImage = require("../../middlewares/imageUpload");
const  {getAllSubChildren,createSubCategoryChild, deleteSubCategoryChild,updateSubCategoryChild}= require('../../controllers/category/subChildren');


router.get("/", getAllSubChildren);

// router.get("/categories/:categoryId", getCategory);

router.post("/new",uploadImage('subCategoryChildImage'), createSubCategoryChild);

router.patch("/:id",uploadImage('subCategoryChildImage'), updateSubCategoryChild);

router.post("/delete/:id",checkAuth, deleteSubCategoryChild);

module.exports = router;