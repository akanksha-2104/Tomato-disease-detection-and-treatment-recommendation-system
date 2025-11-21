// src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "./context/AuthContext";
import { ImageProvider } from "./context/ImageContext";

import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UploadPage from "./pages/UploadPage";
import AboutPage from "./pages/AboutPage";

import DashboardLayout from "./dashboard/DashboardLayout";
import FarmerNews from "./dashboard/components/FarmerNews";
import HistorySection from "./dashboard/HistorySection";
import DiscussionForum from "./dashboard/components/DiscussionForum";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app start
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
    setIsAuthenticated(true);
    window.location.href = "/dashboard"; // Redirect after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  if (loading) return <LoadingSpinner />;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <ImageProvider>
        <Router>
          <div className="min-h-screen flex flex-col" style={{ width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
            <Navbar />
            <main className="flex-grow" style={{ width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Protected Routes */}
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <UploadPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/news"
                  element={
                    <ProtectedRoute>
                      <FarmerNews />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/history"
                  element={
                    <ProtectedRoute>
                      <HistorySection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/discussions"
                  element={
                    <ProtectedRoute>
                      <DiscussionForum />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </ImageProvider>
    </AuthContext.Provider>
  );
};

export default App;
