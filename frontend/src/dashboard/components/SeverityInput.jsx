// src/dashboard/components/SeverityInput.jsx
import React from "react";
import { useImageContext } from "../../context/ImageContext";

const SeverityInput = () => {
  const {
    affectedPercentage,
    setAffectedPercentage,
    farmingType,
    setFarmingType,
    budgetType,
    setBudgetType,
    getRecommendations,
    isLoadingRecommendations,
  } = useImageContext();

  return (
    <div
      style={{
        background: "#f8f9fa",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
        border: "1px solid #e0e0e0",
      }}
    >
      <h6 className="fw-bold mb-3" style={{ fontSize: "15px", color: "#333" }}>
        📊 Get Treatment Recommendations
      </h6>
      <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
        To provide accurate treatment recommendations, please provide additional information:
      </p>

      {/* Affected Percentage Slider */}
      <div className="mb-4">
        <label
          htmlFor="affectedSlider"
          className="form-label"
          style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}
        >
          Approximately what percentage of your plants show symptoms?
        </label>
        <div style={{ position: "relative", marginBottom: "10px" }}>
          <input
            type="range"
            className="form-range"
            id="affectedSlider"
            min="0"
            max="100"
            step="1"
            value={affectedPercentage}
            onChange={(e) => setAffectedPercentage(Number(e.target.value))}
            style={{
              width: "100%",
              height: "8px",
              borderRadius: "5px",
              background: `linear-gradient(to right, #4caf50 0%, #4caf50 ${affectedPercentage}%, #ddd ${affectedPercentage}%, #ddd 100%)`,
              outline: "none",
              cursor: "pointer",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "5px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#4caf50",
            }}
          >
            {affectedPercentage}%
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "#999",
          }}
        >
          <span>Just a few plants (0%)</span>
          <span>All plants (100%)</span>
        </div>
      </div>

      {/* Farming Type Dropdown */}
      <div className="mb-3">
        <label
          htmlFor="farmingType"
          className="form-label"
          style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}
        >
          Your Farming Approach:
        </label>
        <select
          id="farmingType"
          className="form-select"
          value={farmingType}
          onChange={(e) => setFarmingType(e.target.value)}
          style={{
            fontSize: "14px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
        >
          <option value="mixed">Mixed (Organic + Chemical when needed)</option>
          <option value="organic">Organic Only</option>
          <option value="chemical">Conventional (Chemical treatments)</option>
        </select>
      </div>

      {/* Budget Dropdown */}
      <div className="mb-3">
        <label
          htmlFor="budgetType"
          className="form-label"
          style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}
        >
          Your Budget Range:
        </label>
        <select
          id="budgetType"
          className="form-select"
          value={budgetType}
          onChange={(e) => setBudgetType(e.target.value)}
          style={{
            fontSize: "14px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
        >
          <option value="medium">Medium Budget</option>
          <option value="low">Low Budget (Cost-effective options)</option>
          <option value="high">High Budget (Best effectiveness)</option>
        </select>
      </div>

      {/* Get Recommendations Button */}
      <button
        className="btn w-100"
        onClick={getRecommendations}
        disabled={isLoadingRecommendations}
        style={{
          background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
          color: "white",
          border: "none",
          padding: "12px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: "600",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 5px rgba(76, 175, 80, 0.3)",
        }}
        onMouseEnter={(e) => {
          if (!isLoadingRecommendations) {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.4)";
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 2px 5px rgba(76, 175, 80, 0.3)";
        }}
      >
        {isLoadingRecommendations ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Generating Recommendations...
          </>
        ) : (
          <>
            <i className="bi bi-clipboard-check me-2"></i>
            Get Treatment Recommendations
          </>
        )}
      </button>
    </div>
  );
};

export default SeverityInput;