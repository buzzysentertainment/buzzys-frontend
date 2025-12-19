export default function InflatableCard({ title, price, imgKey, onBook }) {
   const imageMap = {
	dolphin: "/images/16-ft-Dolphin.png",
	rainbow: "/images/18ft-Rainbow-Rush.png",
	volcano: "/images/19-ft-Volcano.png",
	jumbo:   "/images/Double-Jumbo-Combo.png",
	funrun:  "/images/Fun-Run-Obstacle-Course.png"
};
  return (
    <div className="card inflatable-card">
      <div className="card-image-container">
        {imageMap[imgKey] ? (
          <img 
            src={imageMap[imgKey]} 
            alt={title} 
            className="inflatable-img" 
          />
        ) : (
          <div className="placeholder-icon" style={{ fontSize: '3.5rem' }}>🐝</div>
        )}
      </div>
      
      <h3>{title}</h3>
      {/* Added the price display so customers see what they are spending */}
      <p className="item-price">${price}</p>
      
      {/* Updated: We now pass the whole object. 
          The 'onBook' prop here is actually the 'addToCart' function 
          we passed down from App.js through the Catalog.
      */}
      <button className="btn-book" onClick={() => onBook({ title, price, image: imageMap[imgKey] })}>
        Add to Hive
      </button>
    </div>
  );
}