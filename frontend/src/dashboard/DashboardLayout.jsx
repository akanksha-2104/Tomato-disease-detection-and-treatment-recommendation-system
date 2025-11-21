import React from "react";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./DashboardHome";

const DashboardLayout = () => {
  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh",
      width: "100%",
      maxWidth: "100vw",
      overflowX: "hidden",
      boxSizing: "border-box",
      position: "relative",
    }}>
      <Sidebar />
      <div style={{ 
        marginLeft: "250px",
        width: "calc(100% - 250px)",
        maxWidth: "calc(100% - 250px)",
        overflowX: "hidden",
        boxSizing: "border-box",
        minHeight: "100vh",
      }}>
        <DashboardHome />
      </div>
    </div>
  );
};

export default DashboardLayout;