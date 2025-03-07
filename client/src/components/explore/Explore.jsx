import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUtensils, FaGlobe, FaClock, FaLeaf } from "react-icons/fa"; 
import "./Explore.css"; 

const categories = {
  "Categories": { icon: <FaUtensils />, filters: ["Main Course", "Appetizer", "Salad"] },
  "Cuisine": { icon: <FaGlobe />, filters: ["American", "British", "Italian", "Mexican", "Indian", "Mediterranean"] },
  "Meal Type": { icon: <FaClock />, filters: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"] },
  "Diet": { icon: <FaLeaf />, filters: [
   "High Protien",
    "Vegan", "Vegetarian", "Low Carb", "Keto", "Paleo", "Dairy Free", "Gluten Free",
  ] },
};

function Explore() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleFilterClick = (category, filter) => {
    const query = new URLSearchParams({ [category]: filter }).toString();
    navigate(`/explore?${query}`);
  };

  return (
    <div
      className="dropdown-container"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <Link to="#">Explore</Link>
      {showDropdown && (
        <div className="dropdown show">
          {Object.entries(categories).map(([category, { icon, filters }]) => (
            <div key={category} className="dropdown-category">
              <h4>{icon} {category}</h4>
              {filters.map((filter) => (
                <div
                  key={filter}
                  className="dropdown-item"
                  onClick={() => handleFilterClick(category, filter)}
                >
                  {filter}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;
