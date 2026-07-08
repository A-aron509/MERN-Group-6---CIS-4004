import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="text-success fw-bold">🌿 StayFresh</h2>

      <div>
        <Link to="/dashboard" className="btn btn-outline-success me-2">
          Dashboard
        </Link>

        <Link to="/meal-plan" className="btn btn-outline-success me-2">
          Meal Plan
        </Link>

        <Link to="/" className="btn btn-success">
          Logout
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;