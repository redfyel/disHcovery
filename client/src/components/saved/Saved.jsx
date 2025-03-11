import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { userLoginContext } from "../../contexts/UserLoginContext";
import "./Saved.css";

const SavedRecipes = () => {
  const { loginStatus, currentUser } = useContext(userLoginContext);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loginStatus || !currentUser) return;

    async function fetchSavedRecipes() {
      try {
        const res = await fetch(`http://localhost:4000/recipe-api/saved-recipes/${currentUser._id}`);
        if (!res.ok) throw new Error("Failed to fetch saved recipes");
        const data = await res.json();
        setSavedRecipes(data.payload || []);
      } catch (err) {
        console.error("Error fetching saved recipes:", err.message);
        setError(err.message);
      }
    }

    fetchSavedRecipes();
  }, [loginStatus, currentUser]); // Refetch when user logs in/out

  if (!loginStatus) {
    return <p className="text-center">Please <Link to="/login">log in</Link> to view saved recipes.</p>;
  }

  return (
    <div className="saved-recipes-container">
      <h2>Saved Recipes</h2>

      {error && <p className="error-message">{error}</p>}

      {savedRecipes.length === 0 ? (
        <p className="no-recipes">No saved recipes yet. Start saving your favorites!</p>
      ) : (
        <div className="recipe-grid">
          {savedRecipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} className="recipe-image" />
              <h3>{recipe.title}</h3>
              <Link to={`/recipe/${recipe._id}`} className="view-button">View Recipe</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
