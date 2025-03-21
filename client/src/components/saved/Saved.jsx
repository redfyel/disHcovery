import React, { useEffect, useState, useContext } from "react"; 
import { Link } from "react-router-dom";
import AccessDenied from "../protected/AccessDenied";
import { userLoginContext } from "../../contexts/UserLoginContext";
import "./Saved.css";

const SavedRecipes = () => {
  const { loginStatus, currentUser } = useContext(userLoginContext);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [rouletteRecipes, setRouletteRecipes] = useState([]);
  const [aiRecipes, setAiRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loginStatus || !currentUser?._id) return;
    
    const fetchRecipes = async () => {
      try {
        const savedRes = await fetch(`http://localhost:4000/user-api/saved-recipes/${currentUser._id}`);
        if (!savedRes.ok) throw new Error(`Error ${savedRes.status}: ${savedRes.statusText}`);
        const savedData = await savedRes.json();
        setSavedRecipes(savedData?.payload ?? []);

        if (savedData.payload.length === 0) {
          setMessage("Save the recipes that you would like!");
        }
      } catch (err) {
        console.error("Error fetching recipes:", err.message);
        setError(err.message);
      }
    };
    fetchRecipes();
  }, [loginStatus, currentUser]);

  const handleSaveRecipe = (recipe) => {
    if (savedRecipes.some((r) => r._id === recipe._id)) {
      setMessage("Already saved");
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
      setMessage("Recipe saved successfully!");
    }
  };

  const openModal = (recipe) => setSelectedRecipe(recipe);
  const closeModal = () => setSelectedRecipe(null);

  const renderRecipeSection = (title, recipes, type) => (
    recipes.length > 0 && (
      <div className="recipe-category">
        <h2>{title}</h2>
        <div className="saved-recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="saved-recipe-card">
              {recipe.image && <img src={recipe.image} alt={recipe.title} className="saved-recipe-image" />}
              <h3>{recipe.title}</h3>
              {type === "ai" ? (
                <button onClick={() => openModal(recipe)} className="view-button">View Details</button>
              ) : (
                <Link to={`/recipe/${encodeURIComponent(recipe.title)}`} className="view-button">View Recipe</Link>
              )}
              <button onClick={() => handleSaveRecipe(recipe)} className="save-button">
                {savedRecipes.some((r) => r._id === recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="saved-recipes-container">
      <div className="header-container">
        <h2>Saved Recipes</h2>
        {!loginStatus ? <AccessDenied /> : message && <p className="info-message">{message}</p>}
        <select className="recipe-dropdown" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
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
          <hr/>
          {renderRecipeSection("Recipe Roulette", rouletteRecipes, "roulette")}
          <hr/>
          {renderRecipeSection("AI Recipes", aiRecipes, "ai")}
        </>
      ) : (
        <>
          {selectedCategory === "saved" && renderRecipeSection("Saved Recipes", savedRecipes, "saved")}
          {selectedCategory === "roulette" && renderRecipeSection("Recipe Roulette", rouletteRecipes, "roulette")}
          {selectedCategory === "ai" && renderRecipeSection("AI Recipes", aiRecipes, "ai")}
        </>
      )}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>✖</button>
            <h2>{selectedRecipe.title}</h2>
            <p><strong>Description:</strong> {selectedRecipe.description}</p>
            <h3>Ingredients:</h3>
            <ul>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h3>Instructions:</h3>
            <ol>
              {selectedRecipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
