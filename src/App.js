import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BookingSuccess from "./pages/BookingSuccess";
import ScrollToTop from "./components/ScrollToTop";

import BuzzyChatBubble from "./components/BuzzyBot/BuzzyChatBubble";
import BuzzyChatWindow from "./components/BuzzyBot/BuzzyChatWindow";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import BookNow from "./pages/BookNow";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Availability from "./components/Availability"; // Import the new component

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import RequireAdmin from "./components/RequireAdmin";

import FAQ from "./pages/FAQ";
import SafetyRules from "./pages/SafetyRules";
import About from "./pages/About";

import "./styles.css";

function App() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load cart and selected date from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("buzzy_hive_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [bookingDate, setBookingDate] = useState(() => {
    return localStorage.getItem("buzzy_selected_date") || "";
  });

  useEffect(() => {
    localStorage.setItem("buzzy_hive_cart", JSON.stringify(cart));
    localStorage.setItem("buzzy_selected_date", bookingDate);
  }, [cart, bookingDate]);

  // UPDATED: Now accepts an optional date from the Availability component
  const addToCart = (item, date = null) => {
    if (date) {
      // Format date to YYYY-MM-DD for backend compatibility
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      setBookingDate(dateString);
    }
    
    setCart([...cart, item]);
    navigate("/cart"); // Take them to cart so they see the item added
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    setBookingDate("");
    localStorage.removeItem("buzzy_hive_cart");
    localStorage.removeItem("buzzy_selected_date");
  };

  return (
    <>
      <Header
        onBook={() => navigate("/book")}
        onCartOpen={() => navigate("/cart")}
        cartCount={cart.length}
      />

      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/catalog" element={<Catalog addToCart={addToCart} />} />
        
	    <Route path="/about" element={<About />} />
		
        {/* NEW: Availability Route */}
        <Route path="/availability" element={<Availability addToCart={addToCart} />} />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              bookingDate={bookingDate} // Pass the date to the Cart page
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          }
        />

        <Route path="/book" element={<BookNow />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/safety-rules" element={<SafetyRules />} />

		<Route path="/booking-success" element={<BookingSuccess />} />
		
        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
      </Routes>

      <Footer />

      <BuzzyChatBubble onClick={() => setIsChatOpen(true)} />
      {isChatOpen && (
        <BuzzyChatWindow onClose={() => setIsChatOpen(false)} />
      )}
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      {/* This component watches the URL and resets the scroll to the top */}
      <ScrollToTop />
      <App />
    </Router>
  );
}