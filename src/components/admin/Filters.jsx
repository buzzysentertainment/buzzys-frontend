import { useState, useEffect } from "react";
import { fetchAllBookings } from "../../utils/adminApi";

export default function Filters({ onFilter }) {
  const [date, setDate] = useState("");
  const [item, setItem] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const [itemOptions, setItemOptions] = useState([]);

  // Load item titles dynamically from backend
  useEffect(() => {
    fetchAllBookings()
      .then((res) => {
        const bookings = res.data.bookings || [];

        const titles = new Set();

        bookings.forEach((b) => {
          if (b.items && Array.isArray(b.items)) {
            b.items.forEach((i) => {
              if (i.title) titles.add(i.title);
            });
          }
        });

        setItemOptions([...titles]);
      })
      .catch((err) => console.error("Error loading item list:", err));
  }, []);

  const applyFilters = () => {
    onFilter({
      date,
      item,
      status,
      search,
    });
  };

  return (
    <div className="admin-filters">
      {/* DATE FILTER */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* ITEM FILTER (dynamic) */}
      <select value={item} onChange={(e) => setItem(e.target.value)}>
        <option value="">All Items</option>

        {itemOptions.map((title) => (
          <option key={title} value={title}>
            {title}
          </option>
        ))}
      </select>

      {/* STATUS FILTER */}
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {/* SEARCH FILTER */}
      <input
        type="text"
        placeholder="Search customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="admin-btn admin-btn-primary" onClick={applyFilters}>
        Apply
      </button>
    </div>
  );
}
