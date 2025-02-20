import React, { useState } from "react";
import "./Filters.css"; // Import the CSS file

const RecipeFilter = ({ onFilterChange }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");
  const [selectedCookTime, setSelectedCookTime] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedNutrition, setSelectedNutrition] = useState("");

  const ingredients = [
    "Milk",
    "Eggs",
    "Bread",
    "Potatoes",
    "Onions",
    "Carrots",
    "Butter",
    "Chicken",
    "Cheese",
    "Mushrooms",
  ];
  const mealTypes = [
    "Appetizers",
    "Beverages",
    "Breads",
    "Breakfast",
    "Brunch",
  ];
  const diets = [
    "Lacto Vegetarian",
    "Ovo Vegetarian",
    "Ovo-Lacto Vegetarian",
    "Pescatarian",
    "Vegan",
  ];
  const cookTimes = ["Under 15 min", "Under 30 min", "Under 60 min"];
  const cuisines = ["African", "American", "Asian", "Australian", "British"];
  const nutritionOptions = [
    "Healthy",
    "High Protein",
    "Low Sugars",
    "Low Energy",
    "Low Sodium",
  ];

  const handleIngredientChange = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleFilterChange = () => {
    onFilterChange({
      ingredients: selectedIngredients,
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
        <h3>Ingredients</h3>
        {ingredients.map((ingredient) => (
          <label key={ingredient}>
            <input
              type="checkbox"
              checked={selectedIngredients.includes(ingredient)}
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

            <div className="filter-section">
        <h3>Nutrition</h3>
        {nutritionOptions.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="nutrition"
              value={option}
              checked={selectedNutrition === option}
              onChange={() => {
                setSelectedNutrition(option);
                handleFilterChange();
              }}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RecipeFilter;