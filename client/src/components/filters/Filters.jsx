import React, { useState, useEffect } from "react";
import "./Filters.css"; // Import the CSS file

const RecipeFilter = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    mealType: [],
    diet: [],
    cookTime: [],
    cuisine: [],
  });

  const categories = ["Main Course", "Appetizer","Salad","Soup","Sweet","Quick & Easy"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
  const diets = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb"];
  const cookTimes = ["10 minutes", "15 minutes", "30 minutes", "60 minutes"];
  const cuisines = ["American", "British", "Italian", "Mexican", "Indian"];

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters]); 

  // Generic function to handle checkbox selection
  const handleCheckboxChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value) // Remove if already selected
        : [...prev[filterType], value], // Add if not selected
    }));
  };

  return (
    <div className="filter-container">
      <h2>Filter</h2>

      {/* Categories Filter */}
      <div className="filter-section">
        <h3>Categories</h3>
        {categories.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={selectedFilters.categories.includes(category)}
              onChange={() => handleCheckboxChange("categories", category)}
            />
            {category}
          </label>
        ))}
      </div>

      {/* Meal Type Filter */}
      <div className="filter-section">
        <h3>Meal Type</h3>
        {mealTypes.map((type) => (
          <label key={type}>
            <input
              type="checkbox"
              checked={selectedFilters.mealType.includes(type)}
              onChange={() => handleCheckboxChange("mealType", type)}
            />
            {type}
          </label>
        ))}
      </div>

      {/* Diet Filter */}
      <div className="filter-section">
        <h3>Diet</h3>
        {diets.map((diet) => (
          <label key={diet}>
            <input
              type="checkbox"
              checked={selectedFilters.diet.includes(diet)}
              onChange={() => handleCheckboxChange("diet", diet)}
            />
            {diet}
          </label>
        ))}
      </div>

      {/* Cook Time Filter */}
      <div className="filter-section">
        <h3>Cook Time</h3>
        {cookTimes.map((time) => (
          <label key={time}>
            <input
              type="checkbox"
              checked={selectedFilters.cookTime.includes(time)}
              onChange={() => handleCheckboxChange("cookTime", time)}
            />
            {time}
          </label>
        ))}
      </div>

      {/* Cuisine Filter */}
      <div className="filter-section">
        <h3>Cuisine</h3>
        {cuisines.map((cuisine) => (
          <label key={cuisine}>
            <input
              type="checkbox"
              checked={selectedFilters.cuisine.includes(cuisine)}
              onChange={() => handleCheckboxChange("cuisine", cuisine)}
            />
            {cuisine}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RecipeFilter;
