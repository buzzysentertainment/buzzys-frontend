import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 👈 Added for your backend lookups

// 1. IMPORT YOUR FIREBASE MODULES 🚀
import { db } from "../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { PRICES } from "../data/prices";
// 👈 Import your existing mileage utility helpers just like in Cart.jsx
import { BUSINESS_ADDRESS, calculateMileageFee, roundMiles } from "../utils/mileage";

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export default function QuoteRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Standalone states matching your Cart.jsx setup
  const [distance, setDistance] = useState(0); 
  const [mileageFee, setMileageFee] = useState(0);
  const [isCalculatingMileage, setIsCalculatingMileage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orgName: "", 
    orgType: "School", 
    date: "",
    address: "",
    city: "",
    state: "", 
    zip: "",
    startTime: "",
    pickupTime: "",
    anchoring: "Stakes",
    selectedItem: "",
    rentType: "", 
    notes: ""
  });

  const inventoryList = Object.entries(PRICES || {}).map(([key, value]) => {
    const fallbackName = key
      .replace(/([A-Z0-9])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    return {
      id: key,
      displayName: value.title || value.name || value.heading || fallbackName,
    };
  });

  // 👈 Added: Your exact automated mileage API handler ported from Cart.jsx
  const handleConfirmAddress = async () => {
    const { address, city, state, zip } = formData;
    if (!address || !city || !state || !zip) {
      alert("Please fill out the full address, city, state, and zip first! 🏠");
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
	  }, 10);
    } catch (err) {
      console.error("Distance lookup failed:", err);
      alert("Distance lookup failed. Please check the address and try again.");
    } finally {
      setIsCalculatingMileage(false);          
    }
  };

  // 2. FIREBASE SUBMISSION HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const safe = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, escapeHtml(value)])
      );
      const emailPayload = {
        to: "buzzysentertainment@gmail.com", 
        replyTo: formData.email,              
        message: {
          subject: `📋 New Custom Quote: ${formData.orgName ? formData.orgName : formData.name} - ${formData.date}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; border: 2px solid #ffcc00; padding: 20px; border-radius: 15px;">
              <h2 style="color: #222; border-bottom: 2px solid #ffcc00; padding-bottom: 10px;">🐝 Website Quote Application</h2>
              <p><strong>Name:</strong> ${safe.name}</p>
              <p><strong>Email:</strong> ${safe.email}</p>
              <p><strong>Phone:</strong> ${safe.phone}</p>
              <p><strong>Organization:</strong> ${safe.orgName || "N/A"} (${safe.orgType})</p>
              <p><strong>Address:</strong> ${safe.address}, ${safe.city}, ${safe.state} ${safe.zip}</p>
              
              <p><strong>Calculated Distance:</strong> ${distance} miles</p>
              <p><strong>Est. Mileage Fee:</strong> $${mileageFee.toFixed(2)}</p>
              
              <p><strong>Date / Time:</strong> ${safe.date} (${safe.startTime} - ${safe.pickupTime})</p>
              <p><strong>Surface Setup:</strong> ${safe.anchoring}</p>
              <p><strong>Setup Mode:</strong> <span style="color: #00a6ff; font-weight: bold; text-transform: uppercase;">${safe.rentType}</span></p> 
              <div style="background: #fdfae6; padding: 12px; border-radius: 8px; border-left: 5px solid #ffcc00; font-size: 16px; font-weight: bold; margin-top: 15px;">
                Requested Inflatable: ${safe.selectedItem}
              </div>
              <p style="background: #f9f9f9; padding: 12px; border-radius: 8px; font-style: italic; margin-top: 15px;">
                <strong>Notes:</strong> ${safe.notes || "None"}
              </p>
            </div>
          `
        },
        formDataBackup: {
          ...formData,
          calculatedDistance: distance, // 👈 Save numerical logs directly inside your document records
          appliedMileageFee: mileageFee,
          submittedAt: serverTimestamp()
        }
      };

      await addDoc(collection(db, "mail"), emailPayload);
      setSubmitted(true);
    } catch (err) {
      console.error("Firebase quote document creation failed:", err);
      alert("Something went wrong processing your quote. Please try again or give us a buzz directly! 🐝");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '50px 30px', background: '#fff', borderRadius: '25px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '32px', color: '#333', marginBottom: '15px' }}>Quote Request Sent! 📋✨</h2>
        <p style={{ fontSize: '18px', margin: '15px 0', color: '#555' }}>Thank you, {formData.name}. Your details have been transmitted directly to the owner.</p>
        <p style={{ color: '#777', lineHeight: '1.6' }}>We will look over your location data, calculate delivery steps, apply any relevant organizational discounts or tax exemptions, and email you a custom payment link shortly!</p>
        <button className="btn-book" style={{ marginTop: '25px', border: 'none', cursor: 'pointer' }} onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#222' }}>Request a Custom Quote 📋</h2>
        <p style={{ fontSize: '16px', color: '#666', marginTop: '5px' }}>Fill out your event logistics below, and the owner will build your custom rate sheet.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '30px', background: '#fff', borderRadius: '25px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
        
        {/* 1. Contact Info Group */}
        <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '5px', marginBottom: '15px', color: '#444', fontWeight: '700' }}>1. Contact Details</h3>
        <div className="bubble-input-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name *</label>
          <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} />
        </div>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <div className="bubble-input-group" style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address *</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} />
          </div>
          <div className="bubble-input-group" style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number *</label>
            <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <div className="bubble-input-group" style={{ flex: '2 1 250px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Organization Name <span style={{ fontWeight: 'normal', color: '#999' }}>(Optional)</span></label>
            <input type="text" value={formData.orgName} onChange={(e) => setFormData({...formData, orgName: e.target.value})} placeholder="e.g. First Baptist Church, Local Elementary" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} />
          </div>
          <div className="bubble-input-group" style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Organization Type</label>
            <select value={formData.orgType} onChange={(e) => setFormData({...formData, orgType: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc', height: '42px' }}>
              <option value="School">School / University</option>
              <option value="Church">Church / Religious</option>
              <option value="Corporate">Corporate / Business</option>
              <option value="Private Large Event">Private Large Event / Other</option>
            </select>
          </div>
        </div>

        {/* 2. Logistics & Full Address Section */}
        <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '5px', marginBottom: '15px', marginTop: '30px', color: '#444', fontWeight: '700' }}>2. Event Location & Delivery Details</h3>
        
        <div className="bubble-input-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Street Address *</label>
          <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <div className="bubble-input-group" style={{ flex: '2 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City *</label>
            <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} />
          </div>
          <div className="bubble-input-group" style={{ flex: '1 1 80px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>State *</label>
            <input type="text" required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} />
          </div>
          <div className="bubble-input-group" style={{ flex: '1 1 100px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Zip Code *</label>
            <input type="text" required value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} />
          </div>
        </div>

        {/* 👈 Added: Your exact automated validation layout matching Cart.jsx */}
        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
          <button type="button" className="bubble-pay-btn" onClick={handleConfirmAddress} disabled={isCalculatingMileage} style={{ background: '#ffcc00', color: '#222', padding: '10px 20px', borderRadius: '10px', width: 'auto', display: 'inline-block' }}>
            {isCalculatingMileage ? "Confirming Address... 🐝" : "Click Here To Confirm Address"}
          </button> 
          {distance > 0 && (
            <span style={{ marginLeft: '15px', fontWeight: 'bold', fontSize: '15px', color: '#333' }}>
              📍 Route Verified: {distance} Miles away ($${mileageFee.toFixed(2)} travel rate)
            </span>
          )}
          <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>We confirm your address to calculate delivery distance and ensure accurate routing step records.</p>
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <div className="bubble-input-group" style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Party Date *</label>
            <input type="date" required min={new Date().toISOString().split("T")[0]} value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} />
          </div>
          <div className="bubble-input-group" style={{ flex: '1 1 120px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Start Time *</label>
            <input type="text" placeholder="e.g. 10:00 AM" required value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} />
          </div>
          <div className="bubble-input-group" style={{ flex: '1 1 120px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Pickup Time *</label>
            <input type="text" placeholder="e.g. 06:00 PM" required value={formData.pickupTime} onChange={(e) => setFormData({...formData, pickupTime: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }} />
          </div>
        </div>

        {/* 3. Inflatable Dropdown Section */}
        <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '5px', marginBottom: '15px', marginTop: '30px', color: '#444', fontWeight: '700' }}>3. Gear Selection</h3>
        
        {/* Inflatable Picker */}
        <div className="bubble-input-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Inflatable of Interest *</label>
          <select 
            required 
            value={formData.selectedItem} 
            onChange={(e) => setFormData({...formData, selectedItem: e.target.value})} 
            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc', height: '42px' }}
          >
            <option value="">Select an inflatable...</option>
            {inventoryList.map((item, idx) => (
              <option key={idx} value={item.displayName}>
                {item.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* Wet or Dry Preference Dropdown */}
        <div className="bubble-input-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Setup Preference *</label>
          <select 
            required 
            value={formData.rentType} 
            onChange={(e) => setFormData({...formData, rentType: e.target.value})} 
            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc', height: '42px' }}
          >
            <option value="">Select setup type...</option>
            <option value="dry"> Dry Setup</option>
            <option value="wet"> Wet Setup (Water Added)</option>
          </select>
        </div>

        {/* Surface Anchor Selection */}
        <div className="bubble-input-group" style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Setup Surface Setup *</label>
          <select value={formData.anchoring} onChange={(e) => setFormData({...formData, anchoring: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc', height: '42px' }}>
            <option value="Stakes">Grass Setup (Stakes Needed)</option>
            <option value="Sandbags">Pavement, Asphalt, or Indoor Setup (Sandbags Needed)</option>
          </select>
        </div>

        {/* Notes Textarea */}
        <div className="bubble-input-group" style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Special Instructions, Tax Exemption IDs, or Timeline Demands 📝</label>
          <textarea 
            rows="4" 
            placeholder="Let the owner know if your school needs a specific delivery slot window or if your church is completely tax exempt..."
            value={formData.notes} 
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            style={{ width: '100%', borderRadius: '15px', padding: '12px', border: '1px solid #ccc', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="bubble-pay-btn" style={{ width: '100%', marginTop: '20px', padding: '15px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }} disabled={loading || isCalculatingMileage}>
          {loading ? "Sending securely to owner... 🐝" : "Submit My Quote Application"}
        </button>

      </form>
    </div>
  );
}
