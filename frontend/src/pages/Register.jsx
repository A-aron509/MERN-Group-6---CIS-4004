import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="card shadow-lg border-0 p-4 rounded-4" style={{ width: "460px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">Create Account</h2>
          <p className="text-muted">Join StayFresh and start your journey</p>
        </div>

        <form>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input type="text" className="form-control py-2" placeholder="Enter your full name" />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control py-2" placeholder="Enter your email" />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" className="form-control py-2" placeholder="Create a password" />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input type="password" className="form-control py-2" placeholder="Confirm your password" />
          </div>

          <button type="submit" className="btn btn-success w-100 py-2">
            Register
          </button>
        </form>

        <p className="text-center mt-4 mb-0">
          Already have an account?{" "}
          <Link to="/" className="text-success fw-bold text-decoration-none">
          Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;