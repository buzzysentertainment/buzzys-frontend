import React from 'react';
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

          {/* Button (only if enabled) */}
          {showHeroButton && (
            <button className="btn-book" onClick={() => navigate('/catalog')}>
              {heroButtonText}
            </button>
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
    </div>
  );
}
