import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

// CSS Import
import "./AdminSettings.css"; 

// Settings Tabs
import ThemeSettings from "./settings/ThemeSettings";
import HomepageSettings from "./settings/HomepageSettings";
import PricingSettings from "./settings/PricingSettings";
import BookingRulesSettings from "./settings/BookingRulesSettings";
import BusinessInfoSettings from "./settings/BusinessInfoSettings";
import MediaManager from "./settings/MediaManager";
import AdminAccountSettings from "./settings/AdminAccountSettings";

// ⭐ NEW: Import the real homepage
import Home from "../../pages/Home";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("theme");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. CENTRALIZED STATE
  const [previewData, setPreviewData] = useState({
    // Theme Fields
    primary: "#ffb800",
    secondary: "#ffe680",
    accent: "#ff7f00",
    background: "#ffffff",
    card: "#f7f7f7",
    text: "#000000",
    radius: 12,
    
    // Homepage Content Fields
    heroTitle: "Buzzy's Inflatable Rentals",

    // Normal subtitle (when button is ON)
    heroSubtitle: "Best bounce houses in town!",

    // Replacement subtitle (when button is OFF)
    heroSubtitleAlt: "",

    // Button text
    heroButtonText: "Book Now",

    // NEW: Toggle for showing/hiding the button
    showHeroButton: true,

    heroImage: "",
    announcement: "Now booking for Summer 2026!",
    showAnnouncement: true,
    showFeatured: true,
    featuredItems: []
  });

  // 2. FETCH DATA FROM FIREBASE ON MOUNT
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "site_config");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPreviewData((prev) => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Load error:", error);
        toast.error("Failed to load settings from database.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 3. THE UPDATE ENGINE
  const updatePreview = (updates) => {
    setPreviewData((prev) => ({ ...prev, ...updates }));
  };

  // 4. SAVE TO FIREBASE
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "settings", "site_config");
      await updateDoc(docRef, {
        ...previewData,
        lastUpdated: new Date().toISOString()
      });
      toast.success("Changes Published Live!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading Buzzy's Editor...</div>;

  return (
    <div className="admin-settings-layout">
      
      {/* LEFT SIDEBAR */}
      <section className="settings-sidebar">
        <div className="sidebar-header">
          <h2>Site Editor</h2>
          <p>Real-time site configuration</p>
        </div>

        <nav className="settings-tabs">
          {["theme", "homepage", "pricing", "rules", "business", "media", "account"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={activeTab === t ? "active" : ""}
            >
              {t.charAt(0).toUpperCase() + t.slice(1).replace(/([A-Z])/g, ' $1')}
            </button>
          ))}
        </nav>

        <div className="settings-form-container">
          {activeTab === "theme" && (
            <ThemeSettings data={previewData} updatePreview={updatePreview} />
          )}
          {activeTab === "homepage" && (
            <HomepageSettings data={previewData} updatePreview={updatePreview} />
          )}
          {activeTab === "pricing" && <PricingSettings />}
          {activeTab === "rules" && <BookingRulesSettings />}
          {activeTab === "business" && <BusinessInfoSettings />}
          {activeTab === "media" && <MediaManager updatePreview={updatePreview} />}
          {activeTab === "account" && <AdminAccountSettings />}
        </div>

        <footer className="sidebar-footer">
          <button className="publish-btn" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Publishing..." : "Publish Changes"}
          </button>
          <small>Updates live site immediately</small>
        </footer>
      </section>

      {/* ⭐ RIGHT COLUMN: REAL HOMEPAGE PREVIEW */}
      <section className="preview-pane">
        <div className="preview-header">
          <div className="device-toggles">
            <button
              className={previewMode === "desktop" ? "active" : ""}
              onClick={() => setPreviewMode("desktop")}
            >
              Desktop
            </button>
            <button
              className={previewMode === "mobile" ? "active" : ""}
              onClick={() => setPreviewMode("mobile")}
            >
              Mobile
            </button>
          </div>
          <span className="live-status">● Preview Mode</span>
        </div>

        <div className={`viewport-frame ${previewMode}`}>
          <div className="preview-real-homepage">
            <Home previewMode={true} previewData={previewData} />
          </div>
        </div>
      </section>
    </div>
  );
}
