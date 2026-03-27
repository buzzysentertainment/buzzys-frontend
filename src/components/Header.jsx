import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css"; // Import the new specific CSS file

export default function Header({ onCartOpen, cartCount }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">

        {/* LOGO SECTION WITH TAGLINE */}
        <div className="logo-wrapper" onClick={() => navigate('/')}>
          <h1 className="logo">Buzzy’s <span>Inflatables</span></h1>
          <p className="logo-tagline">Built for Kids. Inspired by Family.</p>
          <a href="tel:7069368083" className="phone-link">
            Call Us! (706) 936-8083
          </a>
        </div>

        {/* NAVIGATION CUBBIES */}
        <nav className="nav">
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/catalog" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Inflatables & More
              </NavLink>
            </li>

            {/* ⭐ NEW: ABOUT US BUTTON ⭐ */}
            <li>
              <NavLink to="/about" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                About Us
              </NavLink>
            </li>

            <li>
              <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Customer Service
              </NavLink>
            </li>
            <li>
              <button className="book-now-btn" onClick={onCartOpen}>
                Book Now! 
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}