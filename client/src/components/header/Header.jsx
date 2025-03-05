import { Link, useNavigate } from "react-router-dom";
import Search from "../search-box/Search";
import { useState } from "react";
import "./Header.css";

function Header() {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const categories = {
    Categories: ["Main Course", "Appetizer", "Salad"],
    Cuisine: ["American", "British", "Italian", "Mexican", "Indian"],
    MealType: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
    Diet: [
      "Lacto Vegetarian",
      "Ovo Vegetarian",
      "Ovo-Lacto Vegetarian",
      "Pescatarian",
      "Vegan",
      "Vegetarian",
      "Low Carb",
      "Mediterranean",
      "Keto",
      "Paleo",
      "Dairy Free",
      "Gluten Free",
    ],
  };

  const handleFilterClick = (category, filter) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[category] = [filter];

      const query = new URLSearchParams();
      Object.keys(updatedFilters).forEach((key) => {
        updatedFilters[key].forEach((value) => {
          query.append(key, value);
        });
      });

      navigate(`/explore?${query.toString()}`);
      return updatedFilters;
    });
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img
          src="https://media.istockphoto.com/id/638708254/vector/cooking-process-vector-illustration-flipping-asian-food-in-a-pan.jpg?s=612x612&w=0&k=20&c=5CYIPce69zbyPaXpytKks_xLYIBdr3XN_RzDAQcn2Yw="
          alt="Dishcovery Logo"
        />
      </Link>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <div
          className="dropdown-container"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <Link to="#">Explore</Link>
          {showDropdown && (
            <div className="dropdown show">
              {Object.keys(categories).map((category) => (
                <div key={category} className="dropdown-category">
                  <h4>{category}</h4>
                  {categories[category].map((filter) => (
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
        <Link to="/saved">Saved</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Search />
    </header>
  );
}

export default Header;