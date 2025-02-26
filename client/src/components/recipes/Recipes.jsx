import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Filters from "../filters/Filters"; // Import Filters component
import "./Recipes.css"; // Import CSS file

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    mealType: [],
    diet: [],
    cookTime: [],
    cuisine: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:4000/recipe-api/recipes");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        console.log("Fetched Recipes:", data.payload);
        setRecipes(data.payload || []);
        setFilteredRecipes(data.payload || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    let updatedRecipes = recipes;

    if (
      filters.categories.length ||
      filters.mealType.length ||
      filters.diet.length ||
      filters.cookTime.length ||
      filters.cuisine.length
    ) {
      updatedRecipes = updatedRecipes.filter((recipe) => {
        const matchesCategories =
          filters.categories.length > 0
            ? filters.categories.includes(recipe.category)
            : true;

        const matchesMealType =
          filters.mealType.length > 0
            ? filters.mealType.includes(recipe.mealType)
            : true;

        const matchesDiet =
          filters.diet.length > 0
            ? recipe.dietFilters?.some((diet) => filters.diet.includes(diet))
            : true;

        const matchesCookTime =
          filters.cookTime.length > 0
            ? filters.cookTime.includes(recipe.cookingTime)
            : true;

        const matchesCuisine =
          filters.cuisine.length > 0
            ? filters.cuisine.includes(recipe.cuisine)
            : true;

        return (
          matchesCategories &&
          matchesMealType &&
          matchesDiet &&
          matchesCookTime &&
          matchesCuisine
        );
      });
    }

    setFilteredRecipes(updatedRecipes);
  }, [filters, recipes]);

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recipes-page">
      <h1 className="recipes-title">Discover Delicious Recipes</h1>

      <div className="recipes-container">
        <div className="recipes-content">
          <div className="recipe-grid">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <div key={recipe._id} className="recipe-card">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="recipe-image"
                  />
                  <h3 className="recipe-name">{recipe.title}</h3>
                  <p className="recipe-meal_type">{recipe.mealType}</p>
                  <p className="recipe-total_time">⏱ {recipe.totalTime}</p>

                  <button
                    onClick={() => navigate("/recipe", { state: { recipe } })}
                    className="view-details"
                  >
                    View Details →
                  </button>
                </div>
              ))
            ) : (
              <p className="no-results">No recipes found.</p>
            )}
          </div>
        </div>

        <div className="filters-column">
          <Filters onFilterChange={setFilters} />
        </div>
      </div>
    </div>
  );
};

export default Recipes;
