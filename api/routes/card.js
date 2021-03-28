const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth");
const uploadImage = require("../middlewares/imageUpload");

const  {getCard,getAllCards,createCard, updateCard,deleteCard}= require('../controllers/card')


router.get("/", getAllCards);

router.get("/:id", getCard);

router.post("/new",checkAuth,uploadImage('cardImage'), createCard);

router.patch("/:id",checkAuth,uploadImage('cardImage'), updateCard);

router.patch("/delete/:id",checkAuth, deleteCard);

module.exports = router;