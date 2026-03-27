import { useEffect, useState } from "react";
import "./SlideshowEditor.css";

import {
  saveSlideshowImages,
  loadSlideshowImages,
} from "../../../../utils/mediaApi";

export default function SlideshowEditor({ media, saving }) {
  const [slideshowIds, setSlideshowIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load existing slideshow config
  useEffect(() => {
    const load = async () => {
      try {
        const existing = await loadSlideshowImages();
        setSlideshowIds(existing || []);
      } catch (err) {
        console.error("Failed to load slideshow images:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const addToSlideshow = (mediaId) => {
    setSlideshowIds((prev) =>
      prev.includes(mediaId) ? prev : [...prev, mediaId]
    );
  };

  const removeFromSlideshow = (mediaId) => {
    setSlideshowIds((prev) => prev.filter((id) => id !== mediaId));
  };

  const moveSlide = (index, direction) => {
    setSlideshowIds((prev) => {
      const newArr = [...prev];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;

      const temp = newArr[index];
      newArr[index] = newArr[targetIndex];
      newArr[targetIndex] = temp;

      return newArr;
    });
  };

  const handleSaveClick = async () => {
    try {
      await saveSlideshowImages(slideshowIds);
    } catch (err) {
      console.error("Failed to save slideshow:", err);
    }
  };

  const selectedSlides = slideshowIds
    .map((id) => media.find((m) => m.id === id))
    .filter(Boolean);

  if (loading) return <p>Loading slideshow images...</p>;

  return (
    <div className="slideshow-editor">
      {/* Preview Section */}
      <div className="slideshow-preview">
        {selectedSlides.length === 0 ? (
          <div className="slideshow-placeholder">
            No slideshow images selected yet.
          </div>
        ) : (
          <div className="slideshow-preview-grid">
            {selectedSlides.map((m, index) => (
              <div key={m.id} className="slideshow-slide">
                <img src={m.url} alt={m.name || m.id} />

                <div className="slideshow-controls">
                  <span className="slide-index">#{index + 1}</span>

                  <button onClick={() => moveSlide(index, -1)}>↑</button>
                  <button onClick={() => moveSlide(index, 1)}>↓</button>

                  <button onClick={() => removeFromSlideshow(m.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Picker Section */}
      <div className="slideshow-picker">
        <h4>Available Images</h4>

        <div className="slideshow-picker-grid">
          {media.map((m) => (
            <div key={m.id} className="slideshow-picker-item">
              <img src={m.url} alt={m.name || m.id} />

              <button onClick={() => addToSlideshow(m.id)}>
                {slideshowIds.includes(m.id)
                  ? "Added"
                  : "Add to Slideshow"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="slideshow-save-row">
        <button
          className="admin-btn admin-btn-primary"
          onClick={handleSaveClick}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
