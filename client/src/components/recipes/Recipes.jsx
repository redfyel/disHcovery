import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { PiCookingPotLight } from "react-icons/pi";
import Filters from "../filters/Filters";
import Loading from "../loading/Loading";
import NoRecipesMessage from "../no-recipes/NoRecipesMessage"; // Import NoRecipesMessage
import "./Recipes.css";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { ingredients } = useParams();

  const [filters, setFilters] = useState({
    categories: [],
    mealType: [],
    cuisine: [],
    dietFilters: [],
    hasVideo: false,
  });
  
  useEffect(() => {
    if (location.pathname === "/recipes") {
      setFilters({
        categories: [],
        mealType: [],
        cuisine: [],
        dietFilters: [],
        hasVideo: false,
      });
    }
  }, [location]);
  

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:4000/recipe-api/recipes";

        if (location.search) {
          url = `http://localhost:4000/recipe-api/recipes/explore${location.search}`;
          console.log("Fetching URL with query:", url);
        } else if (ingredients) {
          url = `http://localhost:4000/recipe-api/recipes/by-ingredients/${ingredients}`;
          console.log("Fetching URL by ingredients:", url);
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch recipes. Status: ${response.status}`);
        }

        const data = await response.json();
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
  }, [ingredients, location.search]);

  useEffect(() => {
    const filterRecipes = () => {
      if (!recipes) return [];

      return recipes.filter((recipe) => {
        const matchesCategories =
          !filters?.categories?.length || filters?.categories?.includes(recipe.category);

        const matchesMealType =
          !filters?.mealType?.length || filters?.mealType?.includes(recipe.mealType);

        const matchesCuisine =
          !filters?.cuisine?.length || filters?.cuisine?.includes(recipe.cuisine);

        const matchesDietFilters =
          !filters?.dietFilters?.length ||
          recipe.dietFilters?.some((diet) => filters?.dietFilters?.includes(diet));

        const matchesVideo = !filters.hasVideo || recipe.videoURL;

        return (
          matchesCategories &&
          matchesMealType &&
          matchesCuisine &&
          matchesDietFilters &&
          matchesVideo
        );
      });
    };

    setFilteredRecipes(filterRecipes());
  }, [recipes, filters]);

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recipes-page">
      <div className="recipes-header d-flex justify-content-between align-items-center">
        <h1 className="recipes-title">
          {ingredients 
            ? `Recipes containing ${decodeURIComponent(ingredients)}` 
            : "Discover Delicious Recipes"}
        </h1>
        <h2 className="filters-title">Taste Tuner</h2>
      </div>

      <div className="recipes-container">
        <div className="recipes-content">
          {/* Recipe Grid */}
          <div className={`recipe-grid ${filteredRecipes.length === 0 ? "no-recipes" : ""}`}>
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
                    <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                    <h3 className="recipe-name">{recipe.title}</h3>
                    <button
                      onClick={() => navigate(`/recipe/${encodedTitle}`)}
                      className="get-cooking-button"
                    >
                      <PiCookingPotLight size={17} /> Get Cooking!
                    </button>
                  </div>
                );
              })
            ) : (
              <NoRecipesMessage 
                message={filters.categories.length || filters.mealType.length || filters.cuisine.length || filters.dietFilters.length 
                  ? "No recipes match your filters."
                  : "No recipes found. Try adjusting filters or exploring new ingredients."
                } 
              />
            )}
          </div>
        </div>

        {/* Filters Column */}
        <div className="filters-column">
          <Filters onFilterChange={setFilters} />
        </div>
      </div>
    </div>
  );
};

export default Recipes;
