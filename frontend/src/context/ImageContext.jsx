// src/context/ImageContext.jsx
import React, { createContext, useContext, useState } from "react";
import TomatoDiseaseAPI from "../services/api";

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  
   // NEW: Recommendation state
  const [affectedPercentage, setAffectedPercentage] = useState(10);
  const [farmingType, setFarmingType] = useState("mixed");
  const [budgetType, setBudgetType] = useState("medium");
  const [recommendations, setRecommendations] = useState(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState(null);


  const analyzeImage = async () => {
    if (!selectedImageData) {
      setAnalysisError("No image selected for analysis");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    // Reset recommendations when new analysis starts
    setRecommendations(null);
    setRecommendationError(null);

    try {
      // Get the image file - prefer file object, fallback to converting base64
      let imageFile;
      
      if (selectedImageData.file) {
        // If we have the original file, use it directly
        imageFile = selectedImageData.file;
      } else if (selectedImageData.preview) {
        // Convert base64 data URL to File
        // Remove data:image/...;base64, prefix if present
        const base64Data = selectedImageData.preview.includes(',') 
          ? selectedImageData.preview.split(',')[1] 
          : selectedImageData.preview;
        
        // Determine file type from data URL or default to jpeg
        let mimeType = "image/jpeg";
        if (selectedImageData.preview.startsWith("data:image/")) {
          mimeType = selectedImageData.preview.split(";")[0].split(":")[1];
        }
        
        // Convert base64 to binary
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        
        // Create File from Blob
        imageFile = new File([blob], selectedImageData.name || "image.jpg", {
          type: mimeType,
        });
      } else {
        throw new Error("No image data available");
      }

      // Call the API
      const result = await TomatoDiseaseAPI.predictFromFile(imageFile);
      
      console.log("API Response:", result); // Debug log
      
      // Check if the image was rejected (not a tomato leaf)
      if (result.status === 'rejected') {
        console.log("Image rejected:", result.message);
        setAnalysisError(result.message || "The uploaded image does not appear to be a tomato leaf. Please upload a clear image of a tomato leaf.");
        return;
      }
      
      // Check for errors
      if (result.status === 'error') {
        console.log("Analysis error:", result.message);
        setAnalysisError(result.message || "Failed to analyze image. Please try again.");
        return;
      }
      
      // Handle different response structures from backend
      let diseaseName = null;
      let confidence = 0;
      let diseaseInfo = null;
      let allPredictions = [];
      let treatment = "Please consult with an agricultural expert for specific treatment recommendations.";
      let severity = "Unknown";
      
      // New backend response structure (nested under disease_detection)
      if (result.disease_detection) {
        diseaseName = result.disease_detection.disease;
        confidence = result.disease_detection.confidence || 0;
        diseaseInfo = result.disease_detection.disease_info;
        allPredictions = result.disease_detection.top_predictions || [];
        
        // Extract treatment from disease_info if available
        if (diseaseInfo) {
          treatment = diseaseInfo.description || diseaseInfo.treatment || treatment;
          severity = diseaseInfo.severity || severity;
        }
      }
      // Fallback for old response structure
      else if (result.prediction) {
        diseaseName = result.prediction.disease;
        confidence = result.prediction.confidence || 0;
        diseaseInfo = result.prediction.disease_info;
        allPredictions = result.all_predictions || [];
        treatment = result.prediction.disease_info?.treatment || treatment;
        severity = result.prediction.disease_info?.severity || severity;
      }
      // Fallback for flat structure
      else if (result.disease) {
        diseaseName = result.disease;
        confidence = result.disease_confidence || result.confidence || 0;
        allPredictions = result.all_predictions || [];
        treatment = result.treatment || treatment;
        severity = result.severity || severity;
      }
      
      // Convert confidence to 0-1 range if it's in 0-100 range
      if (confidence > 1) {
        confidence = confidence / 100;
      }
      
      // Transform the API response to match what DiseaseDetected expects
      const transformedResult = {
        predicted_class: diseaseName || "Unknown",
        disease: diseaseName || "Unknown",
        class_name: diseaseName || "Unknown",
        confidence: confidence || 0,
        treatment: treatment,
        severity: severity,
        disease_info: diseaseInfo,
        all_predictions: allPredictions,
      };

      console.log("Transformed Result:", transformedResult); // Debug log
      setAnalysisResult(transformedResult);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisError(error.message || "Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // NEW: Get treatment recommendations
  const getRecommendations = async () => {
    if (!analysisResult?.disease) {
      setRecommendationError("No disease detected. Please analyze an image first.");
      return;
    }

    setIsLoadingRecommendations(true);
    setRecommendationError(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE_URL}/api/get_recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disease_name: analysisResult.disease,
          affected_percentage: affectedPercentage,
          farming_type: farmingType,
          budget: budgetType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendations');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      console.log("Recommendations received:", data);
      setRecommendations(data);
    } catch (error) {
      console.error("Recommendation error:", error);
      setRecommendationError(error.message || "Failed to get recommendations. Please try again.");
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
    setAnalysisError(null);
    setIsAnalyzing(false);
    setRecommendations(null);
    setRecommendationError(null);
    setAffectedPercentage(10);
    setFarmingType("mixed");
    setBudgetType("medium");
  };

  return (
    <ImageContext.Provider
      value={{
        selectedImageData,
        setSelectedImageData,
        analysisResult,
        isAnalyzing,
        analysisError,
        analyzeImage,
        clearAnalysis,
        // NEW: Recommendation values
        affectedPercentage,
        setAffectedPercentage,
        farmingType,
        setFarmingType,
        budgetType,
        setBudgetType,
        recommendations,
        isLoadingRecommendations,
        recommendationError,
        getRecommendations,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => useContext(ImageContext);
