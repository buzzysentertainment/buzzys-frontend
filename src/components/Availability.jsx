import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "./Availability.css";

import { PRODUCTS } from "../data/products";
import { PRICES } from "../data/prices"; // <--- Added this back in

export default function Availability({ addToCart }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState(null);

  const firestoreDate = useMemo(
    () => selectedDate.toISOString().split("T")[0],
    [selectedDate]
  );

  const displayDate = useMemo(
    () => selectedDate.toLocaleDateString("en-US"),
    [selectedDate]
  );

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const response = await axios.post(
          "https://buzzys-backend.onrender.com/book/check-availability",
          {
            date: firestoreDate,
            items: PRODUCTS.map((item) => item.name),
          }
        );
        setAvailability(response.data.available ? "available" : "unavailable");
      } catch (error) {
        console.error("Availability lookup failed:", error);
        setAvailability(null);
      }
    };

    checkAvailability();
  }, [firestoreDate]);

  return (
    <div className="availability-inner">

      {/* LEFT SIDE — CALENDAR */}
      <div className="calendar-wrapper">
        <Calendar
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />

        <div className="selected-date">
          Selected Date: <strong>{displayDate}</strong>
        </div>

        {availability && (
          <div
            className={`availability-badge ${
              availability === "available" ? "badge-available" : "badge-unavailable"
            }`}
          >
            {availability === "available" ? "Available" : "Unavailable"}
          </div>
        )}
      </div>

      {/* RIGHT SIDE — GRID WITH PRICE FIX */}
      <div className="catalog-grid-box">
        <h3 className="catalog-title">Pick Your Item</h3>

        <div className="catalog-grid">
          {PRODUCTS.map((item) => {
            // Get the price for this specific item from our data
            const itemPrice = PRICES[item.id]?.dry || 0;

            return (
              <div key={item.id} className="catalog-card">
                {/* Visual price tag so they see it before adding */}
                <div className="item-price-overlay">${itemPrice}</div>
                
                <img
                  src={`/images/${item.filename}`}
                  alt={item.name}
                  className="catalog-img"
                />

                <div className="catalog-info">
                  <span className="catalog-name">{item.name}</span>

                  <button
                    className="catalog-add-btn"
                    onClick={() => {
                      // CRITICAL: We create a new object that includes the price 
                      // so the Cart component doesn't receive 'undefined'
                      const pricedItem = { 
                        ...item, 
                        price: itemPrice,
                        date: firestoreDate 
                      };
                      addToCart(pricedItem, selectedDate);
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
