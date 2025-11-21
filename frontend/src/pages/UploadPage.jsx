// src/pages/UploadPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImageContext } from "../context/ImageContext";
import ErrorMessage from "../components/ErrorMessage";

const UploadPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setSelectedImageData } = useImageContext();

  // Handle image selection and conversion to base64
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("Image size should be less than 5MB");
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      // Store in context for dashboard - include file object for easier analysis
      const imageData = {
        name: file.name,
        size: file.size,
        preview: reader.result,
        file: file, // Store the original file object for analysis
      };
      setSelectedImageData(imageData);
      // Redirect to dashboard after image is selected
      navigate("/dashboard");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="d-flex justify-content-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f9fff6ff",
        fontFamily: "Poppins, sans-serif",
        paddingTop: "120px",
        paddingBottom: "60px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "15px",
          backgroundColor: "white",
          padding: "20px",
        }}
      >
        <div className="card-body p-4 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3242/3242257.png"
            alt="Upload Icon"
            width="70"
            height="70"
            className="mb-3"
          />
          <h3 className="fw-bold text-success mb-2">
            Upload Tomato Leaf Image
          </h3>
          <p className="text-muted mb-4">
            Upload a clear image of the tomato leaf for disease detection
          </p>

          {/* Instructions shown BEFORE upload */}
          <div
            className="mb-4 p-3 text-start"
            style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
          >
            <h6 className="fw-semibold mb-3" style={{ color: "#2e7d32" }}>
              📸 Instructions for best results:
            </h6>
            <ul className="small mb-0" style={{ lineHeight: "1.8" }}>
              <li>Take a clear, well-lit photo of the leaf</li>
              <li>Ensure the diseased area is visible and in focus</li>
              <li>Avoid blurry or dark images</li>
              <li>One leaf per image works best</li>
              <li>Make sure the leaf fills most of the frame</li>
              <li>Use natural lighting when possible</li>
            </ul>
          </div>

          {error && (
            <div className="mb-3">
              <ErrorMessage message={error} onClose={() => setError("")} />
            </div>
          )}

          <div className="mb-4 text-start">
            <label htmlFor="imageInput" className="form-label fw-semibold">
              Select Image
            </label>
            <input
              type="file"
              className="form-control"
              id="imageInput"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageSelect}
            />
            <div className="form-text">
              Accepted formats: JPEG, PNG, WebP (Max size: 5MB)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
