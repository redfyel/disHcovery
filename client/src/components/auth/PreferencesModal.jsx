// PreferencesModal.jsx
import React from "react";
import UserPreferences from "./UserPreferences";
import "./PreferencesModal.css"; 

const PreferencesModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>X</button>
        {/* Pass onComplete so the quiz can signal when it's done */}
        <UserPreferences onComplete={onClose} />
      </div>
    </div>
  );
};

export default PreferencesModal;
