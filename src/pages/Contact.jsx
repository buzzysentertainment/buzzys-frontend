import React, { useEffect } from "react";
import "./Contact.css";

export default function Contact() {

  // Set footer color for this page
  useEffect(() => {
    document.documentElement.style.setProperty("--footer-color", "var(--buzzy-purple)");
  }, []);

  return (
    <div className="contact-page">

      {/* Hero Image */}
      <div className="contact-hero">
        <img
          src="/images/buzzytruck.png"
          alt="Buzzy's Inflatables truck"
          className="contact-image"
        />

        <h2 className="contact-title contact-title-outline">
          Bounce Into Fun With Buzzy's
        </h2>

        <p className="contact-subtitle">
          Reach out to book your inflatable adventure — we’re here to help!
        </p>
      </div>

      {/* Contact Info */}
      <div className="contact-info">

        {/* CALL */}
        <div className="contact-card">
          <div className="contact-icon">📞</div>
          <h3>Call or Text</h3>
          <a href="tel:7069368083" className="contact-btn">
            Tap to Call / Text
          </a>
        </div>

        {/* EMAIL */}
        <div className="contact-card">
          <div className="contact-icon">📧</div>
          <h3>Email</h3>
          <a
            href="mailto:buzzysentertainment@gmail.com"
            className="contact-btn center-text"
          >
            Send Email
          </a>
        </div>

        {/* LOCATION */}
        <div className="contact-card">
          <div className="contact-icon">📍</div>
          <h3>Location</h3>
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn"
          >
            Get Directions
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="contact-divider"></div>

      {/* Social Links */}
      <div className="social-links">

        {/* FACEBOOK */}
        <a
          href="https://www.facebook.com/buzzysentertainment/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <img
            src="/images/facebookicon.png"
            alt="Facebook"
            className="social-logo"
          />
        </a>

        {/* INSTAGRAM */}
        <a
          href="https://www.instagram.com/buzzys_inflatables/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <img
            src="/images/instagramlogo.png"
            alt="Instagram"
            className="social-logo"
          />
        </a>

        {/* TIKTOK */}
        <a
          href="https://www.tiktok.com/@buzzys.inflatable0"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <img
            src="/images/tiktoklogo.png"
            alt="TikTok"
            className="social-logo"
          />
        </a>
      </div>

      {/* Helpful Buttons */}
      <div className="contact-buttons">
        <a href="/faq" className="contact-bubble-btn">
          FAQs
        </a>

        <a href="/safety-rules" className="contact-bubble-btn">
          Safety Rules
        </a>
      </div>

    </div>
  );
}
