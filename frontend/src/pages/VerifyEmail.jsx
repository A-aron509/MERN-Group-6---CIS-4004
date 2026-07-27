import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token found in the link.");
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Verification failed.");
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(error.message);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="container-fluid min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="card shadow-lg border-0 p-4 rounded-4 text-center" style={{ maxWidth: "480px", width: "100%" }}>
        <h1 className="text-success fw-bold display-6 mb-4">🌿 StayFresh</h1>

        {status === "verifying" && (
          <p className="text-muted">Verifying your email...</p>
        )}

        {status === "success" && (
          <>
            <div className="alert alert-success">{message}</div>
            <Link to="/" className="btn btn-success w-100 py-2">
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="alert alert-danger">{message}</div>
            <Link to="/" className="btn btn-outline-success w-100 py-2">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
