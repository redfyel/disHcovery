import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { userLoginContext } from "../../contexts/UserLoginContext";
import "./Saved.css";

const SavedRecipes = () => {
  const { loginStatus, currentUser } = useContext(userLoginContext);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [rouletteRecipes, setRouletteRecipes] = useState([]);
  const [aiRecipes, setAiRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredRecipes = 
    selectedCategory === "saved"
      ? savedRecipes
      : selectedCategory === "roulette"
      ? rouletteRecipes
      : selectedCategory === "ai"
      ? aiRecipes
      : [...savedRecipes, ...rouletteRecipes, ...aiRecipes]; 

  useEffect(() => {
    if (!loginStatus || !currentUser?._id) return;

    const fetchRecipes = async () => {
      try {
        console.log("Fetching recipes for user:", currentUser._id);

        const savedRes = await fetch(`http://localhost:4000/user-api/saved-recipes/${currentUser._id}`);
        if (!savedRes.ok) throw new Error(`Error ${savedRes.status}: ${savedRes.statusText}`);
        const savedData = await savedRes.json();
        setSavedRecipes(savedData?.payload ?? []);

        const rouletteRes = await fetch(`http://localhost:4000/user-api/saved-roulette-recipes/${currentUser._id}`);
        if (!rouletteRes.ok) throw new Error(`Error ${rouletteRes.status}: ${rouletteRes.statusText}`);
        const rouletteData = await rouletteRes.json();
        setRouletteRecipes(rouletteData?.payload ?? []);

        const aiRes = await fetch(`http://localhost:4000/airecipes-api/ai-recipes/${currentUser.username}`);
        if (!aiRes.ok) throw new Error(`Error ${aiRes.status}: ${aiRes.statusText}`);
        const aiData = await aiRes.json();
        setAiRecipes(aiData?.payload ?? []);

      } catch (err) {
        console.error("Error fetching recipes:", err.message);
        setError(err.message);
      }
    };

    fetchRecipes();
  }, [loginStatus, currentUser]);

  if (!loginStatus) {
    return <p className="text-center">Please <Link to="/login">log in</Link> to view saved recipes.</p>;
  }

  return (
    <div className="saved-recipes-container">
      <div className="header-container">
        <h2>Saved Recipes</h2>
        <select className="recipe-dropdown" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">All Recipes</option>
          <option value="saved">Saved Recipes</option>
          <option value="roulette">Recipe Roulette</option>
          <option value="ai">AI Recipes</option>
        </select>
      </div>

      {error && <p className="saved-error-message">{error}</p>}

      {filteredRecipes.length === 0 ? (
        <p className="saved-no-recipes">No recipes found.</p>
      ) : (
        <div className="saved-recipe-grid">
          {filteredRecipes.map((recipe) => {
            const titleBeforeBracket = recipe.title.split("(")[0].trim();
            const sanitizedTitle = titleBeforeBracket
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");
            const encodedTitle = encodeURIComponent(sanitizedTitle);

            return (
              <div key={recipe._id || `${recipe.title}-${Math.random()}`} className="saved-recipe-card">
                {recipe.image && <img src={recipe.image} alt={recipe.title} className="saved-recipe-image" />}
                <h3>{recipe.title}</h3>
                <Link to={`/recipe/${encodedTitle}`} className="view-button">View Recipe</Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
