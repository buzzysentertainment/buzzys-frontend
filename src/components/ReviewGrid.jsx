import "./ReviewGrid.css";

export default function ReviewGrid() {
  const reviews = [
    {
      name: "Wendy Lopez",
      stars: 5,
      text: "They are very professional and prompt. Their equipment is super clean. We were well pleased with this rental and it was the star of the show for our event. Will definitely use them for our next one!",
    },
    {
      name: "Chesney Gowens",
      stars: 5,
      text: "Great and clean jump house! Friendly people.",
    },
    {
      name: "Kara Studdard",
      stars: 5,
      text: "We had the best experience! Would definitely recommend to others!",
    },
  ];

  return (
    <section className="review-grid-section">
      <h2 className="review-grid-title">Customer Buzz</h2>
      <div className="review-grid">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-stars">{"★".repeat(review.stars)}</div>
            <h4 className="review-name">{review.name}</h4>
            <p className="review-text">"{review.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}
