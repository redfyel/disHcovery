// Recipe.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Share from "../share/Share";
import "./Recipe.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HiSparkles } from "react-icons/hi";
import {
  faHeart,
  faPrint,
  faBookmark,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { userLoginContext } from "../../contexts/UserLoginContext";
import Loading from "../loading/Loading";
import ScaleRecipe from "../scale/ScaleRecipe";

// Helper function: parse numeric portion from something like "4 slices"
function parseNumericServings(servingsStr) {
  const parsed = parseInt(servingsStr, 10);
  return isNaN(parsed) ? 1 : parsed;
}

const Recipe = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const { currentUser, token } = useContext(userLoginContext);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);

  const [showIngredientSelection, setShowIngredientSelection] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientAlternatives, setIngredientAlternatives] = useState({});
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isFetchingAlternatives, setIsFetchingAlternatives] = useState(false);

  // Keep numeric servings in state
  const [servings, setServings] = useState(1);

  // Fetch the recipe from the API
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

  useEffect(() => {
    if (recipe && recipe.likedBy && currentUser) {
      // Check if recipe.likedBy is an array before using includes
      setIsLiked(Array.isArray(recipe.likedBy) ? recipe.likedBy.includes(currentUser.id) : false);
    }
  }, [recipe, currentUser]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/recipe-api/comments/${recipe?._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    if (recipe?._id) {
      fetchComments();
    }
  }, [recipe]);

  // Once the recipe loads, parse out the numeric servings
  useEffect(() => {
    if (recipe && recipe.servings) {
      setServings(parseNumericServings(recipe.servings));
    }
  }, [recipe]);

  useEffect(() => {
    if (currentUser && token) {
      fetchLikedRecipes();
    }
  }, [currentUser, token]);

  const fetchLikedRecipes = async () => {
    // Add a check to ensure currentUser.id exists before making the request
    if (!currentUser?.id) {
      console.warn("currentUser.id is undefined, skipping fetchLikedRecipes");
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/user-api/liked-recipes/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      console.log("Liked Recipes:", data.payload);
    } catch (error) {
      console.error("Error fetching liked recipes:", error);
    }
  };

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (error) {
    return (
      <div className="error">
        {error} <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Helper to store recipe for printing
  const handlePrint = () => {
    localStorage.setItem("recipeToPrint", JSON.stringify(recipe));
    navigate("/print");
  };

  // Save recipe
  const handleSaveRecipe = async () => {
    if (!currentUser) {
      alert("Please log in to save recipes.");
      return;
    }
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/user-api/save-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipe }),
      });
      if (!response.ok) {
        throw new Error("Failed to save recipe");
      }
      setIsSaved(true);
      alert("Recipe saved successfully!");
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Error saving recipe. Please try again later.");
    }
  };



  // Toggle ingredient selection for AI alternatives
  const toggleIngredientSelection = () => {
    setShowIngredientSelection(!showIngredientSelection);
    setSelectedIngredients([]);
    setIngredientAlternatives({});
  };

  // Check/uncheck ingredient
  const handleIngredientSelect = (ingredientName) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredientName)
        ? prevSelected.filter((name) => name !== ingredientName)
        : [...prevSelected, ingredientName]
    );
  };

  // Get AI-based ingredient alternatives
  const fetchIngredientAlternatives = async () => {
    if (selectedIngredients.length === 0) {
      alert("Please select at least one ingredient.");
      return;
    }
    setIsFetchingAlternatives(true);
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
      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
      const data = await response.json();
      setIngredientAlternatives(data.alternatives);
      setShowIngredientSelection(false);
    } catch (error) {
      console.error("Error fetching ingredient alternatives:", error);
      alert("Failed to get ingredient alternatives.");
    } finally {
      setIsFetchingAlternatives(false);
    }
  };

  const handleLikeRecipe = async () => {
    if (!currentUser) {
      alert("Please log in to like recipes.");
      return;
    }
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/user-api/like-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipe}),
      });

      if (!response.ok) {
        throw new Error("Failed to update like status");
      }

      const data = await response.json();
      
      setIsLiked(true);

      console.log("Like status updated:", data);
    } catch (error) {
      console.error("Error toggling like status:", error);
      alert("Error updating like status. Please try again later.");
    }
  };

  // Toggle share options
  const toggleShareOptions = () => setShowShareOptions((prev) => !prev);

  // Numeric version of the original servings
  const numericRecipeServings = parseNumericServings(recipe?.servings);

  // For easy references
  const recipeId = recipe?._id;
  const recipeTitle = recipe?.title;
  const nutrition = recipe?.nutritionInformation;

  return (
    <div className="recipe-details">
      <h1 className="recipe-title">{recipeTitle}</h1>

      <div className="recipe-grid-container">
        {/* LEFT COLUMN */}
        <div className="recipe-left-column">
          <img
            src={recipe?.image}
            alt={recipeTitle}
            className="rrecipe-image"
          />
          <div className="save-print-area">
            <button onClick={handleSaveRecipe} className="icon-button">
              <FontAwesomeIcon icon={faBookmark} />
              {isSaved ? " Saved" : " Save"}
            </button>
            <button onClick={handlePrint} className="icon-button">
              <FontAwesomeIcon icon={faPrint} /> Print
            </button>
          </div>

          {/* INGREDIENTS SECTION */}
          <div className="ingredients-section">
            <div
              className="ingredients-header"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <h3>Ingredients:</h3>

              <button
                onClick={toggleIngredientSelection}
                className="ai-button ingredient-alternatives-button"
                disabled={isFetchingAlternatives}
              >
                <HiSparkles style={{ marginRight: "5px" }} />
                {showIngredientSelection ? "Close" : "Alternatives"}
              </button>

              <ScaleRecipe
                servings={servings}
                setServings={setServings}
                originalServingsText={recipe?.servings}
              />
            </div>

            <ul>
              {recipe?.ingredients?.map((ingredient, index) => (
                <li key={index}>
                  <div className="ingredient-text">
                    {(
                      (ingredient.amount * servings) /
                      numericRecipeServings
                    ).toFixed(2)}{" "}
                    {ingredient.unit} {ingredient.name}
                  </div>
                  {ingredientAlternatives[ingredient.name] && (
                    <p
                      className={`alternative ${
                        selectedIngredients.includes(ingredient.name)
                          ? "highlighted"
                          : ""
                      }`}
                    >
                      Alternative: {ingredientAlternatives[ingredient.name]}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            {showIngredientSelection && (
              <div
                className={`ingredient-selection ${
                  showIngredientSelection ? "" : "hidden"
                }`}
              >
                <h4>Select Ingredients for Alternatives:</h4>
                <ul>
                  {recipe?.ingredients?.map((ingredient, index) => (
                    <li key={index}>
                      <label>
                        <input
                          type="checkbox"
                          value={ingredient.name}
                          checked={selectedIngredients.includes(
                            ingredient.name
                          )}
                          onChange={() =>
                            handleIngredientSelect(ingredient.name)
                          }
                        />
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={fetchIngredientAlternatives}
                  className="ai-button"
                  disabled={isFetchingAlternatives}
                >
                  {isFetchingAlternatives ? <Loading /> : "Get Alternatives"}
                </button>
              </div>
            )}
          </div>

          {/* OPTIONAL MIX-INS SECTION */}
          {recipe?.optional_mixins?.length > 0 && (
            <div className="optional-mixins-section recipe-section">
              <h3>Optional Mix-ins:</h3>
              <ul>
                {recipe?.optional_mixins.map((mix, index) => (
                  <li key={index}>{mix}</li>
                ))}
              </ul>
            </div>
          )}

          {/* STEPS SECTION */}
          <div className="steps-section recipe-section">
            <h3>Steps:</h3>
            <ol>
              {recipe?.steps?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {/* ALLERGY WARNINGS SECTION */}
          {Array.isArray(recipe?.allergyWarnings) &&
            recipe?.allergyWarnings.length > 0 && (
              <div className="allergy-warnings-section recipe-section">
                <h3>Allergy Warnings:</h3>
                <ul>
                  {recipe?.allergyWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

          {/* RECIPE VIDEO SECTION */}
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

        {/* RIGHT COLUMN */}
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
            {recipe?.nutritionInformation ? (
              <>
                <p><strong>Calories:</strong> {recipe?.nutritionInformation.Calories}</p>
                <p><strong>Fat:</strong> {recipe?.nutritionInformation.Fat}</p>
                <p><strong>Saturated Fat:</strong> {recipe?.nutritionInformation["Saturated Fat"]}</p>
                <p><strong>Carbohydrates:</strong> {recipe?.nutritionInformation.Carbohydrates}</p>
                <p><strong>Fiber:</strong> {recipe?.nutritionInformation.Fiber}</p>
                <p><strong>Sugars:</strong> {recipe?.nutritionInformation.Sugars}</p>
                <p><strong>Protein:</strong> {recipe?.nutritionInformation.Protein}</p>
                <p><strong>Sodium:</strong> {recipe?.nutritionInformation.Sodium}</p>
              </>
            ) : (
              <p>No nutrition information available.</p>
            )}
          </div>

          <div className="like-comment-share">
            <button className="icon-button" onClick={handleLikeRecipe}>
              <FontAwesomeIcon icon={faHeart} style={{ color: isLiked ? "red" : "black" }} />
              {isLiked ? " Liked" : " Like"}
            </button>
            <button className="comment-button">
              <FontAwesomeIcon icon={faComment} style={{ marginRight: "5px" }} /> Comment
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
              <Share
                recipeId={recipeId}
                recipeTitle={recipeTitle}
                recipeImage={recipe?.image}
              />
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