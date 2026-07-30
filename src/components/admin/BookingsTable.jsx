import { useState } from "react";
import BookingDetailsModal from "./BookingDetailsModal";
import "./AdminLayout.css";

export default function BookingsTable({ bookings, onUpdated }) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  // When a booking is selected, we render the full-page view instead of the table
  if (selectedBooking) {
    return (
      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onUpdated={onUpdated}
        mode="page"   // Tells the component to render as a full page
      />
    );
  }

  return (
    <>
      <div className="table-card-glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Item(s)</th>
              {/* 💧 Setup heading added to match row layout */}
              <th style={{ textAlign: 'center' }}>Setup</th> 
              <th style={{ textAlign: 'center' }}>Mileage</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => {
              const resolvedName = b.name || b.customerName || b.customer || "Unknown";
              const resolvedDate =
                b.date ||
                b.eventDate ||
                b.partyDate ||
                b.selectedDate ||
                b.bookingDate ||
                b.reservationDate ||
                "TBD";

              const resolvedItems =
                b.items && b.items.length > 0
                  ? b.items.map((i) => i.title || i.name).join(", ")
                  : b.item || "—";
              const itemModes = (b.items || [])
                .map((item) => String(item.mode || "").toLowerCase())
                .filter((mode) => mode === "wet" || mode === "dry");
              const setupType = itemModes.length
                ? new Set(itemModes).size > 1 ? "mixed" : itemModes[0]
                : String(b.setupType || b.mode || "dry").toLowerCase();
              const setupLabel =
                setupType === "mixed" ? "WET + DRY" : setupType.toUpperCase();

              // 🎯 Extracts the string format "dry" or "wet" straight from Firebase
              const itemModes = (b.items || [])
                .map((item) => item.mode)
                .filter((mode) => mode === "wet" || mode === "dry");
              const cleanMode = String(
                (itemModes.length
                  ? (new Set(itemModes).size > 1 ? "mixed" : itemModes[0])
                  : null) ||
                b.mode ||
                b.setupType ||
                "dry"
              ).toLowerCase();
              const setupLabel =
                cleanMode === "mixed"
                  ? "WET + DRY"
                  : cleanMode === "wet" ? "WET" : "DRY";

              return (
                <tr key={b.booking_id || b.id || b.created_at || Math.random()}>
                  <td><strong>{resolvedName}</strong></td>
                  <td>{resolvedItems}</td>
                  
                  {/* 💧 Setup column with conditional styling badges */}
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <span 
                      className={`setup-badge ${cleanMode}`}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        display: 'inline-block',
                        background: cleanMode === 'wet' ? '#e1f5fe' : cleanMode === 'mixed' ? '#f3e5f5' : '#fff3e0',
                        color: cleanMode === 'wet' ? '#0288d1' : cleanMode === 'mixed' ? '#7b1fa2' : '#f57c00',
                        border: cleanMode === 'wet' ? '1px solid #b3e5fc' : cleanMode === 'mixed' ? '1px solid #ce93d8' : '1px solid #ffe0b2'
                      }}
                    >
                      {setupLabel}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {Number.isFinite(Number(b.distance))
                      ? `${Number(b.distance)} mi`
                      : "—"}
                  </td>

                  <td>{resolvedDate}</td>
                  <td>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>${Number(b.total || 0).toFixed(2)}</td>

                  <td className="admin-actions-cell" style={{ textAlign: 'center' }}>
                    <button
                      className="admin-btn admin-btn-primary"
                      onClick={() => setSelectedBooking(b)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
