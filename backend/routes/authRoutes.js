const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, googleAuth } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/google', googleAuth);

module.exports = router;
