
const express = require('express');
const { addFavorite, getToFavorite, deletefavoriteItems } = require('../controllers/favoriteController');
const router = express.Router();

router.post('/addFavorites', addFavorite);
router.get("/getFavorites", getToFavorite);
router.delete('/deletefavorite', deletefavoriteItems);
module.exports = router;