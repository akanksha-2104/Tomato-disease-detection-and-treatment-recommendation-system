// src/dashboard/components/RecommendationsDisplay.jsx
import React from "react";
import { useImageContext } from "../../context/ImageContext";

const RecommendationsDisplay = () => {
  const { recommendations, recommendationError } = useImageContext();

  if (recommendationError) {
    return (
      <div
        style={{
          background: "#ffebee",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "20px",
          borderLeft: "4px solid #f44336",
        }}
      >
        <strong style={{ color: "#c62828" }}>⚠️ Error:</strong>
        <p style={{ margin: "5px 0 0 0", color: "#c62828", fontSize: "14px" }}>
          {recommendationError}
        </p>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  const { disease_info, treatments, cultural_practices, immediate_actions, monitoring } = recommendations;

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Severity & Urgency Banner */}
      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "15px",
          border: "1px solid #e0e0e0",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
          <span
            className={`badge ${
              disease_info.severity === "Critical"
                ? "bg-danger"
                : disease_info.severity === "Severe"
                ? "bg-danger"
                : disease_info.severity === "Moderate"
                ? "bg-warning text-dark"
                : "bg-success"
            }`}
            style={{ fontSize: "13px", padding: "6px 14px" }}
          >
            {disease_info.severity} Severity
          </span>
          <span
            className="badge"
            style={{ background: "#e3f2fd", color: "#1976d2", fontSize: "12px", padding: "6px 12px" }}
          >
            {disease_info.affected_percentage}% Affected
          </span>
        </div>
        <div
          style={{
            background: "#fff3cd",
            borderLeft: "4px solid #ffc107",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "13px",
          }}
        >
          {disease_info.urgency}
        </div>
      </div>

      {/* Recommended Treatments */}
      <h6 className="fw-bold mb-3" style={{ fontSize: "15px", color: "#333" }}>
        💊 Recommended Treatments
      </h6>
      
      {treatments && treatments.map((treatment, index) => (
        <div
          key={index}
          style={{
            background: "white",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "12px",
            border: "1px solid #e0e0e0",
            borderLeft: "4px solid #4caf50",
          }}
        >
          {/* Treatment Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
            <h6 style={{ fontSize: "15px", fontWeight: "600", color: "#333", margin: 0 }}>
              {index + 1}. {treatment.name}
            </h6>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#4caf50" }}>
              {treatment.recommendation_score}
              <small style={{ fontSize: "12px", color: "#999" }}>/100</small>
            </div>
          </div>

          {/* Treatment Badges */}
          <div style={{ marginBottom: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <span
              className={`badge ${treatment.is_organic ? "bg-success" : "bg-danger"}`}
              style={{ fontSize: "11px", padding: "4px 10px" }}
            >
              {treatment.is_organic ? "🌱 Organic" : "⚗️ Chemical"}
            </span>
            <span
              className="badge"
              style={{ background: "#e3f2fd", color: "#1976d2", fontSize: "11px", padding: "4px 10px" }}
            >
              {treatment.type}
            </span>
            <span
              className="badge"
              style={{ background: "#f3e5f5", color: "#7b1fa2", fontSize: "11px", padding: "4px 10px" }}
            >
              {treatment.effectiveness}% Effective
            </span>
          </div>

          {/* Treatment Details */}
          <div
            style={{
              background: "#f8f9fa",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "8px" }}>
              <strong style={{ color: "#666" }}>Dosage:</strong>
              <span>{treatment.details.dosage}</span>

              <strong style={{ color: "#666" }}>Frequency:</strong>
              <span>{treatment.details.frequency}</span>

              <strong style={{ color: "#666" }}>Duration:</strong>
              <span>{treatment.details.duration}</span>

              <strong style={{ color: "#666" }}>Cost:</strong>
              <span>{treatment.details.cost_per_acre} per acre</span>
            </div>
          </div>

          {/* How to Apply */}
          <div style={{ marginBottom: "10px" }}>
            <strong style={{ fontSize: "13px", color: "#666" }}>How to Apply:</strong>
            <p style={{ margin: "5px 0 0 0", fontSize: "13px", lineHeight: "1.5" }}>
              {treatment.details.how_to_apply}
            </p>
          </div>

          {/* Precautions */}
          <div
            style={{
              background: "#ffebee",
              borderLeft: "3px solid #f44336",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "12px",
            }}
          >
            <strong>⚠️ Safety Precautions:</strong>
            <p style={{ margin: "5px 0 0 0" }}>{treatment.safety.precautions}</p>
            {treatment.safety.waiting_days_before_harvest > 0 && (
              <p style={{ margin: "5px 0 0 0", fontWeight: "600" }}>
                Wait {treatment.safety.waiting_days_before_harvest} days before harvest.
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Cultural Practices */}
      {cultural_practices && cultural_practices.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h6 className="fw-bold mb-3" style={{ fontSize: "15px", color: "#333" }}>
            🌾 Cultural Practices (Non-Chemical Management)
          </h6>
          {cultural_practices.map((practice, index) => (
            <div
              key={index}
              style={{
                background: "#e8f5e9",
                padding: "12px",
                borderRadius: "8px",
                borderLeft: "4px solid #4caf50",
                marginBottom: "10px",
                fontSize: "13px",
              }}
            >
              <h6 style={{ fontSize: "14px", fontWeight: "600", color: "#2e7d32", marginBottom: "5px" }}>
                {practice.practice_name}
              </h6>
              <p style={{ margin: "0 0 5px 0", lineHeight: "1.5" }}>{practice.description}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>
                <strong>Timing:</strong> {practice.timing}
                {practice.effectiveness && ` • Effectiveness: ${practice.effectiveness}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Immediate Actions */}
      {immediate_actions && immediate_actions.length > 0 && (
        <div
          style={{
            background: "#fff3e0",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "15px",
          }}
        >
          <h6 className="fw-bold mb-2" style={{ fontSize: "15px", color: "#333" }}>
            ⚡ Immediate Actions Required
          </h6>
          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px" }}>
            {immediate_actions.map((action, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Monitoring Schedule */}
      {monitoring && (
        <div
          style={{
            background: "#e3f2fd",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "15px",
            fontSize: "13px",
          }}
        >
          <h6 className="fw-bold mb-2" style={{ fontSize: "15px", color: "#333" }}>
            📊 Monitoring Schedule
          </h6>
          <p style={{ margin: "0 0 5px 0" }}>
            <strong>Frequency:</strong> {monitoring.frequency}
          </p>
          <p style={{ margin: "0 0 5px 0" }}>
            <strong>Duration:</strong> {monitoring.duration}
          </p>
          <p style={{ margin: 0 }}>
            <strong>What to Check:</strong> {monitoring.what_to_check}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsDisplay;