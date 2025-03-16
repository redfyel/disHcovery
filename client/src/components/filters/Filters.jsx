import React, { useState, useEffect } from "react";
import { FaUtensils, FaClock, FaConciergeBell, FaUsers } from "react-icons/fa";
import "./Filters.css";

const Filters = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    mealType: "",
    cuisine: [],
    dietFilters: [],
    hasVideo: false,
  });

  const categories = [
    "Quick & Easy", "Healthy", "Soup", "Salad", "Pasta", "Main Course",
    "Appetizer", "Sweet", "Comfort Food",
  ];

  const mealTypes = ["Breakfast", "Lunch", "Dinner",  "Dessert","Snack"];

  const cuisines = ["American", "British", "Italian", "Mexican", "Indian", "Chinese", "French", "Thai", "Japanese", "Mediterranean"];

  const dietFilters = ["Vegetarian", "Paleo", "Gluten-Free", "Dairy-Free",  "High-Protein","Keto","Vegan",];

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  const toggleCheckboxFilter = (filterType, value, event) => {
    event.preventDefault();
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handleRadioFilter = (filterType, value, event) => {
    event.preventDefault();
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleVideoFilterChange = (event) => {
    event.preventDefault();
    setSelectedFilters((prev) => ({
      ...prev,
      hasVideo: !prev.hasVideo,
    }));
  };

  return (
    <div className="filter-container">
      <div className="filter-section">
        <h3>Video</h3>
        <label className="toggle-switch">
          <input type="checkbox" checked={selectedFilters.hasVideo} onChange={handleVideoFilterChange} />
          <span className="slider"></span>
        </label>
        <span className="toggle-label">{selectedFilters.hasVideo ? " With Video" : " Without Video"}</span>
      </div>
      <hr />

      <div className="filter-section">
        <h3>Categories</h3>
        <div className="filter-options">
          {categories.map((item) => (
            <button 
              key={item} 
              type="button" 
              className={`filter-button ${selectedFilters.categories.includes(item) ? "selected" : ""}`} 
              onMouseDown={(event) => toggleCheckboxFilter("categories", item, event)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <hr />

      <div className="filter-section">
        <h3>Meal Type</h3>
        <div className="filter-options meal-type-options">
          {mealTypes.map((item) => (
            <label key={item} className="filter-option meal-type-option">
              <input 
                type="radio" 
                name="mealType" 
                value={item} 
                checked={selectedFilters.mealType === item} 
                onMouseDown={(event) => handleRadioFilter("mealType", item, event)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
      <hr />

      <div className="filter-section">
        <h3> <FaUtensils />    Cuisine</h3>
        <div className="filter-options">
          {cuisines.map((item) => (
            <button 
              key={item} 
              type="button" 
              className={`filter-button ${selectedFilters.cuisine.includes(item) ? "selected" : ""}`} 
              onMouseDown={(event) => toggleCheckboxFilter("cuisine", item, event)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <hr />

      <div className="filter-section">
        <h3>Diet Filters</h3>
        <div className="filter-options diet-filter-options">
          {dietFilters.map((item) => (
            <label key={item} className="filter-option diet-filter-option">
              <input 
                type="checkbox" 
                value={item} 
                checked={selectedFilters.dietFilters.includes(item)} 
                onMouseDown={(event) => toggleCheckboxFilter("dietFilters", item, event)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Filters;
