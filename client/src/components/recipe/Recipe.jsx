import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Share from "../share/Share";
import "./Recipe.css";

const Recipe = () => {
    const { title } = useParams(); // Get recipe ID and title from URL
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showIngredientSelection, setShowIngredientSelection] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingredientAlternatives, setIngredientAlternatives] = useState({});
    const [showShareOptions, setShowShareOptions] = useState(false);

    const fetchRecipe = useCallback(async (recipeTitle) => {
        try {
            const response = await fetch(
                `http://localhost:4000/recipe-api/recipe/${recipeTitle}`
            );
            if (!response.ok) {
                throw new Error("Recipe not found");
            }
            const data = await response.json();
            setRecipe(data.payload);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // The URL should be decoded as it is already handled in backend
        fetchRecipe(title);
    }, [title, fetchRecipe]);

    if (loading) return <div className="loading">Loading recipe...</div>;
    if (error)
        return (
            <div className="error">
                {error} <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );

    const handlePrint = () => {
        localStorage.setItem("recipeToPrint", JSON.stringify(recipe));
        navigate("/print");
    };

    const toggleIngredientSelection = () => {
        setShowIngredientSelection(!showIngredientSelection);
        setSelectedIngredients([]);
        setIngredientAlternatives({});
    };

    const handleIngredientSelect = (ingredientName) => {
        setSelectedIngredients((prevSelected) =>
            prevSelected.includes(ingredientName)
                ? prevSelected.filter((name) => name !== ingredientName)
                : [...prevSelected, ingredientName]
        );
    };

    const fetchIngredientAlternatives = async () => {
        if (selectedIngredients.length === 0) {
            alert("Please select at least one ingredient.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:4000/airecipes-api/get-ingredient-alternatives",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ recipe, ingredients: selectedIngredients }),
                }
            );

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            setIngredientAlternatives(data.alternatives);
            setShowIngredientSelection(false);
        } catch (error) {
            console.error("Error fetching ingredient alternatives:", error);
            alert("Failed to get ingredient alternatives. Please try again.");
        }
    };

    const toggleShareOptions = () => setShowShareOptions((prev) => !prev);

    const recipeId = recipe?._id;
    const recipeTitle = recipe?.title;

    return (
        <div className="recipe-details">
            <h1 className="recipe-title">{recipeTitle}</h1>

            <div className="recipe-main">
                <img src={recipe?.image} alt={recipeTitle} className="recipe-image" />
                <div className="recipe-info">
                    <p><strong>Cuisine:</strong> {recipe?.cuisine}</p>
                    <p><strong>Meal Type:</strong> {recipe?.mealType}</p>
                    <p><strong>Category:</strong> {recipe?.category}</p>
                    <p><strong>Prep Time:</strong> {recipe?.preparationTime}</p>
                    <p><strong>Cook Time:</strong> {recipe?.cookingTime}</p>
                    <p><strong>Total Time:</strong> {recipe?.totalTime}</p>
                    <p><strong>Servings:</strong> {recipe?.servings}</p>
                </div>
            </div>

            <div className="recipe-extra">
                <h3>Dietary Filters:</h3>
                <ul>{recipe?.dietFilters?.map((filter, index) => <li key={index}>{filter}</li>)}</ul>

                <h3>Ingredients:</h3>
                <ul>
                    {recipe?.ingredients?.map((ingredient, index) => (
                        <li key={index}>
                            {ingredient.amount} {ingredient.unit} {ingredient.name}
                            {ingredientAlternatives[ingredient.name] && (
                                <p className="alternative">Alternative: {ingredientAlternatives[ingredient.name]}</p>
                            )}
                        </li>
                    ))}
                </ul>

                {recipe?.optional_mixins?.length > 0 && (
                    <>
                        <h3>Optional Mix-ins:</h3>
                        <ul>{recipe?.optional_mixins.map((mix, index) => <li key={index}>{mix}</li>)}</ul>
                    </>
                )}

                <h3>Steps:</h3>
                <ol>{recipe?.steps?.map((step, index) => <li key={index}>{step}</li>)}</ol>
                {Array.isArray(recipe?.allergyWarnings) && recipe?.allergyWarnings.length > 0 && (
                    <>
                        <h3>Allergy Warnings:</h3>
                        <ul>
                            {recipe?.allergyWarnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                    </>
                )}

                {recipe?.videoURL && (
                    <div className="recipe-video">
                        <h3>Recipe Video:</h3>
                        <iframe
                            width="560"
                            height="315"
                            src={recipe?.videoURL.replace("watch?v=", "embed/")}
                            title="Recipe Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </div>

            <button onClick={toggleIngredientSelection} className="ai-button">
                {showIngredientSelection ? "Hide Ingredient Selection" : "Get Ingredient Alternatives"}
            </button>

            {showIngredientSelection && (
                <div className="ingredient-selection">
                    <h4>Select Ingredients for Alternatives:</h4>
                    <ul>
                        {recipe?.ingredients?.map((ingredient, index) => (
                            <li key={index}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={ingredient.name}
                                        checked={selectedIngredients.includes(ingredient.name)}
                                        onChange={() => handleIngredientSelect(ingredient.name)}
                                    />
                                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button onClick={fetchIngredientAlternatives} className="ai-button">
                        Get Alternatives
                    </button>
                </div>
            )}

            <button onClick={handlePrint} className="print-button">
                Print Recipe
            </button>

            <button onClick={toggleShareOptions} className="share-button">
                Share
            </button>
            {showShareOptions && (
                <Share recipeId={recipeId} recipeTitle={recipeTitle} recipeImage={recipe?.image} />
            )}

            <button onClick={() => navigate(-1)} className="back-button">
                Go Back
            </button>
        </div>
    );
};

export default Recipe;