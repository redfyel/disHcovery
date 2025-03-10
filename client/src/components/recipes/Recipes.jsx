import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiCookingPotLight } from "react-icons/pi";
import Filters from "../filters/Filters";
import "./Recipes.css";


const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const navigate = useNavigate();


 const [filters, setFilters] = useState({
    categories: [],
    mealType: [],
    cuisine: [],
    dietFilters: [],
    hasVideo: false,
  });


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:4000/recipe-api/recipes");
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();


        setRecipes(data.payload || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    fetchRecipes();
  }, []);


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
                    <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                    <h3 className="recipe-name">{recipe.title}</h3>
                    <button
                      onClick={() => navigate(`/recipe/${encodedTitle}`)}
                      className="get-cooking-button"
                    >
                     <PiCookingPotLight size={17}/> Get Cooking!
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
        <h2>Filters</h2>
          <Filters onFilterChange={setFilters} />
        </div>
      </div>
    </div>
  );
};


export default Recipes;
