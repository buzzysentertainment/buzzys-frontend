import { useState } from "react";

// Added hideMoreInfo to the props
export default function InflatableCard({ item, onBook, hideMoreInfo, ...props }) {
  const displayItem = item || {
    title: props.title,
    dry: props.dry,
    wet: props.wet,
    filename: props.filename,
    description: props.description,
    category: props.category
  };

  const { title, dry, wet, filename, description, category } = displayItem;

  const [mode, setMode] = useState(wet ? "dry" : "flat");
  const [showInfo, setShowInfo] = useState(false);
  const [selectedColor, setSelectedColor] = useState("Standard White");

  if (!title) return null;

  const basePrice = mode === "wet" ? wet : dry;
  const totalPrice = basePrice;
  const foamColors = ["Standard White", "UV Glow", "Pink", "Blue", "Green"];

  // Styling variable for the blue theme
  const blueButtonStyle = {
    backgroundColor: "#00d1ff",
    color: "#000",
    border: "2px solid #000",
    borderBottom: "4px solid #000",
    fontWeight: "bold",
    borderRadius: "20px",
    cursor: "pointer"
  };

  return (
    <div className="card inflatable-card">
      <div className="card-image-container">
        {filename ? (
          <img src={`/images/${filename}`} alt={title} className="inflatable-img" />
        ) : (
          <div className="placeholder-icon" style={{ fontSize: "3.5rem" }}>🐝</div>
        )}
      </div>

      <h3>{title}</h3>

      {wet && (
        <div className="wet-dry-toggle">
          {/* Apply blue style to active toggle */}
          <button 
            className={mode === "dry" ? "active" : ""} 
            onClick={() => setMode("dry")}
            style={mode === "dry" ? blueButtonStyle : { borderRadius: "20px" }}
          >
            Dry
          </button>
          <button 
            className={mode === "wet" ? "active" : ""} 
            onClick={() => setMode("wet")}
            style={mode === "wet" ? blueButtonStyle : { borderRadius: "20px" }}
          >
            Wet
          </button>
        </div>
      )}

      {category === "Foam Parties" && (
        <div className="custom-option" style={{ margin: "10px 0" }}>
          <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "4px" }}>Foam Color:</label>
          <select 
            value={selectedColor} 
            onChange={(e) => setSelectedColor(e.target.value)}
            style={{ width: "100%", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            {foamColors.map(color => <option key={color} value={color}>{color}</option>)}
          </select>
        </div>
      )}

      <p className="item-price">
        ${totalPrice} {wet && <span className="mode-label">({mode})</span>}
      </p>

      {/* FIXED: This button now only shows if hideMoreInfo is NOT true */}
      {!hideMoreInfo && (
        <button 
          className="more-info-btn" 
          onClick={() => setShowInfo(!showInfo)}
          style={{ marginBottom: '10px', cursor: 'pointer', background: 'transparent', border: '1px solid #ccc', borderRadius: '5px', width: '80%' }}
        >
          {showInfo ? "Hide Details ▴" : "More Info ▾"}
        </button>
      )}

      {showInfo && !hideMoreInfo && (
        <div className="description-drop" style={{ textAlign: 'left', padding: '10px', fontSize: '0.85rem', borderTop: '1px solid #eee', background: '#f9f9f9' }}>
          <p>{description || "Built for Kids. Inspired by Family."}</p>
          {category === "Foam Parties" && (
            <p style={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>
              *UV Glow requires specialized blacklight equipment.
            </p>
          )}
        </div>
      )}

      <button
        className="btn-book"
        style={{ ...blueButtonStyle, width: "100%", padding: "10px" }}
        onClick={() =>
          onBook({
            ...displayItem,
            mode,
            price: totalPrice,
            selectedColor: category === "Foam Parties" ? selectedColor : null
          })
        }
      >
        Add to Cart
      </button>
    </div>
  );
}