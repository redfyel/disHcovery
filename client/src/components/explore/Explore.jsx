import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { FaUtensils, FaGlobe, FaClock, FaLeaf } from "react-icons/fa"; 
import ExploreDropdown from "./ExploreDropdown";
import "./Explore.css";

const categories = {
  Categories: {
    icon: <FaUtensils />,
    filters: ["Main Course", "Appetizer", "Salad", "Quick & Easy", "Soup", "Comfort Food"],
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
    filters: ["Vegan", "Keto", "High-Protein", "Paleo", "Gluten Free", "Ovo Vegetarian"],
  },
};

function Explore() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const exploreButtonRef = useRef(null);

  const handleFilterClick = (category, filter) => {
    const query = new URLSearchParams({ [category]: filter }).toString();
    navigate(`/recipes/explore?${query}`);
  };

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 300);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", display: "inline-block" }}
    >
      <Link to="#" className="explore-button" ref={exploreButtonRef}>
        Explore
      </Link>
      <ExploreDropdown
        show={showDropdown}
        anchorRef={exploreButtonRef}
        onFilterClick={handleFilterClick}
        categories={categories}
      />
    </div>
  );
}

export default Explore;
