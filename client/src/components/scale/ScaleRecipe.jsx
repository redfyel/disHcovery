import React from "react";

/**
 * @param {number} servings - Current serving count (numeric).
 * @param {function} setServings - Function to update the serving count in parent.
 * @param {string} originalServingsText - The original recipe.servings string (e.g. "4 slices").
 * @param {number} baseServings - The original serving size from the recipe.
 * @param {Array} ingredients - Array of ingredients with quantity and unit.
 * @param {function} setScaledIngredients - Function to update scaled ingredients.
 */
const ScaleRecipe = ({ 
  servings, 
  setServings, 
  originalServingsText, 
  baseServings, 
  ingredients, 
  setScaledIngredients
}) => {
  // If the recipe servings text includes "slice", we can display "slices"
  const showSlices = originalServingsText?.toLowerCase().includes("slice");

  // Scale ingredients when servings change
  const scaleIngredients = (newServings) => {
    const scaled = ingredients.map(ingredient => ({
      ...ingredient,
      quantity: (ingredient.quantity * newServings) / baseServings,
    }));
    setScaledIngredients(scaled);
  };

  const incrementServings = () => {
    const newServings = servings + 1;
    setServings(newServings);
    scaleIngredients(newServings);
  };

  const decrementServings = () => {
    if (servings > 1) {
      const newServings = servings - 1;
      setServings(newServings);
      scaleIngredients(newServings);
    }
  };

  return (
    <div className="serving-control" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button onClick={decrementServings} className="serving-button">-</button>
      <span className="serving-number">{servings}{showSlices ? " slices" : ""}</span>
      <button onClick={incrementServings} className="serving-button">+</button>
    </div>
  );
};

export default ScaleRecipe;
