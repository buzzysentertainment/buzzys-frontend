import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const token = localStorage.getItem("adminToken");

  // If no token, block access
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // If token exists, allow access
  return children;
}
