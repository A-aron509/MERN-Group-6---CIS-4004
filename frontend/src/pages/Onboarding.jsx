import { Link } from "react-router-dom";

function Onboarding() {
  return (
    <div className="container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="card shadow-lg border-0 p-4 rounded-4" style={{ maxWidth: "700px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">Let&apos;s personalize your plan</h2>
          <p className="text-muted">
            Tell us about your body, activity level, and fitness goals.
          </p>
        </div>

        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Height</label>
              <input type="text" className="form-control py-2" placeholder="Ex: 5'4 or 64 inches" />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Weight Range</label>
              <select className="form-select py-2">
                <option>Select weight range</option>
                <option>100 - 120 lbs</option>
                <option>121 - 140 lbs</option>
                <option>141 - 160 lbs</option>
                <option>161 - 180 lbs</option>
                <option>181+ lbs</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Fitness Goal</label>
            <select className="form-select py-2">
              <option>Select your goal</option>
              <option>Lose Weight</option>
              <option>Maintain Weight</option>
              <option>Build Muscle</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Activity Level</label>
            <select className="form-select py-2">
              <option>Select activity level</option>
              <option>Sedentary</option>
              <option>Lightly Active</option>
              <option>Moderately Active</option>
              <option>Very Active</option>
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Weightlifting Frequency</label>
              <select className="form-select py-2">
                <option>Select frequency</option>
                <option>0 days/week</option>
                <option>1 - 2 days/week</option>
                <option>3 - 4 days/week</option>
                <option>5+ days/week</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Cardio Type</label>
              <select className="form-select py-2">
                <option>Select cardio type</option>
                <option>Walking</option>
                <option>Running</option>
                <option>Cycling</option>
                <option>Swimming</option>
                <option>None</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Cardio Frequency</label>
            <select className="form-select py-2">
              <option>Select frequency</option>
              <option>0 days/week</option>
              <option>1 - 2 days/week</option>
              <option>3 - 4 days/week</option>
              <option>5+ days/week</option>
            </select>
          </div>

          <Link to="/dashboard" className="btn btn-success w-100 py-2">
            Continue to Dashboard
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;