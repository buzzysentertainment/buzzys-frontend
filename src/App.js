import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react"; // Added useEffect
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import "./styles.css";


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Initialize cart from LocalStorage if it exists
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("buzzy_hive_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Save to LocalStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem("buzzy_hive_cart", JSON.stringify(cart));
  }, [cart]);

  const openBooking = () => setIsModalOpen(true);
  const closeBooking = () => setIsModalOpen(false);

  const addToCart = (item) => {
    setCart([...cart, item]);
	setIsModalOpen(true);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("buzzy_hive_cart"); // Clean up storage
  };
   // ⭐ 3. Firestore connection test — THIS is where it goes
  useEffect(() => {
    async function testConnection() {
      try {
        const snapshot = await getDocs(collection(db, "test"));
        console.log("Firestore connected! Docs:", snapshot.docs.length);
      } catch (error) {
        console.error("Firestore error:", error);
      }
    }
    testConnection();
  }, []);


  return (
    <Router>
      <div className="App">
        <Header onBook={openBooking} cartCount={cart.length} />

        <Routes>
          <Route path="/" element={<Home openBooking={openBooking} />} />
          <Route path="/catalog" element={<Catalog addToCart={addToCart} />} />
          <Route 
            path="/view_cart" 
            element={
              <Cart 
                cart={cart} 
                removeFromCart={removeFromCart} 
                clearCart={clearCart} 
              />
            } 
          />
        </Routes>

        <Footer />

        {isModalOpen && (
          <BookingModal 
            onClose={closeBooking} 
            cart={cart} 
            clearCart={clearCart} 
          />
        )}
      </div>
    </Router>
  );
}
export default App;