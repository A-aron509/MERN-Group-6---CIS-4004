const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { setupProfile, getProfile } = require('../controllers/profileController');

router.post('/setup', requireAuth, setupProfile);
router.get('/', requireAuth, getProfile);

module.exports = router;
