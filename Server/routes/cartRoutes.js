
const express = require('express');
const { addToCart, getToCart, updateCart,deleteCartItem } = require('../controllers/cartController');
const router = express.Router();

router.post('/addcart', addToCart);
router.get('/getcart', getToCart);
router.post('/updatecart', updateCart);
router.delete('/deletecart', deleteCartItem);

module.exports = router;
