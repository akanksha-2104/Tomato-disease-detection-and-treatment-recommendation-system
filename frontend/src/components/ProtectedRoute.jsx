import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Check if user is authenticated
  if (!isAuthenticated && !user) {
    // User is not logged in, show alert and redirect to login page
    alert("Please sign in to access this page");
    return <Navigate to="/login" replace />;
  }

  // User is logged in, allow access
  return children;
};

export default ProtectedRoute;