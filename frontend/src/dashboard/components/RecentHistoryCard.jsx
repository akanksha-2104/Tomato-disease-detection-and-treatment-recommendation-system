import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const RecentHistoryCard = () => {
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentHistory();
  }, []);

  const fetchRecentHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        setLoading(false);
        return;
      }

      // Fetch only the 3 most recent scans
      const scansRef = collection(db, 'scans');
      const q = query(
        scansRef,
        where('userId', '==', currentUser.uid),
        orderBy('scanDate', 'desc'),
        limit(3)
      );

      const querySnapshot = await getDocs(q);
      
      const scans = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        scans.push({
          id: doc.id,
          image: data.imageBase64,
          disease: data.diseaseName || 'Pending Analysis',
          date: formatDate(data.scanDate),
          status: data.status || 'pending',
          severity: data.severity || 'Unknown'
        });
      });

      setRecentScans(scans);
    } catch (error) {
      console.error('Error fetching recent history:', error);
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleViewDetails = () => {
    // Navigate to History page in dashboard
    navigate('/dashboard/history');
  };

  return (
    <div 
      className="card" 
      style={{ 
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        height: "280px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div className="card-body" style={{ padding: "24px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0" style={{ fontSize: "16px" }}>Recent History</h6>
          {recentScans.length > 0 && (
            <button 
              className="btn btn-sm btn-success"
              onClick={handleViewDetails}
              style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "6px" }}
            >
              View All →
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <div className="spinner-border text-primary mb-2" role="status" style={{ width: "30px", height: "30px" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mb-0" style={{ fontSize: "13px" }}>Loading history...</p>
          </div>
        ) : error ? (
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <div style={{ fontSize: "40px", color: "#dc3545", marginBottom: "10px" }}>⚠️</div>
            <p className="text-danger mb-2" style={{ fontSize: "13px" }}>{error}</p>
            <button 
              className="btn btn-sm btn-primary"
              onClick={fetchRecentHistory}
              style={{ fontSize: "12px" }}
            >
              Retry
            </button>
          </div>
        ) : recentScans.length === 0 ? (
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <div style={{ fontSize: "40px", color: "#ccc", marginBottom: "10px" }}>📊</div>
            <p className="text-muted mb-0 text-center" style={{ fontSize: "13px" }}>
              No scan history found
            </p>
            <small className="text-muted text-center" style={{ fontSize: "11px" }}>
              Upload a leaf image to get started
            </small>
          </div>
        ) : (
          <div className="flex-grow-1" style={{ overflowY: "auto" }}>
            <div className="d-flex flex-column gap-2">
              {recentScans.map((scan, index) => (
                <div 
                  key={scan.id || index}
                  className="d-flex align-items-center p-2"
                  style={{ 
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e9ecef"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                >
                  {/* Scan Image */}
                  <img
                    src={scan.image}
                    alt="Scan"
                    style={{ 
                      width: "50px", 
                      height: "50px", 
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "2px solid #dee2e6",
                      marginRight: "12px"
                    }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                    }}
                  />
                  
                  {/* Scan Info */}
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p 
                          className="mb-0 fw-semibold text-truncate" 
                          style={{ fontSize: "13px", color: "#212529" }}
                          title={scan.disease}
                        >
                          {scan.disease}
                        </p>
                        <small className="text-muted" style={{ fontSize: "11px" }}>
                          {scan.date}
                        </small>
                      </div>
                      
                      {/* Status Badge */}
                      <span 
                        className={`badge ms-2 ${
                          scan.status === 'completed' ? 'bg-success' :
                          scan.status === 'pending' ? 'bg-warning text-dark' :
                          'bg-secondary'
                        }`}
                        style={{ 
                          fontSize: "10px", 
                          padding: "4px 8px",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {scan.status === 'completed' ? '✓' : '⏳'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentHistoryCard;