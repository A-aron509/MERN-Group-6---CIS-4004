import "./App.css";
import foodImage from "./assets/salmonbowl.jpg";

function App() {
  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row min-vh-100 align-items-center">
        
        <div className="col-lg-6 d-flex justify-content-center p-5">
          <div className="w-100" style={{ maxWidth: "520px" }}>
            <h1 className="text-success fw-bold display-4">🌿 StayFresh</h1>
            <h3 className="fw-semibold mt-3">Eat better. Feel better.</h3>

            <p className="text-muted mt-3 fs-5">
              A fitness and nutrition app that helps you create simple meal plans
              based on your goals, activity level, and lifestyle.
            </p>

            <div className="row text-center my-5">

  <div className="col-4">
    <div
      className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center"
      style={{ width: "20px", height: "20px" }}
    >
      <i className="bi bi-egg-fried text-success fs-3"></i>
    </div>

    <h6 className="mt-3 fw-semibold">
      Personalized
      <br />
      Meal Plans
    </h6>
  </div>

  <div className="col-4">
    <div
      className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center"
      style={{ width: "20px", height: "20px" }}
    >
      <i className="bi bi-bar-chart-line text-success fs-3"></i>
    </div>

    <h6 className="mt-3 fw-semibold">
      Fitness
      <br />
      Goals
    </h6>
  </div>

  <div className="col-4">
    <div
      className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center"
      style={{ width: "20px", height: "20px" }}
    >
      <i className="bi bi-heart text-success fs-3 "></i>
    </div>

    <h6 className="mt-3 fw-semibold">
      Healthy
      <br />
      Habits
    </h6>
  </div>

</div>

            <div className="card shadow-lg border-0 p-4 rounded-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Log in to continue your journey</p>
              </div>

              <form>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control py-2"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control py-2"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <input type="checkbox" className="form-check-input me-2" />
                    <small>Remember me</small>
                  </div>
                  <small className="text-success">Forgot password?</small>
                </div>

                <button type="submit" className="btn btn-success w-100 py-2">
                  Login
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                Don&apos;t have an account?{" "}
                <span className="text-success fw-bold">Register</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6 d-none d-lg-block p-0 position-relative overflow hidden">
          <svg
          viewBox="0 0 240 1000"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            left: "-1px",
            top: 0,
            width: "240px",
            height: "100%",
            zIndex: 10
          }}
          >
            <path
            fill="white"
            d="
             M240,0
             C10,180 10,820 220,1000
             L0,1000
             L0,0
             Z"
             />
             </svg>
             <img
             src={foodImage}
             alt="Healthy salmon rice bowl"
             className="w-100"
             style={{ objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
            />
            
            
            </div>
            
            </div>
    </div>
  );
}

export default App;