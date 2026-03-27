import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./BookingSuccess.css";

export default function BookingSuccess() {
  const location = useLocation();

  // Square sends ?transactionId=...&orderId=...
  const params = new URLSearchParams(location.search);
  const transactionId = params.get("transactionId");
  const orderId = params.get("orderId");

  return (
    <div className="booking-success-page">
      <div className="success-card">
        <h1 className="success-title">🎉 Booking Complete!</h1>
        <p className="success-subtitle">
          Thank you for booking with Buzzy’s Inflatables!
        </p>

        <p className="success-message">
          Your deposit has been received and your reservation is now locked in.
        </p>

        {transactionId && (
          <p className="success-detail">
            <strong>Transaction ID:</strong> {transactionId}
          </p>
        )}

        {orderId && (
          <p className="success-detail">
            <strong>Order ID:</strong> {orderId}
          </p>
        )}

        <p className="success-note">
          You’ll receive a confirmation email shortly with all your event
          details. If anything looks off, feel free to reach out!
        </p>

        <Link to="/" className="success-button">
          Return Home
        </Link>
      </div>
    </div>
  );
}
