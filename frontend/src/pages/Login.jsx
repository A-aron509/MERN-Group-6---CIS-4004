import "../App.css";
import foodImage from "../assets/salmonbowl.jpg";
import{ Link } from "react-router-dom";

function Login(){
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

            {/* keep your feature icons here */}

            <div className="card shadow-lg border-0 p-4 rounded-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Log in to continue your journey</p>
              </div>

              <form>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control py-2" placeholder="Enter your email" />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input type="password" className="form-control py-2" placeholder="Enter your password" />
                </div>

                <button type="submit" className="btn btn-success w-100 py-2">
                  Login
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-success fw-bold text-decoration-none">
                Register
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-6 d-none d-lg-block p-0 position-relative">
          <svg
            viewBox="0 0 240 1000"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              left: "-1px",
              top: 0,
              width: "240px",
              height: "100%",
              zIndex: 10,
            }}
          >
            <path
              fill="white"
              d="M240,0 C10,180 10,820 220,1000 L0,1000 L0,0 Z"
            />
          </svg>

          <img
            src={foodImage}
            alt="Healthy salmon rice bowl"
            className="w-100"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100vh",
            }}
          />
        </div>
      </div>
    </div>
  );




}

export default Login;