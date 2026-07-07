const axios = require('axios');
const User = require('../models/User');

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;
const EDAMAM_BASE_URL = 'https://api.edamam.com/api/recipes/v2';

// Rough activity multipliers for estimating daily calories (Mifflin-St Jeor style
// simplification — good enough for a class project, not a medical tool)
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very active': 1.9,
};

// Calorie split per meal — rough percentages of the daily target
const MEAL_CALORIE_SPLIT = {
  breakfast: 0.25,
  lunch: 0.3,
  dinner: 0.3,
  snack: 0.15,
};

const calculateDailyCalories = (user) => {
  // Simple baseline estimate since we only collect weight range, not exact
  // weight/age/sex. Good enough to drive meal search ranges for this project.
  const baseCalories = 2000;
  const multiplier = ACTIVITY_MULTIPLIERS[user.activityLevel?.toLowerCase()] || 1.375;

  let target = baseCalories * multiplier;

  if (user.fitnessGoal === 'Lose Weight') target -= 400;
  if (user.fitnessGoal === 'Build Muscle') target += 300;

  return Math.round(target);
};

const fetchMealFromEdamam = async (mealType, targetCalories) => {
  const calorieRange = `${Math.round(targetCalories * 0.8)}-${Math.round(targetCalories * 1.2)}`;

  const response = await axios.get(EDAMAM_BASE_URL, {
    params: {
      type: 'public',
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY,
      mealType,
      calories: calorieRange,
      random: true,
    },
    headers: {
      'Edamam-Account-User': EDAMAM_APP_ID, // required by Edamam v2 API
    },
  });

  const hits = response.data.hits;
  if (!hits || hits.length === 0) {
    return null;
  }

  // Pick a random result from what came back so "regenerate" gives variety
  const recipe = hits[Math.floor(Math.random() * hits.length)].recipe;

  return {
    label: recipe.label,
    image: recipe.image,
    calories: Math.round(recipe.calories),
    url: recipe.url,
    ingredientLines: recipe.ingredientLines,
  };
};

// POST /api/meals/generate
const generateMealPlan = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.profileComplete) {
      return res.status(400).json({ message: 'Please complete your profile first.' });
    }

    const dailyCalories = calculateDailyCalories(user);

    const [breakfast, lunch, dinner, snack] = await Promise.all([
      fetchMealFromEdamam('breakfast', dailyCalories * MEAL_CALORIE_SPLIT.breakfast),
      fetchMealFromEdamam('lunch', dailyCalories * MEAL_CALORIE_SPLIT.lunch),
      fetchMealFromEdamam('dinner', dailyCalories * MEAL_CALORIE_SPLIT.dinner),
      fetchMealFromEdamam('snack', dailyCalories * MEAL_CALORIE_SPLIT.snack),
    ]);

    res.status(200).json({
      dailyCalorieTarget: dailyCalories,
      mealPlan: { breakfast, lunch, dinner, snack },
    });
  } catch (err) {
    console.error('Meal generation error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Server error generating meal plan.' });
  }
};

module.exports = { generateMealPlan };
