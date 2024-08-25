
const express = require('express');
const { addOrder, getUserOrders, deleteOrder } = require('../controllers/orderController');
const router = express.Router();

router.post('/PlaceOrder', addOrder);

router.get('/getmyOrders', getUserOrders);
router.delete('/deleteOrder/:id', deleteOrder);
module.exports = router;