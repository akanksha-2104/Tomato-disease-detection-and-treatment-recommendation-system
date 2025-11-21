// src/dashboard/UploadLeafCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useImageContext } from "../context/ImageContext";

const UploadLeafCard = () => {
  const navigate = useNavigate();
  const { selectedImageData, analyzeImage, isAnalyzing } = useImageContext();

  const handleClick = () => {
    navigate("/upload");
  };

  const handleAnalyze = async (e) => {
    e.stopPropagation(); // Prevent card click event
    if (selectedImageData && !isAnalyzing) {
      await analyzeImage();
    }
  };

  return (
    <div
      className="card shadow-sm"
      style={{
        width: "100%",
        maxWidth: "100%",
        minHeight: "450px",
        cursor: "pointer",
        border: "2px dashed #ccc",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
      onClick={!selectedImageData ? handleClick : undefined}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4caf50")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
    >
      <div
        className="card-body text-center"
        style={{ 
          padding: "40px 20px", 
          alignContent: "center",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          className="d-flex flex-column align-items-center justify-content-center mb-3"
          style={{ minHeight: "150px" }}
        >
          {selectedImageData ? (
            <>
              <img
                src={selectedImageData.preview}
                alt="Leaf Preview"
                className="rounded mb-3"
                style={{
                  width: "240px",
                  height: "180px",
                  objectFit: "cover",
                  border: "2px solid #e0e0e0",
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)"
                }}
              />
              <p className="text-muted small mb-2">
                {selectedImageData.name} –{" "}
                {(selectedImageData.size / 1024).toFixed(2)} KB
              </p>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-success btn-sm fw-bold"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Image"
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm fw-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  disabled={isAnalyzing}
                >
                  Change Image
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: "60px",
                  color: "#ccc",
                  marginBottom: "15px",
                }}
              >
                🍃
              </div>
              <button
                className="btn btn-success btn-lg"
                style={{
                  borderRadius: "8px",
                  padding: "12px 30px",
                  fontWeight: "600",
                }}
              >
                Upload Leaf Image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadLeafCard;
