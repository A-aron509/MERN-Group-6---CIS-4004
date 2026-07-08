import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import AvocadoMascot from "../components/AvocadoMascot";

function MealPlan() {
  const meals = [
    {
      type: "Breakfast",
      icon: "🍳",
      name: "Greek Yogurt Bowl",
      details: "Greek yogurt, berries, granola, honey",
      calories: "420 kcal",
      protein: "28g protein",
    },
    {
      type: "Lunch",
      icon: "🥗",
      name: "Salmon Rice Bowl",
      details: "Salmon, jasmine rice, avocado, cucumber, greens",
      calories: "650 kcal",
      protein: "38g protein",
    },
    {
      type: "Dinner",
      icon: "🍗",
      name: "Chicken Power Plate",
      details: "Grilled chicken, sweet potatoes, broccoli, olive oil",
      calories: "720 kcal",
      protein: "45g protein",
    },
    {
      type: "Snack",
      icon: "🍎",
      name: "Apple & Peanut Butter",
      details: "Apple slices with peanut butter",
      calories: "260 kcal",
      protein: "8g protein",
    },
  ];

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

              <button className="btn btn-success">
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
              <h2 className="fw-bold text-success">2,050 kcal</h2>
              <p className="text-muted mb-0">Estimated total for today</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Protein</h6>
              <h2 className="fw-bold">119g</h2>
              <p className="text-muted mb-0">Approximate daily protein</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Goal</h6>
              <h2 className="fw-bold">Build Muscle</h2>
              <p className="text-muted mb-0">Meal plan adjusted for goal</p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {meals.map((meal, index) => (
            <div className="col-md-6" key={index}>
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h4 className="fw-bold">
                      {meal.icon} {meal.type}
                    </h4>
                    <h5 className="text-success">{meal.name}</h5>
                  </div>

                  <span className="badge bg-success bg-opacity-10 text-success p-2">
                    {meal.calories}
                  </span>
                </div>

                <p className="text-muted">{meal.details}</p>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="fw-semibold">{meal.protein}</small>

                  <button className="btn btn-outline-success btn-sm">
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