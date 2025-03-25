import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Share from "../share/Share";
import "./Recipe.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HiSparkles } from "react-icons/hi";
import { IoFastFoodSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import {faHeart,faPrint,faBookmark,faComment,faUtensils,faClock,faPlay,faStickyNote,faShare,faPlus,faTimes,faHeartBroken,} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo_og.png";
import { TiWarning } from "react-icons/ti";
import { userLoginContext } from "../../contexts/UserLoginContext";
import Loading from "../loading/Loading";
import Toast from "../toast/Toast";
import { useToast } from "../../contexts/ToastProvider";
import { motion } from "framer-motion";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import Notes from "../notes/Notes";
import Comments from "../comments/Comments";

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
  const [showComments, setShowComments] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { toast, showToast } = useToast();
  const [showIngredientSelection, setShowIngredientSelection] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientAlternatives, setIngredientAlternatives] = useState({});
  const [isFetchingAlternatives, setIsFetchingAlternatives] = useState(false);

  const [isFabOpen, setIsFabOpen] = useState(false); // Toggle state for the FAB
  // Create a ref for the toggle button
  const toggleButtonRef = useRef(null);
  // State to control video popup
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  // Function to open the video popup
  const openVideoPopup = () => setShowVideoPopup(true);
  // Function to close the video popup
  const closeVideoPopup = () => setShowVideoPopup(false);

  // scrolling to comments
  const commentsRef = useRef(null);

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchRecipe = useCallback(
    async (recipeTitle) => {
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
    },
    [] // Removed dependencies, assuming this only needs to be defined once
  );

  // Check if the recipe is already saved
  const checkIfRecipeIsSaved = useCallback(
    async (recipeId) => {
      if (!loginStatus || !recipeId) return;

      try {
        const response = await fetch(
          "http://localhost:4000/user-api/is-recipe-saved",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ recipeId: recipeId }), // Send the recipe ID
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
    },
    [loginStatus, token]
  );

  const checkIfRecipeIsLiked = useCallback(
    async (recipeId) => {
      //   console.log("checkIfRecipeIsLiked called with recipeId:", recipeId); // Add this

      if (!loginStatus || !recipeId) {
        // console.log("checkIfRecipeIsLiked: Not logged in or recipeId missing");
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:4000/user-api/is-recipe-liked",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ recipeId: recipeId }),
          }
        );
        if (!response.ok) {
          console.error(
            "checkIfRecipeIsLiked: Failed to check if recipe is liked."
          ); // Add this
          throw new Error("Failed to check if recipe is liked.");
        }
        const liked = await response.json();
        // console.log("checkIfRecipeIsLiked: Response from server:", liked); // Add this
        setIsLiked(liked.isLiked);
      } catch (error) {
        console.error("Error checking if recipe is liked:", error);
      }
    },
    [loginStatus, token]
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchRecipe(title);
  }, [title, fetchRecipe]);

  useEffect(() => {
    if (recipe) {
      console.log("useEffect: Recipe changed, checking saved/liked status"); // Add this
      checkIfRecipeIsSaved(recipe._id);
      checkIfRecipeIsLiked(recipe._id);
    }
  }, [recipe, loginStatus, checkIfRecipeIsSaved, checkIfRecipeIsLiked]);

  const handleLikeRecipe = async () => {
    if (!loginStatus) {
      showToast("Please log in to like/unlike recipes.", "alert");
      return;
    }

    const endpoint = isLiked ? "dislike-recipe" : "like-recipe";

    console.log("handleLikeRecipe: Sending recipeId:", recipe._id); // Add this line

    try {
      const response = await fetch(
        `http://localhost:4000/user-api/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipeId: recipe._id, recipe: recipe }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update like status.  Status: ${response.status}`
        );
      }

      setIsLiked((prevIsLiked) => !prevIsLiked); // Toggle the isLiked state

      const message = isLiked
        ? "Recipe successfully liked!"
        : "Recipe successfully removed from liked recipes.";
      showToast(message, "success");
    } catch (error) {
      showToast(
        `Recipe like/dislike operation failed. Please try again later.${error.message}`,
        "error"
      );
      console.error("Error in handleLikeRecipe:", error); // Log the error
    }
  };

  // Helper to store recipe for printing
  const handlePrint = () => {
    if (!recipe) return;

    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const printDocument = iframe.contentWindow.document;

    // Construct the HTML content for printing.
    // Note: Replace React components with plain HTML (or images/icons as needed).
    const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Recipe</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .print-container { max-width: 1200px; margin: auto; text-align: left; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
          .logo { width: auto; height: 100px; opacity: 0.7; }
          .recipe-image { width: 100%; max-width: 250px; display: block; margin: 15px auto; border-radius: 10px; }
          .info { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; background: #f8f8f8; border-radius: 8px; }
          .tag { display: inline-block; background: #fffae5; padding: 5px 10px; border-radius: 15px; font-size: 14px; font-weight: bold; margin: 4px; }
          h3 { margin-top: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <h1>${recipe.title}</h1>
            <img class="logo" src="${logo}" alt="Dishcovery Logo" />
          </div>
          <img class="recipe-image" src="${recipe.image}" alt="${
      recipe.title
    }" />
          <div class="info">
                <div class="tag"><FaUtensils /> ${recipe.cuisine}</div>
                  <div class="tag"><FaConciergeBell /> ${recipe.mealType}</div>
                  <div class="tag"><FaClock /> Prep: ${
                    recipe.preparationTime
                  }</div>
                  <div class="tag"><FaClock /> Cook: ${recipe.cookingTime}</div>
                  <div class="tag"><FaClock /> Total: ${recipe.totalTime}</div>
                  <div class="tag"><FaUsers /> Servings: ${
                    recipe.servings
                  }</div>
          </div>
          <h3>Ingredients:</h3>
          <ul>
            ${recipe.ingredients
              .map((ing) => `<li>${ing.amount} ${ing.unit} ${ing.name}</li>`)
              .join("")}
          </ul>
          <h3>Steps:</h3>
          <ol>
            ${recipe.steps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
          ${
            recipe.allergyWarnings && recipe.allergyWarnings.length
              ? `
            <h3>Allergy Warnings:</h3>
            <ul>
              ${recipe.allergyWarnings
                .map((warn) => `<li>${warn}</li>`)
                .join("")}
            </ul>
          `
              : ""
          }
        </div>
        <script>
          window.addEventListener('load', function() {
            window.print();
          });
          window.addEventListener('afterprint', function() {
            window.parent.document.body.removeChild(document.currentScript.parentNode.parentNode);
          });
        </script>
      </body>
    </html>
  `;

    printDocument.open();
    printDocument.write(printContent);
    printDocument.close();
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

      setIsSaved(!isSaved); // Toggle the isSaved state
      showToast("Recipe saved successfully!", "success");
    } catch (err) {
      showToast(
        `Recipe could not be saved! Please try again later. ${err.message}`,
        "error"
      );
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
      showToast("Please select at least one ingredient.", "info");
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
      // console.error("Error fetching ingredient alternatives:", error);
      showToast(
        "Failed to get ingredient alternatives. Please try again later.",
        "error"
      );
    } finally {
      setIsFetchingAlternatives(false);
    }
  };

  // Toggle share options
  const toggleShareOptions = () => setShowShareOptions((prev) => !prev);
  const toggleFab = () => setIsFabOpen(!isFabOpen);

  // For easy references
  const recipeId = recipe?._id;
  const recipeTitle = recipe?.title;
  const userId = currentUser?._id;

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="error">
        {error} <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const renderTooltip = (msg) => (props) =>
    (
      <Tooltip id="button-tooltip" className="tooltip" {...props}>
        {msg}
      </Tooltip>
    );

  const ToggleButton = React.forwardRef(({ children, onClick }, ref) => (
    <button className="toggle-button" onClick={onClick} ref={ref}>
      {children}
    </button>
  ));
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
      <div className={`floating-action-toggle ${isFabOpen ? "open" : ""}`}>
        <ToggleButton ref={toggleButtonRef} onClick={toggleFab} >
          <FontAwesomeIcon icon={isFabOpen ? faTimes : faPlus} />
        </ToggleButton>

        <div className="floating-action-bar">
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(
              "Save this recipe for a delicious day ahead! 😋"
            )}
          >
            <button onClick={handleSaveRecipe} className="icon-button">
              {isSaved ? (
                <FontAwesomeIcon icon={faBookmark} />
              ) : (
                <CiBookmark size={30} style={{ strokeWidth: 1 }} />
              )}
            </button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(
              isLiked
                ? "Changed your mind? No worries! 💔"
                : "Show this recipe some love! ❤️"
            )}
          >
            <button className="icon-button" onClick={handleLikeRecipe}>
              {isLiked ? <FontAwesomeIcon icon={faHeart} /> : <FaRegHeart />}
            </button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(
              "Print it out and become a kitchen wizard! 🧙‍♂️"
            )}
          >
            <button onClick={handlePrint} className="icon-button">
              <AiFillPrinter />
            </button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip("Got thoughts? Drop a comment! 💬")}
          >
            <button
              className="icon-button"
              onClick={() => {
                setShowComments(!showComments);
                scrollToComments(); 
              }}
              
            >
              {showComments ? <FaComments /> : <FaRegComments />}
            </button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip("Jot down your secret tweaks! ✍️")}
          >
           {/* Notes Button */}
<button
  className="icon-button"
  onClick={() => {
    if (!loginStatus) {
      showToast("You must be logged in to add notes!", "alert");
      return;
    }
    setShowNotes((prev) => !prev);
  }}
>
  {showNotes ? (
    <FontAwesomeIcon icon={faStickyNote} />
  ) : (
    <CiStickyNote size={30} style={{ strokeWidth: 2 }} />
  )}
</button>



          </OverlayTrigger>
          {/* Notes Feature */}    

        {/* Notes Modal Positioned Beside the Icon */}
<div className={`notes-container ${showNotes ? "" : "hidden"}`}>
  {showNotes && (
    // <Notes recipeId={recipeId} userNotes={userNotes} />
    <Notes userId={userId} recipeId={recipeId} initialOpen={showNotes} setShowNotes={setShowNotes} />
  )}
</div>

          <OverlayTrigger
            placement="left"
            delay={{ show: 150, hide: 400 }}
            overlay={renderTooltip("Spread the foodie joy! 🍽️")}
          >
            <button onClick={toggleShareOptions} className="icon-button">
              <IoShareSocialOutline />
            </button>
          </OverlayTrigger>
         {/* Share Component Positioned to the Left */}
<div className={`share-container ${showShareOptions ? "" : "hidden"}`}>
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
          <div className="tag">
            <FontAwesomeIcon icon={faUtensils} /> {recipe.cuisine}
          </div>
          <div className="tag">
            <FontAwesomeIcon icon={faUtensils} /> {recipe.mealType}
          </div>
          <div className="tag">
            {" "}
            <IoFastFoodSharp size={23} />
            {recipe.category}
          </div>
          <div className="tag">
            <FaUsers />
            Servings:{recipe.servings}
          </div>
          <div className="tag">
            {" "}
            <FontAwesomeIcon icon={faClock} /> Prep: {recipe.preparationTime}
          </div>
          <div className="tag">
            <FontAwesomeIcon icon={faClock} /> Cook: {recipe.cookingTime}{" "}
          </div>
          <div className="tag">
            {" "}
            <FontAwesomeIcon icon={faClock} /> Total: {recipe.totalTime}
          </div>
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
            <h3>Ingredients</h3>
            <button
              onClick={toggleIngredientSelection}
              className="ai-button ingredient-alternatives-button"
              disabled={isFetchingAlternatives} 
            >
              <HiSparkles style={{ marginRight: "5px" }} size={23}/>
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
  <div className={`ingredient-selection ${showIngredientSelection ? "" : "hidden"}`}>
    <h4>Select Ingredients for Alternatives</h4>

    {isFetchingAlternatives ? (
      <Loading />
    ) : (
      <>
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
          Get Alternatives
        </button>
      </>
    )}
  </div>
)}
        </div>


        {/* STEPS SECTION */}
        <div className="recipe-section steps-section">

          <h3>Steps</h3>
          <ol>
            {recipe.steps?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

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
        </div>
      )}
      <div className="recipe-right-column">
        

        <div ref={commentsRef}></div>
        {showComments && <Comments recipeId={recipeId} />}
      </div>
      <button onClick={() => navigate(-1)} className="back-button">
        Go Back
      </button>
    </div>
  );
};

export default Recipe;
