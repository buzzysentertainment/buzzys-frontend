import React, { useState } from "react";
import { deleteMediaItem } from "../../../../utils/mediaApi";
import { toast } from "react-hot-toast";
import { FaTrash, FaExternalLinkAlt, FaSearch } from "react-icons/fa";

export default function MediaLibrary({ media, setMedia }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.name}"? This will remove it from all slideshows and inflatables.`
    );

    if (!confirmDelete) return;

    try {
      // 1. Call our API to delete from Firestore & Storage
      await deleteMediaItem(item);
      
      // 2. Update local state to remove the item from the UI immediately
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
      
      toast.success("File deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete file. Check your permissions.");
    }
  };

  // Filter media based on search input
  const filteredMedia = media.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="media-library-container">
      {/* Search Bar */}
      <div className="media-search-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="media-search-input"
        />
      </div>

      {filteredMedia.length === 0 ? (
        <div className="no-media-message">
          <p>No media found. Try a different search or upload new files.</p>
        </div>
      ) : (
        <div className="media-grid">
          {filteredMedia.map((item) => (
            <div key={item.id} className="media-item-card">
              <div className="media-preview-wrapper">
                <img src={item.url} alt={item.name} loading="lazy" />
              </div>
              
              <div className="media-item-info">
                <span className="media-item-name" title={item.name}>
                  {item.name}
                </span>
                
                <div className="media-item-actions">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="action-btn view-btn"
                    title="View Full Size"
                  >
                    <FaExternalLinkAlt />
                  </a>
                  
                  <button 
                    onClick={() => handleDelete(item)} 
                    className="action-btn delete-btn"
                    title="Delete Permanently"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}