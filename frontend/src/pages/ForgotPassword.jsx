import "../App.css";
import foodImage from "../assets/salmonbowl.jpg";
import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage(
      "If an account exists with that email, password reset instructions will be sent."
    );
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row min-vh-100 align-items-center">
        <div className="col-lg-6 d-flex justify-content-center p-5">
          <div className="w-100" style={{ maxWidth: "520px" }}>
            <h1 className="text-success fw-bold display-4">🌿 StayFresh</h1>

            <h3 className="fw-semibold mt-3">
              Let&apos;s get you back on track.
            </h3>

            <p className="text-muted mt-3 fs-5">
              Enter the email connected to your account and we&apos;ll help you
              reset your password.
            </p>

            <div className="card shadow-lg border-0 p-4 rounded-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Forgot Password?</h2>

                <p className="text-muted mb-0">
                  We&apos;ll send you instructions to create a new password.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control py-2"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2"
                >
                  Send Reset Link
                </button>
              </form>

              {message && (
                <div className="alert alert-success mt-3 mb-0" role="alert">
                  {message}
                </div>
              )}

              <p className="text-center mt-4 mb-0">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-success fw-bold text-decoration-none"
                >
                  Back to Login
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

export default ForgotPassword;
