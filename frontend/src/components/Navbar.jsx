import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Simulate a short logout loading period
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
      navigate("/"); // Redirect to landing page after logout
    }, 2000);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light fixed-top mb-5">
      <div className="container-fluid d-flex justify-content-between align-items-center m-0 px-4">
        {/* Logo + Brand */}
        <Link
          className="navbar-brand d-flex align-items-center ps-3"
          to={user ? "/dashboard" : "/"}
        >
          <img
            src="/logo.png"
            alt="TomatoCare Logo"
            style={{ width: "40px", height: "40px", objectFit: "contain" }}
            className="me-2"
          />
          <span className="fw-bold text-success fs-5">TomatoCare</span>
        </Link>

        {/* Right side */}
        <div className="d-flex align-items-center gap-3">
          {!user ? (
            <>
              <button
                className="btn btn-outline-success me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-success"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              {isLoggingOut ? (
                <div className="d-flex align-items-center">
                  <div
                    className="spinner-border text-danger me-2"
                    role="status"
                    style={{ width: "1.2rem", height: "1.2rem" }}
                  ></div>
                  <span className="fw-semibold text-danger">
                    Logging off...
                  </span>
                </div>
              ) : (
                <>
                  <div className="dropdown">
                    <button
                      className="btn border-0 bg-transparent d-flex align-items-center"
                      type="button"
                      id="userMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-user text-success fs-5 me-2"></i>
                      <span className="fw-bold">
                        {user.username || user.name}
                      </span>
                    </button>

                    <ul
                      className="dropdown-menu dropdown-menu-end shadow-sm"
                      aria-labelledby="userMenuButton"
                      style={{ minWidth: "250px" }}
                    >
                      {/* User Profile Header */}
                      <li className="px-3 py-2 bg-light border-bottom">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle bg-dark d-flex align-items-center justify-content-center me-2"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <i className="fa-solid fa-user text-white"></i>
                          </div>
                          <div>
                            {/* <div className="fw-semibold text-dark">
                              {user.name || user.username || user.displayName || "User"}
                            </div> */}
                            {/* Username line placed above the email as requested */}
                            <div className="fw-semibold text-dark" style={{ fontSize: "1.25rem" }}>
                              {user.username
                                ? `@${user.username}`
                                : user.email
                                ? user.email.split("@")[0]
                                : "username"}
                            </div>
                            <small className="text-muted">
                              {user.email || "user@example.com"}
                            </small>
                          </div>
                        </div>
                      </li>

                      {/* General Settings Header */}
                      <li className="px-3 pt-2 pb-1">
                        <small className="text-muted fw-semibold">General Settings</small>
                      </li>

                      {/* Edit Profile */}
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => navigate("/dashboard/edit-profile")}
                        >
                          <i className="fa-solid fa-pen me-2 text-secondary"></i>
                          Edit Profile
                        </button>
                      </li>

                      {/* Change Password */}
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => navigate("/dashboard/change-password")}
                        >
                          <i className="fa-solid fa-lock me-2 text-secondary"></i>
                          Change Password
                        </button>
                      </li>

                      {/* Settings */}
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => navigate("/dashboard/settings")}
                        >
                          <i className="fa-solid fa-gear me-2 text-secondary"></i>
                          Settings
                        </button>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      {/* Logout */}
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          <i className="fa-solid fa-right-from-bracket me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;