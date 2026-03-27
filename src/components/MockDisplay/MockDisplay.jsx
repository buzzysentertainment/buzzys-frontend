import "./MockDisplay.css";

export default function MockDisplay({ theme }) {
  const {
    primary,
    secondary,
    accent,
    background,
    card,
    text,
    radius,
  } = theme;

  return (
    <div
      className="mock-display"
      style={{
        backgroundColor: background,
        color: text,
        borderRadius: `${radius}px`,
        transition: "all 0.25s ease",
      }}
    >
      {/* HERO SECTION */}
      <div
        className="mock-hero"
        style={{
          padding: "20px",
          borderRadius: `${radius}px`,
        }}
      >
        <h2 style={{ color: primary, marginBottom: "10px" }}>
          Welcome to Buzzy's!
        </h2>
        <p style={{ color: secondary }}>
          Your inflatable adventure starts here.
        </p>
      </div>

      {/* FEATURED CARD */}
      <div
        className="mock-card"
        style={{
          backgroundColor: card,
          borderRadius: `${radius}px`,
          border: `3px solid ${accent}`,
          padding: "20px",
          marginTop: "25px",
          transition: "all 0.25s ease",
        }}
      >
        <h3 style={{ color: accent, marginBottom: "8px" }}>
          Featured Inflatable
        </h3>
        <p>Colorful bounce house with slide</p>
      </div>
    </div>
  );
}
