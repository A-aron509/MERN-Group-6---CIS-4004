import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    Boolean(user?.twoFactorEnabled)
  );
  const [qrCode, setQrCode] = useState("");
  const [manualKey, setManualKey] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityError, setSecurityError] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);

  // --- Real profile + meal data ---
  const [profile, setProfile] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setDataError("Please log in again.");
        setDataLoading(false);
        return;
      }

      try {
        const profileResponse = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(profileData.message || "Failed to load profile.");
        }

        setProfile(profileData.user);

        // Only pull a meal plan if the profile is actually complete
        if (profileData.user?.profileComplete) {
          const mealResponse = await fetch("/api/meals/generate", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          const mealData = await mealResponse.json();

          if (mealResponse.ok) {
            setMealPlan(mealData.mealPlan);
            setDailyCalorieTarget(mealData.dailyCalorieTarget);
          }
        }
      } catch (error) {
        setDataError(error.message);
      } finally {
        setDataLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const saveTwoFactorStatus = () => {
    if (!user) {
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        twoFactorEnabled: true,
      })
    );
  };

  const startTwoFactorSetup = async () => {
    const token = localStorage.getItem("token");

    setSecurityMessage("");
    setSecurityError(false);

    if (!token) {
      setSecurityError(true);
      setSecurityMessage("Please log in again before enabling two-factor authentication.");
      return;
    }

    setSecurityLoading(true);

    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.message || "Unable to begin two-factor authentication setup.";

        if (errorMessage.toLowerCase().includes("already enabled")) {
          setTwoFactorEnabled(true);
          saveTwoFactorStatus();
          setSecurityMessage("Two-factor authentication is already enabled.");
          return;
        }

        throw new Error(errorMessage);
      }

      setQrCode(data.qrCode);
      setManualKey(data.manualKey);
      setSecurityMessage(
        "Scan the QR code, then enter the six-digit code from your authenticator app."
      );
    } catch (error) {
      setSecurityError(true);
      setSecurityMessage(error.message);
    } finally {
      setSecurityLoading(false);
    }
  };

  const confirmTwoFactorSetup = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const normalizedCode = twoFactorCode.trim();

    setSecurityMessage("");
    setSecurityError(false);

    if (!token) {
      setSecurityError(true);
      setSecurityMessage("Please log in again before confirming two-factor authentication.");
      return;
    }

    if (!/^\d{6}$/.test(normalizedCode)) {
      setSecurityError(true);
      setSecurityMessage("Enter the six-digit code from your authenticator app.");
      return;
    }

    setSecurityLoading(true);

    try {
      const response = await fetch("/api/auth/2fa/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          token: normalizedCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to confirm two-factor authentication."
        );
      }

      setTwoFactorEnabled(true);
      setQrCode("");
      setManualKey("");
      setTwoFactorCode("");
      setSecurityMessage(data.message);
      saveTwoFactorStatus();
    } catch (error) {
      setSecurityError(true);
      setSecurityMessage(error.message);
    } finally {
      setSecurityLoading(false);
    }
  };

  const cancelTwoFactorSetup = () => {
    setQrCode("");
    setManualKey("");
    setTwoFactorCode("");
    setSecurityMessage("");
    setSecurityError(false);
  };

  return (
    <div className="container-fluid min-vh-100 bg-light p-4">
      <div className="container">
        <Navbar />

        <div className="mb-4">
          <h1 className="fw-bold">
            Welcome back, {user?.fullName || "StayFresh user"}!
          </h1>

          <p className="text-muted">
            Here is your personalized wellness dashboard for today.
          </p>
        </div>

        {dataError && (
          <div className="alert alert-warning">{dataError}</div>
        )}

        {!dataLoading && profile && !profile.profileComplete && (
          <div className="alert alert-info">
            Finish setting up your profile to see your personalized calorie
            target and meal plan.{" "}
            <Link to="/onboarding" className="fw-semibold">
              Complete it now
            </Link>
          </div>
        )}

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Daily Calories</h6>
              <h2 className="fw-bold text-success">
                {dataLoading
                  ? "..."
                  : dailyCalorieTarget
                  ? `${dailyCalorieTarget} cal`
                  : "Not set yet"}
              </h2>
              <p className="mb-0 text-muted">
                Estimated calorie target
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Fitness Goal</h6>
              <h2 className="fw-bold">
                {dataLoading ? "..." : profile?.fitnessGoal || "Not set"}
              </h2>
              <p className="mb-0 text-muted">Based on your profile setup</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Activity Level</h6>
              <h2 className="fw-bold text-capitalize">
                {dataLoading ? "..." : profile?.activityLevel || "Not set"}
              </h2>
              <p className="mb-0 text-muted">
                {dataLoading
                  ? ""
                  : profile?.weightliftingFrequency !== undefined
                  ? `${profile.weightliftingFrequency} workouts per week`
                  : ""}
              </p>
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

              {dataLoading ? (
                <p className="text-muted mt-3">Loading your meal plan...</p>
              ) : mealPlan ? (
                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <h5>🍳 Breakfast</h5>
                      <p className="mb-1 fw-semibold">
                        {mealPlan.breakfast?.label || "Not available"}
                      </p>
                      <small className="text-muted">
                        {mealPlan.breakfast?.calories
                          ? `${mealPlan.breakfast.calories} calories`
                          : ""}
                      </small>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <h5>🥗 Lunch</h5>
                      <p className="mb-1 fw-semibold">
                        {mealPlan.lunch?.label || "Not available"}
                      </p>
                      <small className="text-muted">
                        {mealPlan.lunch?.calories
                          ? `${mealPlan.lunch.calories} calories`
                          : ""}
                      </small>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <h5>🍗 Dinner</h5>
                      <p className="mb-1 fw-semibold">
                        {mealPlan.dinner?.label || "Not available"}
                      </p>
                      <small className="text-muted">
                        {mealPlan.dinner?.calories
                          ? `${mealPlan.dinner.calories} calories`
                          : ""}
                      </small>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded-4 p-3 h-100">
                      <h5>🍎 Snack</h5>
                      <p className="mb-1 fw-semibold">
                        {mealPlan.snack?.label || "Not available"}
                      </p>
                      <small className="text-muted">
                        {mealPlan.snack?.calories
                          ? `${mealPlan.snack.calories} calories`
                          : ""}
                      </small>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted mt-3">
                  Complete your profile to get a personalized meal plan.
                </p>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold">Profile Summary</h4>

              {dataLoading ? (
                <p className="text-muted mb-0">Loading...</p>
              ) : profile ? (
                <>
                  <p className="mb-1">
                    <strong>Height:</strong>{" "}
                    {profile.height ? `${profile.height} in` : "Not set"}
                  </p>

                  <p className="mb-1">
                    <strong>Weight:</strong> {profile.weightRange || "Not set"}
                  </p>

                  <p className="mb-1">
                    <strong>Goal:</strong> {profile.fitnessGoal || "Not set"}
                  </p>

                  <p className="mb-0">
                    <strong>Cardio:</strong>{" "}
                    {profile.cardioType
                      ? `${profile.cardioType}, ${profile.cardioFrequency || 0}x/week`
                      : "Not set"}
                  </p>
                </>
              ) : (
                <p className="text-muted mb-0">No profile data yet.</p>
              )}
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold">Quick Actions</h4>

              <Link
                to="/onboarding"
                className="btn btn-outline-success w-100 mb-2"
              >
                Edit Profile
              </Link>

              <Link to="/meal-plan" className="btn btn-success w-100">
                View Meal Plan
              </Link>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold">Account Security</h4>

              <p className="text-muted">
                Protect your account with an authenticator app.
              </p>

              {securityMessage && (
                <div
                  className={`alert ${
                    securityError ? "alert-danger" : "alert-success"
                  }`}
                >
                  {securityMessage}
                </div>
              )}

              {twoFactorEnabled ? (
                <div className="alert alert-success mb-0">
                  Two-factor authentication is enabled.
                </div>
              ) : !qrCode ? (
                <button
                  type="button"
                  className="btn btn-outline-success w-100"
                  onClick={startTwoFactorSetup}
                  disabled={securityLoading}
                >
                  {securityLoading
                    ? "Starting Setup..."
                    : "Enable Two-Factor Authentication"}
                </button>
              ) : (
                <form onSubmit={confirmTwoFactorSetup}>
                  <p className="fw-semibold mb-2">
                    Scan this QR code with Google Authenticator, Microsoft
                    Authenticator, Authy, or another authenticator app.
                  </p>

                  <div className="text-center mb-3">
                    <img
                      src={qrCode}
                      alt="Two-factor authentication QR code"
                      className="img-fluid"
                      style={{ maxWidth: "220px" }}
                    />
                  </div>

                  <p className="small text-muted mb-1">
                    Cannot scan the QR code? Enter this key manually:
                  </p>

                  <code className="d-block border rounded p-2 mb-3 text-break">
                    {manualKey}
                  </code>

                  <label
                    htmlFor="dashboardTwoFactorCode"
                    className="form-label fw-semibold"
                  >
                    Six-Digit Code
                  </label>

                  <input
                    id="dashboardTwoFactorCode"
                    type="text"
                    inputMode="numeric"
                    className="form-control text-center fs-4 mb-3"
                    placeholder="000000"
                    value={twoFactorCode}
                    onChange={(event) =>
                      setTwoFactorCode(
                        event.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                  />

                  <button
                    type="submit"
                    className="btn btn-success w-100 mb-2"
                    disabled={
                      securityLoading || twoFactorCode.length !== 6
                    }
                  >
                    {securityLoading
                      ? "Confirming..."
                      : "Confirm and Enable"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={cancelTwoFactorSetup}
                    disabled={securityLoading}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
