export default function PricingCard({ title, price, isPopular, onBook }) {
  return (
    <div className="pricing-card">
      {isPopular && <div className="popular-ribbon">MOST POPULAR</div>}

      <div className="pricing-header">
        <div className="pricing-icon" style={{ fontSize: '2rem' }}>🐝</div>
        <h3>{title}</h3>
      </div>
      
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

      {/* Wiring the button */}
      <button className="btn-book pricing-btn" onClick={onBook}>
        Select Package
      </button>
    </div>
  );
}