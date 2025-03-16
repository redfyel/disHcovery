import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Share from "../share/Share";
import "./Recipe.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HiSparkles } from "react-icons/hi";
import { faHeart, faPrint, faBookmark, faComment } from '@fortawesome/free-solid-svg-icons'; 
import { userLoginContext } from "../../contexts/UserLoginContext";
import Loading from '../loading/Loading'; // Import your loading component

const Recipe = () => {
    const { title } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const { loginStatus, currentUser, token } = useContext(userLoginContext);

    const [showIngredientSelection, setShowIngredientSelection] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingredientAlternatives, setIngredientAlternatives] = useState({});
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [isFetchingAlternatives, setIsFetchingAlternatives] = useState(false); // Add state for loading
    const [comments, setComments] = useState([
        { id: 1, author: "Emily R.", text: "This recipe is amazing! So easy to follow." },
        { id: 2, author: "David L.", text: "I added a little extra spice and it turned out great." },
    ]);

    const handleSaveRecipe = async () => {
        try {
            const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1"); // Remove quotes
            console.log("Retrieved token:", token);
            
      
          const recipeData = {
            userId: currentUser._id, // Ensure currentUser is not null
            recipeId: recipe._id,    // Ensure recipe._id is valid
          };
          console.log("Sending recipe data:", recipeData);
      
          const response = await fetch("http://localhost:4000/user-api/saved-recipe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Ensure correct format
            },
            body: JSON.stringify(recipeData),
          });
      
          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to save recipe: ${errorMessage}`);
          }
      
          console.log("Recipe saved successfully");
        } catch (error) {
          console.error("Error saving recipe:", error.message);
        }
      };
      
    

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

        setIsFetchingAlternatives(true); // Start loading

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
        } finally {
            setIsFetchingAlternatives(false); // End loading
        }
    };


    const toggleShareOptions = () => setShowShareOptions((prev) => !prev);


    const recipeId = recipe?._id;
    const recipeTitle = recipe?.title;
    const nutrition = recipe?.nutritionInformation; // Access nutrition information


    return (
        <div className="recipe-details">
            <h1 className="recipe-title">{recipeTitle}</h1>


            <div className="recipe-grid-container">
                <div className="recipe-left-column">
                    <img src={recipe?.image} alt={recipeTitle} className="rrecipe-image" />
                    <div className="save-print-area">
                        <button onClick={handleSaveRecipe} className="icon-button">
                            <FontAwesomeIcon icon={faBookmark} />
                            {isSaved ? " Saved" : " Save"}
                        </button>

                        <button onClick={handlePrint} className="icon-button">
                            <FontAwesomeIcon icon={faPrint} /> Print
                        </button>
                    </div>


                    {/* Ingredients Section */}
                    <div className="ingredients-section">
                        <div className="ingredients-header">
                            <h3>Ingredients:</h3>
                            <button
                                onClick={toggleIngredientSelection}
                                className="ai-button ingredient-alternatives-button"
                                disabled={isFetchingAlternatives} // Disable button while loading
                            >
                                <HiSparkles style={{ marginRight: '5px' }} />
                                {showIngredientSelection ? "Close" : "Alternatives"}
                            </button>
                        </div>
                        <ul>
                            {recipe?.ingredients?.map((ingredient, index) => (
                                <li key={index}>
                                    <div className="ingredient-text">
                                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                                    </div>
                                    {ingredientAlternatives[ingredient.name] && (
                                        <p className={`alternative ${selectedIngredients.includes(ingredient.name) ? 'highlighted' : ''}`}>
                                            Alternative: {ingredientAlternatives[ingredient.name]}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {showIngredientSelection && (
                            <div className={`ingredient-selection ${showIngredientSelection ? '' : 'hidden'}`}>
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
                                <button onClick={fetchIngredientAlternatives} className="ai-button" disabled={isFetchingAlternatives}>
                                    {isFetchingAlternatives ? <Loading /> : "Get Alternatives"}
                                </button>
                            </div>
                        )}
                    </div>


                    {/* Optional Mix-ins Section */}
                    {recipe?.optional_mixins?.length > 0 && (
                        <div className="optional-mixins-section recipe-section">
                            <h3>Optional Mix-ins:</h3>
                            <ul>{recipe?.optional_mixins.map((mix, index) => <li key={index}>{mix}</li>)}</ul>
                        </div>
                    )}


                    {/* Steps Section */}
                    <div className="steps-section recipe-section">
                        <h3>Steps:</h3>
                        <ol>{recipe?.steps?.map((step, index) => <li key={index}>{step}</li>)}</ol>
                    </div>


                    {/* Allergy Warnings Section */}
                    {Array.isArray(recipe?.allergyWarnings) && recipe?.allergyWarnings.length > 0 && (
                        <div className="allergy-warnings-section recipe-section">
                            <h3>Allergy Warnings:</h3>
                            <ul>
                                {recipe?.allergyWarnings.map((warning, index) => (
                                    <li key={index}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}


                    {/* Recipe Video Section */}
                    {recipe?.videoURL && (
                        <div className="recipe-video recipe-section">
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


                <div className="recipe-right-column">
                    <div className="recipe-info">
                        <p><strong>Cuisine:</strong> {recipe?.cuisine}</p>
                        <p><strong>Meal Type:</strong> {recipe?.mealType}</p>
                        <p><strong>Category:</strong> {recipe?.category}</p>
                        <p><strong>Servings:</strong> {recipe?.servings}</p>
                        <p><strong>Prep Time:</strong> {recipe?.preparationTime}</p>
                        <p><strong>Cook Time:</strong> {recipe?.cookingTime}</p>
                        <p><strong>Total Time:</strong> {recipe?.totalTime}</p>
                    </div>


                    <div className="nutrition-info">
                        <h3>Nutrition</h3>
                        {nutrition ? (
                            <>
                                <p><strong>Calories:</strong> {nutrition.Calories}</p>
                                <p><strong>Fat:</strong> {nutrition.Fat}</p>
                                <p><strong>Saturated Fat:</strong> {nutrition["Saturated Fat"]}</p>
                                <p><strong>Carbohydrates:</strong> {nutrition.Carbohydrates}</p>
                                <p><strong>Fiber:</strong> {nutrition.Fiber}</p>
                                <p><strong>Sugars:</strong> {nutrition.Sugars}</p>
                                <p><strong>Protein:</strong> {nutrition.Protein}</p>
                                <p><strong>Sodium:</strong> {nutrition.Sodium}</p>
                            </>
                        ) : (
                            <p>No nutrition information available.</p>
                        )}
                    </div>


                    <div className="like-comment-share">
                        <button className="icon-button"> <FontAwesomeIcon icon={faHeart} />Like
                        </button>
                        <button className="comment-button">
                            <FontAwesomeIcon icon={faComment} style={{ marginRight: '5px' }} /> Comment
                        </button>
                        <div className="sample-comments">
                            {comments.map((comment) => (
                                <div key={comment.id} className="sample-comment">
                                    <p className="comment-author">{comment.author}</p>
                                    <p className="comment-text">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={toggleShareOptions} className="share-button">
                            Share
                        </button>
                        {showShareOptions && (
                            <Share recipeId={recipeId} recipeTitle={recipeTitle} recipeImage={recipe?.image} />
                        )}
                    </div>
                </div>
            </div>


            <button onClick={() => navigate(-1)} className="back-button">
                Go Back
            </button>
        </div>
    );
};


export default Recipe;