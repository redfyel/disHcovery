import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import  "./Filters.jsx"; // Import the filter component
import "./Recipes.css"; // Import the CSS file

const Recipes = () => {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({}); // State to hold filter options

  // Fetch recipes from the backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes'); // Adjust the URL if necessary
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search input and selected filters
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(search.toLowerCase());
    const matchesIngredients = filters.ingredients ? filters.ingredients.every(ingredient => recipe.ingredients.includes(ingredient)) : true;
    const matchesMealType = filters.mealType ? recipe.mealType === filters.mealType : true;
    const matchesDiet = filters.diet ? recipe.diet === filters.diet : true;
    const matchesCookTime = filters.cookTime ? recipe.cookTime === filters.cookTime : true;
    const matchesCuisine = filters.cuisine ? recipe.cuisine === filters.cuisine : true;
    const matchesNutrition = filters.nutrition ? recipe.nutrition === filters.nutrition : true;

    return matchesSearch && matchesIngredients && matchesMealType && matchesDiet && matchesCookTime && matchesCuisine && matchesNutrition;
  });

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recipes-page">
      <h1 className="recipes-title">Discover Delicious Recipes</h1>

      {/* Search Bar */}
      <div className="search-filter-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter Component */}
      <RecipeFilter onFilterChange={setFilters} />

      {/* Recipe Listing */}
      <div className="recipe-grid">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <img
                src={recipe.imageURL} // Ensure your recipe model has an imageURL field
                alt={recipe.name}
                className="recipe-image"
              />
              <h3 className="recipe-name">{recipe.name}</h3>
              <p className="recipe-cuisine">{recipe.cuisine}</p>
              <p className="recipe-time">⏱ {recipe.cookingTime}</p>
              <Link to={`/recipe/${recipe._id}`} className="view-details">
                View Details →
              </Link>
            </div>
          ))
        ) : (
          <p className="no-results">No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default Recipes;