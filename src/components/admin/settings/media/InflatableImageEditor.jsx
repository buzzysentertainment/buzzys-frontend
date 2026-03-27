import { useEffect, useState } from "react";
import "./InflatableImageEditor.css";

import {
  saveInflatableImages,
  loadInflatableImages,
} from "../../../../utils/mediaApi";

// TODO: Replace with real inflatables from Firestore later
const MOCK_INFLATABLES = [
  { id: "funRunObstacle", name: "Fun Run Obstacle" },
  { id: "rainbowRush18", name: "Rainbow Rush 18" },
  { id: "volcano19", name: "Volcano 19" },
  { id: "whitePrincess", name: "White Princess" },
  { id: "primaryCombo", name: "Primary Combo" },
];

export default function InflatableImageEditor({
  media,
  saving,
  onSave,
}) {
  const [mappings, setMappings] = useState({}); // inflatableId -> mediaId
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMappings = async () => {
      try {
        const existing = await loadInflatableImages();
        setMappings(existing || {});
      } catch (err) {
        console.error("Failed to load inflatable mappings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMappings();
  }, []);

  const handleSelectImage = (inflatableId, mediaId) => {
    setMappings((prev) => ({
      ...prev,
      [inflatableId]: mediaId,
    }));
  };

  const handleSaveClick = async () => {
    try {
      await saveInflatableImages(mappings);
      if (onSave) onSave(mappings);
    } catch (err) {
      console.error("Failed to save inflatable images:", err);
    }
  };

  const getMediaById = (id) => media.find((m) => m.id === id);

  if (loading) return <p>Loading inflatable image mappings...</p>;

  return (
    <div className="inflatable-editor">
      <div className="inflatable-grid">
        {MOCK_INFLATABLES.map((inflatable) => {
          const selectedMediaId = mappings[inflatable.id];
          const selectedMedia = selectedMediaId
            ? getMediaById(selectedMediaId)
            : null;

          return (
            <div key={inflatable.id} className="inflatable-card-row">
              {/* Info */}
              <div className="inflatable-info">
                <h4>{inflatable.name}</h4>
                <p className="inflatable-id">ID: {inflatable.id}</p>
              </div>

              {/* Preview */}
              <div className="inflatable-preview">
                {selectedMedia ? (
                  <img src={selectedMedia.url} alt={inflatable.name} />
                ) : (
                  <div className="inflatable-placeholder">
                    No image selected
                  </div>
                )}
              </div>

              {/* Dropdown */}
              <div className="inflatable-media-select">
                <select
                  value={selectedMediaId || ""}
                  onChange={(e) =>
                    handleSelectImage(inflatable.id, e.target.value || null)
                  }
                >
                  <option value="">Select image...</option>
                  {media.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || m.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="inflatable-save-row">
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
