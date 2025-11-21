import React, { useState, useEffect } from "react";

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const fetchWeather = async (city) => {
    if (!city.trim()) {
      setError("Please enter a location");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // Replace with your OpenWeatherMap API key from the URL that worked
      
      // Fetch weather data
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&units=metric&appid=${API_KEY}`;
      console.log("Fetching weather for:", city);
      
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      console.log("Weather Response:", weatherResponse.status, weatherData);

      if (!weatherResponse.ok) {
        if (weatherResponse.status === 401) {
          throw new Error("Invalid API key. Please check your OpenWeatherMap API key.");
        } else if (weatherResponse.status === 404) {
          throw new Error(`City "${city}" not found. Please check the spelling.`);
        } else if (weatherData.message) {
          throw new Error(weatherData.message);
        } else {
          throw new Error("Failed to fetch weather data");
        }
      }

      setWeather(weatherData);
      setSearchLocation(city);

      // Fetch air quality data using coordinates
      const { lat, lon } = weatherData.coord;
      const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      const airQualityResponse = await fetch(airQualityUrl);

      if (airQualityResponse.ok) {
        const airQualityData = await airQualityResponse.json();
        setAirQuality(airQualityData);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(err.message || "Failed to fetch weather data");
      setLoading(false);
      setWeather(null);
      setAirQuality(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(location);
  };

  const getAQILevel = (aqi) => {
    const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    return levels[aqi - 1] || "Unknown";
  };

  const getAQIColor = (aqi) => {
    const colors = ["#4caf50", "#8bc34a", "#ffeb3b", "#ff9800", "#f44336"];
    return colors[aqi - 1] || "#999";
  };

  return (
    <div 
      className="card" 
      style={{ 
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        height: "auto",
        minHeight: "320px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div className="card-body" style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h6 className="fw-bold mb-3" style={{ fontSize: "16px" }}>Weather</h6>

        {!weather ? (
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>🌤️</div>
            <p className="text-muted mb-3 text-center" style={{ fontSize: "14px" }}>
              Enter your location to check weather
            </p>
            <form onSubmit={handleSearch} className="w-100">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Mumbai, London, New York"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ borderRadius: "8px 0 0 8px", border: "1px solid #ddd" }}
                />
                <button 
                  className="btn btn-success" 
                  type="submit"
                  disabled={loading}
                  style={{ borderRadius: "0 8px 8px 0" }}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : "Go"}
                </button>
              </div>
            </form>
            {error && (
              <div className="alert alert-danger py-2 px-3 mt-2 mb-0 w-100" role="alert" style={{ fontSize: "12px" }}>
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-grow-1 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h6 className="mb-0 fw-bold">{weather.name}, {weather.sys.country}</h6>
                <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                  {new Date().toLocaleDateString("en-US", { 
                    month: "short", 
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setWeather(null);
                  setAirQuality(null);
                  setLocation("");
                  setError(null);
                }}
                style={{ fontSize: "11px", padding: "4px 10px" }}
              >
                Change
              </button>
            </div>

            <div className="d-flex align-items-center mb-3">
              <div style={{ fontSize: "50px", marginRight: "15px" }}>
                {weather.weather[0]?.main === "Clear" ? "☀️" : 
                 weather.weather[0]?.main === "Clouds" ? "☁️" : 
                 weather.weather[0]?.main === "Rain" ? "🌧️" : 
                 weather.weather[0]?.main === "Drizzle" ? "🌦️" : 
                 weather.weather[0]?.main === "Snow" ? "❄️" : 
                 weather.weather[0]?.main === "Mist" || weather.weather[0]?.main === "Fog" ? "🌫️" : "🌤️"}
              </div>
              <div>
                <h2 className="mb-0 fw-bold" style={{ fontSize: "36px" }}>
                  {Math.round(weather.main.temp)}°C
                </h2>
                <p className="mb-0 text-muted" style={{ fontSize: "13px", textTransform: "capitalize" }}>
                  {weather.weather[0]?.description}
                </p>
              </div>
            </div>

            <div className="row g-2 mt-auto">
              <div className="col-6">
                <div className="p-2" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                  <p className="mb-0 text-muted" style={{ fontSize: "11px" }}>Humidity</p>
                  <p className="mb-0 fw-bold" style={{ fontSize: "14px" }}>💧 {weather.main.humidity}%</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                  <p className="mb-0 text-muted" style={{ fontSize: "11px" }}>Wind Speed</p>
                  <p className="mb-0 fw-bold" style={{ fontSize: "14px" }}>💨 {Math.round(weather.wind.speed)} km/h</p>
                </div>
              </div>
              {airQuality ? (
                <>
                  <div className="col-6">
                    <div className="p-2" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                      <p className="mb-0 text-muted" style={{ fontSize: "11px" }}>Air Quality</p>
                      <p className="mb-0 fw-bold" style={{ fontSize: "14px", color: getAQIColor(airQuality.list[0].main.aqi) }}>
                        🌍 {getAQILevel(airQuality.list[0].main.aqi)}
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                      <p className="mb-0 text-muted" style={{ fontSize: "11px" }}>Feels Like</p>
                      <p className="mb-0 fw-bold" style={{ fontSize: "14px" }}>🌡️ {Math.round(weather.main.feels_like)}°C</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-6">
                    <div className="p-2" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                      <p className="mb-0 text-muted" style={{ fontSize: "11px" }}>Pressure</p>
                      <p className="mb-0 fw-bold" style={{ fontSize: "14px" }}>🌡️ {weather.main.pressure} hPa</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                      <p className="mb-0 text-muted" style={{ fontSize: "11px" }}>Feels Like</p>
                      <p className="mb-0 fw-bold" style={{ fontSize: "14px" }}>🌡️ {Math.round(weather.main.feels_like)}°C</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;