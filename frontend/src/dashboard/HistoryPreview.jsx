import React from "react";
import Sidebar from "./components/Sidebar";

const mockHistory = [
  {
    id: "1",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABJ0lEQVR4nO3YMQ6CQBBF0XcQPaQjGm6h0g6k0g6k0g6k0g6k0g6k0g6k0g6k0g6k0g6k0g6k8l2e5u7s7s7wYQF6P0A4gA0gGkAnQGkAnQGkAnQGkAnQGkAnQGkAnQGkAnQGkArsK8Wz9w2ueu2+q3u9t6wEo7m7sD+8wQAe4C0A6wDqANoA6gDaAOpA2gDqANoA6gDaAOpA2gDqANoA6gDaAOpA2gDqANoA6gDaAOpA2gDoQH5s5Wbq3h0k5QAAAABJRU5ErkJggg==",
    disease: "Late Blight",
    date: "6 Nov 2025, 02:30 PM",
    treatment:
      "Remove affected leaves, apply a copper fungicide and avoid overhead watering.",
    severity: "High",
    status: "completed",
    confidence: 0.92,
  },
  {
    id: "2",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+",
    disease: "Healthy",
    date: "5 Nov 2025, 11:10 AM",
    treatment: "No action required.",
    severity: "Low",
    status: "completed",
    confidence: 0.15,
  },
  {
    id: "3",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+",
    disease: "Pending Analysis",
    date: "4 Nov 2025, 09:40 AM",
    treatment: "Analysis in progress...",
    severity: "Unknown",
    status: "pending",
    confidence: 0,
  },
];

const HistoryPreview = () => {
  const history = mockHistory;

  return (
    <>
      <Sidebar />
      <div
        style={{
          marginTop: "70px",
          marginLeft: "250px",
          padding: "40px 50px",
          backgroundColor: "#ffffff",
          minHeight: "calc(100vh - 70px)",
          width: "calc(100% - 250px)",
        }}
      >
        <div
          className="card shadow-sm"
          style={{ borderRadius: "12px", border: "1px solid #e0e0e0" }}
        >
          <div
            className="card-header bg-white"
            style={{
              padding: "20px 30px",
              borderBottom: "2px solid #e0e0e0",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0" style={{ color: "#2e7d32" }}>
                Scan History (Preview)
              </h5>
              <span
                className="badge bg-success"
                style={{ fontSize: "14px", padding: "8px 16px" }}
              >
                {history.length} Scan{history.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  <tr>
                    <th style={{ padding: "16px 20px", fontWeight: "600", fontSize: "14px", color: "#666" }}>
                      IMAGE
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600", fontSize: "14px", color: "#666" }}>
                      DISEASE DETECTED
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600", fontSize: "14px", color: "#666", minWidth: "280px" }}>
                      TREATMENT RECOMMENDATION
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600", fontSize: "14px", color: "#666" }}>
                      SEVERITY
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600", fontSize: "14px", color: "#666" }}>
                      STATUS
                    </th>
                    <th style={{ padding: "16px 20px", fontWeight: "600", fontSize: "14px", color: "#666" }}>
                      DATE & TIME
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={item.id || index} style={{ cursor: "pointer", transition: "background-color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <td style={{ padding: "16px 20px" }}>
                        <img
                          src={item.image}
                          alt="Scan"
                          style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "2px solid #e0e0e0" }}
                        />
                      </td>
                      <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                        <div>
                          <div className="fw-bold" style={{ fontSize: "15px", color: "#333", marginBottom: "4px" }}>
                            {item.disease}
                          </div>
                          {item.confidence > 0 && (
                            <small className="text-muted">
                              Confidence: <strong>{(item.confidence * 100).toFixed(1)}%</strong>
                            </small>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", verticalAlign: "middle", maxWidth: "350px" }}>
                        <p className="mb-0" style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
                          {item.treatment}
                        </p>
                      </td>
                      <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                        <span className={`badge ${item.severity === "High" ? "bg-danger" : item.severity === "Medium" || item.severity === "Moderate" ? "bg-warning text-dark" : item.severity === "Low" ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "13px", padding: "8px 14px", fontWeight: "600" }}>
                          {item.severity}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                        <span className={`badge ${item.status === "completed" ? "bg-success" : item.status === "pending" ? "bg-warning text-dark" : "bg-secondary"}`} style={{ fontSize: "13px", padding: "8px 14px", fontWeight: "600" }}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                        <div style={{ fontSize: "14px", color: "#666" }}>{item.date}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryPreview;
