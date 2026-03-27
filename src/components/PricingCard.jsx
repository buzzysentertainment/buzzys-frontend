import { useState } from "react";

export default function PricingCard({ title, dry, wet, isPopular, onBook }) {
  const [mode, setMode] = useState("dry"); // "dry" or "wet"

  const price = mode === "dry" ? dry : wet;

  return (
    <div className="pricing-card">
      {isPopular && <div className="popular-ribbon">MOST POPULAR</div>}

      <div className="pricing-header">
        <div className="pricing-icon" style={{ fontSize: "2rem" }}>🐝</div>
        <h3>{title}</h3>
      </div>

      {/* Toggle */}
      <div className="wet-dry-toggle">
        <button
          className={mode === "dry" ? "active" : ""}
          onClick={() => setMode("dry")}
        >
          Dry
        </button>
        <button
          className={mode === "wet" ? "active" : ""}
          onClick={() => setMode("wet")}
        >
          Wet
        </button>
      </div>

      {/* Price */}
      <div className="price-display">
        <span className="currency">$</span>
        <span className="amount">{price}</span>
        <span className="per-event">/ event</span>
      </div>

      <ul className="details-list">
        <li>✨ Full Day Rental</li>
        <li>🚚 Setup & Take Down</li>
        <li>🛡️ Safety Inspection</li>
      </ul>

      <button
        className="btn-book pricing-btn"
        onClick={() => onBook({ mode, price })}
      >
        Select {mode === "dry" ? "Dry" : "Wet"} Option
      </button>
    </div>
  );
}