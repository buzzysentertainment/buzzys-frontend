import { NavLink, useNavigate } from "react-router-dom";

export default function Header({ onBook }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Buzzy’s <span>Inflatables</span>
        </h1>

        <nav className="nav">
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/catalog" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Catalog
              </NavLink>
            </li>
            <li>
              <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onBook(); }}>
                Booking
              </a>
            </li>
            <li>
              <a href="#contact" className="nav-item">Contact</a>
            </li>
            <li>
              <NavLink to="/view_cart" className="cart-btn">
                View Cart
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}