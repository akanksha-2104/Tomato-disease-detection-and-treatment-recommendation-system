import React, { useContext } from "react";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import DiseaseInfoSection from "../components/DiseaseInfoSection";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  const handleUploadClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated && !user) {
      alert("Please sign in to upload images");
      navigate("/login");
    } else {
      navigate("/upload");
    }
  };

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    if (isAuthenticated || user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="container text-center" style={{ margin: "7%" }}>
        {/* Hero Section */}
        <section
          className=" d-flex align-items-center"
          style={{ paddingTop: "70px" }}
        >
          <div className="container text-center">
            {/* Image */}

            {/* Main Heading */}
            <h1 className="display-4 fw-bold mb-5">Welcome to TomatoCare</h1>

            <img
              src="/hero_image (1).png" // put a relevant tomato image in public folder
              alt="Tomato Plant"
              className="img-fluid rounded mb-4"
              style={{ maxHeight: "600px" }}
            />

            {/* Description */}
            <p className="lead mb-4 mt-4">
              TomatoCare helps farmers diagnose and treat tomato crop problems,
              <br />
              Improve productivity and provide farming knowledge. <br />
              Achieve your farming goals and improve your <br />
              agricultural experience with TomatoCare. <br />
            </p>

            {/* Call-to-Action Button */}
            <a href="/upload" onClick={handleUploadClick} className="btn btn-success btn-lg">
              Upload Image
            </a>
          </div>
        </section>

        {/* Extra Info Section */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="row text-center">
              <div className="col-md-4 mb-4">
                <div className="mb-2" style={{ fontSize: "3rem" }}>
                  👨‍🌾
                </div>
                <h5 className="fw-bold mb-1">Trusted by Farmers</h5>
                <p className="text-muted">
                  Over 5,000 farmers rely on TomatoCare daily.
                </p>
              </div>

              <div className="col-md-4 mb-4">
                <div className="mb-2" style={{ fontSize: "3rem" }}>
                  ⚡
                </div>
                <h5 className="fw-bold mb-1">Fast Diagnosis</h5>
                <p className="text-muted">
                  Get results in less than 10 seconds.
                </p>
              </div>

              <div className="col-md-4 mb-4">
                <div className="mb-2" style={{ fontSize: "3rem" }}>
                  📈
                </div>
                <h5 className="fw-bold mb-1">Healthy Growth</h5>
                <p className="text-muted">
                  Maximize your tomato yield with AI guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}

        <section id="how-it-works" className="py-5 bg-light">
          <div className="container">
            <h2 className="text-center mb-5">How Our Application Works</h2>

            <div className="row g-4">

              <div className="col-md-4 text-center">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Step 1: Upload Crop Image</h5>
                    <p className="card-text">
                      You can upload an image of the tomato crop leaves directly
                      to the website. The system accepts clear photos showing
                      the leaves for accurate detection.
                    </p>
                  </div>
                </div>
              </div>


              <div className="col-md-4 text-center">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Step 2: Detection & Analysis</h5>
                    <p className="card-text">
                      The system examines the uploaded image and identifies the
                      condition of the tomato leaves.
                    </p>
                  </div>
                </div>
              </div>


              <div className="col-md-4 text-center">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      Step 3: Treatment Recommendations
                    </h5>
                    <p className="card-text">
                      After analysis, you receive a detailed report showing the
                      detected issues and practical suggestions for crop care,
                      helping improve plant health and yield.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <DiseaseInfoSection />

        <a href="/login" onClick={handleGetStartedClick} className="btn btn-success btn-lg mt-5 mb-5">
          Get Started
        </a>

        {/* <hr /> */}
      </div>
    </>
  );
};
export default LandingPage;