// routes/authRoutes.js
const express = require('express');
const { registerUser, authUser, protect, getUserById, updateUserById } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/getuser/:id', getUserById);
router.put('/updateuser/:id', updateUserById);

module.exports = router;
