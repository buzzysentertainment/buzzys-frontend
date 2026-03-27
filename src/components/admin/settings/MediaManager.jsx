import { useEffect, useState } from "react";
import "./MediaManager.css";

import MediaUploadZone from "./media/MediaUploadZone";
import InflatableImageEditor from "./media/InflatableImageEditor";
import SlideshowEditor from "./media/SlideshowEditor";
import AdPlacementEditor from "./media/AdPlacementEditor";
import MediaLibrary from "./media/MediaLibrary";

import {
  fetchAllMedia,
  saveInflatableImages,
  saveSlideshowImages,
  saveAdPlacements,
} from "../../../utils/mediaApi";

export default function MediaManager() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const [savingInflatables, setSavingInflatables] = useState(false);
  const [savingSlideshow, setSavingSlideshow] = useState(false);
  const [savingAds, setSavingAds] = useState(false);

  // Load all media from Firestore
  useEffect(() => {
    const loadMedia = async () => {
      try {
        const items = await fetchAllMedia();
        setMedia(items || []);
      } catch (err) {
        console.error("Failed to load media:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, []);

  // When upload completes, merge new media into list
  const handleUploadComplete = (uploadedItems) => {
    setMedia((prev) => [...uploadedItems, ...prev]);
  };

  // Save inflatable mappings
  const handleSaveInflatables = async (mappings) => {
    setSavingInflatables(true);
    try {
      await saveInflatableImages(mappings);
      alert("Inflatable images updated!");
    } catch (err) {
      console.error("Failed to save inflatable images:", err);
    } finally {
      setSavingInflatables(false);
    }
  };

  /**
   * UPDATED: Now passes 'media' as the second argument.
   * This allows the API to find URLs for the IDs selected in SlideshowEditor.
   */
  const handleSaveSlideshow = async (slideshowIds) => {
    setSavingSlideshow(true);
    try {
      // Logic Bridge: IDs + Media List = Homepage Updates
      await saveSlideshowImages(slideshowIds, media);
      alert("Success! Homepage slideshow is now updated.");
    } catch (err) {
      console.error("Failed to save slideshow:", err);
      alert("Error updating slideshow. Check console for details.");
    } finally {
      setSavingSlideshow(false);
    }
  };

  // Save ad placements
  const handleSaveAds = async (placements) => {
    setSavingAds(true);
    try {
      await saveAdPlacements(placements);
      alert("Ad placements updated!");
    } catch (err) {
      console.error("Failed to save ad placements:", err);
    } finally {
      setSavingAds(false);
    }
  };

  if (loading) return <p>Loading media...</p>;

  return (
    <div className="media-manager">
      <h2>Media Library</h2>

      {/* Upload Zone */}
      <MediaUploadZone onUploadComplete={handleUploadComplete} />

      {/* Inflatable Images */}
      <section className="media-section">
        <div className="media-section-header">
          <h3>Inflatable Images</h3>
          <p className="media-section-subtitle">
            Assign images to inflatables shown on your catalog page.
          </p>
        </div>

        <InflatableImageEditor
          media={media}
          saving={savingInflatables}
          onSave={handleSaveInflatables}
        />
      </section>

      {/* Slideshow */}
      <section className="media-section">
        <div className="media-section-header">
          <h3>Homepage Slideshow</h3>
          <p className="media-section-subtitle">
            Choose and order images for your homepage hero slideshow.
          </p>
        </div>

        <SlideshowEditor
          media={media}
          saving={savingSlideshow}
          onSave={handleSaveSlideshow}
        />
      </section>

      {/* Ads */}
      <section className="media-section">
        <div className="media-section-header">
          <h3>Advertisements</h3>
          <p className="media-section-subtitle">
            Assign images to ad placements across your site.
          </p>
        </div>

        <AdPlacementEditor
          media={media}
          saving={savingAds}
          onSave={handleSaveAds}
        />
      </section>

      {/* Media Library */}
      <section className="media-section">
        <div className="media-section-header">
          <h3>All Uploaded Media</h3>
          <p className="media-section-subtitle">
            Browse, filter, and delete media from your library.
          </p>
        </div>

        <MediaLibrary media={media} setMedia={setMedia} />
      </section>
    </div>
  );
}