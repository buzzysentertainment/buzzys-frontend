import { useNavigate } from "react-router-dom";
import "./BookNow.css";

export default function BookNow() {
  const navigate = useNavigate();

  return (
    <div className="booknow-page">
      <h1 className="booknow-title">Ready to Book Your Bounce?</h1>

      <p className="booknow-text">
        Booking with Buzzy’s is quick and easy. Review your cart and complete
        your event details in just a few steps.
      </p>

      <div className="booknow-steps">
        <div className="step">
          <h3>1. Pick Your Inflatables</h3>
          <p>Browse our catalog and add your favorites to the cart.</p>
        </div>

        <div className="step">
          <h3>2. Review Your Cart</h3>
          <p>Make sure everything looks perfect before booking.</p>
        </div>

        <div className="step">
          <h3>3. Complete Your Booking</h3>
          <p>Enter your event details and submit your request.</p>
        </div>
      </div>

      {/* ⭐ BUBBLY BUTTONS */}
      <div className="booknow-buttons">
        <button className="buzzy-btn" onClick={() => navigate("/catalog")}>
          Browse Catalog
        </button>

        <button className="buzzy-btn" onClick={() => navigate("/cart")}>
          Go to My Cart
        </button>
      </div>
    </div>
  );
}
