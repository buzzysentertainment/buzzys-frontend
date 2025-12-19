export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        
        {/* Left Side: Text and Stats */}
        <div className="hero-text">
          <h1>Pick your perfect bounce</h1>
          <p className="hero-description">
            Buzzy loves three things: <strong>big laughs</strong>, safe jumps, and stress-free parties. 
            At Buzzy's inflatables, we bring high-quality fun to your home and handle the boring stuff.
          </p>

          <ul className="hero-bullets">
            <li>✓ Sparkling clean inflatables</li>
            <li>✓ On-time setup</li>
            <li>✓ Safety first</li>
          </ul>

          <div className="bio-box">
            <p><strong>Name:</strong> Buzzy the Bumbis Bee</p>
            <p><strong>Special move:</strong> Super bounce spin</p>
            <p><strong>Favorite sound:</strong> Kids laughing</p>
          </div>
        </div>

        {/* Right Side: Animated Bee & Speech Bubble */}
        <div className="hero-visual">
          <div className="speech-bubble">
            <p>Let’s make your party the bees knees!</p>
          </div>
          
          <div className="buzzy-wrapper">
            {/* Replace with your generated bee image path */}
            <img src="/buzzy-bee.png" alt="Buzzy Bee" className="buzzy-bee" />
            <div className="shadow"></div>
          </div>
        </div>

      </div>
    </section>
  );
}