import React from "react";
import UploadLeafCard from "./UploadSection";
// import HistorySection from "./HistorySection";
import DiseaseDetected from "./components/DiseaseDetected";
// import WeatherCard from "./components/WeatherCard";

const DashboardHome = () => {
  return (
    <div
      className="dashboardHome"
      style={{ 
        marginTop: "70px",
        padding: "30px 40px",
        paddingBottom: "60px",
        backgroundColor: "#ffffff",
        minHeight: "calc(100vh - 70px)",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div className="mb-4" style={{ width: "100%", maxWidth: "100%" }}>
        <h3 className="fw-bold mb-2" style={{ color: "#2e7d32", textAlign:"center"}}>
          Welcome to TomatoCare 
        </h3>
        <p className="text-muted mb-0" style={{textAlign:"center"}}>
          Analyze your tomato plants and track your previous scans easily.
        </p>
      </div>

      <div 
        className="row" 
        style={{ 
          gap: "20px", 
          display: "flex",
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          padding: 0,
          alignItems: "flex-start",
          boxSizing: "border-box",
          justifyContent: "center",
        }}
      >
        {/* Left Column - Upload & History */}
        <div 
          className="col-lg-6" 
          style={{ 
            flex: "0 1 calc(50% - 10px)",
            minWidth: 0,
            maxWidth: "calc(50% - 10px)",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <div style={{ minHeight: "450px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
            <UploadLeafCard />
          </div>
        </div>

        {/* Right Column - Weather & Disease */}
        <div 
          className="col-lg-6" 
          style={{ 
            flex: "0 1 calc(50% - 10px)",
            minWidth: 0,
            maxWidth: "calc(50% - 10px)",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <div style={{ minHeight: "450px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
            <DiseaseDetected />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
//<HistorySection />, <WeatherCard />