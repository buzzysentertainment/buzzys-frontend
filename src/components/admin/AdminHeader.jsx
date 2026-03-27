export default function AdminHeader() {
  const today = new Date().toLocaleDateString();

  return (
    <div className="admin-header">
      <h1 className="admin-header-title">Admin Dashboard</h1>

      <div className="admin-header-right">
        <span>{today}</span>
      </div>
    </div>
  );
}
