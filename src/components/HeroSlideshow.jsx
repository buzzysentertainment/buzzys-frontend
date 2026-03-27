import { useState, useEffect } from "react";
import { db } from "../firebase"; // Adjust this path to your firebase config
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import "./HeroSlideshow.css";

// Your original static images - KEPT as a safety net
const staticSlides = [
  { type: "image", src: "/images/image7.webp" },
  { type: "image", src: "/images/image8.webp" },
  { type: "image", src: "/images/image9.webp" },
  { type: "image", src: "/images/image10.webp" },
  { type: "image", src: "/images/image11.webp" },
  { type: "image", src: "/images/image12.webp" },
  { type: "image", src: "/images/image13.webp" },
  { type: "image", src: "/images/image14.webp" },
  { type: "image", src: "/images/image15.webp" },
  { type: "image", src: "/images/image1.webp" },
  { type: "image", src: "/images/image2.webp" },
  { type: "image", src: "/images/image3.webp" },
  { type: "image", src: "/images/image4.webp" },
  { type: "image", src: "/images/image5.webp" },
  { type: "image", src: "/images/image6.webp" }
];

export default function HeroSlideshow() {
  // Start the state with your static images already inside
  const [slides, setSlides] = useState(staticSlides);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // 1. Listen for new uploads in Firestore
    const q = query(collection(db, "hero-slideshow"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dynamicSlides = snapshot.docs.map(doc => ({
        id: doc.id,
        type: doc.data().type || "image",
        src: doc.data().imageUrl,
      }));

      // 2. Combine: Put new uploads FIRST, then your original static slides
      setSlides([...dynamicSlides, ...staticSlides]);
    });

    return () => unsubscribe();
  }, []);

  // Auto-advance logic
  useEffect(() => {
    if (slides.length === 0) return;
    const delay = slides[index]?.type === "video" ? 5000 : 3500;
    
    const interval = setInterval(() => {
      nextSlide();
    }, delay);

    return () => clearInterval(interval);
  }, [index, slides]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="slideshow-container">
      <button className="nav-btn prev-btn" onClick={prevSlide}>❮</button>

      {slides[index]?.type === "video" ? (
        <video
          key={slides[index].src}
          src={slides[index].src}
          className="slideshow-image"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img
          src={slides[index]?.src}
          className="slideshow-image"
          alt="Buzzy's Inflatables"
        />
      )}

      <button className="nav-btn next-btn" onClick={nextSlide}>❯</button>
    </div>
  );
}