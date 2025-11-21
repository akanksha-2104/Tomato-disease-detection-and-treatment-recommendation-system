// src/components/DiseaseInfoSection.jsx
import React from "react";

const DiseaseInfoSection = () => {
  const diseases = [
    {
      name: "Bacterial spot",
      description: "Bacterial spot causes dark, greasy-looking spots on leaves and fruit.",
      icon: "🦠",
    },
    {
      name: "Early blight",
      description: "Early blight is a fungal disease causing dark spots with concentric rings.",
      icon: "🍂",
    },
    {
      name: "Late blight",
      description: "Late blight is a devastating disease that can destroy entire crops quickly.",
      icon: "⚠️",
    },
    {
      name: "Leaf Mold",
      description: "Leaf mold thrives in humid conditions, affecting greenhouse tomatoes.",
      icon: "🍄",
    },
    {
      name: "Septoria leaf spot",
      description: "Septoria leaf spot causes small circular spots with gray centers.",
      icon: "⭕",
    },
    {
      name: "Spider mites Two-spotted spider mite",
      description: "Spider mites are tiny pests that suck plant juices, causing stippling.",
      icon: "🕷️",
    },
    {
      name: "Target Spot",
      description: "Target spot causes concentric ring patterns on leaves and fruit.",
      icon: "🎯",
    },
    {
      name: "Tomato Yellow Leaf Curl Virus",
      description: "TYLCV is a viral disease spread by whiteflies, causing severe stunting.",
      icon: "🦟",
    },
    {
      name: "Tomato mosaic virus",
      description: "Mosaic virus causes mottled patterns on leaves and affects fruit quality.",
      icon: "🧩",
    },
    {
      name: "Healthy",
      description: "Your tomato plant appears healthy! Continue proper care practices.",
      icon: "✅",
    },
  ];

  return (
    <section
      style={{
        padding: "80px 20px",
        backgroundColor: "#f5f5f5",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: "700",
              color: "#2d3748",
              marginBottom: "15px",
            }}
          >
            Our system can identify 10 different tomato plant conditions
          </h2>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 18px)",
              color: "#718096",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Advanced AI-powered detection for accurate diagnosis and treatment recommendations
          </p>
        </div>

        {/* Disease Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px",
            padding: "0 10px",
          }}
        >
          {diseases.map((disease, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "30px 25px",
                borderLeft: "5px solid #48bb78",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.12)";
                e.currentTarget.style.borderLeftColor = "#38a169";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.07)";
                e.currentTarget.style.borderLeftColor = "#48bb78";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  fontSize: "36px",
                  marginBottom: "15px",
                }}
              >
                {disease.icon}
              </div>

              {/* Disease Name */}
              <h3
                style={{
                  fontSize: "clamp(18px, 2.5vw, 20px)",
                  fontWeight: "700",
                  color: "#2d3748",
                  marginBottom: "12px",
                  lineHeight: "1.3",
                }}
              >
                {disease.name}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "clamp(14px, 1.8vw, 15px)",
                  color: "#718096",
                  lineHeight: "1.6",
                  margin: 0,
                  flex: 1,
                }}
              >
                {disease.description}
              </p>
            </div>
          ))}
        </div>

        {/* Optional: Call to Action */}
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
          }}
        >
        </div>
      </div>
    </section>
  );
};

export default DiseaseInfoSection;