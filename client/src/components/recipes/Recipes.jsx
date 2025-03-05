import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Filters from "../filters/Filters";
import "./Recipes.css";


const Recipes = () => {   const [recipes, setRecipes] = useState([]);
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
                const response = await fetch("http://localhost:4000/recipe-api/recipes");
                if (!response.ok) {
                    throw new Error("Failed to fetch recipes");
                }
                const data = await response.json();
                // console.log("Fetched Recipes:", data.payload);
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


                const matchesVideo = filters.hasVideo ? recipe.videoURL : true;


                return (
                    matchesCategories &&
                    matchesMealType &&
                    matchesDiet &&
                    matchesCookTime &&
                    matchesCuisine &&
                    (filters.hasVideo ? recipe.videoURL != null && recipe.videoURL !== "" : true)
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


            <div className="recipes-container"> <div className="recipes-content">
                    <div className="recipe-grid">
                        {filteredRecipes.length > 0 ? (
                            filteredRecipes.map((recipe) => {
                                // Sanitize and then encode the title for the URL
                                const titleBeforeBracket = recipe.title.split('(')[0].trim();

// Normalize accents (é → e, ç → c, etc.)
const sanitizedTitle = titleBeforeBracket
    .normalize("NFD") // Decomposes characters (e.g., é → e +  ́)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

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
                                            className="view-details"
                                        >
                                            View Details →
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

