import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { FaUtensils, FaGlobe, FaClock, FaLeaf } from "react-icons/fa"; 
import ExploreDropdown from "./ExploreDropdown";
import "./Explore.css";

// Example categories with icons
const categories = {
  Categories: {
    icon: <FaUtensils />,
    filters: ["Main Course", "Appetizer", "Salad"],
  },
  Cuisine: {
    icon: <FaGlobe />,
    filters: ["American", "British", "Italian", "Mexican", "Indian", "Mediterranean"],
  },
  MealType: {
    icon: <FaClock />,
    filters: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
  },
  Diet: {
    icon: <FaLeaf />,
    filters: ["Vegan", "Keto", "Paleo", "Gluten Free", "Ovo Vegetarian"],
  },
};

function Explore() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const exploreButtonRef = useRef(null);

  const handleFilterClick = (category, filter) => {
    const query = new URLSearchParams({ [category]: filter }).toString();
    navigate(`/explore?${query}`);
  };

  return (
    <div>
      {/* The "Explore" link (anchor) */}
      <Link
        to="#"
        className="explore-button"
        ref={exploreButtonRef}
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        Explore
      </Link>

      {/* The dropdown itself, rendered in a Portal */}
      <ExploreDropdown
        show={showDropdown}
        anchorRef={exploreButtonRef}
        onFilterClick={handleFilterClick}
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
        categories={categories}
      />
    </div>
  );
}

export default Explore;
