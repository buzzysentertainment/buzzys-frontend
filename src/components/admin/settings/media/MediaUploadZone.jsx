import { useState, useRef } from "react";
import "./MediaUploadZone.css";
import { uploadMediaFile } from "../../../../utils/mediaApi";

/**
 * @param {Function} onUploadComplete - Callback to pass newly uploaded items to parent state
 */
export default function MediaUploadZone({ onUploadComplete }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Core logic to handle file processing
  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedItems = [];

    try {
      // Loop through each file and send to your Firebase utility
      for (const file of files) {
        console.log(`Uploading: ${file.name}...`);
        const uploaded = await uploadMediaFile(file);
        
        // Only push if the API returned a valid object with a URL
        if (uploaded && uploaded.url) {
          uploadedItems.push(uploaded);
        }
      }

      // If we got successful uploads, notify the parent MediaManager
      if (onUploadComplete && uploadedItems.length > 0) {
        onUploadComplete(uploadedItems);
      }
    } catch (err) {
      console.error("Upload process failed:", err);
      alert("Something went wrong during the upload. Check the console for details.");
    } finally {
      setUploading(false);
      setDragOver(false);
      // Reset input value so the same file can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Drag Event Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files || []);
    handleFiles(files);
  };

  // Manual Click Handler
  const handleZoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="media-upload-container">
      <div
        className={`media-upload-drop ${dragOver ? "drag-over" : ""} ${uploading ? "uploading-active" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleZoneClick}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
        />

        <div className="upload-content">
          <div className="upload-icon">
            {uploading ? "⏳" : "☁️"}
          </div>
          <p className="media-upload-title">
            {uploading 
              ? "Uploading to Buzzy's Library..." 
              : "Drag & drop images here, or click to browse"}
          </p>
          <p className="media-upload-subtitle">
            Supports: JPG, PNG, WebP (Max 5MB recommended)
          </p>
        </div>

        {uploading && (
          <div className="upload-progress-bar">
            <div className="progress-fill"></div>
          </div>
        )}
      </div>
    </div>
  );
}