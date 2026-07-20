//const User = require("../models/User");

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very active": 1.9,
};

const breakfastMeals = [
  {
    type: "Breakfast",
    icon: "🍳",
    name: "Greek Yogurt Bowl",
    details: "Greek yogurt, berries, granola, honey",
    calories: "420 kcal",
    protein: "28g protein",
  },
  {
    type: "Breakfast",
    icon: "🥞",
    name: "Protein Pancakes",
    details: "Protein pancakes with strawberries",
    calories: "450 kcal",
    protein: "30g protein",
  },
  {
    type: "Breakfast",
    icon: "🥣",
    name: "Oatmeal Bowl",
    details: "Oats, banana, almonds, cinnamon",
    calories: "390 kcal",
    protein: "18g protein",
  },
];

const lunchMeals = [
  {
    type: "Lunch",
    icon: "🥗",
    name: "Salmon Rice Bowl",
    details: "Salmon, jasmine rice, avocado, cucumber",
    calories: "650 kcal",
    protein: "38g protein",
  },
  {
    type: "Lunch",
    icon: "🌯",
    name: "Turkey Wrap",
    details: "Turkey, spinach, tomato, whole wheat wrap",
    calories: "590 kcal",
    protein: "35g protein",
  },
  {
    type: "Lunch",
    icon: "🍝",
    name: "Chicken Pasta",
    details: "Grilled chicken with whole wheat pasta",
    calories: "670 kcal",
    protein: "42g protein",
  },
];

const dinnerMeals = [
  {
    type: "Dinner",
    icon: "🍗",
    name: "Chicken Power Plate",
    details: "Grilled chicken, sweet potatoes, broccoli",
    calories: "720 kcal",
    protein: "45g protein",
  },
  {
    type: "Dinner",
    icon: "🥩",
    name: "Steak & Veggies",
    details: "Sirloin steak with roasted vegetables",
    calories: "760 kcal",
    protein: "48g protein",
  },
  {
    type: "Dinner",
    icon: "🍤",
    name: "Shrimp Stir Fry",
    details: "Shrimp with mixed vegetables and rice",
    calories: "690 kcal",
    protein: "40g protein",
  },
];

const snackMeals = [
  {
    type: "Snack",
    icon: "🍎",
    name: "Apple & Peanut Butter",
    details: "Apple slices with peanut butter",
    calories: "260 kcal",
    protein: "8g protein",
  },
  {
    type: "Snack",
    icon: "🥜",
    name: "Mixed Nuts",
    details: "Almonds, cashews and walnuts",
    calories: "240 kcal",
    protein: "7g protein",
  },
  {
    type: "Snack",
    icon: "🥤",
    name: "Protein Shake",
    details: "Vanilla whey protein shake",
    calories: "220 kcal",
    protein: "30g protein",
  },
];

function randomMeal(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function calculateDailyCalories(user) {
  const baseCalories = 2000;

  const multiplier =
    ACTIVITY_MULTIPLIERS[user.activityLevel?.toLowerCase()] || 1.375;

  let target = baseCalories * multiplier;

  if (user.fitnessGoal === "Lose Weight") target -= 400;
  if (user.fitnessGoal === "Build Muscle") target += 300;

  return Math.round(target);
}

const generateMealPlan = (req, res) => {
  try {
    const meals = [
      randomMeal(breakfastMeals),
      randomMeal(lunchMeals),
      randomMeal(dinnerMeals),
      randomMeal(snackMeals),
    ];

    res.status(200).json({
      dailyCalories: 2050,
      goal: "Build Muscle",
      meals,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error generating meal plan.",
    });
  }
};

module.exports = {
  generateMealPlan,
};