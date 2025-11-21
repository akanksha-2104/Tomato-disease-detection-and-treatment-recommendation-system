import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const FarmerNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
    // Auto-refresh news every 30 minutes
    const interval = setInterval(() => {
      fetchNews();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      // REPLACE THIS WITH YOUR GNEWS API KEY FROM https://gnews.io/
      const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

      // Search for agriculture/farming news in India
      const query = "agriculture OR farming OR crop OR farmer OR kisan";
      
      // GNews API endpoint - gets recent news from India
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        query
      )}&lang=en&country=in&max=10&apikey=${API_KEY}`;

      console.log("Fetching news from GNews...");
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit reached. Please try again later.");
        } else if (response.status === 403 || response.status === 401) {
          throw new Error("Invalid API key. Please check your GNews API key.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("GNews Response:", data);

      if (data.articles && data.articles.length > 0) {
        setNews(data.articles);
      } else {
        throw new Error("No articles found");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    }

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
            width: "calc(100% - 250px)"
          }}
        >
          <div className="mb-4">
            <h3 className="fw-bold mb-2" style={{ color: "#2e7d32" }}>
              Farmer News 
            </h3>
            <p className="text-muted mb-0">
              Latest agriculture and farming news
            </p>
          </div>
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" style={{ width: "50px", height: "50px" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading latest news...</p>
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
            width: "calc(100% - 250px)"
          }}
        >
          <div className="mb-4">
            <h3 className="fw-bold mb-2" style={{ color: "#2e7d32" }}>
              Farmer News 🌾
            </h3>
            <p className="text-muted mb-0">
              Latest agriculture and farming news
            </p>
          </div>
          <div className="alert alert-warning" role="alert">
            <h5 className="alert-heading">⚠️ Unable to load news</h5>
            <p className="mb-2">{error}</p>
            <div className="alert alert-info mt-3">
              <strong>Setup Instructions:</strong>
              <ol className="mb-0 mt-2">
                <li>Go to <a href="https://gnews.io/" target="_blank" rel="noopener noreferrer">https://gnews.io/</a></li>
                <li>Sign in to your account</li>
                <li>Copy your API key from the dashboard</li>
                <li>Replace "YOUR_GNEWS_API_KEY_HERE" in the code (line 24) with your actual API key</li>
              </ol>
            </div>
            <button className="btn btn-success btn-sm mt-2" onClick={fetchNews}>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (news.length === 0) {
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
            width: "calc(100% - 250px)"
          }}
        >
          <div className="mb-4">
            <h3 className="fw-bold mb-2" style={{ color: "#2e7d32" }}>
              Farmer News 
            </h3>
            <p className="text-muted mb-0">
              Latest agriculture and farming news
            </p>
          </div>
          <div className="alert alert-info">
            No news articles found at the moment. Please try again later.
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
          width: "calc(100% - 250px)"
        }}
      >
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold mb-2" style={{ color: "#2e7d32" }}>
              Farmer News
            </h3>
            <p className="text-muted mb-0">
              Latest agriculture and farming news
            </p>
          </div>
          <button 
            className="btn btn-success" 
            onClick={fetchNews}
            disabled={loading}
          >
            <i className="fa fa-refresh me-2"></i>
            Refresh
          </button>
        </div>

        <div className="row">
          {news.map((article, index) => (
            <div key={index} className="col-12 mb-3">
              <div 
                className="card" 
                style={{ 
                  borderRadius: "12px",
                  border: "1px solid #e0e0e0",
                  transition: "transform 0.2s, box-shadow 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="card-body" style={{ padding: "20px" }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1 me-3">
                      <h6 className="fw-bold mb-2" style={{ fontSize: "16px", lineHeight: "1.4" }}>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dark text-decoration-none"
                          style={{ transition: "color 0.2s" }}
                          onMouseEnter={(e) => e.target.style.color = "#2e7d32"}
                          onMouseLeave={(e) => e.target.style.color = "#000"}
                        >
                          {article.title}
                        </a>
                      </h6>
                      <p className="text-muted mb-2" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                        {truncateText(article.description, 150)}
                      </p>
                      <div className="d-flex align-items-center text-muted" style={{ fontSize: "12px" }}>
                        <span>📅 {formatDate(article.publishedAt)}</span>
                        {article.source?.name && (
                          <span className="ms-2">• 📰 {article.source.name}</span>
                        )}
                      </div>
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-success btn-sm"
                      style={{ 
                        borderRadius: "8px",
                        fontSize: "12px",
                        padding: "6px 12px",
                        whiteSpace: "nowrap"
                      }}
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <p className="text-muted small">
            <i className="fa fa-info-circle me-1"></i>
            News updates automatically every 30 minutes • Powered by GNews
          </p>
        </div>
      </div>
    </>
  );
};

export default FarmerNews;