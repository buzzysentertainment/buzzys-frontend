import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BookingDetailsModal from "./BookingDetailsModal";
import { fetchAllBookings } from "../../utils/adminApi";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await fetchAllBookings();
        const data = res.data.bookings || [];

        const formatted = data.map((b) => ({
          id: b.id,
          title: b.name || "Booking",
          start: b.date,
          end: b.pickupTime || b.date,
          extendedProps: b
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Calendar load error:", err);
      }
    }

    loadBookings();
  }, []);

  const handleEventClick = (info) => {
    setSelectedBooking(info.event.extendedProps);
    setShowModal(true);
  };

  const handleEventDrop = async (info) => {
    const newDate = info.event.start;

    try {
      await fetch(`https://buzzys-backend.onrender.com/admin/bookings/${info.event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate })
      });
    } catch (err) {
      console.error("Drag update error:", err);
      info.revert();
    }
  };

  const handleEventResize = async (info) => {
    const newPickup = info.event.end;

    try {
      await fetch(`https://buzzys-backend.onrender.com/admin/bookings/${info.event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupTime: newPickup })
      });
    } catch (err) {
      console.error("Resize update error:", err);
      info.revert();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Booking Calendar</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        editable={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="80vh"
      />

      {showModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setShowModal(false)}
          onUpdated={() => window.location.reload()}
          mode="modal"
        />
      )}
    </div>
  );
}
