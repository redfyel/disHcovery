import React, { useState } from "react";
import "./Filters.css"; // Import the CSS file

const RecipeFilter = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedIngredients] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");
  const [selectedCookTime, setSelectedCookTime] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedNutrition, setSelectedNutrition] = useState("");

  const Categories = ["Quick & Easy", "Healthy", "Family-Friendly", "Budget-Friendly", "One-Pot", "Comfort Food", "Seasonal", "Special Occasion", "BBQ", "Soup", "Salad", "Pasta", "Baking", "Grilling"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Appetizer", "Side Dish", "Main Course"];
  const diets = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "Keto", "Paleo", "High-Protein"];
  const cookTimes = ["Under 15 min", "Under 30 min", "Under 60 min"];
  const cuisines = ["American", "British", "Italian", "Mexican", "Indian", "Chinese", "French", "Thai", "Japanese", "Mediterranean"];



  const handleIngredientChange = (ingredient) => {
    setSelectedCategories((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleFilterChange = () => {
    onFilterChange({
      Categories: selectedCategories,
      mealType: selectedMealType,
      diet: selectedDiet,
      cookTime: selectedCookTime,
      cuisine: selectedCuisine,
      nutrition: selectedNutrition,
    });
  };

  return (
    <div className="filter-container">
      <h2>Filter</h2>
      <div className="filter-section">
        <h3>Categories</h3>
        {Categories.map((ingredient) => (
          <label key={ingredient}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(ingredient)}
              onChange={() => {
                handleIngredientChange(ingredient);
                handleFilterChange();
              }}
            />
            {ingredient}
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
              onChange={() => {
                setSelectedMealType(type);
                handleFilterChange();
              }}
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
              onChange={() => {
                setSelectedDiet(diet);
                handleFilterChange();
              }}
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
              onChange={() => {
                setSelectedCookTime(time);
                handleFilterChange();
              }}
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
              onChange={() => {
                setSelectedCuisine(cuisine);
                handleFilterChange();
              }}
            />
            {cuisine}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RecipeFilter;