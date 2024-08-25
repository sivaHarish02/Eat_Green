// routes/authRoutes.js
const express = require('express');
const { getProduct } = require('../controllers/productsController');
const router = express.Router();

router.get('/products', getProduct);

module.exports = router;
