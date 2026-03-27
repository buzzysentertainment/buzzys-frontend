import { useEffect, useState } from "react";
import {
  getAdminAccount,
  updateAdminAccount,
} from "../../../utils/adminApi";

export default function AdminAccountSettings() {
  const [account, setAccount] = useState({
    email: "",
    enable2FA: false,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Load admin account info on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminAccount();
        if (res?.data?.account) {
          setAccount(res.data.account);
        }
      } catch (err) {
        console.error("Failed to load admin account:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleAccountChange = (field, value) => {
    setAccount((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    // Validate password match
    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match.");
      setSaving(false);
      return;
    }

    try {
      await updateAdminAccount({
        ...account,
        ...passwords,
      });

      setSaved(true);

      // Clear password fields after save
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {
      console.error("Failed to save admin account:", err);
      setError("Failed to update account. Check your current password.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading admin account...</p>;

  return (
    <div className="admin-account-settings">
      <h3>Admin Account</h3>

      {/* EMAIL */}
      <div className="settings-field">
        <label>Admin Email</label>
        <input
          type="email"
          value={account.email}
          onChange={(e) => handleAccountChange("email", e.target.value)}
        />
      </div>

      {/* 2FA */}
      <div className="settings-field">
        <label>Enable Two‑Factor Authentication</label>
        <input
          type="checkbox"
          checked={account.enable2FA}
          onChange={(e) => handleAccountChange("enable2FA", e.target.checked)}
        />
      </div>

      <h4 style={{ marginTop: "20px" }}>Change Password</h4>

      {/* CURRENT PASSWORD */}
      <div className="settings-field">
        <label>Current Password</label>
        <input
          type="password"
          value={passwords.currentPassword}
          onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
        />
      </div>

      {/* NEW PASSWORD */}
      <div className="settings-field">
        <label>New Password</label>
        <input
          type="password"
          value={passwords.newPassword}
          onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
        />
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="settings-field">
        <label>Confirm New Password</label>
        <input
          type="password"
          value={passwords.confirmPassword}
          onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
        />
      </div>

      {/* ERROR MESSAGE */}
      {error && <p className="error-text">{error}</p>}

      {/* SAVE BUTTON */}
      <button
        className="admin-btn admin-btn-primary"
        onClick={handleSave}
        disabled={saving}
        style={{ marginTop: "20px" }}
      >
        {saving ? "Saving..." : "Save Account Settings"}
      </button>

      {saved && <p className="success-text">Account updated successfully!</p>}
    </div>
  );
}
