import { useEffect, useState } from "react";
import {
  getBookingRules,
  updateBookingRules,
} from "../../../utils/adminApi";

export default function BookingRulesSettings() {
  const [rules, setRules] = useState({
    blackoutDates: [],
    maxBookingsPerDay: 3,
    earliestStart: "08:00",
    latestEnd: "20:00",
    depositPercent: 35,
    cancellationPolicy: "",
  });

  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load rules on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBookingRules();
        if (res?.data?.rules) {
          setRules(res.data.rules);
        }
      } catch (err) {
        console.error("Failed to load booking rules:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (field, value) => {
    setRules((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const addBlackoutDate = () => {
    if (!newDate) return;
    if (rules.blackoutDates.includes(newDate)) return;

    setRules((prev) => ({
      ...prev,
      blackoutDates: [...prev.blackoutDates, newDate],
    }));

    setNewDate("");
    setSaved(false);
  };

  const removeBlackoutDate = (date) => {
    setRules((prev) => ({
      ...prev,
      blackoutDates: prev.blackoutDates.filter((d) => d !== date),
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBookingRules(rules);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save booking rules:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading booking rules...</p>;

  return (
    <div className="booking-rules-settings">
      <h3>Booking Rules</h3>

      <div className="settings-grid">

        {/* MAX BOOKINGS PER DAY */}
        <div className="settings-field">
          <label>Max Bookings Per Day</label>
          <input
            type="number"
            value={rules.maxBookingsPerDay}
            onChange={(e) =>
              handleChange("maxBookingsPerDay", Number(e.target.value))
            }
          />
        </div>

        {/* EARLIEST START */}
        <div className="settings-field">
          <label>Earliest Start Time</label>
          <input
            type="time"
            value={rules.earliestStart}
            onChange={(e) => handleChange("earliestStart", e.target.value)}
          />
        </div>

        {/* LATEST END */}
        <div className="settings-field">
          <label>Latest End Time</label>
          <input
            type="time"
            value={rules.latestEnd}
            onChange={(e) => handleChange("latestEnd", e.target.value)}
          />
        </div>

        {/* DEPOSIT PERCENT */}
        <div className="settings-field">
          <label>Deposit Percentage (%)</label>
          <input
            type="number"
            value={rules.depositPercent}
            onChange={(e) =>
              handleChange("depositPercent", Number(e.target.value))
            }
          />
        </div>
      </div>

      {/* BLACKOUT DATES */}
      <div className="settings-section">
        <h4>Blackout Dates</h4>

        <div className="blackout-add">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <button
            className="admin-btn admin-btn-secondary"
            onClick={addBlackoutDate}
          >
            Add Date
          </button>
        </div>

        <div className="blackout-list">
          {rules.blackoutDates.length === 0 && (
            <p>No blackout dates added.</p>
          )}

          {rules.blackoutDates.map((date) => (
            <div key={date} className="blackout-item">
              <span>{date}</span>
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => removeBlackoutDate(date)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CANCELLATION POLICY */}
      <div className="settings-section">
        <h4>Cancellation Policy</h4>
        <textarea
          rows="5"
          value={rules.cancellationPolicy}
          onChange={(e) =>
            handleChange("cancellationPolicy", e.target.value)
          }
        />
      </div>

      {/* SAVE BUTTON */}
      <button
        className="admin-btn admin-btn-primary"
        onClick={handleSave}
        disabled={saving}
        style={{ marginTop: "20px" }}
      >
        {saving ? "Saving..." : "Save Booking Rules"}
      </button>

      {saved && (
        <p className="success-text">Booking rules saved successfully!</p>
      )}
    </div>
  );
}
