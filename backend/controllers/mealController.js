const axios = require('axios');
const User = require('../models/User');

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';

// Rough activity multipliers for estimating daily calories (simplified —
// good enough for a class project, not a medical tool)
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
  const baseCalories = 2000;
  const multiplier = ACTIVITY_MULTIPLIERS[user.activityLevel?.toLowerCase()] || 1.375;

  let target = baseCalories * multiplier;

  if (user.fitnessGoal === 'Lose Weight') target -= 400;
  if (user.fitnessGoal === 'Build Muscle') target += 300;

  return Math.round(target);
};

const fetchMealFromSpoonacular = async (mealType, targetCalories) => {
  const minCalories = Math.round(targetCalories * 0.8);
  const maxCalories = Math.round(targetCalories * 1.2);

  const response = await axios.get(SPOONACULAR_BASE_URL, {
    params: {
      apiKey: SPOONACULAR_API_KEY,
      type: mealType, // breakfast, main course (lunch/dinner), snack
      minCalories,
      maxCalories,
      number: 10, // pull a handful so we can pick randomly for variety
      addRecipeInformation: true,
      addRecipeNutrition: true,
    },
  });

  const results = response.data.results;
  if (!results || results.length === 0) {
    return null;
  }

  // Pick a random result so "regenerate" gives variety
  const recipe = results[Math.floor(Math.random() * results.length)];

  const calorieInfo = recipe.nutrition?.nutrients?.find((n) => n.name === 'Calories');

  return {
    label: recipe.title,
    image: recipe.image,
    calories: calorieInfo ? Math.round(calorieInfo.amount) : null,
    url: recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.id}`,
    readyInMinutes: recipe.readyInMinutes,
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

    // Spoonacular uses "main course" instead of separate lunch/dinner types
    const [breakfast, lunch, dinner, snack] = await Promise.all([
      fetchMealFromSpoonacular('breakfast', dailyCalories * MEAL_CALORIE_SPLIT.breakfast),
      fetchMealFromSpoonacular('main course', dailyCalories * MEAL_CALORIE_SPLIT.lunch),
      fetchMealFromSpoonacular('main course', dailyCalories * MEAL_CALORIE_SPLIT.dinner),
      fetchMealFromSpoonacular('snack', dailyCalories * MEAL_CALORIE_SPLIT.snack),
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
