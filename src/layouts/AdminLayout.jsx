import React from "react";
import Sidebar from "../components/admin/Sidebar";
import AdminHeader from "../components/admin/AdminHeader";

// IMPORT BOTH CSS FILES
import "../styles/Admin.css"; 
import "./AdminLayout.css";

export default function AdminLayout({ children, onSectionChange }) {
  return (
    <div className="admin-layout">
      
      {/* LEFT SIDEBAR - Pass the section handler down */}
      <div className="sidebar-wrapper">
        <Sidebar onSectionChange={onSectionChange} />
      </div>

      {/* RIGHT SIDE (HEADER + CONTENT) */}
      <div className="admin-main">
        <AdminHeader />

        {/* This container handles the overflow and scrolling for the dashboard */}
        <main className="admin-content">
          {children}
        </main>
      </div>

    </div>
  );
}