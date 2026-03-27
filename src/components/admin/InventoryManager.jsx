import React, { useState } from "react";
import { PRODUCTS } from "../../data/products";

const InventoryManager = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  // Upload new image
  const handleUploadNewImage = (item) => {
    setSelectedItem(item);
    document.getElementById("uploadInput").click();
  };

  // Replace main image
  const handleReplaceMainImage = (item) => {
    setSelectedItem(item);
    document.getElementById("replaceInput").click();
  };

  // Remove image
  const handleRemoveImage = (item) => {
    alert(`This would remove the main image for: ${item.name}`);
  };

  // Edit item
  const handleEditItem = (item) => {
    alert(`Edit Item clicked for: ${item.name}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Inventory Manager</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "20px",
        }}
      >
        {PRODUCTS.map((item) => {
          const mainImage =
            item.images && item.images.length > 0
              ? `/images/${item.images[0]}`
              : null;

          return (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                background: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              {/* IMAGE DISPLAY */}
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    background: "#f0f0f0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777",
                    fontSize: "14px",
                    marginBottom: "10px",
                  }}
                >
                  No Images Assigned
                </div>
              )}

              <h2 style={{ margin: "0 0 10px 0" }}>{item.name}</h2>

              <p><strong>ID:</strong> {item.id}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Type:</strong> {item.type}</p>

              {/* PRICING */}
              {item.dryPrice && <p><strong>Dry Price:</strong> ${item.dryPrice}</p>}
              {item.wetPrice && <p><strong>Wet Price:</strong> ${item.wetPrice}</p>}
              {item.price && <p><strong>Price:</strong> ${item.price}</p>}

              {/* DIMENSIONS */}
              {item.dimensions && (
                <p><strong>Dimensions:</strong> {item.dimensions}</p>
              )}
              {item.spaceNeeded && (
                <p><strong>Space Needed:</strong> {item.spaceNeeded}</p>
              )}

              {/* AGE RANGE */}
              {(item.minAge || item.maxAge) && (
                <p>
                  <strong>Ages:</strong>{" "}
                  {item.minAge ? `${item.minAge}+` : ""}{" "}
                  {item.maxAge ? `to ${item.maxAge}` : ""}
                </p>
              )}

              {/* IDEAL GUESTS */}
              {item.idealGuests && (
                <p><strong>Ideal Guests:</strong> {item.idealGuests}</p>
              )}

              {/* DESCRIPTION */}
              {item.description && (
                <p><strong>Description:</strong> {item.description}</p>
              )}

              {/* BEST FOR */}
              {item.bestFor && (
                <p><strong>Best For:</strong> {item.bestFor.join(", ")}</p>
              )}

              {/* TAGS */}
              {item.tags && (
                <p><strong>Tags:</strong> {item.tags.join(", ")}</p>
              )}

              {/* IMAGE MANAGEMENT SECTION */}
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  background: "#fafafa",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                }}
              >
                <h4 style={{ margin: "0 0 10px 0" }}>Images</h4>

                {item.images && item.images.length > 0 ? (
                  <ul style={{ paddingLeft: "20px", margin: "0 0 10px 0" }}>
                    {item.images.map((img, index) => (
                      <li key={index}>{img}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#777" }}>No images assigned</p>
                )}

                <button
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginBottom: "6px",
                  }}
                  onClick={() => handleUploadNewImage(item)}
                >
                  Upload New Image
                </button>

                <button
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#2196f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginBottom: "6px",
                  }}
                  onClick={() => handleReplaceMainImage(item)}
                >
                  Replace Main Image
                </button>

                <button
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemoveImage(item)}
                >
                  Remove Image
                </button>
              </div>

              {/* EDIT BUTTON */}
              <button
                style={{
                  marginTop: "15px",
                  width: "100%",
                  padding: "10px",
                  background: "#f4b400",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => handleEditItem(item)}
              >
                Edit Item
              </button>
            </div>
          );
        })}
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        id="uploadInput"
        style={{ display: "none" }}
        onChange={() =>
          alert(`Upload triggered for: ${selectedItem?.name}`)
        }
      />

      <input
        type="file"
        id="replaceInput"
        style={{ display: "none" }}
        onChange={() =>
          alert(`Replace triggered for: ${selectedItem?.name}`)
        }
      />
    </div>
  );
};

export default InventoryManager;