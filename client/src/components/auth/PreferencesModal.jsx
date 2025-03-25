// PreferencesModal.jsx
import React from "react";
import UserPreferences from "./userpreferences";
import "./PreferencesModal.css"; 

const PreferencesModal = ({ onClose }) => {
  return (
    <div className="pref-modal-overlay">
      <div className="pref-modal-content">
        <button className="pref-modal-close-btn" onClick={onClose}>X</button>
        {/* Pass onComplete so the quiz can signal when it's done */}
        <UserPreferences onComplete={onClose} />
      </div>
    </div>
  );
};

export default PreferencesModal;
