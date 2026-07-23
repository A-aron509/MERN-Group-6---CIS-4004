import { useState } from "react";
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

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="text-muted">Daily Calories</h6>
              <h2 className="fw-bold text-success">1,850 - 2,100</h2>
              <p className="mb-0 text-muted">
                Estimated calorie target range
              </p>
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
                    <p className="mb-1 fw-semibold">
                      Chicken Power Plate
                    </p>
                    <small className="text-muted">
                      Chicken, sweet potatoes, vegetables
                    </small>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-4 p-3 h-100">
                    <h5>🍎 Snack</h5>
                    <p className="mb-1 fw-semibold">
                      Apple &amp; Peanut Butter
                    </p>
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
