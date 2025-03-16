import React, { useState } from "react";
import "./Dashboard.css";

const UserEditModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    bio: user.bio || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="modal-body">
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />

          <label>Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} />

          <div className="modal-actions">
            <button className="save-btn" onClick={() => onSave(formData)}>Save</button>
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
