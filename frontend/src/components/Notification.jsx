import React, { useEffect } from "react";
import "../styles/Notification.css";

export default function Notification({ message, type = "info", onClose, autoClose = 5000 }) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
