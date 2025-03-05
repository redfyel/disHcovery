// filters.jsx
import React, { useState, useEffect } from "react";
import "./Filters.css";


const RecipeFilter = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    mealType: [],
    diet: [],
    cookTime: [],
    cuisine: [],
    hasVideo: false,
  });


  const categories = [
    "Main Course",
    "Appetizer",
    "Salad",
    "Soup",
    "Sweet",
    "Quick & Easy",
  ];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
  const diets = [
    "Pescatarian",
    "Vegan",
    "Vegetarian",
    "Low Carb",
    "Keto",
    "Paleo",
    "Dairy-Free",
    "Gluten-Free",
    "Soy-Free",
  ];
  const cookTimes = ["10 minutes", "30 minutes", "45 minutes"];
  const cuisines = ["Japanese", "American", "British", "Italian", "Mexican", "Indian"];


  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);


  const toggleFilter = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };


  const handleVideoFilterChange = () => {
    setSelectedFilters((prev) => ({
      ...prev,
      hasVideo: !prev.hasVideo,
    }));
  };


  const hasVideoOptions = ["Recipes with Videos"];


  const renderFilterSection = (filterType, items, isVideo = false) => {
    return (
      <div className="filter-section">
        <h3>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</h3>
        <div className="filter-tags">
          {items.map((item) => (
            <span
              key={item}
              className={`filter-tag ${
                isVideo
                  ? selectedFilters[filterType]
                    ? "selected"
                    : ""
                  : selectedFilters[filterType].includes(item)
                  ? "selected"
                  : ""
              }`}
              onClick={() => {
                if (isVideo) {
                  handleVideoFilterChange();
                } else {
                  toggleFilter(filterType, item);
                }
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div className="filter-container">
      <h2>Filters</h2>
      {renderFilterSection("categories", categories)}
      {renderFilterSection("mealType", mealTypes)}
      {renderFilterSection("diet", diets)}
      {renderFilterSection("cookTime", cookTimes)}
      {renderFilterSection("cuisine", cuisines)}
      {renderFilterSection("hasVideo", hasVideoOptions, true)}
    </div>
  );
};


export default RecipeFilter;


