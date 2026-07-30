import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for page routing
import {
  updateBookingStatus,
  addAdminNote,
  updateBookingDetails,
  createBooking,
} from "../../utils/adminApi";
import { deleteBookingById } from "../../utils/adminApi";
import "./AdminLayout.css";

export default function BookingModal({ booking, onClose, onUpdated }) {
  const navigate = useNavigate(); // Hook to redirect instead of closing a modal

  // 1. Identify if we are editing or creating
  const isExisting = !!(booking && (booking.booking_id || booking.id));
  const bookingId = isExisting ? (booking.booking_id || booking.id) : null;
	
  // 2. State management
  const [customerName, setCustomerName] = useState(booking?.name || booking?.customerName || "");
  const [customerEmail, setCustomerEmail] = useState(booking?.email || booking?.customerEmail || "");
  const [customerPhone, setCustomerPhone] = useState(booking?.phone || booking?.customerPhone || "");
  const [address, setAddress] = useState(booking?.address || "");
  const [eventDate, setEventDate] = useState(booking?.eventDate || booking?.date || "");
  const [deliveryTime, setDeliveryTime] = useState(booking?.deliveryTime || booking?.startTime || "");
  const [pickupTime, setPickupTime] = useState(booking?.pickupTime || booking?.endTime || "");
  
  // 🎯 Map this directly to read the "mode" field from your Firebase data
  const [setupType, setSetupType] = useState(booking?.mode || booking?.setupType || "dry");
  
  // 🔒 Locked storage for the original client preference
  const [originalMode] = useState((booking?.mode || "dry").toUpperCase());

  const [status, setStatus] = useState(booking?.status || "pending");
  const [note, setNote] = useState(booking?.adminNote || "");
  const [total, setTotal] = useState(booking?.total || 0);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const TIME_SLOTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"];

  // Sync state if booking prop updates (useful for admin list changes)
  useEffect(() => {
    if (isExisting) {
      setStatus(booking.status || "pending");
      setNote(booking.adminNote || "");
      setSetupType(booking.mode || booking.setupType || "dry");
    }
  }, [booking, isExisting]);
  
  async function deleteBooking(id) {
    return deleteBookingById(id);
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this booking? This cannot be undone.")) return;
    
    setDeleting(true);
    try {
      await deleteBooking(bookingId);
      alert("Booking deleted.");
      if (onUpdated) onUpdated();
      if (onClose) {
        onClose();
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete booking. Check your permissions.");
    } finally {
      setDeleting(false);
    }
  }

  // 3. Unified Save Function
  async function handleSave() {
    if (!customerName || !eventDate) {
      return alert("Customer Name and Event Date are required!");
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
      deliveryTime,
      pickupTime,
      setupType: setupType, // Keep for legacy/fallback support
      mode: setupType,      // 🎯 Saves directly to your main "mode" field in Firebase
      status,
      adminNote: note,
      items: booking?.items || [],
      total: Number(total),
      source: isExisting ? (booking.source || "Web") : "In-Person/Admin",
    };

    setSaving(true);
    try {
      if (isExisting) {
        await updateBookingDetails(bookingId, payload);
        await updateBookingStatus(bookingId, status);
        alert("Booking updated successfully!");
      } else {
        await createBooking(payload);
        alert("New in-person booking created!");
      }
      
      if (onUpdated) onUpdated(); 
      
      // Redirect back to the main admin schedule/dashboard post-execution
      navigate("/admin/dashboard");   
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save booking.");
    } finally {
      setSaving(false);
    }
  }

  // Handle cross exit navigation safely
  const handleCloseRedirect = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="admin-page-container" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div className="modal" style={{ boxShadow: "none", border: "1px solid #e3e6e8", position: "relative" }}>
        <div className="modal-header">
          <h2>{isExisting ? "Edit Booking Details" : "Create In-Person Order"}</h2>
          <button className="close-x" onClick={handleCloseRedirect}>&times;</button>
        </div>

        <div className="modal-body">
          {/* Section: Customer Basics */}
          <div className="modal-section">
            <label>Customer Name</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            
            <label>Email</label>
            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
            
            <label>Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          {/* Section: Logistics */}
          <div className="row-flex" style={{ gap: '10px', marginTop: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>Event Date</label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Total Price ($)</label>
              <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
            </div>
          </div>

          <div className="row-flex" style={{ gap: '10px', marginTop: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>Delivery</label>
              <select value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)}>
                <option value="">Select Time</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Pickup</label>
              <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
                <option value="">Select Time</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* 🔒 LOCKED ORIGINAL SELECTION PANEL */}
          {isExisting && (
            <div 
              style={{
                marginTop: "20px",
                padding: "12px",
                background: "#f4f5f7",
                borderRadius: "6px",
                borderLeft: `4px solid ${originalMode === "WET" ? "#026aa7" : "#36b37e"}`,
                fontSize: "0.9rem"
              }}
            >
              <strong>🛒 Original Customer Choice:</strong>{" "}
              <span style={{ fontWeight: "bold", color: originalMode === "WET" ? "#026aa7" : "#228b22" }}>
                {originalMode} SETUP
              </span>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6b778c" }}>
                This is a protected record of the customer's choice at checkout. Use the switches below to overwrite logistics if needed.
              </p>
            </div>
          )}

          <label style={{ marginTop: '15px', display: 'block' }}>Setup Preference</label>
          <div className="setup-toggle-group">
            <button 
              type="button"
              className={`toggle-btn ${setupType === 'dry' ? 'active-dry' : ''}`} 
              onClick={() => setSetupType('dry')}
            >☀️ Dry Setup</button>
            <button 
              type="button"
              className={`toggle-btn ${setupType === 'wet' ? 'active-wet' : ''}`} 
              onClick={() => setSetupType('wet')}
            >🌊 Wet Setup</button>
          </div>

          <hr className="modal-divider" />

          {/* Section: Status & Notes */}
          <div className="admin-actions">
            <label><strong>Order Status</strong></label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginBottom: '15px' }}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <label><strong>Admin Notes (Internal)</strong></label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Staff notes here..."
              style={{ width: '100%', minHeight: '80px', padding: '10px' }}
            />

            <button 
              className="admin-btn-primary" 
              onClick={handleSave} 
              disabled={saving}
              style={{ width: '100%', padding: '12px', marginTop: '20px' }}
            >
              {saving ? "Processing..." : (isExisting ? "Save All Changes" : "Create Order")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
