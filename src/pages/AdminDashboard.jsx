import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import BookingsTable from "../components/admin/BookingsTable";
import Filters from "../components/admin/Filters";
import CalendarView from "../components/admin/CalendarView";
import InventoryManager from "../components/admin/InventoryManager";
import AdminSettings from "../components/admin/AdminSettings";
import "./AdminDashboard.css";

// Import the new Master PDF utility
import { downloadAllBookingsPDF } from "../utils/pdfGenerator";

import {
  fetchAllBookings,
  fetchBookingsByDate,
  fetchBookingsByItem,
  fetchBookingsByStatus,
  startKeepAlive,
} from "../utils/adminApi";

export default function AdminDashboard() {
  const [section, setSection] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Logic Intact: WAKE UP THE SERVER
  useEffect(() => {
    startKeepAlive();
  }, []);

  // 2. Logic Intact: Fetch all bookings
  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetchAllBookings();
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (section === "bookings") {
      loadBookings();
    }
  }, [section]);

  // Logic Intact: Handle filter logic
  const handleFilter = async (filters) => {
    setLoading(true);
    try {
      let res;
      if (filters.date) {
        res = await fetchBookingsByDate(filters.date);
      } else if (filters.item) {
        res = await fetchBookingsByItem(filters.item);
      } else if (filters.status) {
        res = await fetchBookingsByStatus(filters.status);
      } else {
        res = await fetchAllBookings();
      }

      let filtered = res.data.bookings || [];
      if (filters.search) {
        const s = filters.search.toLowerCase();
        filtered = filtered.filter((b) =>
          (b.customerName || b.name || "").toLowerCase().includes(s)
        );
      }
      setBookings(filtered);
    } catch (err) {
      console.error("Filter error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout onSectionChange={setSection}>
      <div className="admin-dashboard-container sparkle-bg">
        <div className="sparkle-overlay"></div>

        <div className="admin-section-scroll">
          <div className="glass-content-wrapper">
            
            {/* BOOKINGS SECTION */}
            {section === "bookings" && (
              <div className="admin-fade-in">
                <header className="admin-header-sleek-container">
                  <div className="admin-header-sleek">
                    <h2>Bookings</h2>
                    <div className="brand-underline-small"></div>
                  </div>

                  {/* MASTER PDF BUTTON: Connected to current filtered bookings */}
                  <button 
                    className="master-pdf-btn"
                    onClick={() => downloadAllBookingsPDF(bookings)}
                    disabled={loading || bookings.length === 0}
                  >
                    Download Delivery Pack ({bookings.length}) 📄
                  </button>
                </header>
                
                <Filters onFilter={handleFilter} />

                {loading ? (
                  <div className="loading-container-glass">
                    <p className="loading-text">Fetching the buzz...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="empty-state-glass">
                    <p>No bookings found.</p>
                  </div>
                ) : (
                  <div className="table-card-glass">
                    <BookingsTable bookings={bookings} onUpdated={loadBookings} />
                  </div>
                )}
              </div>
            )}

            {section === "calendar" && <div className="admin-fade-in"><CalendarView /></div>}
            {section === "inventory" && <div className="admin-fade-in"><InventoryManager /></div>}
            {section === "settings" && <div className="admin-fade-in"><AdminSettings /></div>}
            
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}