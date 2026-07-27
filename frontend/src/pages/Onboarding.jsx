import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const navigate = useNavigate();

  const [height, setHeight] = useState("");
  const [weightRange, setWeightRange] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [weightliftingFrequency, setWeightliftingFrequency] = useState("");
  const [cardioType, setCardioType] = useState("");
  const [cardioFrequency, setCardioFrequency] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);
    setIsLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          height: Number(height),
          weightRange,
          fitnessGoal,
          activityLevel,
          weightliftingFrequency: weightliftingFrequency ? Number(weightliftingFrequency) : undefined,
          cardioType,
          cardioFrequency: cardioFrequency ? Number(cardioFrequency) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile.");
      }

      // Keep localStorage user info in sync so other pages know
      // profileComplete is now true
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, profileComplete: true })
      );

      navigate("/dashboard");
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="card shadow-lg border-0 p-4 rounded-4" style={{ maxWidth: "700px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">Let&apos;s personalize your plan</h2>
          <p className="text-muted">
            Tell us about your body, activity level, and fitness goals.
          </p>
        </div>

        {message && (
          <div className={`alert ${isError ? "alert-danger" : "alert-success"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Height (inches)</label>
              <input
                type="number"
                className="form-control py-2"
                placeholder="Ex: 64"
                value={height}
                onChange={(event) => setHeight(event.target.value)}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Weight Range</label>
              <select
                className="form-select py-2"
                value={weightRange}
                onChange={(event) => setWeightRange(event.target.value)}
                required
              >
                <option value="">Select weight range</option>
                <option value="100 - 120 lbs">100 - 120 lbs</option>
                <option value="121 - 140 lbs">121 - 140 lbs</option>
                <option value="141 - 160 lbs">141 - 160 lbs</option>
                <option value="161 - 180 lbs">161 - 180 lbs</option>
                <option value="181+ lbs">181+ lbs</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Fitness Goal</label>
            <select
              className="form-select py-2"
              value={fitnessGoal}
              onChange={(event) => setFitnessGoal(event.target.value)}
              required
            >
              <option value="">Select your goal</option>
              <option value="Lose Weight">Lose Weight</option>
              <option value="Maintain Weight">Maintain Weight</option>
              <option value="Build Muscle">Build Muscle</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Activity Level</label>
            <select
              className="form-select py-2"
              value={activityLevel}
              onChange={(event) => setActivityLevel(event.target.value)}
              required
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="active">Very Active</option>
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Weightlifting Frequency</label>
              <select
                className="form-select py-2"
                value={weightliftingFrequency}
                onChange={(event) => setWeightliftingFrequency(event.target.value)}
              >
                <option value="">Select frequency</option>
                <option value="0">0 days/week</option>
                <option value="2">1 - 2 days/week</option>
                <option value="4">3 - 4 days/week</option>
                <option value="5">5+ days/week</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Cardio Type</label>
              <select
                className="form-select py-2"
                value={cardioType}
                onChange={(event) => setCardioType(event.target.value)}
              >
                <option value="">Select cardio type</option>
                <option value="Walking">Walking</option>
                <option value="Running">Running</option>
                <option value="Cycling">Cycling</option>
                <option value="Swimming">Swimming</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Cardio Frequency</label>
            <select
              className="form-select py-2"
              value={cardioFrequency}
              onChange={(event) => setCardioFrequency(event.target.value)}
            >
              <option value="">Select frequency</option>
              <option value="0">0 days/week</option>
              <option value="2">1 - 2 days/week</option>
              <option value="4">3 - 4 days/week</option>
              <option value="5">5+ days/week</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100 py-2" disabled={isLoading}>
            {isLoading ? "Saving..." : "Continue to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;
