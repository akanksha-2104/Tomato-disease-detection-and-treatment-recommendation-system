import React, { useState, useEffect, useCallback } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import Sidebar from "./components/Sidebar";

const HistorySection = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserHistory = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        // If no userId provided, try to get from auth.currentUser as fallback
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log("No user logged in");
          setLoading(false);
          return;
        }
        userId = currentUser.uid;
      }

      const scansRef = collection(db, "scans");
      
      // Try query with orderBy first, fallback to without orderBy if index is missing
      let querySnapshot;
      try {
        const q = query(
          scansRef,
          where("userId", "==", userId),
          orderBy("uploadDate", "desc")
        );
        querySnapshot = await getDocs(q);
      } catch (indexError) {
        // If index error, try without orderBy and sort in memory
        console.warn("Index may be missing, fetching without orderBy:", indexError);
        const q = query(
          scansRef,
          where("userId", "==", userId)
        );
        querySnapshot = await getDocs(q);
      }

      const historyData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.uploadDate || data.scanDate;
        historyData.push({
          id: doc.id,
          image: data.imageData || data.imageBase64, // Support both field names
          disease: data.diseaseName || "Pending Analysis",
          date: formatDate(timestamp), // Support both field names
          rawTimestamp: timestamp, // Store raw timestamp for sorting
          treatment: data.treatment || data.treatmentRecommendation || "Analysis in progress...",
          severity: data.severity || "Unknown",
          status: data.status || "pending",
          confidence: data.confidence || 0,
        });
      });

      // Sort by date if we didn't use orderBy (sort by raw timestamp)
      if (historyData.length > 0) {
        historyData.sort((a, b) => {
          if (!a.rawTimestamp || !b.rawTimestamp) return 0;
          
          let dateA, dateB;
          if (a.rawTimestamp.toDate) {
            dateA = a.rawTimestamp.toDate();
          } else if (typeof a.rawTimestamp === "string") {
            dateA = new Date(a.rawTimestamp);
          } else {
            dateA = new Date(a.rawTimestamp);
          }
          
          if (b.rawTimestamp.toDate) {
            dateB = b.rawTimestamp.toDate();
          } else if (typeof b.rawTimestamp === "string") {
            dateB = new Date(b.rawTimestamp);
          } else {
            dateB = new Date(b.rawTimestamp);
          }
          
          return dateB - dateA; // Descending order (newest first)
        });
      }

      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history:", error);
      // Show more detailed error message
      const errorMessage = error.message || "Failed to load history";
      setError(`Failed to load history: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Listen to auth state changes to wait for Firebase to initialize
    // This ensures we wait for Firebase to restore the user session on page refresh
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, fetch history
        fetchUserHistory(user.uid);
      } else {
        // No user logged in
        console.log("No user logged in");
        setLoading(false);
        setHistory([]);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [fetchUserHistory]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
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
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <div className="text-center">
              <div
                className="spinner-border text-success mb-3"
                role="status"
                style={{ width: "50px", height: "50px" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading your scan history...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
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
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <div className="text-center">
              <div
                style={{
                  fontSize: "60px",
                  color: "#dc3545",
                  marginBottom: "20px",
                }}
              >
                ⚠️
              </div>
              <h5 className="text-danger mb-3">{error}</h5>
              <button 
                className="btn btn-success" 
                onClick={() => {
                  const currentUser = auth.currentUser;
                  if (currentUser) {
                    fetchUserHistory(currentUser.uid);
                  } else {
                    fetchUserHistory();
                  }
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (history.length === 0) {
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
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <div className="text-center">
              <div
                style={{
                  fontSize: "80px",
                  color: "#ccc",
                  marginBottom: "20px",
                }}
              >
                📊
              </div>
              <h5 className="fw-bold mb-2">No Scan History Found</h5>
              <p className="text-muted mb-0">
                Your scans will appear here after you upload images
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

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
                Scan History
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
                    <th
                      style={{
                        padding: "16px 20px",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      IMAGE
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      DISEASE DETECTED
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#666",
                        minWidth: "280px",
                      }}
                    >
                      TREATMENT RECOMMENDATION
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      SEVERITY
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      STATUS
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      DATE & TIME
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr
                      key={item.id || index}
                      style={{
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f8f9fa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td style={{ padding: "16px 20px" }}>
                        <img
                          src={item.image}
                          alt="Scan"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid #e0e0e0",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
                          }}
                        />
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          verticalAlign: "middle",
                        }}
                      >
                        <div>
                          <div
                            className="fw-bold"
                            style={{
                              fontSize: "15px",
                              color: "#333",
                              marginBottom: "4px",
                            }}
                          >
                            {item.disease}
                          </div>
                          {item.confidence > 0 && (
                            <small className="text-muted">
                              Confidence:{" "}
                              <strong>
                                {(item.confidence * 100).toFixed(1)}%
                              </strong>
                            </small>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          verticalAlign: "middle",
                          maxWidth: "350px",
                        }}
                      >
                        <p
                          className="mb-0"
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            lineHeight: "1.6",
                          }}
                        >
                          {item.treatment}
                        </p>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          verticalAlign: "middle",
                        }}
                      >
                        <span
                          className={`badge ${
                            item.severity === "High"
                              ? "bg-danger"
                              : item.severity === "Medium" ||
                                item.severity === "Moderate"
                              ? "bg-warning text-dark"
                              : item.severity === "Low"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                          style={{
                            fontSize: "13px",
                            padding: "8px 14px",
                            fontWeight: "600",
                          }}
                        >
                          {item.severity}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          verticalAlign: "middle",
                        }}
                      >
                        <span
                          className={`badge ${
                            item.status === "completed"
                              ? "bg-success"
                              : item.status === "pending"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                          style={{
                            fontSize: "13px",
                            padding: "8px 14px",
                            fontWeight: "600",
                          }}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          verticalAlign: "middle",
                        }}
                      >
                        <div style={{ fontSize: "14px", color: "#666" }}>
                          {item.date}
                        </div>
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

export default HistorySection;
