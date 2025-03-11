import React, { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import Filters from "../filters/Filters";
import "./Recipes.css";

const Recipes = () => {
  const { category } = useParams(); 
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
    hasVideo: false,
  });

  const navigate = useNavigate();
  useEffect(() => {
    const fetchRecipes = async () => {
        try {
            let url = "http://localhost:4000/recipe-api/recipes";
            if (category) {
                url = `http://localhost:4000/recipe-api/recipes/category/${category}`;
            }

            //console.log("Fetching recipes from:", url);

            const response = await fetch(url);
            // console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error(`Failed to fetch recipes. Status: ${response.status}`);
            }

            const data = await response.json();
            // console.log("Fetched recipes data:", data);

            setRecipes(data.payload || []);
            setFilteredRecipes(data.payload || []);
        } catch (err) {
            console.error("Error fetching recipes:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchRecipes();
}, [category]);


  useEffect(() => {
    let updatedRecipes = recipes;

    if (
      filters.categories.length ||
      filters.mealType.length ||
      filters.diet.length ||
      filters.cookTime.length ||
      filters.cuisine.length ||
      filters.hasVideo
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
            ? recipe.dietFilters?.some((diet) =>
                filters.diet.map(d => d.trim().toLowerCase()).includes(diet.trim().toLowerCase())
              )
            : true;

        const matchesCookTime =
          filters.cookTime.length > 0
            ? filters.cookTime.includes(recipe.cookingTime)
            : true;

        const matchesCuisine =
          filters.cuisine.length > 0
            ? filters.cuisine.includes(recipe.cuisine)
            : true;

        const matchesVideo = filters.hasVideo ? recipe.videoURL : true;

        return (
          matchesCategories &&
          matchesMealType &&
          matchesDiet &&
          matchesCookTime &&
          matchesCuisine &&
          (filters.hasVideo
            ? recipe.videoURL != null && recipe.videoURL !== ""
            : true)
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
              filteredRecipes.map((recipe) => {
                const titleBeforeBracket = recipe.title.split("(")[0].trim();
                const sanitizedTitle = titleBeforeBracket
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");

                const encodedTitle = encodeURIComponent(sanitizedTitle);

                return (
                  <div key={recipe._id} className="recipe-card">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="recipe-image"
                    />
                    <h3 className="recipe-name">{recipe.title}</h3>
                    <button
                      onClick={() => navigate(`/recipe/${encodedTitle}`)}
                      className="view-details get-cooking-button"  // Added class for styling
                    >
                      <i className="fas fa-utensils cooking-icon"></i> Get Cooking!
                    </button>
                  </div>
                );
              })
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