import { useEffect, useState } from "react";
import {
  getBusinessInfo,
  updateBusinessInfo,
} from "../../../utils/adminApi";

export default function BusinessInfoSettings() {
  const [info, setInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    radius: 25,
    facebook: "",
    instagram: "",
    tiktok: "",
    about: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load business info on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBusinessInfo();

        if (res?.data?.business) {
          // Merge backend values into defaults so nothing becomes undefined
          setInfo((prev) => ({
            ...prev,
            ...res.data.business,
          }));
        }
      } catch (err) {
        console.error("Failed to load business info:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (field, value) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBusinessInfo(info);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save business info:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading business info...</p>;

  return (
    <div className="business-info-settings">
      <h3>Business Information</h3>

      <div className="settings-grid">

        {/* BUSINESS NAME */}
        <div className="settings-field">
          <label>Business Name</label>
          <input
            type="text"
            value={info.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* PHONE */}
        <div className="settings-field">
          <label>Phone Number</label>
          <input
            type="text"
            value={info.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div className="settings-field">
          <label>Email Address</label>
          <input
            type="email"
            value={info.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        {/* ADDRESS */}
        <div className="settings-field">
          <label>Business Address</label>
          <input
            type="text"
            value={info.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        {/* RADIUS */}
        <div className="settings-field">
          <label>Service Radius (miles)</label>
          <input
            type="number"
            value={info.radius}
            onChange={(e) => handleChange("radius", Number(e.target.value))}
          />
        </div>

        {/* SOCIAL LINKS */}
        <div className="settings-field">
          <label>Facebook URL</label>
          <input
            type="text"
            value={info.facebook}
            onChange={(e) => handleChange("facebook", e.target.value)}
          />
        </div>

        <div className="settings-field">
          <label>Instagram URL</label>
          <input
            type="text"
            value={info.instagram}
            onChange={(e) => handleChange("instagram", e.target.value)}
          />
        </div>

        <div className="settings-field">
          <label>TikTok URL</label>
          <input
            type="text"
            value={info.tiktok}
            onChange={(e) => handleChange("tiktok", e.target.value)}
          />
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="settings-field" style={{ marginTop: "20px" }}>
        <label>About Your Business</label>
        <textarea
          rows="5"
          value={info.about}
          onChange={(e) => handleChange("about", e.target.value)}
        />
      </div>

      {/* SAVE BUTTON */}
      <button
        className="admin-btn admin-btn-primary"
        onClick={handleSave}
        disabled={saving}
        style={{ marginTop: "20px" }}
      >
        {saving ? "Saving..." : "Save Business Info"}
      </button>

      {saved && <p className="success-text">Business info saved successfully!</p>}
    </div>
  );
}
