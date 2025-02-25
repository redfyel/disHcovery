import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Filters from "../filters/Filters"; // Import Filters component
import "./Recipes.css"; // Import CSS file

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Stores recipes after filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({}); // Holds selected filter options
  const navigate = useNavigate(); // Used for navigation

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:4000/recipe-api/recipes");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        console.log("Fetched Recipes:", data.payload);
        setRecipes(data.payload || []); // Store all recipes
        setFilteredRecipes(data.payload || []); // Initially show all recipes
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Function to check if filters are applied
  const areFiltersApplied = () => {
    return Object.values(filters).some((filter) => filter && filter.length > 0);
  };

  // Apply filters when filter state changes
  useEffect(() => {
    let updatedRecipes = recipes;

    if (areFiltersApplied()) {
      updatedRecipes = updatedRecipes.filter((recipe) => {
        const matchesCategories = filters.Categories
          ? filters.Categories.every((category) =>
              recipe.category?.includes(category)
            )
          : true;
        const matchesMealType = filters.mealType
          ? recipe.meal_type === filters.mealType
          : true;
        const matchesDiet = filters.diet ? recipe.diet_filters?.includes(filters.diet) : true;
        const matchesCookTime = filters.cookTime
          ? recipe.cook_time?.includes(filters.cookTime)
          : true;
        const matchesCuisine = filters.cuisine
          ? recipe.cuisine === filters.cuisine
          : true;
        const matchesNutrition = filters.nutrition
          ? recipe.nutrition_info?.includes(filters.nutrition)
          : true;

        return (
          matchesCategories &&
          matchesMealType &&
          matchesDiet &&
          matchesCookTime &&
          matchesCuisine &&
          matchesNutrition
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

      {/* Main Layout: Recipes on Left, Filters on Right */}
      <div className="recipes-container">
        {/* Recipes Section (Left) */}
        <div className="recipes-content">
          {/* Recipe Listing */}
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
                  <p className="recipe-meal_type">{recipe.meal_type}</p>
                  <p className="recipe-total_time">⏱ {recipe.total_time}</p>
                  
                  {/* Pass recipe data using state */}
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

        {/* Filters Section (Right) */}
        <div className="filters-column">
          <Filters onFilterChange={setFilters} />
        </div>
      </div>
    </div>
  );
};

export default Recipes;
