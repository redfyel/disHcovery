import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AccessDenied from "../protected/AccessDenied";
import { userLoginContext } from "../../contexts/UserLoginContext";
import NoRecipesMessage from "../no-recipes/NoRecipesMessage";
import { PiCookingPotLight } from "react-icons/pi";
import "./Saved.css";

const SavedRecipes = () => {
  const { loginStatus, currentUser } = useContext(userLoginContext);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [rouletteRecipes, setRouletteRecipes] = useState([]);
  const [aiRecipes, setAiRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    if (!loginStatus || !currentUser?._id) return;

    const fetchRecipes = async () => {
      try {
        // Fetch Saved Recipes
        const savedRes = await fetch(
          `http://localhost:4000/user-api/saved-recipes/${currentUser._id}`
        );
        if (!savedRes.ok)
          throw new Error(`Error ${savedRes.status}: ${savedRes.statusText}`);
        const savedData = await savedRes.json();
        setSavedRecipes(savedData?.payload ?? []);

        // Fetch Roulette Recipes
        const rouletteRes = await fetch(
          `http://localhost:4000/user-api/saved-roulette-recipes/${currentUser._id}`
        );
        if (!rouletteRes.ok)
          throw new Error(
            `Error ${rouletteRes.status}: ${rouletteRes.statusText}`
          );
        const rouletteData = await rouletteRes.json();
        setRouletteRecipes(rouletteData?.payload ?? []);

        // Fetch AI Recipes
        const aiRes = await fetch(
          `http://localhost:4000/airecipes-api/ai-recipes/${currentUser.username}`
        );
        if (!aiRes.ok)
          throw new Error(`Error ${aiRes.status}: ${aiRes.statusText}`);
        const aiData = await aiRes.json();
        // console.log(aiData?.payload);
        setAiRecipes(aiData?.payload ?? []);
      } catch (err) {
        console.error("Error fetching recipes:", err.message);
        setError(err.message);
      }
    };

    fetchRecipes();
  }, [loginStatus, currentUser]);

  const openModal = (recipe) => setSelectedRecipe(recipe);
  const closeModal = () => setSelectedRecipe(null);

  const renderRecipeSection = (title, recipes, type) =>
    recipes.length > 0 ? (
      <div className="recipe-category">
        <h2>{title}</h2>
        <div className="saved-recipe-grid">
          {recipes.map((recipe) => {
            const titleBeforeBracket = recipe.title.split("(")[0].trim();
            const sanitizedTitle = titleBeforeBracket
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") // Remove accents
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-") // Replace spaces and special chars with '-'
              .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
            const encodedTitle = encodeURIComponent(sanitizedTitle);

            return (
              <div key={recipe._id} className="saved-recipe-card">
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="saved-recipe-image"
                  />
                )}
                <h3>{recipe.title}</h3>
                {type === "ai" ? (
                  <button
                    onClick={() => openModal(recipe)}
                    className="view-button"
                  >
                   <PiCookingPotLight size={20} /> Get Cooking!
                  </button>
                ) : (
                  <Link to={`/recipe/${encodedTitle}`} className="view-button">
                    <PiCookingPotLight size={20} /> Get Cooking!
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <NoRecipesMessage type={type} />
    );

  if (!loginStatus) return <AccessDenied />;

  return (
    <div className="saved-recipes-container">
      <div className="header-container">
        <h2>Your Tasty Saves</h2>
        <select
          className="recipe-dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Recipes</option>
          <option value="saved">Saved Recipes</option>
          <option value="roulette">Recipe Roulette</option>
          <option value="ai">AI Recipes</option>
        </select>
      </div>
      {error && <p className="saved-error-message">{error}</p>}

      {selectedCategory === "all" ? (
        <>
          {renderRecipeSection("Saved Recipes", savedRecipes, "saved")}
          <hr />
          {renderRecipeSection("Recipe Roulette", rouletteRecipes, "roulette")}
          <hr />
          {renderRecipeSection("AI Recipes", aiRecipes, "ai")}
        </>
      ) : (
        <>
          {selectedCategory === "saved" &&
            renderRecipeSection("Saved Recipes", savedRecipes, "saved")}
          {selectedCategory === "roulette" &&
            renderRecipeSection("Recipe Roulette", rouletteRecipes, "roulette")}
          {selectedCategory === "ai" &&
            renderRecipeSection("AI Recipes", aiRecipes, "ai")}
        </>
      )}

      {selectedRecipe && (
        <div className="ai-modal-overlay" onClick={closeModal}>
          <div
            className="ai-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="btn-close ai-modal-close-button"
            ></button>

            {/* Recipe Title */}
            <div className="ai-modal-header">
              <h2>{selectedRecipe.title}</h2>
            </div>

            {/* Recipe Image */}
            {selectedRecipe.image && (
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="ai-modal-image"
              />
            )}

            {/* Recipe Body */}
            <div className="ai-modal-body">
              {/* Description */}
              <p className="ai-modal-description">
                <strong>Description:</strong> {selectedRecipe.description}
              </p>

              {/* Ingredients Section */}
              <div className="ai-modal-section">
                <h3>Ingredients</h3>
                <ul className="ai-modal-list ai-ingredients-box">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      <span className="ai-bullet">•</span>
                      <span className="ai-bullet-space"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions Section */}
              <div className="ai-modal-section">
                <h3>Instructions</h3>
                <ul className="ai-instructions-list">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index}>
                      <span className="ai-step-circle">{index + 1}</span>{" "}
                      {instruction.replace(/^\d+\.\s*/, "")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
