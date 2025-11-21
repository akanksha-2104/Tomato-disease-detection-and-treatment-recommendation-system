import React, { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Login user through context
      if (login) {
        login(user, "firebaseToken");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      // Better error messages
      let errorMessage = err.message;
      if (err.code === "auth/user-not-found") {
        errorMessage =
          "No account found with this email. Please sign up first.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (err.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (err.code === "auth/invalid-credential") {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #dcedc8 0%, #a5d6a7 100%)",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "20px",
          backgroundColor: "white",
          padding: "40px",
          margin:"100px"
        }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
              alt="Login Icon"
              width="70"
              height="70"
              className="mb-3"
            />
            <h3 className="fw-bold text-success mb-2">Welcome Back!</h3>
            <p className="text-muted mb-0">Sign in to continue to TomatoCare</p>
          </div>

          {error && (
            <div className="mb-3">
              <ErrorMessage message={error} onClose={() => setError("")} />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <label htmlFor="email">Email address</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-success btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-success fw-semibold text-decoration-none"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;