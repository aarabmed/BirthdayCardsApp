const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const  {getCard,getAllCards,createCard, updateCard,deleteCard}= require('../controllers/card')


router.get("/all_cards", getAllCards);

router.get("/card/:cardId", getCard);

router.post("/new_card",auth, createCard);

router.patch("/edit/card/:cardId",auth, updateCard);

router.post("/delete/card/:cardId",auth, deleteCard);

module.exports = router;