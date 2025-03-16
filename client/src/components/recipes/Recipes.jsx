import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { PiCookingPotLight } from "react-icons/pi";
import Filters from "../filters/Filters";
import Loading from "../loading/Loading";
import "./Recipes.css";

const Recipes = () => {
    const { category } = useParams();
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

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
                setLoading(true);  // Start loading before the fetch
                let url = "http://localhost:4000/recipe-api/recipes";

                // Check if ingredients are passed in location state
                const ingredients = location.state?.ingredients;
                if (ingredients && ingredients.length > 0) {
                    const queryString = ingredients.join(",");
                    url = `http://localhost:4000/recipe-api/recipes/by-ingredients?ingredients=${queryString}`;
                } else if (category) {
                    url = `http://localhost:4000/recipe-api/recipes/category/${category}`;
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
    }, [category, location.state?.ingredients, location]); // Listen for changes in location state

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
                <h1 className="recipes-title">Discover Delicious Recipes</h1>
                <h2 className="filters-title">Taste Tuner</h2>
            </div>

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
                                            <PiCookingPotLight size={17} /> Get Cooking!
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