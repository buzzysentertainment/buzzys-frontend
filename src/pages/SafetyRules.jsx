import "./SafetyRules.css";

export default function SafetyRules() {
  return (
    <div className="safety-page">
      <h1 className="safety-title">Safety Rules</h1>

      <div className="safety-list">

        <div className="safety-item">
          <h3>Adult Supervision Required</h3>
          <p>An adult must monitor the inflatable at all times.</p>
        </div>

        <div className="safety-item">
          <h3>No Shoes, Food, or Drinks</h3>
          <p>Remove shoes and avoid bringing food or drinks inside the inflatable.</p>
        </div>

        <div className="safety-item">
          <h3>No Flips or Rough Play</h3>
          <p>To prevent injuries, no flips, wrestling, or piling on others.</p>
        </div>

        <div className="safety-item">
          <h3>Weather Safety</h3>
          <p>Inflatables must be shut down during high winds or storms.</p>
        </div>

        <div className="safety-item">
          <h3>Weight & Capacity Limits</h3>
          <p>Follow posted limits for number of riders and weight.</p>
        </div>

      </div>
    </div>
  );
}
