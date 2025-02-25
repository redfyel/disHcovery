import React, { useState, useEffect } from "react";
import "./Filters.css"; // Import the CSS file

const RecipeFilter = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");
  const [selectedCookTime, setSelectedCookTime] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedNutrition, setSelectedNutrition] = useState("");

  const categories = [
    "Quick & Easy", "Healthy", "Family-Friendly", "Budget-Friendly", "One-Pot",
    "Comfort Food", "Seasonal", "Special Occasion", "BBQ", "Soup", "Salad",
    "Pasta", "Baking", "Grilling"
  ];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Appetizer", "Side Dish", "Main Course"];
  const diets = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "Keto", "Paleo", "High-Protein"];
  const cookTimes = ["Under 15 min", "Under 30 min", "Under 60 min"];
  const cuisines = ["American", "British", "Italian", "Mexican", "Indian", "Chinese", "French", "Thai", "Japanese", "Mediterranean"];

  // Update filter state when any filter changes
  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      mealType: selectedMealType,
      diet: selectedDiet,
      cookTime: selectedCookTime,
      cuisine: selectedCuisine,
      nutrition: selectedNutrition,
    });
  }, [selectedCategories, selectedMealType, selectedDiet, selectedCookTime, selectedCuisine, selectedNutrition, onFilterChange]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="filter-container">
      <h2>Filter</h2>

      <div className="filter-section">
        <h3>Categories</h3>
        {categories.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            {category}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Meal Type</h3>
        {mealTypes.map((type) => (
          <label key={type}>
            <input
              type="radio"
              name="mealType"
              value={type}
              checked={selectedMealType === type}
              onChange={() => setSelectedMealType(type)}
            />
            {type}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Diet</h3>
        {diets.map((diet) => (
          <label key={diet}>
            <input
              type="radio"
              name="diet"
              value={diet}
              checked={selectedDiet === diet}
              onChange={() => setSelectedDiet(diet)}
            />
            {diet}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Cook Time</h3>
        {cookTimes.map((time) => (
          <label key={time}>
            <input
              type="radio"
              name="cookTime"
              value={time}
              checked={selectedCookTime === time}
              onChange={() => setSelectedCookTime(time)}
            />
            {time}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h3>Cuisine</h3>
        {cuisines.map((cuisine) => (
          <label key={cuisine}>
            <input
              type="radio"
              name="cuisine"
              value={cuisine}
              checked={selectedCuisine === cuisine}
              onChange={() => setSelectedCuisine(cuisine)}
            />
            {cuisine}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RecipeFilter;
