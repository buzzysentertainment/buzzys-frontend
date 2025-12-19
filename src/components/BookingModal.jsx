import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, runTransaction } from "firebase/firestore";

export default function BookingModal({ onClose, cart, clearCart }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your hive is empty!");
    setLoading(true);

    try {
      // 1. Firestore availability check + save
      await runTransaction(db, async (transaction) => {
        for (const item of cart) {
          const bookingID = `${item.title.replace(/\s+/g, '')}_${date}`;
          const bookingRef = doc(db, "bookings", bookingID);
          const bookingDoc = await transaction.get(bookingRef);

          if (bookingDoc.exists()) {
            throw new Error(`The ${item.title} is already booked for this date!`);
          }

          transaction.set(bookingRef, {
            customerEmail: email,
            items: cart,
            date: date,
            total: total,
            status: "pending",
            createdAt: new Date()
          });
        }
      });

      // 2. Send booking to FastAPI backend
      const response = await fetch("http://127.0.0.1:8000/book/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          date: date,
          items: cart,
          total: total
        })
      });

      const result = await response.json();
      console.log("Backend booking response:", result);

      if (result.status !== "success") {
        alert("Booking saved, but email failed to send.");
      }

      // 3. Success UI
      setSubmitted(true);
      clearCart();

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        {!submitted ? (
          <>
            <h2>Check Out Your Hive 🐝</h2>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Event Date</label>
                <input 
                  type="date" 
                  required 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>

              <button type="submit" className="btn-confirm" disabled={loading}>
                {loading ? "Checking Availability..." : "Confirm Booking"}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <h2>Success! 🎉</h2>
            <p>Buzzy has received your request. We will contact you at <strong>{email}</strong> soon.</p>
            <button className="btn-confirm" onClick={onClose}>Great!</button>
          </div>
        )}
      </div>
    </div>
  );
}