import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import foodImage from "../assets/salmonbowl.jpg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");

  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const finishLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user?.profileComplete) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (data.requiresTwoFactor) {
        setTwoFactorToken(data.twoFactorToken);
        setRequiresTwoFactor(true);
        setMessage(data.message);
        return;
      }

      finishLogin(data);
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/2fa/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          twoFactorToken,
          token: twoFactorCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Two-factor authentication failed."
        );
      }

      finishLogin(data);
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const returnToLogin = () => {
    setRequiresTwoFactor(false);
    setTwoFactorCode("");
    setTwoFactorToken("");
    setMessage("");
    setIsError(false);
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row min-vh-100 align-items-center">
        <div className="col-lg-6 d-flex justify-content-center p-5">
          <div className="w-100" style={{ maxWidth: "520px" }}>
            <h1 className="text-success fw-bold display-4">
              🌿 StayFresh
            </h1>

            <h3 className="fw-semibold mt-3">
              Eat better. Feel better.
            </h3>

            <p className="text-muted mt-3 fs-5">
              A fitness and nutrition app that helps you create simple meal
              plans based on your goals, activity level, and lifestyle.
            </p>

            <div className="card shadow-lg border-0 p-4 rounded-4">
              {!requiresTwoFactor ? (
                <>
                  <div className="text-center mb-4">
                    <h2 className="fw-bold">Welcome Back</h2>

                    <p className="text-muted">
                      Log in to continue your journey
                    </p>
                  </div>

                  {message && (
                    <div
                      className={`alert ${
                        isError ? "alert-danger" : "alert-success"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label
                        htmlFor="email"
                        className="form-label fw-semibold"
                      >
                        Email
                      </label>

                      <input
                        id="email"
                        type="email"
                        className="form-control py-2"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className="mb-2">
                      <label
                        htmlFor="password"
                        className="form-label fw-semibold"
                      >
                        Password
                      </label>

                      <input
                        id="password"
                        type="password"
                        className="form-control py-2"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                      />
                    </div>

                    <div className="text-end mb-3">
                      <Link
                        to="/forgot-password"
                        className="text-success fw-semibold text-decoration-none"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success w-100 py-2"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </button>
                  </form>

                  <p className="text-center mt-4 mb-0">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/register"
                      className="text-success fw-bold text-decoration-none"
                    >
                      Register
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <h2 className="fw-bold">Two-Factor Authentication</h2>

                    <p className="text-muted">
                      Enter the six-digit code from your authenticator app.
                    </p>
                  </div>

                  {message && (
                    <div
                      className={`alert ${
                        isError ? "alert-danger" : "alert-success"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleTwoFactorLogin}>
                    <div className="mb-3">
                      <label
                        htmlFor="twoFactorCode"
                        className="form-label fw-semibold"
                      >
                        Authentication Code
                      </label>

                      <input
                        id="twoFactorCode"
                        type="text"
                        inputMode="numeric"
                        className="form-control py-2 text-center fs-4"
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
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success w-100 py-2"
                      disabled={
                        isLoading || twoFactorCode.length !== 6
                      }
                    >
                      {isLoading ? "Verifying..." : "Verify and Login"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-link text-success w-100 mt-2"
                      onClick={returnToLogin}
                      disabled={isLoading}
                    >
                      Return to login
                    </button>
                  </form>
                </>
              )}
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
