import { useNavigate } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      {/* 1. TOP SECTION: REVIEWS CUBBIES (STRung ACROSS) */}
      <div className="footer-reviews-container">
        <div className="google-review-header">
          <img
            src="/images/googlelogo.png"
            alt="Google"
            className="google-logo"
          />
          <div className="google-header-text">
            <div className="google-stars">★★★★★</div>
            <div className="google-rating">4.9 out of 5 Based on customer reviews</div>
          </div>
        </div>

        <div className="google-review-grid">
          <div className="google-review-item">
            <h4 className="review-name">Wendy Lopez</h4>
            <div className="review-stars">★★★★★</div>
            <p className="review-text">
              They are very professional and prompt. Their equipment is super clean.
              We were well pleased with this rental and it was the star of the show.
            </p>
          </div>

          <div className="google-review-item">
            <h4 className="review-name">Chesney Gowens</h4>
            <div className="review-stars">★★★★★</div>
            <p className="review-text">
              Great and clean jump house! Friendly people.
            </p>
          </div>

          <div className="google-review-item">
            <h4 className="review-name">Kara Studdard</h4>
            <div className="review-stars">★★★★★</div>
            <p className="review-text">
              We had the best experience! Would definitely recommend to others!
            </p>
          </div>
        </div>

        <a
          href="https://www.google.com/search?q=buzzysinflatables+google+reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="google-cta-button"
        >
          Read More Reviews
        </a>
      </div>

      {/* 2. BOTTOM SECTION: BRAND + LINKS + SOCIALS (HORIZONTAL ROW) */}
      <div className="footer-brand-info-row">
        
        {/* BRAND COLUMN */}
        <div className="footer-brand">
          <h3>Buzzy’s <span>Inflatables</span></h3>
          <p>Bringing the bounce to Northwest, Georgia!</p>
        </div>

        {/* LINKS COLUMN */}
        <div className="footer-links">
          <a href="/safety-rules">Safety Rules</a>
          <a href="/faq">FAQs</a>
          <a href="/contact">Contact Us</a>
        </div>

        {/* SOCIALS & ADMIN COLUMN */}
        <div className="footer-socials-wrapper">
          <div className="footer-socials">
            <a href="https://facebook.com/buzzysentertainment/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src="/images/facebookicon.png" alt="Facebook" className="social-logo" />
            </a>
            <a href="https://instagram.com/buzzys_inflatables/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src="/images/instagramlogo.png" alt="Instagram" className="social-logo" />
            </a>
          </div>
          <p className="footer-admin-link" onClick={() => navigate("/admin/login")}>
            Admin Login
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© Buzzy’s Inflatables • Silver Creek, Georgia</p>
      </div>
    </footer>
  );
}