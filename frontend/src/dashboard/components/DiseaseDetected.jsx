import React from "react";
import { useImageContext } from "../../context/ImageContext";
import SeverityInput from "../../dashboard/components/SeverityInput";
import RecommendationsDisplay from "../../dashboard/components/RecommendationDisplay";

const DiseaseDetected = () => {
  const { analysisResult, isAnalyzing, analysisError } = useImageContext();

  // Debug log
  React.useEffect(() => {
    if (analysisResult) {
      console.log("DiseaseDetected received analysisResult:", analysisResult);
    }
  }, [analysisResult]);

  // Format confidence value
  const getConfidence = () => {
    if (!analysisResult?.confidence) return null;
    if (typeof analysisResult.confidence === 'number') {
      return `${(analysisResult.confidence * 100).toFixed(1)}%`;
    }
    return `${analysisResult.confidence}%`;
  };

  // Get disease name
  const getDiseaseName = () => {
    return analysisResult?.predicted_class || 
           analysisResult?.disease || 
           analysisResult?.class_name || 
           "Unknown";
  };

  // Get treatment recommendations (if available in result)
  const getTreatment = () => {
    return analysisResult?.treatment || 
           analysisResult?.recommendation || 
           "Please consult with an agricultural expert for specific treatment recommendations.";
  };

  if (isAnalyzing) {
    return (
      <div
        className="card"
        style={{
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
          width: "100%",
          maxWidth: "100%",
          minHeight: "450px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="card-body text-center py-5" id="analysis-card-body" style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <div>
            <div
              className="spinner-border text-success"
              role="status"
              style={{ width: "40px", height: "40px" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted mb-0">Analyzing image...</p>
          </div>
        </div>
      </div>
    );
  }

  if (analysisError) {
    return (
      <div
        className="card"
        style={{
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
          width: "100%",
          maxWidth: "100%",
          minHeight: "450px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="card-body text-center py-5"
          id="analysis-card-body"
          style={{ 
            alignContent: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{ fontSize: "48px", color: "#dc3545", marginBottom: "15px" }}
          >
            ⚠️
          </div>
          <h6 className="fw-bold mb-2 text-danger">Analysis Error</h6>
          <p className="text-muted small mb-3" style={{ fontSize: "13px" }}>
            {analysisError}
          </p>
          <p className="text-muted small mb-0" style={{ fontSize: "12px" }}>
            Please try again or check your connection
          </p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div
        className="card"
        style={{
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
          width: "100%",
          maxWidth: "100%",
          minHeight: "450px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="card-body text-center py-5"
          id="analysis-card-body"
          style={{ 
            alignContent: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{ fontSize: "64px", color: "#ccc", marginBottom: "15px" }}
          >
            ➕
          </div>
          <h6 className="fw-bold mb-2">No Analysis Yet</h6>
          <p className="text-muted small mb-0" style={{ fontSize: "13px" }}>
            Upload a leaf image to detect diseases and get treatment
            recommendations
          </p>
        </div>
      </div>
    );
  }

  // Main disease detected view
  return (
    <div
      className="card"
      style={{
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        width: "100%",
        maxWidth: "100%",
        minHeight: "450px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div 
        className="card-body" 
        style={{ 
          padding: "24px",
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflowY: "auto",
          maxHeight: "calc(100vh - 200px)", // Allow scrolling if content is long
        }}
      >
        {/* Disease Detection Header */}
        <div style={{ marginBottom: "20px" }}>
          <h6 className="fw-bold mb-3" style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            🔬 Disease Detected
          </h6>

          <h5
            className="mb-3"
            style={{ 
              color: "#4caf50", 
              fontWeight: "600",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              fontSize: "clamp(16px, 2.5vw, 22px)",
            }}
          >
            {getDiseaseName().replace(/_/g, " ")}
          </h5>

          {getConfidence() && (
            <div className="mb-3">
              <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>
                Confidence level
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ flex: 1, height: "8px", background: "#e0e0e0", borderRadius: "10px", overflow: "hidden" }}>
                  <div 
                    style={{ 
                      height: "100%", 
                      background: analysisResult.confidence >= 0.8 ? "#4caf50" : analysisResult.confidence >= 0.6 ? "#ff9800" : "#f44336",
                      width: `${(analysisResult.confidence * 100)}%`,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <h6 className="mb-0" style={{ fontWeight: "600", minWidth: "60px" }}>
                  {getConfidence()}
                </h6>
              </div>
            </div>
          )}
        </div>

        {/* Severity Input Section - NEW */}
        <SeverityInput />

        {/* Recommendations Display - NEW */}
        <RecommendationsDisplay />
      </div>
    </div>
  );
};


//   return (
//     <div
//       className="card"
//       style={{
//         borderRadius: "12px",
//         border: "1px solid #e0e0e0",
//         width: "100%",
//         maxWidth: "100%",
//         minHeight: "450px",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <div 
//         className="card-body" 
//         id="analysis-card-body" 
//         style={{ 
//           padding: "24px",
//           width: "100%",
//           maxWidth: "100%",
//           display: "flex",
//           flexDirection: "column",
//           flex: 1,
//         }}
//       >
//         <h6 className="fw-bold mb-3" style={{ fontSize: "16px" }}>
//           Disease Detected
//         </h6>

//         <div 
//           style={{
//             width: "100%",
//             minWidth: 0,
//           }}
//         >
//           <h5
//             className="mb-3"
//             style={{ 
//               color: "#4caf50", 
//               fontWeight: "600",
//               wordBreak: "break-word",
//               overflowWrap: "break-word",
//               fontSize: "clamp(14px, 2vw, 20px)",
//             }}
//           >
//             {getDiseaseName().replace(/_/g, " ")}
//           </h5>

//           {getConfidence() && (
//             <div className="mb-3">
//               <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>
//                 Confidence level
//               </p>
//               <h6 className="mb-0" style={{ fontWeight: "600" }}>
//                 {getConfidence()}
//               </h6>
//             </div>
//           )}

//           {analysisResult.severity && (
//             <div className="mb-3">
//               <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>
//                 Severity
//               </p>
//               <span
//                 className={`badge ${
//                   analysisResult.severity === "High"
//                     ? "bg-danger"
//                     : analysisResult.severity === "Moderate"
//                     ? "bg-warning text-dark"
//                     : "bg-success"
//                 }`}
//                 style={{ fontSize: "12px", padding: "5px 12px" }}
//               >
//                 {analysisResult.severity}
//               </span>
//             </div>
//           )}

//           <div style={{ width: "100%", minWidth: 0 }}>
//             <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>
//               Preventive
//             </p>
//             <p
//               className="mb-0"
//               style={{ 
//                 fontSize: "14px", 
//                 lineHeight: "1.5",
//                 wordBreak: "break-word",
//                 overflowWrap: "break-word",
//                 hyphens: "auto",
//               }}
//             >
//               {getTreatment()}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default DiseaseDetected;
