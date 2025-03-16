import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import "./Dashboard.css";
import Breakfast from "../../assets/images/breakfast.jpg";
import Lunch from "../../assets/images/lunch.jpg";
import Dinner from "../../assets/images/dinner.jpg";
import Snacks from "../../assets/images/snacks.jpg";
import Desserts from "../../assets/images/dessert.jpg";
import Healthy from "../../assets/images/Healthy.jpg";
import { userLoginContext } from "../../contexts/UserLoginContext";
import UserEditModal from "../dashboard/UserEditModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(userLoginContext);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    { name: "Breakfast", img: Breakfast },
    { name: "Lunch", img: Lunch },
    { name: "Dinner", img: Dinner },
    { name: "Snacks", img: Snacks },
    { name: "Desserts", img: Desserts },
    { name: "Healthy", img: Healthy },
  ];

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveDetails = (updatedUser) => {
    console.log("User details updated:", updatedUser);
    setIsEditModalOpen(false);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <CgProfile className="profile-icon large" />
        <h2 className="user-name">{currentUser.username}</h2>
        <p className="user-email">{currentUser.email}</p>
        <button className="edit-profile" onClick={() => setIsEditModalOpen(true)}>
          Edit Details ✎
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="homepage-section-title">What's Cooking!!</h2>
        <div className="homepage-category-grid">
          {categories.map((category, index) => (
            <Link to={`/category/${category.name.toLowerCase()}`} className="homepage-category-card" key={index}>
              <div className="homepage-category-circle">
                <img src={category.img} alt={category.name} className="homepage-category-image" />
              </div>
              <h5 className="homepage-category-name">{category.name}</h5>
            </Link>
          ))}
        </div>

        <section className="saved-recipes">Your saved recipes (Click to view)</section>
        <section className="posts">
          <p>Your posts</p>
          <button className="edit-post">✎</button>
        </section>
      </main>

      {/* Right Sidebar */}
      <aside className="right-sidebar">
        <div className="roulette" ref={dropdownRef}>
          <button className="past-recipes" onClick={() => setShowDropdown(!showDropdown)}>
            Past Roulette Recipes ▼
          </button>
          {showDropdown && (
            <div className="dropdown visible">
              {currentUser.roulette_recipes?.length > 0 ? (
                currentUser.roulette_recipes.map((recipe, index) => (
                  <div key={index} className="dropdown-item">
                    <Link to={`/recipe/${encodeURIComponent(recipe.title.replace(/\s+/g, "-").toLowerCase())}`} className="dropdown-link">
                      {recipe.title}
                    </Link>
                  </div>
                ))
              ) : (
                <div className="no-recipes">No past recipes found</div>
              )}
            </div>
          )}
        </div>

        <section className="fridge-section">
          <p>What's in your fridge?</p>
          <button onClick={() => navigate("/CoolAi")}>Go to CoolAi</button>
        </section>
      </aside>

      {/* User Edit Modal */}
      {isEditModalOpen && (
        <UserEditModal user={currentUser} onSave={handleSaveDetails} onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;
