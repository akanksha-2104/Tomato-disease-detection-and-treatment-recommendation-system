import React, { useState, useContext } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useContext(AuthContext);

  // Handle image selection and conversion to base64
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    setError("");
    setSuccess("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result); // save base64 data
    };
    reader.readAsDataURL(file);
  };

  // Upload image (base64) to Firestore
  const handleUpload = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    if (!user) {
      setError("You must be logged in to upload images");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const scanData = {
        userId: user.uid,
        imageName: selectedImage.name,
        imageSize: selectedImage.size,
        imageData: imageBase64, // base64 string
        uploadDate: serverTimestamp(),
        status: "pending_analysis",
        diseaseName: null,
        confidence: null,
      };

      await addDoc(collection(db, "scans"), scanData);

      setSuccess("Image uploaded successfully and saved to Firestore!");
    } catch (err) {
      console.error("Firestore upload error:", err);
      setError("Failed to upload image. Please check your Firestore setup.");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageBase64("");
    setError("");
    setSuccess("");
  };

  return (
    
    // <div
    //   className="d-flex justify-content-center align-items-center min-vh-100"
    //   style={{
    //     minHeight: "100vh",
    //     width: "100vw",
    //     backgroundColor: "#f9fff6ff",
    //     fontFamily: "Poppins, sans-serif",
    //     padding: "40px 0",
    //     boxSizing: "border-box",
    //   }}
    // >

    <div
  className="d-flex justify-content-center"
  style={{
    // minHeight: "calc(100vh - 80px)", // adjust based on your navbar height
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#f9fff6ff",
    fontFamily: "Poppins, sans-serif",
    paddingTop: "200px", // leaves clear space from the navbar
    paddingBottom: "60px",
    boxSizing: "border-box",
  }}
>

      <div
        className="card shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "15px",
          backgroundColor: "white",
          padding: "20px",
        }}
      >
        <div className="card-body p-4 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3242/3242257.png"
            alt="Upload Icon"
            width="70"
            height="70"
            className="mb-3"
          />
          <h3 className="fw-bold text-success mb-2">
            Upload Tomato Leaf Image
          </h3>
          <p className="text-muted mb-3">
            Upload a clear image of the tomato leaf for disease detection
          </p>

          {error && (
            <div className="mb-3">
              <ErrorMessage message={error} onClose={() => setError("")} />
            </div>
          )}

          {success && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              <strong>Success!</strong> {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess("")}
                aria-label="Close"
              ></button>
            </div>
          )}

          {imagePreview && (
            <div className="text-center mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "600px",
                  borderRadius: "10px",
                  border: "2px solid #a5d6a7",
                }}
              />
              <div className="mt-2 text-muted small">
                {selectedImage.name} ({(selectedImage.size / 1024).toFixed(2)}{" "}
                KB)
              </div>
            </div>
          )}

          <div className="mb-4 text-start">
            <label htmlFor="imageInput" className="form-label fw-semibold">
              Select Image
            </label>
            <input
              type="file"
              className="form-control"
              id="imageInput"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageSelect}
              disabled={uploading}
            />
            <div className="form-text">
              Accepted formats: JPEG, PNG, WebP (Max size: 5MB)
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-success"
              onClick={handleUpload}
              disabled={!selectedImage || uploading}
            >
              {uploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-upload me-2"></i>
                  Upload & Analyze
                </>
              )}
            </button>

            {selectedImage && !uploading && (
              <button
                className="btn btn-outline-secondary"
                onClick={handleClear}
              >
                Clear
              </button>
            )}
          </div>

          <div
            className="mt-4 p-3 text-start"
            style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
          >
            <h6 className="fw-semibold mb-2">📸 Tips for best results:</h6>
            <ul className="small mb-0">
              <li>Take a clear, well-lit photo of the leaf</li>
              <li>Ensure the diseased area is visible</li>
              <li>Avoid blurry or dark images</li>
              <li>One leaf per image works best</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
