import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="container-fluid min-vh-100 bg-light p-4">
      <div className="container">
        <nav className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-success fw-bold">🌿 StayFresh</h2>
          <div>
            <Link to="/" className="btn btn-outline-success me-2">
              Logout
            </Link>
          </div>
        </nav>

        <div className="mb-4">
          <h1 className="fw-bold">Welcome back!</h1>
          <p className="text-muted">
            Here is your personalized wellness dashboard for today.
          </p>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Daily Calories</h6>
              <h2 className="fw-bold text-success">1,850 - 2,100</h2>
              <p className="mb-0 text-muted">Estimated calorie target range</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Fitness Goal</h6>
              <h2 className="fw-bold">Build Muscle</h2>
              <p className="mb-0 text-muted">Based on your profile setup</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Activity Level</h6>
              <h2 className="fw-bold">Moderate</h2>
              <p className="mb-0 text-muted">3-4 workouts per week</p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="fw-bold mb-1">Today&apos;s Meal Plan</h3>
                  <p className="text-muted mb-0">
                    Simple meal recommendations for your goal.
                  </p>
                </div>

                <Link to="/meal-plan" className="btn btn-success">
                  Generate New Plan
                </Link>
              </div>

              <div className="row g-3 mt-2">
                <div className="col-md-6">
                  <div className="border rounded-4 p-3 h-100">
                    <h5>🍳 Breakfast</h5>
                    <p className="mb-1 fw-semibold">Greek Yogurt Bowl</p>
                    <small className="text-muted">
                      Greek yogurt, berries, granola, honey
                    </small>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-4 p-3 h-100">
                    <h5>🥗 Lunch</h5>
                    <p className="mb-1 fw-semibold">Salmon Rice Bowl</p>
                    <small className="text-muted">
                      Salmon, rice, avocado, cucumber, greens
                    </small>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-4 p-3 h-100">
                    <h5>🍗 Dinner</h5>
                    <p className="mb-1 fw-semibold">Chicken Power Plate</p>
                    <small className="text-muted">
                      Chicken, sweet potatoes, vegetables
                    </small>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-4 p-3 h-100">
                    <h5>🍎 Snack</h5>
                    <p className="mb-1 fw-semibold">Apple & Peanut Butter</p>
                    <small className="text-muted">
                      Apple slices with peanut butter
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold">Profile Summary</h4>
              <p className="mb-1">
                <strong>Height:</strong> 5&apos;4
              </p>
              <p className="mb-1">
                <strong>Weight:</strong> 145 - 160 lbs
              </p>
              <p className="mb-1">
                <strong>Goal:</strong> Build Muscle
              </p>
              <p className="mb-0">
                <strong>Cardio:</strong> Walking, 2x/week
              </p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold">Quick Actions</h4>
              <Link to="/onboarding" className="btn btn-outline-success w-100 mb-2">
                Edit Profile
              </Link>
              <Link to="/meal-plan" className="btn btn-success w-100">
                View Meal Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;