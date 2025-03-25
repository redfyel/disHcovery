import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import { userLoginContext } from "../../contexts/UserLoginContext";
import { useToast } from "../../contexts/ToastProvider";

const UserEditModal = ({ onClose, onSave }) => {
  const { loginStatus, currentUser, setCurrentUser, token } = useContext(userLoginContext);
  const { showToast } = useToast();
  

  // Initialize state with current user data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  // Populate form data when modal opens
  useEffect(() => {
    if (currentUser) {
      setFormData({
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("https://dishcovery-j22s.onrender.com/user-api/edit-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.updatedUser); 
        onSave(data.updatedUser);
      } else {
        showToast("Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("An error occurred while updating profile.", "error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button
            onClick={onClose}
            className="btn-close p-2"
          ></button>
        </div>

        <div className="modal-body">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder={currentUser?.phone || "Enter phone"}
            onChange={handleChange}
          />

          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder={currentUser?.address || "Enter address"}
            onChange={handleChange}
          />

          <label>Bio</label>
          <textarea
            name="bio"
            placeholder={currentUser?.bio || "Enter bio"}
            onChange={handleChange}
          ></textarea>

          <div className="modal-actions">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
