import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("buzzysentertainment@gmail.com");
  const [password, setPassword] = useState("Buzzys1!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => setError("");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("adminToken", token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("The credentials entered do not match our records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Added sparkle-bg class here */
    <div className="admin-login-container sparkle-bg">
      {/* This layer provides the sparkle effect */}
      <div className="sparkle-overlay"></div>
      
      <div className="admin-login-glass-card">
        <div className="admin-login-brand">
           <h2 className="brand-text">Buzzy's <span>Admin</span></h2>
           <div className="brand-underline"></div>
        </div>

        <form onSubmit={handleLogin} className="admin-form-sleek">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@buzzys.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <p className="error-text-modern">{error}</p>}

          <button type="submit" className="login-button-modern" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
          
          <a href="#" className="forgot-pass-minimal">Forgot Password?</a>
        </form>
      </div>
    </div>
  );
}