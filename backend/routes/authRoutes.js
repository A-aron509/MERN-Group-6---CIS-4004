const express = require('express');
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  googleAuth,
  setupTwoFactor,
  confirmTwoFactor,
  verifyTwoFactorLogin,
} = require('../controllers/authController');

const requireAuth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/google', googleAuth);

router.post('/2fa/setup', requireAuth, setupTwoFactor);
router.post('/2fa/confirm', requireAuth, confirmTwoFactor);
router.post('/2fa/login', verifyTwoFactorLogin);

module.exports = router;
