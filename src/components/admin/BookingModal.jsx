import React, { useState, useEffect } from "react";
import {
  updateBookingStatus,
  addAdminNote,
} from "../../utils/adminApi";

export default function BookingModal({ booking, onClose, onUpdated }) {
  // Use booking_id if available, otherwise fallback to id
  const bookingId = booking.booking_id || booking.id;

  // Normalized fallbacks for display
  const resolvedDate =
    booking.date ||
    booking.eventDate ||
    booking.partyDate ||
    booking.selectedDate ||
    booking.bookingDate ||
    booking.reservationDate ||
    "TBD";

  const resolvedDeliveryTime =
    booking.deliveryTime ||
    booking.dropoffTime ||
    booking.startTime ||
    booking.delivery ||
    booking.setupTime ||
    "TBD";

  const resolvedPickupTime =
    booking.pickupTime ||
    booking.endTime ||
    booking.tearDownTime ||
    booking.pickup ||
    "TBD";

  // States
  const [status, setStatus] = useState(booking.status || "pending");
  const [note, setNote] = useState(booking.adminNote || "");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Keep internal state in sync if the booking prop changes
  useEffect(() => {
    setStatus(booking.status || "pending");
    setNote(booking.adminNote || "");
  }, [booking]);

  async function handleStatusUpdate() {
    if (!bookingId) return alert("Error: Missing Booking ID");
    setIsUpdatingStatus(true);
    try {
      await updateBookingStatus(bookingId, status);
      onUpdated(); 
      onClose();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleAddNote() {
    if (!bookingId) return alert("Error: Missing Booking ID");
    setIsSavingNote(true);
    try {
      await addAdminNote(bookingId, note);
      onUpdated();
      alert("Note saved successfully!");
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to save note. Check your connection.");
    } finally {
      setIsSavingNote(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Booking Details</h2>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <p><strong>Customer:</strong> {booking.name || booking.customerName || "N/A"}</p>
          <p><strong>Email:</strong> {booking.email || booking.customerEmail || "N/A"}</p>
          <p><strong>Date:</strong> {resolvedDate}</p>
          <p><strong>Delivery Time:</strong> {resolvedDeliveryTime}</p>
          <p><strong>Pickup Time:</strong> {resolvedPickupTime}</p>

          <p><strong>Item(s):</strong> {
            booking.items && booking.items.length > 0 
              ? booking.items.map(i => i.title || i.name).join(", ") 
              : (booking.item || "No items listed")
          }</p>

          <p><strong>Address:</strong> {booking.address || "No address provided"}</p>
          <p><strong>Total:</strong> ${Number(booking.total || 0).toFixed(2)}</p>

          {/* Customer-facing notes from the original booking */}
          {booking.notes && (
            <div className="customer-notes">
              <p><strong>Customer Note:</strong> {booking.notes}</p>
            </div>
          )}

          <hr />

          <div className="admin-actions">
            <label><strong>Status</strong></label>
            <div className="status-row">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button 
                className="admin-btn-primary" 
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Updating..." : "Update Status"}
              </button>
            </div>

            <hr />

            <label><strong>Admin Notes (Internal)</strong></label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add internal staff notes here..."
              style={{ width: '100%', minHeight: '100px', marginTop: '10px', padding: '10px' }}
            />

            <button 
              className="admin-btn-primary" 
              onClick={handleAddNote} 
              disabled={isSavingNote || note === booking.adminNote}
              style={{ marginTop: '10px' }}
            >
              {isSavingNote ? "Saving..." : "Save Admin Note"}
            </button>
          </div>
        </div>

        <button className="close-btn" onClick={onClose} style={{ marginTop: '20px' }}>
          Close Window
        </button>
      </div>
    </div>
  );
}