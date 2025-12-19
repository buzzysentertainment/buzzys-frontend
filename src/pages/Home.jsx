import React from 'react';
import { useNavigate } from 'react-router-dom';
import InflatableCard from '../components/InflatableCard';
import PricingCard from '../components/PricingCard';

export default function Home({ openBooking }) {
  const navigate = useNavigate();

  return (
    <div className="home-page">
    
      {/* BUZZY MASCOT SECTION */}
      <section className="buzzy-section">
        <div className="buzzy-box">
          <h2 className="buzzy-title">🐝 Pick Your Perfect Bounce</h2>

          <p className="buzzy-intro">
            🎉 <strong>Big laughs</strong> &nbsp; 
            🛟 <strong>Safe jumps</strong> &nbsp; 
            🧼 <strong>Stress-free parties</strong>
          </p>

          <ul className="buzzy-benefits">
            <li>✨ Sparkling-clean inflatables</li>
            <li>⏰ On-time setup</li>
            <li>🐝 Safety-first crew</li>
          </ul>

          <div className="buzzy-details">
            <p><strong> </strong> Let’s make your party the bee’s knees!</p>
          </div>
        </div>
      </section>

      {/* WAVE: Yellow to Blue */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#fff3c4" d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* FAVORITES SECTION */}
      <section className="inflatables" id="favorites">
        <div className="favorites-box">
          <h2 className="section-title">
            <span className="subtitle">Our most popular picks!</span>
          </h2>

          <div className="card-container">
            <InflatableCard
              title="16ft Dolphin"
			  price={150}
              imgKey="dolphin"
              onBook={openBooking}
            />
            <InflatableCard
              title="18ft Rainbow-Rush"
			  price={200}
              imgKey="rainbow"
              onBook={openBooking}
            />
            <InflatableCard
			  price={200}
              title="19ft Volcano"
              imgKey="volcano"
              onBook={openBooking}
            />
          </div>

          <div className="favorites-button">
            <button
              className="btn-book"
              onClick={() => navigate('/catalog')}
            >
              View Full Inventory
            </button>
          </div>
        </div>
      </section>

      {/* WAVE: Blue to Cream */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#e6f7ff" d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z" />
        </svg>
      </div>

    </div>
  );
}