import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#fff" : "#333",
    backgroundColor: isActive ? "#4caf50" : "#f5f5f5",
    padding: "12px 20px",
    borderRadius: "8px",
    display: "block",
    marginBottom: "8px",
    fontWeight: isActive ? "600" : "500",
    fontSize: "16px",
    transition: "all 0.3s ease",
  });

  return (
    <div
      className="bg-white shadow-sm"
      style={{ 
        width: "250px", 
        minHeight: "calc(100vh - 70px)",
        paddingTop: "20px",
        paddingLeft: "20px",
        paddingRight: "20px",
        marginTop: "70px",
        position: "fixed",
        left: 0,
        top: 0
      }}
    >
      <nav>
        <NavLink to="/dashboard" end style={linkStyle}>
          Dashboard
        </NavLink>
        {/* <NavLink to="/dashboard/history" style={linkStyle}>
          History
        </NavLink> */}
        <NavLink to="/dashboard/discussions" style={linkStyle}>
          Discussions Forum
        </NavLink>
        <NavLink to="/dashboard/news" style={linkStyle}>
          News
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;