import { useState } from "react";
import Navbar from "../components/Navbar";
import AvocadoMascot from "../components/AvocadoMascot";

function MealPlan() {
  const mealOptions = {
    Breakfast: [
      {
        type: "Breakfast",
        icon: "🍳",
        name: "Greek Yogurt Bowl",
        details: "Greek yogurt, berries, granola, and honey",
        calories: 420,
        protein: 28,
      },
      {
        type: "Breakfast",
        icon: "🥞",
        name: "Protein Pancakes",
        details: "Protein pancakes, banana, strawberries, and maple syrup",
        calories: 510,
        protein: 32,
      },
      {
        type: "Breakfast",
        icon: "🥑",
        name: "Avocado Egg Toast",
        details: "Whole-grain toast, avocado, eggs, and tomatoes",
        calories: 460,
        protein: 24,
      },
      {
        type: "Breakfast",
        icon: "🥣",
        name: "Peanut Butter Oatmeal",
        details: "Oats, peanut butter, banana, cinnamon, and almond milk",
        calories: 480,
        protein: 22,
      },
    ],

    Lunch: [
      {
        type: "Lunch",
        icon: "🥗",
        name: "Salmon Rice Bowl",
        details: "Salmon, jasmine rice, avocado, cucumber, and greens",
        calories: 650,
        protein: 38,
      },
      {
        type: "Lunch",
        icon: "🌯",
        name: "Chicken Burrito Bowl",
        details: "Chicken, brown rice, black beans, corn, and salsa",
        calories: 680,
        protein: 42,
      },
      {
        type: "Lunch",
        icon: "🥪",
        name: "Turkey Avocado Sandwich",
        details: "Turkey, avocado, lettuce, tomato, and whole-grain bread",
        calories: 540,
        protein: 35,
      },
      {
        type: "Lunch",
        icon: "🍝",
        name: "Chicken Pesto Pasta",
        details: "Chicken, pasta, pesto, spinach, and cherry tomatoes",
        calories: 710,
        protein: 44,
      },
    ],

    Dinner: [
      {
        type: "Dinner",
        icon: "🍗",
        name: "Chicken Power Plate",
        details: "Grilled chicken, sweet potatoes, broccoli, and olive oil",
        calories: 720,
        protein: 45,
      },
      {
        type: "Dinner",
        icon: "🥩",
        name: "Steak and Potatoes",
        details: "Lean steak, roasted potatoes, asparagus, and garlic",
        calories: 760,
        protein: 52,
      },
      {
        type: "Dinner",
        icon: "🍤",
        name: "Shrimp Stir Fry",
        details: "Shrimp, mixed vegetables, rice, and teriyaki sauce",
        calories: 610,
        protein: 40,
      },
      {
        type: "Dinner",
        icon: "🐟",
        name: "Baked Salmon Plate",
        details: "Baked salmon, quinoa, green beans, and lemon",
        calories: 690,
        protein: 46,
      },
    ],

    Snack: [
      {
        type: "Snack",
        icon: "🍎",
        name: "Apple and Peanut Butter",
        details: "Apple slices served with creamy peanut butter",
        calories: 260,
        protein: 8,
      },
      {
        type: "Snack",
        icon: "🥤",
        name: "Protein Smoothie",
        details: "Protein powder, banana, berries, and almond milk",
        calories: 320,
        protein: 30,
      },
      {
        type: "Snack",
        icon: "🥜",
        name: "Trail Mix",
        details: "Almonds, cashews, raisins, and dark chocolate",
        calories: 290,
        protein: 10,
      },
      {
        type: "Snack",
        icon: "🧀",
        name: "Cheese and Crackers",
        details: "Cheddar cheese, whole-grain crackers, and grapes",
        calories: 280,
        protein: 13,
      },
    ],
  };

  const initialMeals = [
    mealOptions.Breakfast[0],
    mealOptions.Lunch[0],
    mealOptions.Dinner[0],
    mealOptions.Snack[0],
  ];

  const [meals, setMeals] = useState(initialMeals);

  const getRandomMeal = (mealType, currentMealName = "") => {
    const choices = mealOptions[mealType].filter(
      (meal) => meal.name !== currentMealName
    );

    const randomIndex = Math.floor(Math.random() * choices.length);

    return choices[randomIndex];
  };

  const regenerateMealPlan = () => {
    const newMeals = [
      getRandomMeal("Breakfast", meals[0].name),
      getRandomMeal("Lunch", meals[1].name),
      getRandomMeal("Dinner", meals[2].name),
      getRandomMeal("Snack", meals[3].name),
    ];

    setMeals(newMeals);
  };

  const swapMeal = (index) => {
    const currentMeal = meals[index];

    const replacementMeal = getRandomMeal(
      currentMeal.type,
      currentMeal.name
    );

    const updatedMeals = [...meals];
    updatedMeals[index] = replacementMeal;

    setMeals(updatedMeals);
  };

  const totalCalories = meals.reduce(
    (total, meal) => total + meal.calories,
    0
  );

  const totalProtein = meals.reduce(
    (total, meal) => total + meal.protein,
    0
  );

  return (
    <div className="container-fluid min-vh-100 bg-light p-4">
      <div className="container">
        <Navbar />

        <div className="card border-0 shadow rounded-4 p-4 mb-4 bg-success bg-opacity-10">
          <div className="row align-items-center">
            <div className="col-md-9">
              <h1 className="fw-bold text-success mb-2">
                🍽️ Your Meal Plan
              </h1>

              <p className="text-muted mb-3">
                Your meals have been personalized based on your fitness goal,
                activity level, and nutrition preferences.
              </p>

              <button
                type="button"
                className="btn btn-success"
                onClick={regenerateMealPlan}
              >
                ✨ Regenerate Meal Plan
              </button>
            </div>

            <div className="col-md-3 text-center">
              <AvocadoMascot />
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Daily Calories</h6>

              <h2 className="fw-bold text-success">
                {totalCalories.toLocaleString()} kcal
              </h2>

              <p className="text-muted mb-0">
                Estimated total for today
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Protein</h6>

              <h2 className="fw-bold">{totalProtein}g</h2>

              <p className="text-muted mb-0">
                Approximate daily protein
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Goal</h6>

              <h2 className="fw-bold">Build Muscle</h2>

              <p className="text-muted mb-0">
                Meal plan adjusted for goal
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {meals.map((meal, index) => (
            <div className="col-md-6" key={`${meal.type}-${meal.name}`}>
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h4 className="fw-bold">
                      {meal.icon} {meal.type}
                    </h4>

                    <h5 className="text-success">{meal.name}</h5>
                  </div>

                  <span className="badge bg-success bg-opacity-10 text-success p-2">
                    {meal.calories} kcal
                  </span>
                </div>

                <p className="text-muted">{meal.details}</p>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="fw-semibold">
                    {meal.protein}g protein
                  </small>

                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={() => swapMeal(index)}
                  >
                    Swap Meal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MealPlan;