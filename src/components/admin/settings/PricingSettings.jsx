import { useEffect, useState } from "react";
import { getPricingSettings, updatePricingSettings } from "../../../utils/adminApi";
import "./PricingSettings.css";

export default function PricingSettings() {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const res = await getPricingSettings();
        if (res?.data?.pricing) {
          setPricing(res.data.pricing);
        }
      } catch (err) {
        console.error("Failed to load pricing:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, []);

  const handleChange = (field, value) => {
    setPricing((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleItemChange = (key, field, value) => {
    setPricing((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [key]: {
          ...prev.items[key],
          [field]: value,
        },
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePricingSettings(pricing);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save pricing:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !pricing) return <p>Loading pricing settings...</p>;

  const inflatables = Object.entries(pricing.items).filter(
    ([, item]) => "dry" in item || "wet" in item
  );

  const addons = Object.entries(pricing.items).filter(
    ([, item]) => "price" in item && !("dry" in item) && !("wet" in item)
  );

  return (
    <div className="pricing-settings">
      <h3>Pricing Settings</h3>

      {/* GLOBAL SETTINGS */}
      <div className="settings-grid">
        <div className="settings-field">
          <label>Tax Rate (%)</label>
          <input
            type="number"
            step="0.01"
            value={pricing.taxRate}
            onChange={(e) => handleChange("taxRate", Number(e.target.value))}
          />
        </div>

        <div className="settings-field">
          <label>Delivery Fee ($)</label>
          <input
            type="number"
            value={pricing.deliveryFee}
            onChange={(e) => handleChange("deliveryFee", Number(e.target.value))}
          />
        </div>

        <div className="settings-field">
          <label>Weekend Surcharge ($)</label>
          <input
            type="number"
            value={pricing.weekendSurcharge}
            onChange={(e) =>
              handleChange("weekendSurcharge", Number(e.target.value))
            }
          />
        </div>
      </div>

      {/* INFLATABLE PRICES WITH SIDE SAVE BUTTON */}
      <div className="inflatable-section">
        <h4>Inflatable Prices</h4>

        <div className="inflatable-layout">
          {/* LEFT: TABLE */}
          <div
            className="items-list"
            style={{
              maxHeight: "350px",
              overflowY: "auto",
              paddingRight: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "10px",
              flex: "1"
            }}
          >
            <div
              className="item-row"
              style={{ fontWeight: "bold", marginBottom: "10px" }}
            >
              <span style={{ width: "180px", display: "inline-block" }}>Item</span>
              <span style={{ width: "120px", display: "inline-block" }}>Dry Price ($)</span>
              <span style={{ width: "120px", display: "inline-block" }}>Wet Price ($)</span>
            </div>

            {inflatables.map(([key, item]) => (
              <div key={key} className="item-row" style={{ marginBottom: "10px" }}>
                <strong style={{ width: "180px", display: "inline-block" }}>{key}</strong>
                <input
                  type="number"
                  placeholder="Dry price"
                  value={item.dry}
                  style={{ width: "120px" }}
                  onChange={(e) => handleItemChange(key, "dry", Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Wet price"
                  value={item.wet}
                  style={{ width: "120px" }}
                  onChange={(e) => handleItemChange(key, "wet", Number(e.target.value))}
                />
              </div>
            ))}
          </div>

          {/* RIGHT: SAVE BUTTON */}
          <div className="save-button-side">
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Pricing"}
            </button>

            {saved && <p className="success-text">Pricing saved successfully!</p>}
          </div>
        </div>
      </div>

      {/* ADD-ONS */}
      <h4>Add‑Ons</h4>

      <div
        className="items-list"
        style={{
          maxHeight: "250px",
          overflowY: "auto",
          paddingRight: "10px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
      >
        <div
          className="item-row"
          style={{ fontWeight: "bold", marginBottom: "10px" }}
        >
          <span style={{ width: "180px", display: "inline-block" }}>Item</span>
          <span style={{ width: "120px", display: "inline-block" }}>Base Price ($)</span>
          <span style={{ width: "200px", display: "inline-block" }}>Extras</span>
        </div>

        {addons.map(([key, item]) => (
          <div key={key} className="item-row" style={{ marginBottom: "10px" }}>
            <strong style={{ width: "180px", display: "inline-block" }}>{key}</strong>
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              style={{ width: "120px" }}
              onChange={(e) => handleItemChange(key, "price", Number(e.target.value))}
            />
            <div style={{ width: "200px", display: "inline-block" }}>
              {"extra6Hours" in item && (
                <input
                  type="number"
                  placeholder="Extra 6 hours"
                  value={item.extra6Hours}
                  style={{ width: "120px", marginBottom: "5px" }}
                  onChange={(e) =>
                    handleItemChange(key, "extra6Hours", Number(e.target.value))
                  }
                />
              )}
              {"extraSyrup" in item && (
                <input
                  type="number"
                  placeholder="Extra syrup"
                  value={item.extraSyrup}
                  style={{ width: "120px" }}
                  onChange={(e) =>
                    handleItemChange(key, "extraSyrup", Number(e.target.value))
                  }
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
