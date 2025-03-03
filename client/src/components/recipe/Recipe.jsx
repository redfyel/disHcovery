import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Recipe.css"; // Import CSS file

const Recipe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const originalRecipe = location.state?.recipe; // Get the original recipe data from navigation state

  // const [recipe, setRecipe] = useState(originalRecipe); // Initialize recipe with the original recipe
  const storedRecipe = localStorage.getItem("savedRecipe");

  const [recipe, setRecipe] = useState(
    storedRecipe ? JSON.parse(storedRecipe) : originalRecipe
  );

  const [showIngredientSelection, setShowIngredientSelection] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientAlternatives, setIngredientAlternatives] = useState({}); // Store alternatives for each ingredient


  if (!originalRecipe) {
    return (
      <div className="error">
        No recipe selected. <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const handlePrint = () => {
    localStorage.setItem("recipeToPrint", JSON.stringify(recipe));
    localStorage.setItem("recipeTitle", recipe.title); // Optional: Store title

    // Use React Router to navigate within the same tab
    navigate("/print");
  };

  const toggleIngredientSelection = () => {
    setShowIngredientSelection(!showIngredientSelection);
    setSelectedIngredients([]); // Clear selections when toggling
    setIngredientAlternatives({}); // Clear alternative when toggling

  };

  const handleIngredientSelect = (ingredientName) => {
    setSelectedIngredients((prevSelected) => {
      if (prevSelected.includes(ingredientName)) {
        return prevSelected.filter((name) => name !== ingredientName);
      } else {
        return [...prevSelected, ingredientName];
      }
    });
  };

  const fetchIngredientAlternatives = async () => {
    if (selectedIngredients.length === 0) {
      alert("Please select at least one ingredient.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/airecipes-api/get-ingredient-alternatives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipe: recipe, ingredients: selectedIngredients }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setIngredientAlternatives(data.alternatives); // Store the alternative.
      setShowIngredientSelection(false); // Close the selection
    } catch (error) {
      console.error("Error fetching ingredient alternatives:", error);
      alert("Failed to get ingredient alternatives. Please try again.");
    }
  };

  return (
    <div className="recipe-details">
      <h1 className="recipe-title">{recipe.title}</h1>

      {/* Image & Main Details Section */}
      <div className="recipe-main">
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
        <div className="recipe-info">
          <p>
            <strong>Cuisine:</strong> {recipe.cuisine}
          </p>
          <p>
            <strong>Meal Type:</strong> {recipe.mealType}
          </p>
          <p>
            <strong>Category:</strong> {recipe.category}
          </p>
          <p>
            <strong>Prep Time:</strong> {recipe.preparationTime}
          </p>
          <p>
            <strong>Cook Time:</strong> {recipe.cookingTime}
          </p>
          <p>
            <strong>Total Time:</strong> {recipe.totalTime}
          </p>
          <p>
            <strong>Servings:</strong> {recipe.servings}
          </p>
        </div>
      </div>

      {/* Remaining Details */}
      <div className="recipe-extra">
        <h3>Dietary Filters:</h3>
        <ul>
          {recipe.dietFilters?.map((filter, index) => (
            <li key={index}>{filter}</li>
          ))}
        </ul>

        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients?.map((ingredient, index) => (
            <li key={index}>
              {ingredient.amount} {ingredient.unit} {ingredient.name}
              {ingredientAlternatives[ingredient.name] && (
                <p className="alternative">
                  Alternative: {ingredientAlternatives[ingredient.name]}
                </p>
              )}
            </li>
          ))}
        </ul>

        {recipe.optional_mixins && ( // Conditionally render if optional_mixins exists
          <>
            <h3>Optional Mix-ins:</h3>
            <ul>
              {recipe.optional_mixins?.map((mix, index) => (
                <li key={index}>{mix}</li>
              ))}
            </ul>
          </>
        )}

        <h3>Steps:</h3>
        <ol>
          {recipe.steps?.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>

        {Array.isArray(recipe.allergyWarnings) && recipe.allergyWarnings.length > 0 && (
          <>
            <h3>Allergy Warnings:</h3>
            <ul>
              {recipe.allergyWarnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </>
        )}

        {recipe.videoURL && (
          <div className="recipe-video">
            <h3>Recipe Video:</h3>
            <iframe
              width="560"
              height="315"
              src={recipe.videoURL.replace("watch?v=", "embed/")}
              title="Recipe Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>

      {/* Toggle for Ingredient Selection */}
      <button onClick={toggleIngredientSelection} className="ai-button">
        {showIngredientSelection ? "Hide Ingredient Selection" : "Get Ingredient Alternatives"}
      </button>

      {/* Ingredient Selection List (Conditionally Rendered) */}
      {showIngredientSelection && (
        <div className="ingredient-selection">
          <h4>Select Ingredients for Alternatives:</h4>
          <ul>
            {recipe.ingredients?.map((ingredient, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    value={ingredient.name}
                    checked={selectedIngredients.includes(ingredient.name)}
                    onChange={() => handleIngredientSelect(ingredient.name)}
                  />
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={fetchIngredientAlternatives} className="ai-button">
            Get Alternatives
          </button>
        </div>
      )}

      <button onClick={() => navigate(-1)} className="back-button">
        Go Back
      </button>
      <button onClick={handlePrint} className="print-button">
        Print Recipe
      </button>{" "}
      {/* Print Button */}
    </div>
  );
};

export default Recipe;