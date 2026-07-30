import React, { useState, useEffect } from "react";
import { createBooking } from "../../utils/adminApi";
import { PRODUCTS } from "../../data/products"; // Adjust this path if your files are structured differently
import "./AdminLayout.css";
import { useNavigate } from "react-router-dom";

export default function CreateBookingModal({ onClose, onUpdated }) {
  const navigate = useNavigate();
  // --- Form Field State ---
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [setupType, setSetupType] = useState("dry"); // 'dry' or 'wet'
  const [anchoring, setAnchoring] = useState("Stakes");
  const [paymentMethod, setPaymentMethod] = useState("Cash"); // Card, Cash, Check, Fundraiser
  const [status, setStatus] = useState("confirmed"); // Default to confirmed for internal manual entries
  const [adminNotes, setAdminNotes] = useState("");
  
  // --- Inventory State ---
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);
  
  // --- Global Status State ---
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const TIME_SLOTS = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
  ];

  // Recalculate price automatically whenever items or setup style changes
  useEffect(() => {
    let calculatedTotal = 0;
    const updatedItems = selectedItems.map((item) => {
      const productSource = PRODUCTS.find((p) => p.name === item.title);
      if (productSource) {
        const updatedPrice = productSource.price !== undefined
          ? productSource.price
          : (setupType === "wet" ? productSource.wetPrice : productSource.dryPrice) || 0;
        calculatedTotal += updatedPrice;
        return { ...item, price: updatedPrice, mode: setupType };
      }
      calculatedTotal += Number(item.price || 0);
      return { ...item, mode: setupType };
    });
    const itemsChanged = updatedItems.some(
      (item, index) =>
        item.price !== selectedItems[index]?.price ||
        item.mode !== selectedItems[index]?.mode
    );
    if (itemsChanged) setSelectedItems(updatedItems);
    setTotal(calculatedTotal);
  }, [selectedItems, setupType]);

  // Dropdown inclusion handler
  const handleDropdownSelect = (e) => {
    const selectedProductName = e.target.value;
    if (!selectedProductName) return;

    // Don't add duplicates
    if (selectedItems.some(item => item.title === selectedProductName)) {
      e.target.value = ""; // Reset dropdown
      return;
    }

    const product = PRODUCTS.find(p => p.name === selectedProductName);
    if (product) {
      const activePrice = product.price !== undefined 
        ? product.price 
        : (setupType === "wet" ? product.wetPrice : product.dryPrice) || 0;

      setSelectedItems([
        ...selectedItems,
        {
          title: product.name,
          name: product.name,
          price: activePrice,
          mode: setupType,
        }
      ]);
    }
    e.target.value = ""; // Reset dropdown view back to placeholder text
  };

  const removeItem = (indexToRemove) => {
    setSelectedItems(selectedItems.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async () => {
    setError(null);
    if (!customerName || !eventDate) {
      alert("Customer Name and Party Date are required!");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please select at least one item from the inventory dropdown!");
      return;
    }

    const payload = {
      customerName,
      customerEmail,
      customerPhone,
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      address,
      eventDate,
      date: eventDate,
      deliveryTime,
      pickupTime,
      setupType,
      mode: setupType,
      anchoring,
      paymentStatus: `Paid via ${paymentMethod}`,
      status,
      adminNotes,
      adminNote: adminNotes, // backwards-compatible matching logic field
      items: selectedItems,
      total: Number(total),
      source: "Manual In-Person Entry",
      createdAt: new Date().toISOString(),
    };

    setSaving(true);
    try {
      await createBooking(payload);
      alert("In-person booking built and successfully created!");
      if (onUpdated) onUpdated();
      if (onClose) onClose();
      else navigate("/admin/dashboard");
    } catch (err) {
      console.error("Booking generation failed:", err);
      setError(err.message || "Failed to finalize new manual invoice entry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-container">
        
        {/* HEADER */}
        <div className="admin-page-header">
          <div className="header-brand-group">
            <img src="/images/buzzybuzzybee.png" alt="Buzzy Logo" className="modal-logo-img" />
            <div className="header-text-info">
              <h3>Create In-Person Order</h3>
              <span className="modal-id-badge" style={{ background: "#4f46e5" }}>Internal Console</span>
            </div>
          </div>
          <button className="header-close-btn" onClick={() => onClose ? onClose() : navigate("/admin/dashboard")}>&times;</button>
        </div>

        {/* CONTENT */}
        <div className="admin-modal-content admin-page-scroll">
          {error && (
            <div style={{ color: "#b91c1c", backgroundColor: "#fef2f2", borderLeft: "4px solid #ef4444", padding: "12px", marginBottom: "15px", borderRadius: "4px" }}>
              ⚠️ {error}
            </div>
          )}

          {/* CUSTOMER PROFILE */}
          <div className="admin-card">
            <h4>Customer Profile Info</h4>
            <div className="modal-edit-field">
              <label>Customer Full Name</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. John Doe" />
            </div>
            <div className="modal-edit-field">
              <label>Email Address</label>
              <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="name@domain.com" />
            </div>
            <div className="modal-edit-field">
              <label>Phone Number</label>
              <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="555-555-5555" />
            </div>
            <div className="modal-edit-field">
              <label>Delivery Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full street address, city, state & zip" />
            </div>
          </div>

          {/* LOGISTICS & SCHEDULING */}
          <div className="admin-card">
            <h4>Scheduling & Environment Settings</h4>
            <div className="modal-edit-field">
              <label>Party Date</label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div className="modal-edit-field">
              <label>Drop-Off / Delivery Time</label>
              <select value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="admin-modal-select">
                <option value="">Select Drop-off Time</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="modal-edit-field">
              <label>Pick-Up Time</label>
              <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="admin-modal-select">
                <option value="">Select Pick-up Time</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            
            <div className="modal-edit-field">
              <label>Setup Setup Preference</label>
              <div className="setup-toggle-group">
                <button type="button" className={`toggle-btn ${setupType === "dry" ? "active-dry" : ""}`} onClick={() => setSetupType("dry")}>☀️ Dry Setup</button>
                <button type="button" className={`toggle-btn ${setupType === "wet" ? "active-wet" : ""}`} onClick={() => setSetupType("wet")}>🌊 Wet Setup</button>
              </div>
            </div>

            <div className="modal-edit-field">
              <label>Anchoring Method</label>
              <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <input type="radio" name="create-anchoring" value="Stakes" checked={anchoring === "Stakes"} onChange={(e) => setAnchoring(e.target.value)} style={{ marginRight: "8px" }} /> Stakes
                </label>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                  <input type="radio" name="create-anchoring" value="Sand Bags" checked={anchoring === "Sand Bags"} onChange={(e) => setAnchoring(e.target.value)} style={{ marginRight: "8px" }} /> Sand Bags
                </label>
              </div>
            </div>
          </div>

          {/* INVENTORY ASSETS SELECTION DROPDOWN */}
          <div className="admin-card">
            <h4>Select Inflatable Equipment</h4>
            <div className="modal-edit-field">
              <label>Add Inflatables & Add-ons to Order</label>
              <select onChange={handleDropdownSelect} className="admin-modal-select" defaultValue="">
                <option value="" disabled>--- Click to Select Inventory Equipment ---</option>
                {PRODUCTS.map((prod) => {
                  const itemPrice = prod.price !== undefined 
                    ? prod.price 
                    : (setupType === "wet" ? prod.wetPrice : prod.dryPrice) || 0;
                  return (
                    <option key={prod.id} value={prod.name}>
                      {prod.name} (${itemPrice}.00)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* List Manifest Area */}
            {selectedItems.length > 0 && (
              <div style={{ marginTop: "15px", backgroundColor: "#f8fafc", borderRadius: "6px", padding: "10px", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#64748b", textTransform: "uppercase" }}>Current Line Manifest</span>
                <ul style={{ margin: "5px 0 0 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {selectedItems.map((item, idx) => (
                    <li key={idx} style={{ fontSize: "0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{item.title} - <strong>${item.price}.00</strong></span>
                      <button type="button" onClick={() => removeItem(idx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem" }}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* PAYMENT METHOD & INTERNAL ACCOUNTING */}
          <div className="admin-card">
            <h4>Payment & Accounting Ledger</h4>
            
            <div className="modal-edit-field">
              <label>Payment Classification Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="admin-modal-select">
                <option value="Cash">💵 Cash Order</option>
                <option value="Card">💳 Credit / Debit Card</option>
                <option value="Check">📝 Check Payment</option>
                <option value="Fundraiser">🏫 Fundraiser / Institutional Comp</option>
              </select>
            </div>

            <div className="modal-edit-field">
              <label>System Dispatch Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-modal-select">
                <option value="pending">Pending Hold</option>
                <option value="confirmed">Confirmed / Locked</option>
                <option value="active">Active Dispatch</option>
                <option value="completed">Completed Manifest</option>
              </select>
            </div>

            <div className="modal-edit-field">
              <label>Total Combined Billable Gross ($)</label>
              <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} style={{ fontWeight: "bold", fontSize: "1.1rem" }} />
            </div>

            <div className="modal-edit-field">
              <label>Internal Staff Administration Notes</label>
              <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Type unique deployment requests, discount info, setup instructions, etc..." />
            </div>
          </div>

          {/* FORM TERMINATION CONTROLS */}
          <div className="admin-card">
            <h4>Execute Operations</h4>
            <button className="modal-btn modal-btn-save" style={{ width: "100%", padding: "14px", fontWeight: "bold" }} onClick={handleSave} disabled={saving}>
              {saving ? "Generating Manifest Entry..." : `Finalize & Create Order ($${Number(total).toFixed(2)})`}
            </button>
            <div className="modal-footer-actions" style={{ marginTop: "15px" }}>
              <button className="modal-btn modal-btn-close" style={{ width: "100%" }} onClick={() => onClose ? onClose() : navigate("/admin/dashboard")}>
                Cancel Generation
              </button>
            </div>
			<div style={{ marginTop: "15px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px" }}>
			  <button
			    type="button"
				className="modal-btn"
				style={{ width: "100%", background: "rgba(255, 255, 255, 0.08)", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.2)" }}
				onClick={() => navigate("/admin/dashboard")}
			  >
			    ← Back to Dashboard
			  </button>
			</div>
          </div>

        </div>
      </div>
    </div>
  );
}
