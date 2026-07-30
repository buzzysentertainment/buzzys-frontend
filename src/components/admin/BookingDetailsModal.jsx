import { useState, useRef, useEffect } from "react";
import "./BookingDetailsModal.css";
import {
  updateBookingStatus,
  addAdminNote,
  deleteBookingById,
  updateBookingDetails, // ⭐ NEW API CALL
} from "../../utils/adminApi";

export default function BookingDetailsModal({
  booking,
  onClose,
  onUpdated,
  mode = "modal",
}) {
  const [status, setStatus] = useState(booking.status);
  const [note, setNote] = useState(booking.adminNote || "");
  const [saving, setSaving] = useState(false);

  // ⭐ Editable booking fields
  const [eventDate, setEventDate] = useState(
    booking.eventDate || booking.date || ""
  );
  const [deliveryTime, setDeliveryTime] = useState(
    booking.deliveryTime || booking.startTime || ""
  );
  const [pickupTime, setPickupTime] = useState(
    booking.pickupTime || booking.endTime || ""
  );
  const [customerName, setCustomerName] = useState(
    booking.customerName || booking.name || ""
  );
  const [customerEmail, setCustomerEmail] = useState(
    booking.customerEmail || booking.email || ""
  );
  const [customerPhone, setCustomerPhone] = useState(
    booking.customerPhone || booking.phone || ""
  );
  const [address, setAddress] = useState(booking.address || "");

  const modalRef = useRef(null);
  const dragData = useRef({ offsetX: 0, offsetY: 0 });

  // ⭐ Time slots for dropdowns
  const TIME_SLOTS = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
    "11:00 PM",
  ];

  // --- FIELD ALIASES ---
  const resolvedItems =
    booking.items && booking.items.length > 0
      ? booking.items.map((i) => i.title || i.name).join(", ")
      : booking.item || "—";
  const pricingBreakdown = booking.pricing_breakdown || {};
  const pricingSubtotal =
    pricingBreakdown.subtotal ??
    booking.subtotal ??
    (booking.items || []).reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );
  const pricingTax = pricingBreakdown.tax ?? booking.tax ?? 0;
  const pricingTotal = pricingBreakdown.total ?? booking.total ?? 0;
  const pricingDeposit = pricingBreakdown.deposit ?? booking.deposit ?? 0;
  const paymentStatus = String(booking.paymentStatus || "").toLowerCase();
  const explicitAmountPaid =
    booking.amountPaid ?? booking.paidAmount ?? booking.paymentAmount;
  const amountPaid =
    explicitAmountPaid !== undefined && explicitAmountPaid !== null
      ? Number(explicitAmountPaid)
      : ["balance_paid", "paid", "paid_in_full"].includes(paymentStatus)
        ? Number(pricingTotal)
        : ["deposit_paid", "confirmed"].includes(paymentStatus)
          ? Number(pricingDeposit)
          : 0;

  function formatDisplayDate(dateString) {
    if (!dateString) return "TBD";
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }

  // --- ESCAPE KEY CLOSE ---
  useEffect(() => {
    if (mode !== "modal") return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, mode]);

  // --- DRAG LOGIC ---
  const startDrag = (e) => {
    if (mode !== "modal") return;
    const modal = modalRef.current;
    if (!modal) return;

    const rect = modal.getBoundingClientRect();
    dragData.current.offsetX = e.clientX - rect.left;
    dragData.current.offsetY = e.clientY - rect.top;

    modal.style.transform = "none";
    modal.style.left = `${rect.left}px`;
    modal.style.top = `${rect.top}px`;

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const onDrag = (e) => {
    if (mode !== "modal") return;
    const modal = modalRef.current;
    if (!modal) return;
    modal.style.left = `${e.clientX - dragData.current.offsetX}px`;
    modal.style.top = `${e.clientY - dragData.current.offsetY}px`;
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  // --- API ACTIONS ---
  const updateStatus = async () => {
    setSaving(true);
    try {
      await updateBookingStatus(booking.booking_id || booking.id, status);
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const saveNote = async () => {
    setSaving(true);
    try {
      await addAdminNote(booking.booking_id || booking.id, note);
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Note save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // ⭐ Save booking details
  const saveBookingDetails = async () => {
    setSaving(true);
    try {
      await updateBookingDetails(booking.booking_id || booking.id, {
        eventDate,
        deliveryTime,
        pickupTime,
        customerName,
        customerEmail,
        customerPhone,
        address,
      });

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Booking update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteBooking = async () => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    setSaving(true);
    try {
      await deleteBookingById(booking.booking_id || booking.id);
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={
        mode === "modal" ? "admin-modal-overlay" : "admin-page-wrapper"
      }
      onClick={mode === "modal" ? onClose : undefined}
    >
      <div
        className={
          mode === "modal" ? "admin-modal" : "admin-page-container"
        }
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          className={
            mode === "modal"
              ? "admin-modal-header drag-handle"
              : "admin-page-header"
          }
          onMouseDown={mode === "modal" ? startDrag : undefined}
        >
          <div className="header-brand-group">
            <img
              src="/images/buzzybuzzybee.png"
              alt="Buzzy Logo"
              className="modal-logo-img"
            />
            <div className="header-text-info">
              <h3>Booking Management</h3>
              <span className="modal-id-badge">
                ID: {(booking.id || "").slice(-6)}
              </span>
            </div>
          </div>

          <button className="header-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* CONTENT */}
        <div className="admin-modal-content">
          {/* ⭐ Editable Customer Info */}
          <div className="modal-edit-field">
            <label>Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="modal-edit-field">
            <label>Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>

          <div className="modal-edit-field">
            <label>Phone</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div className="modal-edit-field">
            <label>Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* ITEMS */}
          <div className="modal-items-box">
            <strong>Items:</strong>
            {(booking.items || []).length ? (
              <ul>
                {booking.items.map((item, index) => (
                  <li key={`${item.title || item.name || "item"}-${index}`}>
                    {item.title || item.name || "Unknown item"}
                    {["wet", "dry"].includes(String(item.mode).toLowerCase()) &&
                      ` — ${String(item.mode).toUpperCase()}`}
                  </li>
                ))}
              </ul>
            ) : <p>{resolvedItems}</p>}
          </div>

          <div className="modal-edit-field">
            <label>Mileage</label>
            <p>
              {booking.distance === undefined || booking.distance === null
                ? "Not recorded for this booking"
                : `${Number(booking.distance)} miles — $${Number(booking.mileageFee || 0).toFixed(2)} mileage fee`}
            </p>
          </div>

          {/* ⭐ Editable Schedule */}
          <div className="modal-edit-field">
            <label>Party Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>

          <div className="modal-edit-field">
            <label>Delivery Time</label>
            <select
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="admin-modal-select"
            >
              <option value="">Select time</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {!booking.overnight && (
            <div className="modal-edit-field">
              <label>Pickup Time</label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="admin-modal-select"
              >
                <option value="">Select time</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="modal-pricing-row">
            <strong>Subtotal:</strong>
            <span>${Number(pricingSubtotal).toFixed(2)}</span>
          </div>
          <div className="modal-pricing-row">
            <strong>Tax:</strong>
            <span>${Number(pricingTax).toFixed(2)}</span>
          </div>
          <div className="modal-pricing-row">
            <strong>Total:</strong>
            <span>${Number(pricingTotal).toFixed(2)}</span>
          </div>
          <div className="modal-pricing-row">
            <strong>Customer Paid:</strong>
            <span>${Number(amountPaid).toFixed(2)}</span>
          </div>

          <hr className="modal-divider" />

          {/* STATUS */}
          <div className="modal-action-section">
            <label>
              <strong>Update Status</strong>
            </label>
            <div className="action-row-flex">
              <select
                className="admin-modal-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                className="modal-btn modal-btn-save"
                onClick={updateStatus}
                disabled={saving}
              >
                {saving ? "..." : "Update"}
              </button>
            </div>
          </div>

          {/* NOTES */}
          <div className="modal-action-section" style={{ marginTop: "25px" }}>
            <label>
              <strong>Admin Internal Notes</strong>
            </label>
            <textarea
              className="admin-modal-textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add notes only visible to staff..."
            />
            <button
              className="modal-btn modal-btn-save"
              onClick={saveNote}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>

          {/* ⭐ SAVE BOOKING DETAILS */}
          <div className="modal-action-section" style={{ marginTop: "25px" }}>
            <label>
              <strong>Edit Booking Details</strong>
            </label>
            <button
              className="modal-btn modal-btn-save"
              onClick={saveBookingDetails}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* FOOTER */}
          <div className="modal-footer-actions">
            <button
              className="modal-btn modal-btn-danger"
              onClick={deleteBooking}
              disabled={saving}
            >
              Delete Booking
            </button>
            <button className="modal-btn modal-btn-close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
