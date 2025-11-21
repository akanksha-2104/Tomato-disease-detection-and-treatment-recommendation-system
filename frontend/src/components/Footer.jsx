import React from "react";

const Footer = () => {
  return (
    <footer 
      className="w-100" 
      style={{
        marginLeft: "250px",
        width: "calc(100% - 300px)",
        backgroundColor: "#f8f9fa",
        borderTop: "1px solid #e0e0e0",
        marginTop: "30px"
      }}
    >
      <div style={{ padding: "40px 80px 20px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>

          {/* About Section */}
          <div style={{ flex: "1", minWidth: "250px", maxWidth: "350px" }}>
            <h5 className="fw-bold mb-3" style={{ color: "#2e7d32" }}>TomatoCare</h5>
            <p className="text-muted" style={{ fontSize: "14px", lineHeight: "1.6" }}>
              Helping farmers detect tomato crop diseases using AI technology. Improve crop health and maximize yield.
            </p>
          </div>

          {/* Quick Links Section */}
          <div style={{ flex: "1", minWidth: "200px", maxWidth: "250px", textAlign: "center" }}>
            <h5 className="fw-bold mb-3" style={{ color: "#2e7d32" }}>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#how-it-works" className="text-decoration-none" style={{ color: "#666", fontSize: "14px" }}>
                  How It Works
                </a>
              </li>
              <li className="mb-2">
                <a href="#features" className="text-decoration-none" style={{ color: "#666", fontSize: "14px" }}>
                  Features
                </a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="text-decoration-none" style={{ color: "#666", fontSize: "14px" }}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div style={{ flex: "1", minWidth: "200px", maxWidth: "250px", textAlign: "right" }}>
            <h5 className="fw-bold mb-3" style={{ color: "#2e7d32" }}>Follow Us</h5>
            <div className="d-flex gap-3" style={{ justifyContent: "flex-end" }}>
              <a 
                href="#" 
                className="text-decoration-none"
                style={{ 
                  color: "#666",
                  fontSize: "24px",
                  transition: "color 0.3s"
                }}
                onMouseEnter={(e) => e.target.style.color = "#2e7d32"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
              >
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a 
                href="#" 
                className="text-decoration-none"
                style={{ 
                  color: "#666",
                  fontSize: "24px",
                  transition: "color 0.3s"
                }}
                onMouseEnter={(e) => e.target.style.color = "#2e7d32"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
              >
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a 
                href="#" 
                className="text-decoration-none"
                style={{ 
                  color: "#666",
                  fontSize: "24px",
                  transition: "color 0.3s"
                }}
                onMouseEnter={(e) => e.target.style.color = "#2e7d32"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a 
                href="#" 
                className="text-decoration-none"
                style={{ 
                  color: "#666",
                  fontSize: "24px",
                  transition: "color 0.3s"
                }}
                onMouseEnter={(e) => e.target.style.color = "#2e7d32"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
              >
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </div>

        </div>

        <hr className="my-3" style={{ borderColor: "#e0e0e0" }} />

        <div className="text-center pb-3">
          <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>
            &copy; 2025 TomatoCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;