import React, { useState, useEffect } from "react";
import { FaUtensils, FaConciergeBell } from "react-icons/fa";
import { IoFastFoodSharp } from "react-icons/io5";
import { RiFilterFill } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import "./Filters.css";

const Filters = ({ onFilterChange }) => {
    const location = useLocation();

  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    mealType: "",
    cuisine: [],
    dietFilters: [],
    hasVideo: false,
  });

  useEffect(() => {
    if (location.pathname === "/recipes") {
      setSelectedFilters({
        categories: [],
        mealType: "",
        cuisine: [],
        dietFilters: [],
        hasVideo: false,
      });
    }
  }, [location]);

  const categories = [
    "Quick & Easy",
    "Healthy",
    "Soup",
    "Salad",
    "Pasta",
    "Main Course",
    "Appetizer",
    "Sweet",
    "Comfort Food",
  ];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"];
  const cuisines = [
    "American",
    "British",
    "Italian",
    "Mexican",
    "Indian",
    "Chinese",
    "French",
    "Thai",
    "Japanese",
    "Mediterranean",
  ];
  const dietFilters = [
    "Vegetarian",
    "Paleo",
    "Gluten-Free",
    "Dairy-Free",
    "High-Protein",
    "Keto",
    "Vegan",
  ];

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  const toggleCheckboxFilter = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handleRadioFilter = (filterType, value) => {
    setSelectedFilters((prev) => {
      return {
        ...prev,
        [filterType]: prev[filterType] === value ? "" : value,
      };
    });
  };

  const handleVideoFilterChange = () => {
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
          <input
            type="checkbox"
            checked={selectedFilters.hasVideo}
            onChange={handleVideoFilterChange}
          />
          <span className="slider"></span>
        </label>
        <span className="toggle-label">
          {selectedFilters.hasVideo ? " Recipes With Video" : " All Recipes"}
        </span>
      </div>
      <hr className="custom-hr" />

      <div className="filter-section">
        <h3>
          {" "}
          <IoFastFoodSharp size={23} /> Categories
        </h3>
        <div className="filter-options">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-button ${
                selectedFilters.categories.includes(item) ? "selected" : ""
              }`}
              onClick={() => toggleCheckboxFilter("categories", item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <hr className="custom-hr" />
      <div className="filter-section">
        <h3>
          <FaConciergeBell /> Meal Type
        </h3>
        <div className="filter-options meal-type-options">
          {mealTypes.map((item) => (
            <label key={item} className="filter-option meal-type-option">
              <input
                type="radio"
                name="mealType"
                value={item}
                checked={selectedFilters.mealType === item}
                onChange={() => {}}
                onClick={() => handleRadioFilter("mealType", item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="custom-hr" />

      <div className="filter-section">
        <h3>
          {" "}
          <FaUtensils /> Cuisine
        </h3>
        <div className="filter-options">
          {cuisines.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-button ${
                selectedFilters.cuisine.includes(item) ? "selected" : ""
              }`}
              onClick={() => toggleCheckboxFilter("cuisine", item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <hr className="custom-hr" />

      <div className="filter-section">
        <h3>
          {" "}
          <RiFilterFill size={23} /> Diet Filters
        </h3>
        <div className="filter-options diet-filter-options">
          {dietFilters.map((item) => (
            <label key={item} className="filter-option diet-filter-option">
              <input
               type="checkbox"
               value={item}
               checked={selectedFilters.dietFilters.includes(item)}
               onChange={() => toggleCheckboxFilter("dietFilters", item)}
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
