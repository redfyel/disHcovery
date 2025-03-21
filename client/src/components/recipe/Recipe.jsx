// Recipe.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Share from "../share/Share";
import "./Recipe.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HiSparkles } from "react-icons/hi";
import { IoFastFoodSharp } from "react-icons/io5";
import {  FaUsers } from "react-icons/fa";
import {faHeart,faPrint,faBookmark,faComment,faUtensils,faClock,} from "@fortawesome/free-solid-svg-icons";
import { TiWarning } from "react-icons/ti";
import { userLoginContext } from "../../contexts/UserLoginContext";
import Loading from "../loading/Loading";
import {motion} from 'framer-motion'


const Recipe = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const { currentUser, token } = useContext(userLoginContext);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [showIngredientSelection, setShowIngredientSelection] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientAlternatives, setIngredientAlternatives] = useState({});
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isFetchingAlternatives, setIsFetchingAlternatives] = useState(false);

  const [comments] = useState([
    { id: 1, author: "Emily R.", text: "This recipe is amazing!" },
    { id: 2, author: "David L.", text: "I added extra spice." },
  ]);


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
      alert("Authentication error. Please log in again.");
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

  // Toggle share options
  const toggleShareOptions = () => setShowShareOptions((prev) => !prev);

  // For easy references
  const recipeId = recipe._id;
  const recipeTitle = recipe.title;
  const nutrition = recipe.nutritionInformation;

  return (
    <div className="recipe-details">
      <h1 className="recipe-title">{recipeTitle}</h1>

      <div className="recipe-grid-container">
        {/* LEFT COLUMN */}
        <div className="recipe-left-column">
          <img
            src={recipe.image}
            alt={recipeTitle}
            className="rrecipe-image"
          />

           <div className="recipe-info">
            <div className="tag"><FontAwesomeIcon icon={faUtensils}/> {recipe.cuisine}</div>
            <div className="tag"><FontAwesomeIcon icon={faUtensils} /> {recipe.mealType}</div>
            <div className="tag"><IoFastFoodSharp size={23} />{recipe.category}</div> 
            <div className="tag"><FaUsers />Servings:{recipe.servings}</div>
            <div className="tag"><FontAwesomeIcon icon={faClock} /> Prep: {recipe.preparationTime}</div>
            <div className="tag"><FontAwesomeIcon icon={faClock} /> Cook: {recipe.cookingTime}</div>
            <div className="tag"><FontAwesomeIcon icon={faClock} /> Total: {recipe.totalTime}</div>
          </div>

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


          {/* OPTIONAL MIX-INS SECTION */}
          {recipe.optional_mixins?.length > 0 && (
            <div className="optional-mixins-section recipe-section">
              <h3>Optional Mix-ins:</h3>
              <ul>
                {recipe.optional_mixins.map((mix, index) => (
                  <li key={index}>{mix}</li>
                ))}
              </ul>
            </div>
          )}

          {/* STEPS SECTION */}
          <div className="steps-section recipe-section">
            <h3>Steps:</h3>
            <ol>
              {recipe.steps?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
            {/* RECIPE VIDEO SECTION */}
            {recipe.videoURL ? (
            <div className="recipe-video recipe-section">
              <h3>Recipe Video:</h3>
              <iframe
                width="560"
                height="315"
                src={recipe.videoURL.replace("watch?v=", "embed/")}
                title="Recipe Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : null}
        </div>

        {/* RIGHT COLUMN */}
        <div className="recipe-right-column">
        <div className="nutrition-info">
  <h3>Nutrition Facts</h3>
  {recipe.nutritionInformation && Object.keys(recipe.nutritionInformation).length > 0 ? (
    <ul className="nutrition-list">
      {Object.entries(recipe.nutritionInformation).map(([key, value], index) => (
        <li key={index}>
          <span className="nutrient-name">
            {key.replace(/\b\w/g, char => char.toUpperCase())}
          </span>
          <span className="nutrient-value">{value || "N/A"}</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="no-nutrition">No nutrition information available.</p>
  )}
</div>




          {/* allergy warnings section */}
          {Array.isArray(recipe.allergyWarnings) && recipe.allergyWarnings.length > 0 && (
  <motion.div
    className="allergy-warnings-section recipe-section"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 120 }}
  >
    <h3 className="allergy-title">
    <TiWarning size={20} />
    Allergy Warnings
    </h3>
    <ul>
      {recipe.allergyWarnings.map((warning, index) => (
        <motion.li
          key={index}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.15 }}
        >
         <TiWarning size={20} />
         {warning}
        </motion.li>
      ))}
    </ul>
  </motion.div>
)}


          <div className="like-comment-share">
            <button className="icon-button">
              <FontAwesomeIcon icon={faHeart} /> Like
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
                recipeImage={recipe.image}
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