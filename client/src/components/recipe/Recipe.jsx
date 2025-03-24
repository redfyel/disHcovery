import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Share from "../share/Share";
import "./Recipe.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HiSparkles } from "react-icons/hi";
import { IoFastFoodSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import {
  faHeart,
  faPrint,
  faBookmark,
  faComment,
  faUtensils,
  faClock,
  faPlay,
  faStickyNote, // Import the sticky note icon
  faShare,   //Import faShare
  faPlus,  //Import faPlus
  faTimes,
  faHeartBroken//Importing X times
} from "@fortawesome/free-solid-svg-icons";
import { TiWarning } from "react-icons/ti";
import { userLoginContext } from "../../contexts/UserLoginContext";
import Loading from "../loading/Loading";
import Toast from "../toast/Toast";
import { useToast } from "../../contexts/ToastProvider";
import { motion } from "framer-motion";
import Notes from "../notes/Notes";
import Comments from "../comments/Comments"; // Import Comments

const Recipe = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const { currentUser, token, loginStatus } = useContext(userLoginContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showComments, setShowComments] = useState(false); // added
   const [showShareOptions, setShowShareOptions] = useState(false);
  const { toast, showToast } = useToast();
  const [showIngredientSelection, setShowIngredientSelection] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientAlternatives, setIngredientAlternatives] = useState({});
  const [isFetchingAlternatives, setIsFetchingAlternatives] = useState(false);

  const [isFabOpen, setIsFabOpen] = useState(false); // Toggle state for the FAB

  // State to control video popup
  const [showVideoPopup, setShowVideoPopup] = useState(false);

  // Function to open the video popup
  const openVideoPopup = () => setShowVideoPopup(true);

  // Function to close the video popup
  const closeVideoPopup = () => setShowVideoPopup(false);

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

  // Check if the recipe is already saved
  const checkIfRecipeIsSaved = useCallback(async () => {
    if (!loginStatus || !recipe) return;

    try {
      const response = await fetch(
        "http://localhost:4000/user-api/is-recipe-saved",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipeId: recipe._id }), // Send the recipe ID
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check if recipe is saved.");
      }

      const data = await response.json();
      setIsSaved(data.isSaved); // Assuming the backend returns { isSaved: true/false }
    } catch (error) {
      console.error("Error checking if recipe is saved:", error);
    }
  }, [loginStatus, token, recipe]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchRecipe(title);
  }, [title, fetchRecipe]);

  useEffect(() => {
    if (recipe) {
      checkIfRecipeIsSaved();
    }
  }, [recipe, loginStatus, checkIfRecipeIsSaved]);
  useEffect(() => {
    if (recipe && recipe.likedBy && currentUser) {
      // Check if recipe.likedBy is an array before using includes
      setIsLiked(
        Array.isArray(recipe.likedBy)
          ? recipe.likedBy.includes(currentUser._id)
          : false
      );
    }
  }, [recipe, currentUser]);

  useEffect(() => {
    if (currentUser && token) {
      fetchLikedRecipes();
    }
  }, [currentUser, token]);

  const fetchLikedRecipes = async () => {
    // Add a check to ensure currentUser.id exists before making the request
    if (!currentUser?._id) {
      console.warn("currentUser.id is undefined, skipping fetchLikedRecipes");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:4000/user-api/liked-recipes/${currentUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      console.log("Liked Recipes:", data.payload);
    } catch (error) {
      console.error("Error fetching liked recipes:", error);
    }
  };

  if (loading) return <Loading />;
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
    if (!loginStatus) {
      showToast("Please log in to save recipes.", "alert");
      return;
    }

    if (isSaved) {
      showToast("Recipe is already saved.", "info");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/user-api/save-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipe }),
        }
      );

      if (!response.ok) throw new Error("Failed to save recipe");

      setIsSaved(!isSaved);  // Toggle the isSaved state
      showToast("Recipe saved successfully!", "success");
    } catch (err) {
      showToast(`Recipe could not be saved! ${err.message}`, "error");
    }
  };

  //like recipe 
    const handleLikeRecipe = async () => {
    setIsLiked(!isLiked); // Toggle the isLiked state
    // Additional API Call for liking the recipe can be added here
  };

  //handle share options
    const handleShare = async () => {
    setShowShareOptions(!showShareOptions)
    // Additional API Call for sharing the recipe can be added here
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
      const response = await fetch(
        "http://localhost:4000/user-api/like-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipe }),
        }
      );

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
  const toggleFab = () => setIsFabOpen(!isFabOpen);

 

  // For easy references
  const recipeId = recipe?._id;
  const recipeTitle = recipe?.title;
  const nutrition = recipe?.nutritionInformation;
  const userId = currentUser?._id; 

  return (
    <div className="recipe-details">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => showToast(null)}
        />
      )}
      <h1 className="recipe-title">{recipeTitle}</h1>

      {/* Floating Action Bar */}
      <div className={`floating-action-toggle ${isFabOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={toggleFab}>
  <FontAwesomeIcon icon={isFabOpen ? faTimes : faPlus} />
</button>

        
        <div className="floating-action-bar">
        

          <button onClick={handleSaveRecipe} className="icon-button">
            <FontAwesomeIcon icon={faBookmark} />
          </button>
          <button className="icon-button" onClick={handleLikeRecipe}>
             <FontAwesomeIcon icon={isLiked ? faHeart : faHeartBroken} />
          </button>
          <button onClick={handlePrint} className="icon-button">
            <FontAwesomeIcon icon={faPrint} />
          </button>
          <button className="icon-button">
            <FontAwesomeIcon icon={faComment} />
          </button>
          <button className="icon-button">
            <FontAwesomeIcon icon={faStickyNote} />
          </button>
           <button onClick={handleShare} className="icon-button">
              <FontAwesomeIcon icon={faShare} />
           
          </button>
        </div>
      </div>

      <div className="recipe-left-column">
        <div className="image-container">
          <img src={recipe.image} alt={recipeTitle} className="rrecipe-image" />
          {/* VIDEO PLAY BUTTON */}
          {recipe.videoURL && (
            <button className="video-button" onClick={openVideoPopup}>
              <FontAwesomeIcon icon={faPlay} />
            </button>
          )}
        </div>

        <div className="recipe-info">
          <div className="tag"><FontAwesomeIcon icon={faUtensils} /> {recipe.cuisine}</div>
          <div className="tag"><FontAwesomeIcon icon={faUtensils} /> {recipe.mealType}</div>
          <div className="tag"> <IoFastFoodSharp size={23} />{recipe.category}</div>
          <div className="tag"><FaUsers />Servings:{recipe.servings}</div>
          <div className="tag"> <FontAwesomeIcon icon={faClock} /> Prep: {recipe.preparationTime}</div>
          <div className="tag"><FontAwesomeIcon icon={faClock} /> Cook: {recipe.cookingTime} </div>
          <div className="tag"> <FontAwesomeIcon icon={faClock} /> Total: {recipe.totalTime}</div>
        </div>
       
        <div className="nutrition-allergy-container">
          {/* allergy warnings section */}
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
              {recipe.allergyWarnings?.map((warning, index) => (
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

          <div className="nutrition-info">
            <h3>Nutrition Facts</h3>
            {recipe.nutritionInformation &&
            Object.keys(recipe.nutritionInformation).length > 0 ? (
              <ul className="nutrition-list">
                {Object.entries(recipe.nutritionInformation).map(
                  ([key, value], index) => (
                    <li key={index}>
                      <span className="nutrient-name">
                        {key.replace(/\b\w/g, (char) => char.toUpperCase())}
                      </span>
                      <span className="nutrient-value">{value || "N/A"}</span>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="no-nutrition">
                No nutrition information available.
              </p>
            )}
          </div>
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
              <HiSparkles style={{ marginRight: "5px" }} />
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
                        checked={selectedIngredients.includes(ingredient.name)}
                        onChange={() => handleIngredientSelect(ingredient.name)}
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
        {/* STEPS SECTION */}
        <div className="steps-section recipe-section">
          <h3>Steps:</h3>
          <ol>
            {recipe.steps?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <button onClick={() => navigate(-1)} className="back-button">
        Go Back
      </button>
      {/* VIDEO POPUP */}
      {showVideoPopup && (
        <div className="video-popup">
          <div className="video-popup-content">
            <button className="close-button" onClick={closeVideoPopup}>
              ×
            </button>
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

        <div className="like-comment-share">
          <button
            className="icon-button"
            onClick={handleLikeRecipe}
            disabled={!loginStatus}
          >
            <FontAwesomeIcon icon={faHeart} /> {isLiked ? 'Unlike' : 'Like'}
          </button>
          <button className="comment-button" onClick={()=> setShowComments(!showComments)}>
            <FontAwesomeIcon icon={faComment} style={{ marginRight: "5px" }} />{" "}
            Comments
          </button>

       </div>

        {/* Notes Feature */}
        {loginStatus && recipeId && userId && (
          <div className="notes-section">
            <button
              className="notes-toggle-btn"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? "Hide Notes" : "Add Notes"}
            </button>
            {showNotes && <Notes userId={userId} recipeId={recipeId} />}
          </div>
        )}

      </div>
      {showComments && <Comments recipeId={recipeId} />}
      <button onClick={() => navigate(-1)} className="back-button">
        Go Back
      </button>
    </div>
  );
};

export default Recipe;