import { useState, useEffect } from "react";
import "./BookingDetailsModal.css";
import "./AdminLayout.css";
import {
  updateBookingStatus,
  addAdminNote,
  deleteBookingById,
  updateBookingDetails,
} from "../../utils/adminApi";
import { db } from "../../firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

export default function BookingDetailsModal({
  booking,
  onClose,
  onUpdated,
}) {
  const [allBookings, setAllBookings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBooking, setCurrentBooking] = useState(null);

  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [eventDate, setEventDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [setupType, setSetupType] = useState("dry");
  const [anchoring, setAnchoring] = useState("Stakes");
  const [adminNotes, setAdminNotes] = useState("");

  const TIME_SLOTS = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
  ];

  const resolvedItems =
    currentBooking?.items && currentBooking.items.length > 0
      ? currentBooking.items.map((i) => i.title || i.name).join(", ")
      : currentBooking?.item || "—";

  // Load all bookings from Firestore and determine current index
  useEffect(() => {
    const initialId = booking?.booking_id || booking?.id || null;
    if (!initialId) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "bookings"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // If eventDate is missing, fall back to date for sorting consistency
        list.sort((a, b) => {
          const aDate = a.eventDate || a.date || "";
          const bDate = b.eventDate || b.date || "";
          if (aDate < bDate) return -1;
          if (aDate > bDate) return 1;
          // tie-breaker: createdAt if present
          const aCreated = a.createdAt || "";
          const bCreated = b.createdAt || "";
          if (aCreated < bCreated) return -1;
          if (aCreated > bCreated) return 1;
          return 0;
        });

        setAllBookings(list);

        let idx = list.findIndex(
          (b) => b.id === initialId || b.booking_id === initialId
        );

        // If not found in list (e.g. filtered), try direct fetch
        if (idx === -1) {
          try {
            const docRef = doc(db, "bookings", initialId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const fbBooking = { id: docSnap.id, ...docSnap.data() };
              list.push(fbBooking);
              list.sort((a, b) => {
                const aDate = a.eventDate || a.date || "";
                const bDate = b.eventDate || b.date || "";
                if (aDate < bDate) return -1;
                if (aDate > bDate) return 1;
                const aCreated = a.createdAt || "";
                const bCreated = b.createdAt || "";
                if (aCreated < bCreated) return -1;
                if (aCreated > bCreated) return 1;
                return 0;
              });
              setAllBookings([...list]);
              idx = list.findIndex(
                (b) => b.id === initialId || b.booking_id === initialId
              );
            }
          } catch (err) {
            console.error("Error fetching initial booking:", err);
          }
        }

        if (idx === -1) idx = 0;
        setCurrentIndex(idx);
        setCurrentBooking(list[idx] || null);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading bookings:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [booking]);

  // Sync editable fields when currentBooking changes
  useEffect(() => {
    if (!currentBooking) return;

    setStatus(currentBooking.status || "pending");
    setNote(currentBooking.adminNote || "");
    setEventDate(currentBooking.eventDate || currentBooking.date || "");
    setDeliveryTime(currentBooking.deliveryTime || currentBooking.startTime || "");
    setPickupTime(currentBooking.pickupTime || currentBooking.endTime || "");
    setCustomerName(currentBooking.customerName || currentBooking.name || "");
    setCustomerEmail(currentBooking.customerEmail || currentBooking.email || "");
    setCustomerPhone(currentBooking.customerPhone || currentBooking.phone || "");
    setAddress(currentBooking.address || "");
    const itemModes = (currentBooking.items || [])
      .map((item) => item.mode)
      .filter((mode) => mode === "wet" || mode === "dry");
    setSetupType(
      (itemModes.length
        ? (new Set(itemModes).size > 1 ? "mixed" : itemModes[0])
        : null) ||
      currentBooking.setupType ||
      currentBooking.mode ||
      "dry"
    );
    setAnchoring(currentBooking.anchoring || "Stakes");
    setAdminNotes(currentBooking.adminNotes || "");
  }, [currentBooking]);

  const getCurrentId = () =>
    currentBooking?.booking_id || currentBooking?.id || booking?.booking_id || booking?.id;

  // Save booking details
  const saveBookingDetails = async () => {
    const id = getCurrentId();
    if (!id) return;
    setSaving(true);
    try {
      await updateBookingDetails(id, {
        eventDate,
        deliveryTime,
        pickupTime,
        customerName,
        customerEmail,
        customerPhone,
        address,
        setupType,
        mode: setupType,
        items: (currentBooking.items || []).map((item) => ({
          ...item,
          mode: setupType === "mixed" ? item.mode : setupType,
        })),
        anchoring,
      });
      onUpdated && onUpdated();
    } catch (err) {
      console.error("Booking update error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Update status
  const updateStatus = async () => {
    const id = getCurrentId();
    if (!id) return;
    setSaving(true);
    try {
      await updateBookingStatus(id, status);
      onUpdated && onUpdated();
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Save admin notes
  const saveAdminNotesHandler = async () => {
    const id = getCurrentId();
    if (!id) return;
    setSaving(true);
    try {
      await addAdminNote(id, adminNotes);
      onUpdated && onUpdated();
    } catch (err) {
      console.error("Admin notes update error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete booking
  const deleteBooking = async () => {
    const id = getCurrentId();
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    setSaving(true);
    try {
      await deleteBookingById(id);
      onUpdated && onUpdated();
      // After delete, move to next booking if possible, otherwise previous, otherwise close
      if (allBookings.length > 1) {
        const newList = allBookings.filter(
          (b) => (b.booking_id || b.id) !== id
        );
        setAllBookings(newList);
        let newIndex = currentIndex;
        if (newIndex >= newList.length) newIndex = newList.length - 1;
        setCurrentIndex(newIndex);
        setCurrentBooking(newList[newIndex] || null);
      } else {
        onClose && onClose();
      }
    } catch (err) {
      console.error("Delete booking error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Navigation
  const goToPrevious = () => {
    if (currentIndex <= 0) return;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    setCurrentBooking(allBookings[newIndex] || null);
  };

  const goToNext = () => {
    if (currentIndex >= allBookings.length - 1) return;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    setCurrentBooking(allBookings[newIndex] || null);
  };

  if (loading || !currentBooking) {
    return (
      <div className="admin-page-wrapper">
        <div className="admin-page-container">
          <div className="admin-page-header">
            <div className="header-brand-group">
              <img
                src="/images/buzzybuzzybee.png"
                alt="Buzzy Logo"
                className="modal-logo-img"
              />
              <div className="header-text-info">
                <h3>Booking Management</h3>
                <span className="modal-id-badge">Loading...</span>
              </div>
            </div>
            <button className="header-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="admin-modal-content">
            <p>Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }
  const pricingBreakdown = currentBooking.pricing_breakdown || {};
  const breakDownSubtotal =
    pricingBreakdown.subtotal ??
    currentBooking.subtotal ??
    (currentBooking.items || []).reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );
  const breakDownTax = pricingBreakdown.tax ?? currentBooking.tax ?? 0;
  const breakDownTotal = pricingBreakdown.total ?? currentBooking.total ?? 0;
  const breakDownDeposit =
    pricingBreakdown.deposit ?? currentBooking.deposit ?? 0;
  const paymentStatus = String(currentBooking.paymentStatus || "").toLowerCase();
  const explicitAmountPaid =
    currentBooking.amountPaid ??
    currentBooking.paidAmount ??
    currentBooking.paymentAmount;
  const amountPaid =
    explicitAmountPaid !== undefined && explicitAmountPaid !== null
      ? Number(explicitAmountPaid)
      : ["balance_paid", "paid", "paid_in_full"].includes(paymentStatus)
        ? Number(breakDownTotal)
        : paymentStatus.startsWith("paid via ")
          ? Number(breakDownTotal)
        : ["deposit_paid", "confirmed"].includes(paymentStatus)
          ? Number(breakDownDeposit)
          : 0;
  const isPaidInFull =
    ["balance_paid", "paid", "paid_in_full"].includes(paymentStatus) ||
    Number(amountPaid) >= Number(breakDownTotal);
  const remainingBalance = isPaidInFull
    ? 0
    : pricingBreakdown.remaining ??
      currentBooking.remaining ??
      Math.max(0, Number(breakDownTotal) - Number(amountPaid));
  
  return (
    <div className="admin-page-wrapper">
      <div className="admin-page-container">
        {/* HEADER */}
        <div className="admin-page-header">
          <div className="header-brand-group">
            <img
              src="/images/buzzybuzzybee.png"
              alt="Buzzy Logo"
              className="modal-logo-img"
            />
            <div className="header-text-info">
              <h3>Booking Management</h3>
              <span className="modal-id-badge">
                ID: {(currentBooking.id || "").slice(-6)}
              </span>
            </div>
          </div>
          <button className="header-close-btn" onClick={onClose}>
            &times;
          </button>  
        </div>  

        {/* CONTENT */}
        <div className="admin-modal-content admin-page-scroll">
          {/* CUSTOMER INFO CARD */}
          <div className="admin-card">
            <h4>Customer Information</h4>
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
              <label>Phone Number</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="No phone number on file"
              />
            </div>

            <div className="modal-edit-field">
              <label>Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* EVENT INFO CARD */}
          <div className="admin-card">
            <h4>Event Information</h4>

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

            <div className="modal-items-box">
              <strong>Items:</strong>
              {(currentBooking.items || []).length > 0 ? (
                <ul>
                  {currentBooking.items.map((item, index) => (
                    <li key={`${item.title || item.name || "item"}-${index}`}>
                      {item.title || item.name || "Unknown item"}
                      {["wet", "dry"].includes(item.mode) && (
                        <span className={`setup-badge ${item.mode}`} style={{ marginLeft: "8px" }}>
                          {item.mode.toUpperCase()}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{resolvedItems}</p>
              )}
            </div>

            <div className="modal-edit-field">
              <label>Mileage</label>
              {currentBooking.distance !== undefined &&
              currentBooking.distance !== null ? (
                <p>
                  {Number(currentBooking.distance)} miles
                  {" — "}
                  ${Number(currentBooking.mileageFee || 0).toFixed(2)} mileage fee
                </p>
              ) : (
                <p>Not recorded for this booking</p>
              )}
            </div>

            <div className="modal-edit-field">
              <label>Setup Preference</label>
              <div className="setup-toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${
                    setupType === "dry" ? "active-dry" : ""
                  }`}
                  onClick={() => setSetupType("dry")}
                >
                  Dry Setup
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${
                    setupType === "wet" ? "active-wet" : ""
                  }`}
                  onClick={() => setSetupType("wet")}
                >
                  Wet Setup
                </button>
              </div>
            </div>

            <div className="modal-edit-field">
              <label>Anchoring Method</label>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "10px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="anchoring"
                    value="Stakes"
                    checked={anchoring === "Stakes"}
                    onChange={(e) => setAnchoring(e.target.value)}
                    style={{ marginRight: "8px" }}
                  />
                  Stakes
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="anchoring"
                    value="Sand Bags"
                    checked={anchoring === "Sand Bags"}
                    onChange={(e) => setAnchoring(e.target.value)}
                    style={{ marginRight: "8px" }}
                  />
                  Sand Bags
                </label>
              </div>
            </div>
          </div>

          {/* PAYMENT SUMMARY CARD */}
          <div className="admin-card">
            <h4>Payment Summary</h4>
            <div className="modal-pricing-row">
              <strong>Subtotal:</strong>
              <span>${Number(breakDownSubtotal).toFixed(2)}</span>
            </div>
            <div className="modal-pricing-row">
              <strong>Tax:</strong>
              <span>${Number(breakDownTax).toFixed(2)}</span>
            </div>
            <div className="modal-pricing-row">
              <strong>Total:</strong>
              <span>${Number(breakDownTotal).toFixed(2)}</span>
            </div>
            <div className="modal-pricing-row">
              <strong>Customer Paid:</strong>
              <span>${Number(amountPaid).toFixed(2)}</span>
            </div>
            <div className="modal-pricing-row remaining-balance-row">
              <strong>Remaining Balance:</strong>
              <span>${Number(remainingBalance).toFixed(2)}</span>
            </div>
            {currentBooking.paymentStatus && (
              <div className="modal-pricing-row">
                <strong>Payment Status:</strong>{" "}
                <span>{currentBooking.paymentStatus}</span>
              </div>
            )}
          </div>

          {/* ADMIN NOTES CARD */}
          <div className="admin-card">
            <h4>Admin Notes</h4>
            <div className="admin-notes">
              <label>Internal Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes for this booking..."
              />
              <button onClick={saveAdminNotesHandler} disabled={saving}>
                {saving ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>

          {/* STATUS + ACTIONS CARD */}
          <div className="admin-card">
            <h4>Admin Controls</h4>

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
                </select>
                <button
                  className="modal-btn modal-btn-save"
                  onClick={updateStatus}
                  disabled={saving}
                >
                  Update
                </button>
              </div>
            </div>

            <div
              className="modal-action-section"
              style={{ marginTop: "25px" }}
            >
              <label>
                <strong>Save Booking Changes</strong>
              </label>
              <button
                className="modal-btn modal-btn-save"
                onClick={saveBookingDetails}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className="modal-footer-actions">
              <button
                className="modal-btn modal-btn-danger"
                onClick={deleteBooking}
                disabled={saving}
              >
                Delete Booking
              </button>
              <button
                className="modal-btn modal-btn-close"
                onClick={onClose}
              >
                Back to Booking Modal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
