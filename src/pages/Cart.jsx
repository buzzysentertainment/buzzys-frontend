import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Cart.css"; 
import { 
  BUSINESS_ADDRESS, 
  calculateMileageFee, 
  roundMiles 
} from "../utils/mileage";

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
  const [organizationType, setOrganizationType] = useState("None");

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
    anchoring: "Stakes",
    hasPower: false,
    damageWaiver: false
  });

  const [distance, setDistance] = useState(null); 
  const [mileageFee, setMileageFee] = useState(0);
  const [isCalculatingMileage, setIsCalculatingMileage] = useState(false);

  // --- LOGIC FUNCTIONS ---

  const calculatePricing = () => {
    const hasSoftPlay = cart.some(item => item.category === "Soft Play");
    
    // 1. Calculate raw subtotal with bundle logic
    const rawSubtotal = cart.reduce((acc, item) => {
      let itemPrice = item.price ? parseFloat(item.price.toString().replace(/[^0-9.]/g, "")) : 0;
      if (hasSoftPlay && item.category === "Bounce Houses") itemPrice *= 0.5;
      return acc + itemPrice;
    }, 0);

    // 2. Waiver & Promo Discounts
    const currentWaiverFee = formData.damageWaiver ? Number((rawSubtotal * 0.08).toFixed(2)) : 0;
    const percentDiscountVal = rawSubtotal * (percentOff / 100);
    const totalDiscountAmount = discount + percentDiscountVal;

    // 3. Tax Logic (GA 7%)
    const GA_TAX_RATE = 0.07;
    const taxableAmount = Math.max(0, rawSubtotal + currentWaiverFee + mileageFee - totalDiscountAmount);
    const salesTax = Number((taxableAmount * GA_TAX_RATE).toFixed(2));

    // 4. Final Totals
    const finalTotal = Number((taxableAmount + salesTax).toFixed(2));
    const deposit = 75.00;
    const remainingBalance = Math.max(0, Number((finalTotal - deposit).toFixed(2)));

    return { 
      rawSubtotal, 
      waiverFee: currentWaiverFee, 
      salesTax, 
      finalTotal, 
      deposit, 
      remainingBalance, 
      percentDiscount: percentDiscountVal 
    };
  };

  // Extract variables for use in JSX and Handlers
  const { 
    rawSubtotal, 
    waiverFee, 
    salesTax, 
    finalTotal, 
    deposit, 
    remainingBalance, 
    percentDiscount 
  } = calculatePricing();

  const handleConfirmAddress = async () => {
    const { address, city, state, zip } = formData;
    if (!address || !city || !state || !zip) {
      alert("Please fill out the full address, city, state, and zip! 🏠");
      return;
    }  
    setIsCalculatingMileage(true);
    const customerAddress = `${address}, ${city}, ${state} ${zip}`;
    
    try {
      const res = await axios.post("https://buzzys-backend.onrender.com/utils/distance/", {
        origin: BUSINESS_ADDRESS, 
        destination: customerAddress
      });
	  const miles = roundMiles(res.data.distance);
      const baseOneWayFee = calculateMileageFee(miles);
      const totalMultipliedFee = baseOneWayFee * 4;
	  
	  setDistance(miles);
	  setMileageFee(totalMultipliedFee);
	  
	  setTimeout(() => {
		setIsCalculatingMileage(false);
	  }, 20);
	  
    } catch (err) {
      console.error("Distance lookup failed:", err);
      alert("Distance lookup failed. Please check the address and try again.");
    } finally {
      setIsCalculatingMileage(false);          
    }
  };

  const checkAvailability = async (selectedDate) => {
    if (!selectedDate || cart.length === 0) return;
    setIsChecking(true);
    setAvailabilityStatus({ type: "loading", text: "Checking availability..." });

    try {
      const itemTitles = cart.map(item => item.title || item.name);
      const res = await axios.post("https://buzzys-backend.onrender.com/book/check-availability/", {
        date: selectedDate,
        items: itemTitles
      });

      if (res.data.available) {
        setAvailabilityStatus({ type: "success", text: "Success! Your gear is available! ✅" });
      } else {
        setAvailabilityStatus({ type: "error", text: "One or more items are unavailable. Please try another day!" });
      }
    } catch (err) {
      setAvailabilityStatus({ type: "error", text: "Availability check failed." });
    } finally {
      setIsChecking(false);
    }
  };

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

  const handleOrganizationChange = (event) => {
    setOrganizationType(event.target.value);
  };

  useEffect(() => {
    if (formData.date && cart.length > 0) {
      checkAvailability(formData.date);
    }
  }, [cart.length, formData.date]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!agreed) return alert("Please read and agree to the Rental Agreement.");
    if (signature.trim().length < 3) return alert("Please enter your signature.");
    if (!formData.date) return alert("Please select a party date!");
    if (availabilityStatus.type === "error") return alert("Some items are unavailable.");
    if (distance === null) return alert("Please confirm the delivery address to calculate mileage.");

    setLoading(true);
    try {
      const finalCart = cart.map(item => ({
        ...item,
        price: parseFloat(item.price.toString().replace(/[^0-9.]/g, ""))
      }));

      const selectedSetupTypes = [
        ...new Set(
          finalCart
            .map((item) => item.mode)
            .filter((mode) => mode === "wet" || mode === "dry")
        ),
      ];
      const setupType =
        selectedSetupTypes.length === 1
          ? selectedSetupTypes[0]
          : selectedSetupTypes.length > 1
            ? "mixed"
            : "dry";

      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        setupType,
        mode: setupType,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        date: formData.date,
		surface: "grass",
        anchoring: formData.anchoring,
        referralType: organizationType,
        deliveryTime: formData.startTime,
        pickupTime: formData.pickupTime,
        items: finalCart,
        subtotal: finalTotal, // Stripe checkout total
        tax: salesTax,
        deposit: deposit,      // Always 75.00
        remaining: remainingBalance,
        waiverFee: waiverFee,
        damageWaiver: formData.damageWaiver,
        signature,
        saveCardForAutopay,
        discount,
        percentOff,
        mileageFee,
        distance
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

      <div className="seasonal-banner">
        <img src="/promo-banner.png" alt="Seasonal Promotion" className="seasonal-banner-img" />
      </div>

      <Link to="/catalog" className="continue-shopping-btn">← Continue Shopping</Link>

      {cart.length === 0 ? (
        <div className="empty-bubble-box">
          <p>Your cart is empty!</p>
          <button className="bubble-btn yellow" onClick={() => navigate('/catalog')}>Go Find Fun</button>
        </div>
      ) : (
        <div className="cart-bubble-layout">
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

          <form onSubmit={handleCheckout} className="bouncy-form-grid">
            {/* Logistics Panel */}
            <div className="bubble-panel">
              <h3 className="panel-header">1. Logistics 🏠</h3>
              <div className="bubble-input-group">
                <label>Full Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="bubble-row">
                <div className="bubble-input-group">
                  <label>Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="bubble-input-group">
                  <label>Phone *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="bubble-input-group">
                <label>Street Address *</label>
                <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>

              <div className="bubble-row">
                <div className="bubble-input-group">
                  <label>City *</label>
                  <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                </div>
                <div className="bubble-input-group">
                  <label>State *</label>
                  <input type="text" required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
                </div>
                <div className="bubble-input-group" style={{ flex: '0.4' }}>
                  <label>Zip *</label>
                  <input type="text" required value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} />
                </div>
              </div>
              
              <div style={{ marginTop: '10px', marginBottom: '20px' }}>
                <button type="button" className="bubble-btn yellow" onClick={handleConfirmAddress} disabled={isCalculatingMileage}>
                  {isCalculatingMileage ? "Confirming Address... 🐝" : "Click Here To Confirm Address"}
                </button> 
				<p className="confirm-helper-text">
				  We confirm your address to calculate delivery distance and ensure accurate pricing.
				</p>
              </div>

              <div className="bubble-input-group">
                <label>Party Date *</label>
                <input type="date" required min={new Date().toISOString().split("T")[0]} value={formData.date} 
                  onChange={(e) => { setFormData({...formData, date: e.target.value}); checkAvailability(e.target.value); }} />
                {availabilityStatus.text && <div className={`availability-status-msg ${availabilityStatus.type}`}>{availabilityStatus.text}</div>}
              </div>
			  <div className="bubble-input-group">
				<label>Setup Surface (Anchoring) *</label>
				<div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
				  <div
				    className={`anchoring-card ${formData.anchoring === 'Stakes' ? 'active' : ''}`}
					onClick={() => setFormData({...formData, anchoring: 'Stakes'})}
					style={{
					  flex: 1,
					  padding: '12px',
					  borderRadius: '15px',
					  border: `3px solid ${formData.anchoring === 'Stakes' ? '#FFD700' : '#f0f0f0'}`,
					  background: formData.anchoring === 'Stakes' ? '#FFF9C4' : '#ffffff',
					  textAlign: 'center',
					  cursor: 'pointer',
					  transition: '0.2s all'
					}}
				>
                    <span style={{ fontSize: '20px' }}> Stakes</span>
					<div style={{ fontWeight: 'bold', fontSize: '14px' }}> </div>
				</div>
				
				<div
				  className={`anchoring-card ${formData.anchoring === 'Sand Bags' ? 'active' : ''}`}
				  onClick={() => setFormData({...formData, anchoring: 'Sand Bags'})}
				  style={{
					flex: 1,
					padding: '12px',
					borderRadius: '15px',
					border: `3px solid ${formData.anchoring === 'Sand Bags' ? '#FFD700' : '#f0f0f0'}`,
					background: formData.anchoring === 'Sand Bags' ? '#FFF9C4' : '#ffffff',
					textAlign: 'center',
					cursor: 'pointer',
					transition: '0.2s all'
				  }}
				>
				  <span style={{ fontSize: '20px' }}> </span>
				  <div style={{ fontWeight: 'bold', fontSize: '19.5px' }}> Sandbags</div>
				</div>
			</div>
		</div>	
              <div className="bubble-input-group">
			    <label style={{
				  lineHeight: '1.5',
				  display: 'block',
				  marginBottom: '10px',
				  fontWeight: 'bold',
				  color: '#333',
				  fontSize: '15px'
				}}>
                  Are you a School, Church or Organization? Please let us know. You may qualify for discounts! 🏢🏫
				</label>
				<div style={{ position: 'relative' }}>
				  <select
				    value={organizationType}
					onChange={handleOrganizationChange}
					style={{
					  width: '100%',
					  padding: '12px 16px',
                      borderRadius: '20px',
                      border: '2px solid #e0e0e0',
                      backgroundColor: '#f9f9f9',
                      fontSize: '16px',
                      color: '#444',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
					}}
					onFocus={(e) => {
					  e.target.style.borderColor = '#FFD700';
					  e.target.style.backgroundColor = '#fff';
					}}
					onBlur={(e) => {
					  e.target.style.borderColor = '#e0e0e0';
					  e.target.style.backgroundColor = '#f9f9f9';
					}}
				  >	
				    <option value="None">No, none of these 🎈</option>
					<option value="School">School 🏫</option>
					<option value="Church">Church ⛪</option>
					<option value="Organization">Non-Profit / Organization 🤝</option>
				  </select>
				  
                <div className="bubble-promo-input-wrapper">
                  <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter code..." />
                  <button type="button" className="bubble-btn-sm yellow" onClick={applyPromo}>Apply</button>
                </div>
                {promoMessage && <p className={`promo-status ${(discount + percentOff) > 0 ? 'success' : 'error'}`}>{promoMessage}</p>}
              </div>
              </div>

              <div className="bubble-row">
                <div className="bubble-input-group">
                  <label>Start Time *</label>
                  <select required value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})}>
                    <option value="">Choose...</option>
					<option value="06:00 AM">06:00 AM</option>
					<option value="07:00 AM">07:00 AM</option>
                    <option value="08:00 AM">08:00 AM</option>
					<option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
					<option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
					<option value="01:00 PM">01:00 PM</option>
					<option value="02:00 PM">02:00 PM</option>
					<option value="03:00 PM">03:00 PM</option>
					<option value="04:00 PM">04:00 PM</option>
					<option value="05:00 PM">05:00 PM</option>
					<option value="06:00 PM">06:00 PM</option>
					
                  </select>
                </div>
                <div className="bubble-input-group">
                  <label>Pickup Time *</label>
                  <select required value={formData.pickupTime} onChange={(e) => setFormData({...formData, pickupTime: e.target.value})}>
                    <option value="">Choose...</option>
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

            {/* Agreement & Pricing Panel */}
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
                <input type="checkbox" id="agree" required checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <label htmlFor="agree">I agree to the terms.</label>
              </div>

              <div className="bubble-input-group">
                <label>Electronic Signature</label>
                <input type="text" placeholder="Type name to sign" required value={signature} onChange={(e) => setSignature(e.target.value)} />
              </div>

              <div className="pricing-bubble">
                <div className="price-row"><span>Subtotal</span><span>${rawSubtotal.toFixed(2)}</span></div>
                <div className="price-row waiver">
                  <label><input type="checkbox" checked={formData.damageWaiver} onChange={() => setFormData(p => ({...p, damageWaiver: !p.damageWaiver}))}/> Waiver (8%)</label>
                  <span>${waiverFee.toFixed(2)}</span>
                </div>
                {(discount + percentDiscount) > 0 && (
                  <div className="price-row savings"><span>🎉 You saved</span><span>-${(discount + percentDiscount).toFixed(2)}</span></div>
                )}
                <div className="price-row"><span>Mileage Fee</span><span>${mileageFee.toFixed(2)}</span></div>
                <div className="price-row"><span>Sales Tax (GA 7%)</span><span>${salesTax.toFixed(2)}</span></div>
                <div className="price-divider" />
                <div className="price-row total"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
                <div className="price-row deposit"><span>Deposit Due Now</span><span>$75.00</span></div>
                <div className="price-row balance-due"><span>Balance Due</span><span>${remainingBalance.toFixed(2)}</span></div>

                <div className="autopay-toggle-container">
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                    <input type="checkbox" checked={saveCardForAutopay} onChange={(e) => setSaveCardForAutopay(e.target.checked)} />
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Enable Auto-Pay for the balance</span>
                  </label>
                </div>

                <button type="submit" className="bubble-pay-btn" disabled={loading || isChecking || !agreed || signature.length < 3 || availabilityStatus.type === "error"}>
                  {loading ? "Preparing..." : isChecking ? "Checking..." : `Book My Party!`}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
