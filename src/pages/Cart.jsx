import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; 
import { doc, runTransaction } from "firebase/firestore";
import "../styles.css";

export default function Cart({ cart, removeFromCart, clearCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const subtotal = cart.reduce((acc, item) => acc + Number(item.price), 0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",       // ← added
    date: "",
    surface: "grass",
    gateWidth: "",
    notes: ""
  });

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      // 1. Firestore availability check + save
      await runTransaction(db, async (transaction) => {
        const bookingID = `${cart[0].title.replace(/\s+/g, '')}_${formData.date}`;
        const bookingRef = doc(db, "bookings", bookingID);
        const bookingDoc = await transaction.get(bookingRef);

        if (bookingDoc.exists()) {
          throw "🐝 Buzzy Alert: This inflatable is already booked for that date!";
        }

        transaction.set(bookingRef, {
          customerName: formData.name,
          customerEmail: formData.email,   // ← added
          eventDate: formData.date,
          items: cart,
          total: subtotal,
          specifics: {
            surface: formData.surface,
            gateWidth: formData.gateWidth,
            notes: formData.notes
          },
          status: "pending",
          createdAt: new Date()
        });
      });

      // 2. Send booking to FastAPI backend (emails)
      const response = await fetch("http://127.0.0.1:8000/book/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          date: formData.date,
          items: cart,
          total: subtotal,
          surface: formData.surface,
          gateWidth: formData.gateWidth,
          notes: formData.notes
        })
      });

      const result = await response.json();
      console.log("Backend booking response:", result);

      if (result.status !== "success") {
        alert("Booking saved, but email failed to send.");
      }

      // 3. Success UI
      alert("Success! Your hive is reserved.");
      clearCart();
      navigate("/");

    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <h2 className="section-title">Finalize Your Hive 🐝</h2>
      
      <div className="cart-container">
        {cart.length === 0 ? (
          <div className="empty-cart-box">
            <p>Your hive is empty!</p>
            <button className="btn-confirm" onClick={() => navigate('/catalog')}>Back to Catalog</button>
          </div>
        ) : (
          <>
            {/* LEFT: Item List */}
            <div className="cart-items-list">
              <h3 className="list-header">Your Selected Gear</h3>
              {cart.map((item, index) => (
                <div key={index} className="vivid-item-card">
				  <img
					src={item.image}
					alt={item.title}
					className="cart-item-image"
				/>
                  <div className="item-info">
                    <h4>{item.title}</h4>
                    <p className="price-tag">${item.price}</p>
                  </div>
                  <button className="remove-btn-vivid" onClick={() => removeFromCart(index)}>Remove</button>
                </div>
              ))}
              <div className="total-display">
                <span>Total:</span>
                <span>${subtotal}</span>
              </div>
            </div>

            {/* RIGHT: Checkout Form */}
            <div className="checkout-form-container">
              <form className="booking-form" onSubmit={handleCheckout}>
                <h3 className="form-header">Booking Details</h3>
                
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" placeholder="Enter your name" required 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" placeholder="Enter your email" required
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Event Date</label>
                  <input 
                    type="date" required 
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Setup Surface</label>
                  <select onChange={(e) => setFormData({...formData, surface: e.target.value})}>
                    <option value="grass">Grass (Stakes)</option>
                    <option value="concrete">Concrete (Sandbags)</option>
                    <option value="dirt">Dirt</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Gate Width</label>
                  <input 
                    type="text" placeholder="e.g. 36 inches" 
                    onChange={(e) => setFormData({...formData, gateWidth: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Special Notes</label>
                  <textarea 
                    placeholder="Any special instructions for Buzzy?" 
                    rows="3"
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                <button type="submit" className="btn-confirm" disabled={loading}>
                  {loading ? "Checking Hive..." : "Confirm & Book Now"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}