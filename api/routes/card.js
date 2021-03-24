const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/auth");
const uploadImage = require("../middlewares/imageUpload");

const  {getCard,getAllCards,createCard, updateCard,deleteCard}= require('../controllers/card')


router.get("/", getAllCards);

router.get("/:cardId", getCard);

router.post("/new",checkAuth,uploadImage('cardImage'), createCard);

router.patch("/:id",checkAuth,uploadImage('cardImage'), updateCard);

router.post("/:cardId",checkAuth, deleteCard);

module.exports = router;