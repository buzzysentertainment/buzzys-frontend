import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InflatableCard from '../components/InflatableCard';
import { PRICES } from "../data/prices";
import HeroSlideshow from "../components/HeroSlideshow";


export default function Home({
  addToCart,
  previewMode = false,
  previewData = {},
  settings = {}
}) {
  const navigate = useNavigate();

  useEffect(() => {
	const bee = document.querySelector(".free-bee");
	if (!bee) return undefined;
	let x = window.innerWidth * 0.3; 
	let y = window.innerHeight * 0.3;
	let animationFrameId;
	
	let vx = 1.2;  // horizontal speed
	let vy = 1.0;  // vertical speed
	
	const fly = () => {
	  vx += (Math.random() - 0.5) * 0.2;
	  vy += (Math.random() - 0.5) * 0.2;
	  x += vx;
	  y += vy;
	  if (x < 0 || x > window.innerWidth - 40) vx *= -1;
	  if (y < 0 || y > window.innerHeight - 40) vy *= -1;
	  bee.style.transform = `translate(${x}px, ${y}px)`;
	  animationFrameId = requestAnimationFrame(fly);
	};   
	
	fly();
	return () => cancelAnimationFrame(animationFrameId);
  }, []);	


  // -----------------------------
  // 1. HOMEPAGE SETTINGS (LIVE OR PREVIEW)
  // -----------------------------
  const showAnnouncement = previewMode
    ? previewData.showAnnouncement
    : settings.showAnnouncement;

  const announcement = previewMode
    ? previewData.announcement
    : settings.announcement;

  const heroTitle = previewMode
    ? previewData.heroTitle
    : settings.heroTitle || "Built for Kids\nInspired by Family";

  const heroSubtitle = previewMode
    ? previewData.heroSubtitle
    : settings.heroSubtitle || "";

  const heroButtonText = previewMode
    ? previewData.heroButtonText
    : settings.heroButtonText || "Book Now";

  const heroImage = previewMode
    ? previewData.heroImage
    : settings.heroImage || null;

  // ⭐ NEW: Owner can disable the Book Now button
  const showHeroButton = previewMode
    ? previewData.showHeroButton
    : settings.showHeroButton ?? true;

  const showFeatured = previewMode
    ? previewData.showFeatured
    : settings.showFeatured ?? true;

  const featuredItems = previewMode
    ? previewData.featuredItems
    : settings.featuredItems || ["dolphin16", "rainbowRush18", "volcano19"];

  // -----------------------------
  // 2. FEATURED ITEM MAPPING
  // -----------------------------
  const featuredMap = {
    dolphin16: {
      title: "16ft Dolphin",
      dry: PRICES.dolphin16?.dry || 225,
      wet: PRICES.dolphin16?.wet || 275,
      filename: "16-ft-Dolphin.png"
    },
    rainbowRush18: {
      title: "18ft Rainbow-Rush",
      dry: PRICES.rainbowRush18?.dry || 250,
      wet: PRICES.rainbowRush18?.wet || 300,
      filename: "18ft-Rainbow-Rush.png"
    },
    volcano19: {
      title: "19ft Volcano",
      dry: PRICES.volcano19?.dry || 275,
      wet: PRICES.volcano19?.wet || 325,
      filename: "19-ft-Volcano.png"
    }
  };

  return (
    <div
      className="home-page"
      style={{
        background: "linear-gradient(#9fcaff, #c4f7c8)",
        minHeight: "100vh"
      }}
    >

      {/* -----------------------------
          ANNOUNCEMENT BAR
      ------------------------------ */}
      {showAnnouncement && (
        <div className="announcement-bar">
          {announcement}
        </div>
      )}

      {/* -----------------------------
          HERO SECTION
      ------------------------------ */}
      <section className="hero-section">
        <div className="hero-wrapper">

          {/* Floating bee */}
          <img
            src="/images/bee.png"
            alt="Buzzy Mascot"
            className="hero-bee"
          />

          {/* Title */}
          <h2 className="hero-title">
            {heroTitle.split("\n").map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h2>

          {/* Subtitle (always allowed, but only visible if provided) */}
          {heroSubtitle && !showHeroButton && (
            <p className="hero-subtitle">{heroSubtitle}</p>
          )}

          {showHeroButton && (
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', zIndex: 10, position: 'relative' }}>
			  <button className="btn-book btn-hero-quote" onClick={() => navigate('/get-a-quote')}>
			    Get a Quote Today!
			  </button>
			</div>
		  )}
		  
          {/* Slideshow OR custom hero image */}
          {heroImage ? (
            <img src={heroImage} alt="Hero" className="hero-custom-image" />
          ) : (
            <HeroSlideshow />
          )}
        </div>
      </section>

      {/* -----------------------------
          FEATURED ITEMS
      ------------------------------ */}
      {showFeatured && (
        <section className="favorites-nook">
          <div className="favorites-wrapper">
            <h2 className="favorites-title">Our Top Picks</h2>

            <div className="favorites-grid">
              {featuredItems.map((id) => {
                const item = featuredMap[id];
                if (!item) return null;

                return (
                  <InflatableCard
                    key={id}
                    title={item.title}
                    dry={item.dry}
                    wet={item.wet}
                    filename={item.filename}
                    onBook={addToCart}
                    hideMoreInfo={true}
                  />
                );
              })}
            </div>

            <div className="favorites-button">
              <button className="btn-book" onClick={() => navigate('/catalog')}>
                View Full Inventory
              </button>
            </div>
          </div>
        </section>
      )}

      {/* -----------------------------
          FLOATING BEES
      ------------------------------ */}
      <div className="wave-bees-floating">
        <img src="/images/buzzybuzzybee.png" alt="Buzzy" className="floating-bee" />
        <img src="/images/buzzybuzzybee.png" alt="Buzzy" className="floating-bee" />
        <img src="/images/buzzybuzzybee.png" alt="Buzzy" className="floating-bee" />
      </div>
	  <div className="free-bee">
	    <img src="/images/buzzybuzzybee.png" alt="Flying Bee" />
	  </div>	    
    </div>
  );
}
