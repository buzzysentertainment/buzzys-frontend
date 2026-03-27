import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Cart.css"; 

export default function Cart({ cart, bookingDate, removeFromCart, clearCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState("");

  const [saveCardForAutopay, setSaveCardForAutopay] = useState(false);

  const [isChecking, setIsChecking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState({ type: "", text: "" });

  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [discount, setDiscount] = useState(0);
  const [percentOff, setPercentOff] = useState(0);

  const [formData, setFormData] = useState({
    name: "", 
    email: "", 
    phone: "",
    date: bookingDate || "",
    surface: "grass",
    address: "", 
    city: "", 
    state: "", 
    zip: "", 
    startTime: "", 
    pickupTime: "",
    hasPower: false,
    damageWaiver: false
  });

  const checkAvailability = async (selectedDate) => {
    if (!selectedDate || cart.length === 0) return;
    
    setIsChecking(true);
    setAvailabilityStatus({ type: "loading", text: "Checking availability..." });

    try {
      const itemTitles = cart.map(item => item.title || item.name);
      const res = await axios.post("https://buzzys-backend.onrender.com/book/check-availability", {
        date: selectedDate,
        items: itemTitles
      });

      if (res.data.available) {
        setAvailabilityStatus({ type: "success", text: "Success! Your gear is available! ✅" });
      } else {
        setAvailabilityStatus({ type: "error", text: "One or more items are unavailable on this date. Please try another day!" });
      }
    } catch (err) {
      setAvailabilityStatus({ type: "error", text: "Availability check failed. Please try again." });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (formData.date && cart.length > 0) {
      checkAvailability(formData.date);
    } else if (cart.length === 0) {
      setAvailabilityStatus({ type: "", text: "" });
    }
  }, [cart.length, formData.date]);

  const calculatePricing = () => {
    const hasSoftPlay = cart.some(item => item.category === "Soft Play");
    const rawSubtotal = cart.reduce((acc, item) => {
      let itemPrice = item.price ? parseFloat(item.price.toString().replace(/[^0-9.]/g, "")) : 0;
      if (hasSoftPlay && item.category === "Bounce Houses") itemPrice *= 0.5;
      return acc + itemPrice;
    }, 0);

    const waiverFee = formData.damageWaiver ? Number((rawSubtotal * 0.08).toFixed(2)) : 0;
    const subtotal = rawSubtotal + waiverFee;
    const deposit = Number((subtotal * 0.35).toFixed(2));
    const remainingBalance = Number((subtotal - deposit).toFixed(2));
    return { rawSubtotal, waiverFee, subtotal, deposit, remainingBalance };
  };

  const { rawSubtotal, waiverFee, subtotal } = calculatePricing();

  const applyPromo = async () => {
    try {
      const res = await axios.post("https://buzzys-backend.onrender.com/book/validate-coupon", {
        code: promoCode
      });
      
      if (!res.data.valid) {
        setPromoMessage("Invalid or expired promo code.");
        setDiscount(0);
        setPercentOff(0);
        return;
      }
      
      setPromoMessage(`Promo applied: ${res.data.description}`);
      setDiscount(res.data.amountOff || 0);
      setPercentOff(res.data.percentOff || 0);
    } catch (err) {
      setPromoMessage("Error applying promo.");
    }
  };

  const percentDiscount = rawSubtotal * (percentOff / 100);
  const finalTotal = Math.max(0, subtotal - discount - percentDiscount);
  const discountedSubtotal = finalTotal;
  const discountedDeposit = Number((discountedSubtotal * 0.35).toFixed(2));
  const discountedRemaining = Number((discountedSubtotal - discountedDeposit).toFixed(2));

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!agreed) return alert("Please read and agree to the Rental Agreement.");
    if (signature.trim().length < 3) return alert("Please enter your signature.");
    if (!formData.date) return alert("Please select a party date!");
    if (availabilityStatus.type === "error") return alert("Some items are unavailable for the selected date.");

    setLoading(true);
    try {
      const finalCart = cart.map(item => ({
        ...item,
        price: parseFloat(item.price.toString().replace(/[^0-9.]/g, ""))
      }));

      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        date: formData.date,
        deliveryTime: formData.startTime,
        pickupTime: formData.pickupTime,
        items: finalCart,
        subtotal: discountedSubtotal,
        deposit: discountedDeposit,
        remaining: discountedRemaining,
        waiverFee: waiverFee,
        signature,
        saveCardForAutopay,
        referralType: "None",
        isTaxExempt: false,
        discount,
        percentOff
      };

      const res = await axios.post("https://buzzys-backend.onrender.com/book/create-checkout", bookingData);
      window.location.href = res.data.checkoutUrl;

    } catch (err) {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buzzy-cart-page">
      <div className="bouncy-header">
        <h2 className="bubble-title">Party Checkout! 🎈</h2>
        <p className="bubble-subtitle">Confirm your gear and sign the fun-form.</p>
      </div>

      {/* Seasonal Promo Banner */}
      <div className="seasonal-banner">
        <img 
          src="/promo-banner.png" 
          alt="Seasonal Promotion" 
          className="seasonal-banner-img"
        />
      </div>

      <Link to="/catalog" className="continue-shopping-btn">
        ← Continue Shopping
      </Link>

      {cart.length === 0 ? (
        <div className="empty-bubble-box">
          <p>Your cart is empty!</p>
          <button className="bubble-btn yellow" onClick={() => navigate('/catalog')}>Go Find Fun</button>
        </div>
      ) : (
        <div className="cart-bubble-layout">

          {/* LEFT PANEL: CART ICONS */}
          <div className="icon-cart-section">
            <h3 className="section-label">Your Party Gear 🍦</h3>
            <div className="bubble-icon-container">
              {cart.map((item, index) => (
                <div key={index} className="bouncy-icon-card">
                  <img src={item.image} alt={item.title} className="icon-img" />
                  <div className="icon-text">
                    <span className="icon-title">{item.title}</span>
                    {item.category === "Bounce Houses" && cart.some(i => i.category === "Soft Play") && (
                      <span className="bubble-discount">50% Bundle!</span>
                    )}
                  </div>
                  <button className="bubble-remove" onClick={() => removeFromCart(index)}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleCheckout} className="bouncy-form-grid">

            {/* LEFT FORM PANEL: LOGISTICS */}
            <div className="bubble-panel">
              <h3 className="panel-header">1. Logistics 🏠</h3>

              <div className="bubble-input-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              
              <div className="bubble-row">
                <div className="bubble-input-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div className="bubble-input-group">
                  <label>Phone *</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>

              <div className="bubble-input-group">
                <label>Street Address *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                />
              </div>

              <div className="bubble-row">
                <div className="bubble-input-group">
                  <label>City *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})} 
                  />
                </div>
                <div className="bubble-input-group" style={{ flex: '0.4' }}>
                  <label>Zip *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.zip} 
                    onChange={(e) => setFormData({...formData, zip: e.target.value})} 
                  />
                </div>
              </div>

              <div className="bubble-input-group">
                <label>Party Date *</label>
                <input 
                  type="date" 
                  required 
                  min={new Date().toISOString().split("T")[0]} 
                  value={formData.date} 
                  onChange={(e) => {
                    setFormData({...formData, date: e.target.value});
                    checkAvailability(e.target.value);
                  }} 
                />
                {availabilityStatus.text && (
                  <div className={`availability-status-msg ${availabilityStatus.type}`}>
                    {availabilityStatus.text}
                  </div>
                )}
              </div>

              {/* Promo Section */}
              <div className="bubble-input-group promo-group">
                <label>Got a Promo Code? 🎁</label>
                <div 
                  className="bubble-promo-input-wrapper"
                  style={{
                    display: 'flex',
                    gap: '8px',
                    background: '#f8f9fa',
                    padding: '8px',
                    borderRadius: '50px',
                    border: '2px solid #eee'
                  }}
                >
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code..."
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      paddingLeft: '15px',
                      outline: 'none'
                    }}
                  />
                  <button 
                    type="button" 
                    className="bubble-btn-sm yellow" 
                    onClick={applyPromo}
                    style={{
                      borderRadius: '50px',
                      padding: '8px 20px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      border: 'none',
                      boxShadow: '0 4px 0 #d4ac0d'
                    }}
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p 
                    className={`promo-status ${discount > 0 || percentOff > 0 ? 'success' : 'error'}`} 
                    style={{
                      fontSize: '12px',
                      marginTop: '8px',
                      paddingLeft: '15px',
                      fontWeight: '600'
                    }}
                  >
                    {promoMessage}
                  </p>
                )}
              </div>

              <div className="bubble-row">
                <div className="bubble-input-group">
                  <label>Start Time *</label>
                  <select 
                    required 
                    value={formData.startTime} 
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  >
                    <option value="">Choose...</option>
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>           
                  </select>
                </div>
                <div className="bubble-input-group">
                  <label>Pickup Time*</label>
                  <select 
                    required 
                    value={formData.pickupTime} 
                    onChange={(e) => setFormData({...formData, pickupTime: e.target.value })}
                  >
                    <option value="">Choose...</option>
                    <option value="07:00 AM">07:00 AM</option>
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                  </select>
                </div>  
              </div>
            </div>

            {/* RIGHT PANEL: AGREEMENT + PRICING */}
            <div className="bubble-panel secondary">
              <h3 className="panel-header">2. Agreement ⚖️</h3>

              <div className="waiver-bubble-box">
                <h4>Read & Download Agreements</h4>
                <div className="pdf-button-container">
                  <a href="/rental-agreement.pdf" target="_blank" className="pdf-link">📄 Liability Waiver</a>
                  <a href="/general-release.pdf" target="_blank" className="pdf-link">📄 General Release</a>
                </div>
              </div>

              <div className="bubble-check-row">
                <input 
                  type="checkbox" 
                  id="agree" 
                  required 
                  checked={agreed} 
                  onChange={(e) => setAgreed(e.target.checked)} 
                />
                <label htmlFor="agree">I agree to the terms.</label>
              </div>

              <div className="bubble-input-group">
                <label>Electronic Signature</label>
                <input 
                  type="text" 
                  placeholder="Type name to sign" 
                  required 
                  value={signature} 
                  onChange={(e) => setSignature(e.target.value)} 
                />
              </div>

              <div className="pricing-bubble">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>${rawSubtotal.toFixed(2)}</span>
                </div>

                <div className="price-row waiver">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.damageWaiver} 
                      onChange={() => setFormData(prev => ({...prev, damageWaiver: !prev.damageWaiver}))} 
                    /> 
                    Waiver (8%)
                  </label>
                  <span>${waiverFee.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="price-row promo">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                {percentOff > 0 && (
                  <div className="price-row promo">
                    <span>Percent Discount ({percentOff}%)</span>
                    <span>-${percentDiscount.toFixed(2)}</span>
                  </div>
                )}

                {(discount + percentDiscount) > 0 && (
                  <div className="price-row savings">
                    <span className="savings-text">🎉 You saved</span>
                    <span className="savings-amount">
                      -${(discount + percentDiscount).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="price-divider" />

              <div className="price-row total">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
              <div className="price-row deposit">
                <span>Deposit Due Now</span>
                <span>${(finalTotal * 0.35).toFixed(2)}</span>
              </div>
              <div className="price-row balance-due">
                <span>Balance Due</span>
                <span>${(finalTotal - (finalTotal * 0.35)).toFixed(2)}</span>
              </div>

              <div 
                className="autopay-toggle-container" 
                style={{
                  marginTop: '15px',
                  padding: '12px',
                  background: '#fff9e6',
                  borderRadius: '10px',
                  border: '1px dashed #f39c12'
                }}
              >
                <label 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer', 
                    gap: '10px' 
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={saveCardForAutopay} 
                    onChange={(e) => setSaveCardForAutopay(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                    Enable Auto-Pay for the balance
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                className="bubble-pay-btn" 
                disabled={
                  loading || 
                  isChecking || 
                  !agreed || 
                  signature.length < 3 || 
                  availabilityStatus.type === "error"
                }
              >
                {loading ? "Preparing..." : isChecking ? "Checking..." : `Book My Party!`}
              </button>
            </div>

          </form>

        </div>
      )}
    </div>
  );
}
