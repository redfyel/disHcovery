import { Link, useNavigate } from "react-router-dom";
import Search from "../search-box/Search";
import { useState } from "react";
import logo from '../../assets/images/logoo.png'
import "./Header.css";

function Header() {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const categories = {
    Categories: ["Quick & Easy","Healthy",
      "Family-Friendly",
      "Budget-Friendly",
      "One-Pot",
      "Comfort Food",
      "Seasonal",
      "Special Occasion",
      "BBQ",
      "Soup",
      "Salad",
      "Pasta",
      "Baking",
      "Grilling"
      ],
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
 // Header component navigation functionality
const handleClick = (navigate, category) => {
  fetch(`http://localhost:4000/recipes/category/${encodeURIComponent(category)}`)
      .then(response => {
          if (!response.ok) {
              throw new Error("Failed to fetch recipes");
          }
          return response.json();
      })
      .then(data => {
          if (data.payload && data.payload.length > 0) {
              navigate(`/recipes/category/${encodeURIComponent(category)}`, { state: { recipes: data.payload, category: category } });
          } else {
              console.error("No recipes found");
              navigate(`/recipes/category/${encodeURIComponent(category)}`, { state: { recipes: [], category: category } });
          }
      })
      .catch(error => {
          console.error("Error fetching recipes:", error);
          navigate(`/recipes/category/${encodeURIComponent(category)}`, { state: { recipes: [], category: category } });
      });
};


  return (
    <header className="header">
      <Link to="/" className="logo">
        <img
          src={logo}
          alt="disHcovery Logo"
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
                      onClick={() => handleClick(navigate, filter)}
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