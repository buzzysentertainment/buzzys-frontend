export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Buzzy’s <span>Inflatables</span></h3>
          <p>Bringing the bounce to Rome, Georgia and beyond!</p>
        </div>

        <div className="footer-links">
          <a href="/safety">Safety Rules</a>
          <a href="/faq">FAQs</a>
          <a href="/contact">Contact Us</a>
        </div>

        <div className="footer-socials">
          <div className="social-icon">FB</div>
          <div className="social-icon">IG</div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© Buzzy’s Inflatables • Rome, Georgia • Built with 💛</p>
      </div>
    </footer>
  );
}