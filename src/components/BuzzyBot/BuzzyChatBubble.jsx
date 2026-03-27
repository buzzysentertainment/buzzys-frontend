import React from "react";
import "./BuzzyChatBubble.css";

export default function BuzzyChatBubble({ onClick }) {
  return (
    <div className="buzzy-chat-bubble" onClick={onClick}>
      <img
        src="/images/buzzybuzzybee.png"
        alt="Buzzy Mascot"
        className="buzzy-chat-icon"
      />
    </div>
  );
}
