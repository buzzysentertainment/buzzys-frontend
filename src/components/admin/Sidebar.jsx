import { useState } from "react";

export default function Sidebar({ onSectionChange }) {
  const [activeTab, setActiveTab] = useState("bookings");

  const handleNavClick = (section) => {
    setActiveTab(section);
    onSectionChange(section);
  };

  const navItems = [
    { id: "bookings", label: "Bookings", icon: "📝" }, // Sparkles for new business
    { id: "calendar", label: "Calendar", icon: "🎈" }, // Balloon for events
    { id: "inventory", label: "Inventory", icon: "🏰" }, // The Bounce House!
    { id: "settings", label: "Settings", icon: "🎨" }, // Palette for customization
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🐝</span>
        <h2>Buzzy Admin</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            /* Logic: Dynamically adds 'active' AND a specific color class like 'bookings-active' */
            className={`nav-item-flair ${activeTab === item.id ? `active ${item.id}-active` : ""}`}
            onClick={() => handleNavClick(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {activeTab === item.id && <div className="active-glow" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item-flair logout-btn">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
}