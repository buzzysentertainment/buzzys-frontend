import React, { useEffect } from 'react';
import "./Catalog.css"; // Reuse the bubble & gradient styles

export default function About() {

  // Set footer color for this page
  useEffect(() => {
    document.documentElement.style.setProperty("--footer-color", "var(--buzzy-teal)");
  }, []);

  return (
    <div className="catalog-page" style={{ paddingBottom: '100px' }}>
      <section className="inflatables" style={{ padding: "60px 20px" }}>
        
        {/* TITLE BUBBLE */}
        <div className="catalog-header-container">
          <h2>Meet the Buzzy's Family</h2>
        </div>

        {/* FAMILY PHOTO SECTION */}
        <div className="catalog-header-container" style={{ marginTop: '20px' }}>
          
          <img 
            src="/images/family-photo.jpg" 
            alt="Ethan, Kandy, and their 4 sons" 
            style={{ 
              width: '100%', 
              maxWidth: '800px', 
              borderRadius: '20px', 
              border: '4px solid var(--buzzy-black)' 
            }} 
          />

          <div style={{ marginTop: '30px', textAlign: 'left', color: 'var(--buzzy-black)' }}>
            
            <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '10px' }}>
              Ethan & Kandy
            </h3>

            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontWeight: '600' }}>
              As a husband and wife team, we started Buzzy's with a simple mission: 
              to bring unforgettable joy to local families. Running a business is a 
              team effort, and our four sons are the motivation behind everything we do!
            </p>

            <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Jayden</strong> – The oldest and our lead helper.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Owen</strong> – Our middle man keeping things balanced.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Bentley</strong> – Bringing the energy as our next to youngest.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Liam</strong> – The youngest member of the Buzzy's crew.
              </li>
            </ul>

            <hr style={{ border: '2px solid var(--buzzy-black)', margin: '30px 0' }} />

            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontWeight: '600' }}>
              We are a <strong>family owned and operated business</strong>. When you rent from us, 
              you aren't just getting an inflatable; you're getting a commitment to safety, 
              cleanliness, and the kind of care only a local family can provide. From our 
              driveway to yours, thank you for letting us be a part of your celebrations!
            </p>

          </div>
        </div>

      </section>
    </div>
  );
}
