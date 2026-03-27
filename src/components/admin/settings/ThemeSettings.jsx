import React from "react";

export default function ThemeSettings({ data, updatePreview }) {
  // Central handler for updating parent state
  const handleChange = (key, value) => {
    updatePreview({ [key]: value });
  };

  // Quick Preset Schemes
  const colorPresets = [
    { name: "Buzzy Classic", primary: "#ffb800", secondary: "#ffe680", accent: "#ff7f00", text: "#000000", background: "#ffffff" },
    { name: "Ocean Splash", primary: "#0077b6", secondary: "#90e0ef", accent: "#00b4d8", text: "#03045e", background: "#f0f9ff" },
    { name: "Midnight", primary: "#3a86ff", secondary: "#8338ec", accent: "#ff006e", text: "#ffffff", background: "#121212" },
    { name: "Soft Party", primary: "#ff7ac4", secondary: "#ffd166", accent: "#06d6a0", text: "#222222", background: "#fff5f8" },
  ];

  // Keys to exclude from the 'Custom Fields' dynamic list
  const standardKeys = [
    "primary", "secondary", "accent", "background", "card", "text", "radius",
    "headingFont", "headingSize", "baseFontSize", "heroTitle", "heroSubtitle", 
    "heroButtonText", "heroImage", "announcement", "showAnnouncement", 
    "showFeatured", "featuredItems"
  ];

  return (
    <div className="settings-tab-content">
      <div className="settings-section">
        <h3>Color Scheme</h3>
        
        {/* PRESET CHIPS */}
        <div className="preset-grid">
          {colorPresets.map((scheme) => (
            <button
              key={scheme.name}
              className="preset-chip"
              onClick={() => updatePreview(scheme)}
              style={{ borderLeft: `8px solid ${scheme.primary}` }}
            >
              {scheme.name}
            </button>
          ))}
        </div>

        {/* COLOR PICKERS */}
        <div className="theme-grid">
          <div className="theme-field">
            <label>Primary Color</label>
            <input
              type="color"
              value={data.primary || "#ffb800"}
              onChange={(e) => handleChange("primary", e.target.value)}
            />
          </div>
          <div className="theme-field">
            <label>Secondary Color</label>
            <input
              type="color"
              value={data.secondary || "#ffe680"}
              onChange={(e) => handleChange("secondary", e.target.value)}
            />
          </div>
          <div className="theme-field">
            <label>Background</label>
            <input
              type="color"
              value={data.background || "#ffffff"}
              onChange={(e) => handleChange("background", e.target.value)}
            />
          </div>
          <div className="theme-field">
            <label>Text Color</label>
            <input
              type="color"
              value={data.text || "#000000"}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* TYPOGRAPHY SECTION */}
      <div className="settings-section">
        <h3>Typography & Sizing</h3>
        <div className="theme-grid">
          <div className="theme-field">
            <label>Heading Font</label>
            <select
              value={data.headingFont || "Poppins"}
              onChange={(e) => handleChange("headingFont", e.target.value)}
            >
              <option value="Poppins">Poppins (Modern)</option>
              <option value="Bungee">Bungee (Playful)</option>
              <option value="Montserrat">Montserrat (Bold)</option>
              <option value="Luckiest Guy">Luckiest Guy (Cartoony)</option>
              <option value="Inter">Inter (Clean)</option>
            </select>
          </div>

          <div className="theme-field">
            <label>Heading Size ({data.headingSize || 32}px)</label>
            <input
              type="range" min="20" max="80"
              value={data.headingSize || 32}
              onChange={(e) => handleChange("headingSize", Number(e.target.value))}
            />
          </div>

          <div className="theme-field">
            <label>Base Font Size ({data.baseFontSize || 16}px)</label>
            <input
              type="range" min="12" max="24"
              value={data.baseFontSize || 16}
              onChange={(e) => handleChange("baseFontSize", Number(e.target.value))}
            />
          </div>

          <div className="theme-field">
            <label>Corner Roundness ({data.radius || 12}px)</label>
            <input
              type="range" min="0" max="40"
              value={data.radius || 12}
              onChange={(e) => handleChange("radius", Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* DYNAMIC CUSTOM FIELDS */}
      <div className="settings-section">
        <div className="section-header">
          <h3>Custom Fields</h3>
          <button 
            className="add-field-btn" 
            onClick={() => {
              const key = prompt("Field Name (e.g. footerMotto):");
              if (key) handleChange(key, "");
            }}
          >
            + Add Field
          </button>
        </div>

        <div className="custom-fields-container">
          {Object.keys(data)
            .filter((key) => !standardKeys.includes(key))
            .map((key) => (
              <div key={key} className="theme-field full-width dynamic-row">
                <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <div className="input-group">
                  <input
                    type="text"
                    value={data[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                  <button 
                    className="remove-field-btn"
                    onClick={() => {
                      const updated = { ...data };
                      delete updated[key];
                      updatePreview(updated);
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="info-box">
        <small>Changes update the preview instantly. Hit <b>"Publish Changes"</b> to save live.</small>
      </div>
    </div>
  );
}