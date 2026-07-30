import { useEffect, useState } from "react";
import { getMediaLibrary } from "../../../utils/adminApi";
import "./HomepageSettings.css";

/**
 * @param {Object} data - Current global preview state from AdminSettings
 * @param {Function} updatePreview - Function to update the global preview state
 */
export default function HomepageSettings({ data, updatePreview }) {
  const [media, setMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  // Load media library once on mount for the image dropdowns
  useEffect(() => {
    const loadMedia = async () => {
      try {
        const mediaRes = await getMediaLibrary();
        if (mediaRes?.data?.media) {
          setMedia(mediaRes.data.media);
        }
      } catch (err) {
        console.error("Failed to load media library:", err);
      } finally {
        setLoadingMedia(false);
      }
    };
    loadMedia();
  }, []);

  const handleChange = (field, value) => {
    updatePreview({ [field]: value });
  };

  const toggleFeaturedItem = (id) => {
    const exists = (data.featuredItems || []).includes(id);
    const newFeatured = exists
      ? data.featuredItems.filter((x) => x !== id)
      : [...(data.featuredItems || []), id];

    updatePreview({ featuredItems: newFeatured });
  };

  if (loadingMedia) return <p className="loading-text">Loading assets...</p>;

  return (
    <div className="homepage-settings-tab">
      <header className="tab-header">
        <h3>Homepage Content</h3>
        <p>Edit the text and featured items on your front page.</p>
      </header>

      {/* ANNOUNCEMENT BAR */}
      <div className="settings-section">
        <div className="section-title-row">
          <h4>Announcement Bar</h4>
          <label className="switch">
            <input
              type="checkbox"
              checked={data.showAnnouncement}
              onChange={(e) => handleChange("showAnnouncement", e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {data.showAnnouncement && (
          <div className="settings-field">
            <label>Announcement Text</label>
            <input
              type="text"
              placeholder="e.g. Free delivery within 10 miles!"
              value={data.announcement || ""}
              onChange={(e) => handleChange("announcement", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* HERO SECTION */}
      <div className="settings-section">
        <h4>Hero Section</h4>

        {/* MAIN TITLE */}
        <div className="settings-field">
          <label>Main Title</label>
          <input
            type="text"
            value={data.heroTitle || ""}
            onChange={(e) => handleChange("heroTitle", e.target.value)}
          />
        </div>

        {/* SUBTITLE */}
        <div className="settings-field">
          <label>Subtitle</label>
          <textarea
            rows="2"
            value={data.heroSubtitle || ""}
            onChange={(e) => handleChange("heroSubtitle", e.target.value)}
          />
        </div>

        {/* BACKGROUND IMAGE */}
        <div className="settings-field">
          <label>Background Image</label>
          <select
            value={data.heroImage || ""}
            onChange={(e) => handleChange("heroImage", e.target.value)}
          >
            <option value="">Choose from library...</option>
            {media.map((img) => (
              <option key={img.id} value={img.url}>
                {img.name}
              </option>
            ))}
          </select>
        </div>
      </div>
	  
	  {/* SEASONAL PROMOTION */}
		<div className="settings-section">
		  <div className="section-title-row">
			<h4>Seasonal Promotion</h4>
			<label className="switch">
			  <input
				type="checkbox"
				checked={data.showSeasonalPromo}
				onChange={(e) => handleChange("showSeasonalPromo", e.target.checked)}
			  />
			  <span className="slider round"></span>
			</label>
		</div>

  {data.showSeasonalPromo && (
    <div className="settings-field">
      <label>Promo Message</label>
      <input
        type="text"
        placeholder="e.g. Use code SPRING15 for 15% off!"
        value={data.seasonalPromoMessage || ""}
        onChange={(e) => handleChange("seasonalPromoMessage", e.target.value)}
      />
    </div>
  )}
</div>

      {/* FEATURED ITEMS */}
      <div className="settings-section">
        <div className="section-title-row">
          <h4>Featured Inflatables</h4>
          <label className="switch">
            <input
              type="checkbox"
              checked={data.showFeatured}
              onChange={(e) => handleChange("showFeatured", e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {data.showFeatured && (
          <div className="featured-selection-grid">
            {media.slice(0, 6).map((img) => (
              <div
                key={img.id}
                className={`featured-thumb ${
                  (data.featuredItems || []).includes(img.id) ? "selected" : ""
                }`}
                onClick={() => toggleFeaturedItem(img.id)}
              >
                <img src={img.url} alt={img.name} />
                <div className="check-overlay">✓</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="settings-notice">
        <p>...</p>
      </div>
    </div>
  );
}
