import { useState } from "react";
import BookingDetailsModal from "./BookingDetailsModal";

export default function BookingsTable({ bookings, onUpdated }) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  // When a booking is selected, we render the full-page view instead of the table
  if (selectedBooking) {
    return (
      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onUpdated={onUpdated}
        mode="page"   // 🔥 NEW: tells the component to render as a full page
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

              return (
                <tr key={b.booking_id || b.id || b.created_at || Math.random()}>
                  <td><strong>{resolvedName}</strong></td>
                  <td>{resolvedItems}</td>
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