// src/components/BuzzyBot/BuzzyChatWindow.jsx
import React, { useState } from "react";
import "./BuzzyChatWindow.css";
import { buzzyBrain } from "./buzzyBrain";

export default function BuzzyChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    {
      from: "buzzy",
      type: "text",
      text: "Hey there! I’m Buzzy. Need help picking the perfect inflatable?",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = (msgOverride = null) => {
    const userInput = msgOverride || input;
    if (!userInput.trim()) return;

    const userMsg = { from: "user", type: "text", text: userInput };
    const botReply = buzzyBrain(userInput, messages);

    setMessages((prev) => [...prev, userMsg, botReply]);
    if (!msgOverride) setInput("");
  };

  return (
    <div className="buzzy-chat-window">
      {/* HEADER WITH MASCOT */}
      <div className="buzzy-chat-header">
        <img src="/images/buzzybuzzybee.png" alt="Buzzy mascot" />
        <span className="buzzy-chat-header-title">Buzzy</span>

        <button className="buzzy-chat-close" onClick={onClose}>
          ✖
        </button>
      </div>

      {/* MESSAGES */}
      <div className="buzzy-chat-messages">
        {messages.map((m, i) => {
          // -----------------------------
          // GALLERY MESSAGE
          // -----------------------------
          if (m.type === "gallery") {
            return (
              <div key={i} className={`msg ${m.from}`}>
                {m.text && <div className="gallery-title">{m.text}</div>}
                <div className="gallery-grid">
                  {m.items.map((item, idx) => (
                    <a
                      key={idx}
                      className="gallery-item"
                      href={`/catalog/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.src && (
                        <img
                          src={item.src}
                          alt={item.label}
                          className="chat-img"
                        />
                      )}
                      <div className="img-label">{item.label}</div>
                    </a>
                  ))}
                </div>
              </div>
            );
          }

          // -----------------------------
          // IMAGE MESSAGE
          // -----------------------------
          if (m.type === "image") {
            return (
              <div key={i} className={`msg ${m.from}`}>
                <img src={m.src} alt={m.label} className="chat-img" />
                {m.label && <div className="img-label">{m.label}</div>}
              </div>
            );
          }

          // -----------------------------
          // NAVIGATION MESSAGE (FIXED)
          // -----------------------------
          if (m.type === "nav") {
            return (
              <div key={i} className={`msg ${m.from}`}>
                {m.text && <div className="nav-text">{m.text}</div>}
                <a href={m.to} className="nav-btn">
                  {m.button}
                </a>
              </div>
            );
          }

          // -----------------------------
          // OPTIONS MESSAGE
          // -----------------------------
          if (m.type === "options") {
            return (
              <div key={i} className={`msg ${m.from}`}>
                {m.text && <div>{m.text}</div>}
                <div className="options-container">
                  {m.options?.map((opt, idx) => (
                    <button
                      key={idx}
                      className="option-btn"
                      onClick={() => sendMessage(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          // -----------------------------
          // DEFAULT TEXT MESSAGE
          // -----------------------------
          return (
            <div key={i} className={`msg ${m.from}`}>
              {m.from === "buzzy" && (
                <img
                  src="/images/buzzybuzzybee.png"
                  alt="Buzzy mascot"
                  className="msg-bee-icon"
                />
              )}
              <span>{m.text}</span>
            </div>
          );
        })}
      </div>

      {/* INPUT AREA */}
      <div className="buzzy-chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask me anything!"
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </div>
  );
}
