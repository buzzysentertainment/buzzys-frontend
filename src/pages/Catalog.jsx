import InflatableCard from "../components/InflatableCard";
import "../styles.css";

// Now accepting addToCart from App.js
export default function Catalog({ openBooking, addToCart }) {
  return (
    <div className="catalog-page">
      <section className="inflatables" style={{ padding: '60px 20px' }}>
        <h2 className="section-title">The Full Hive</h2>
        <p className="subtitle">Every bounce house, slide, and obstacle course we offer.</p>
        
        <div className="card-container">

          <InflatableCard 
            title="16ft Dolphin" 
            price={250}
            imgKey="dolphin" 
            onBook={addToCart} 
          />

          <InflatableCard 
            title="18ft Rainbow Rush" 
            price={275}
            imgKey="rainbow" 
            onBook={addToCart} 
          />

          <InflatableCard 
            title="19ft Volcano" 
            price={300}
            imgKey="volcano" 
            onBook={addToCart} 
          />

          <InflatableCard 
            title="Double Jumbo Combo" 
            price={350}
            imgKey="jumbo" 
            onBook={addToCart} 
          />

          <InflatableCard 
            title="Fun Run Obstacle Course" 
            price={400}
            imgKey="funrun" 
            onBook={addToCart} 
          />

        </div>
      </section>
    </div>
  );
}