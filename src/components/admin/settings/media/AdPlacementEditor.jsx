import { useEffect, useState } from "react";
import "./AdPlacementEditor.css";

import {
  saveAdPlacements,
  loadAdPlacements,
} from "../../../../utils/mediaApi";

const PLACEMENTS = [
  { id: "homepage_banner", label: "Homepage Banner" },
  { id: "sidebar", label: "Sidebar" },
  { id: "footer", label: "Footer" },
  { id: "booking_confirmation", label: "Booking Confirmation Page" },
];

export default function AdPlacementEditor({ media, saving }) {
  const [placements, setPlacements] = useState({});
  const [loading, setLoading] = useState(true);

  // Load existing ad placements
  useEffect(() => {
    const load = async () => {
      try {
        const existing = await loadAdPlacements();

        // Convert array → object for easier UI use
        const map = {};
        existing.forEach((p) => {
          map[p.placementId] = p.mediaId;
        });

        setPlacements(map);
      } catch (err) {
        console.error("Failed to load ad placements:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSelect = (placementId, mediaId) => {
    setPlacements((prev) => ({
      ...prev,
      [placementId]: mediaId,
    }));
  };

  const handleSaveClick = async () => {
    try {
      const formatted = PLACEMENTS.map((p) => ({
        placementId: p.id,
        mediaId: placements[p.id] || null,
      }));

      await saveAdPlacements(formatted);
    } catch (err) {
      console.error("Failed to save ad placements:", err);
    }
  };

  const getMediaById = (id) => media.find((m) => m.id === id);

  if (loading) return <p>Loading ad placements...</p>;

  return (
    <div className="ad-editor">
      <div className="ad-grid">
        {PLACEMENTS.map((placement) => {
          const selectedMediaId = placements[placement.id];
          const selectedMedia = selectedMediaId
            ? getMediaById(selectedMediaId)
            : null;

          return (
            <div key={placement.id} className="ad-card">
              <h4>{placement.label}</h4>
              <p className="ad-placement-id">ID: {placement.id}</p>

              {/* Preview */}
              <div className="ad-preview">
                {selectedMedia ? (
                  <img src={selectedMedia.url} alt={placement.label} />
                ) : (
                  <div className="ad-placeholder">No image selected</div>
                )}
              </div>

              {/* Dropdown */}
              <select
                value={selectedMediaId || ""}
                onChange={(e) =>
                  handleSelect(placement.id, e.target.value || null)
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
          );
        })}
      </div>

      {/* Save Button */}
      <div className="ad-save-row">
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
