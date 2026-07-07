const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const { generateMealPlan } = require('../controllers/mealController');

// Same endpoint handles both "generate" and "regenerate" since it's just
// a fresh random pull each time — the frontend can call this on either
// the initial button or the regenerate button
router.post('/generate', requireAuth, generateMealPlan);

module.exports = router;
