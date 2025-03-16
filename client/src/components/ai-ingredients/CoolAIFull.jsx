import React, { useState, useEffect, useRef, useContext } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTrash,
  FaSave,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { userLoginContext } from "../../contexts/UserLoginContext";
import Loading from "../loading/Loading"; // Import the Loading component
import "./CoolAiFull.css";

const CoolAIFull = () => {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [showRemove, setShowRemove] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      text:
        "Hey there! 👋 What deliciousness is hiding in your fridge? Select ingredients below or add your own!   Or upload an image of ingredients you have to get recipes!",
      sender: "ai",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [showIngredientSelection, setShowIngredientSelection] =
    useState(true);
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [showUploadImage, setShowUploadImage] = useState(true);

  const { loginStatus, currentUser } = useContext(userLoginContext);

  useEffect(() => {
    fetch("http://localhost:4000/ingredient-api/ingredients")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Error fetching ingredients:", err));
  }, []);

  const selectIngredient = (item) => {
    setIngredients((prev) =>
      prev.includes(item.name)
        ? prev.filter((i) => i !== item.name)
        : [...prev, item.name]
    );
  };

  const addCustomIngredient = () => {
    if (input.trim() && !ingredients.includes(input)) {
      setIngredients((prev) => [...prev, input.trim()]);
      setInput("");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if it's a valid image type
      if (!file.type.startsWith("image/")) {
        setImageError("Please select a valid image file.");
        setSelectedImage(null);
        setImagePreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Store base64 encoded image
        setImagePreview(reader.result);
        setImageError(null);
      };
      reader.onerror = () => {
        setImageError("Failed to read image. Please try again.");
        setSelectedImage(null);
        setImagePreview(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchRecipes = async () => {
    if (ingredients.length === 0 && !selectedImage) {
      // Modified condition
      setAiMessages((prev) => [
        ...prev,
        {
          text: "Oops! You need to add ingredients or upload an image! 😅",
          sender: "ai",
        },
      ]);
      return;
    }

    setIsTyping(true);
    setIsLoadingRecipe(true);
    setShowIngredientSelection(false);
    setShowGenerateButton(false);
    setShowUploadImage(false);

    setAiMessages([{ text: "Thinking... 🤔", sender: "ai" }]);

    try {
      let response;
      if (selectedImage) {
        // API call for image-based recipe generation
        response = await fetch(
          "http://localhost:4000/airecipes-api/generate-recipe-from-image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: selectedImage }),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:4000/airecipes-api/generate-recipe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ingredients: ingredients }),
          }
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }

      const data = await response.json();
      const aiResponse = data.recipe;

      setIsTyping(false);
      setIsLoadingRecipe(false);

      setAiMessages([
        { text: formatRecipe(aiResponse), sender: "ai", type: "recipe" },
      ]);

      setRecipes([aiResponse]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setIsTyping(false);
      setIsLoadingRecipe(false);
      setShowIngredientSelection(true);
      setShowGenerateButton(true);
      setShowUploadImage(true);
      setAiMessages([
        {
          text: "Uh oh! Something went wrong. Let's try again later. 🥺",
          sender: "ai",
        },
      ]);
    }
  };

  const saveRecipe = async (recipeText) => {
    if (!recipeText) {
      alert("No recipe content found.");
      return;
    }

    if (!loginStatus) {
      alert("You need to log in to save recipes! 🔑");
      return;
    }

    // Extract data from the recipe text
    const titleMatch = recipeText.match(/^Recipe Name:\s*(.+?)\n/);
    const title = titleMatch ? titleMatch[1].trim() : "Untitled Recipe";

    const descriptionMatch = recipeText.match(/Description:\s*(.+?)\n/);
    const description = descriptionMatch
      ? descriptionMatch[1].trim()
      : "No description provided.";

    const ingredientsMatch = recipeText.match(
      /Ingredients:\s*([\s\S]*?)(?=\nInstructions:|\n$)/i
    );
    const ingredientsText = ingredientsMatch ? ingredientsMatch[1] : "";
    const ingredients = ingredientsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    let instructionsText = "";
    const instructionsMatch = recipeText.match(/Instructions:\s*([\s\S]*)$/i);
    if (instructionsMatch) {
      instructionsText = instructionsMatch[1];
    }
    const instructions = instructionsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    try {
      const response = await fetch(
        "http://localhost:4000/airecipes-api/save-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            username: currentUser?.username,
            title,
            ingredients,
            instructions,
            description,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }

      const data = await response.json();
      setAiMessages((prevMessages) => [
        ...prevMessages,
        { text: "Recipe Saved Successfully! ✅", sender: "ai" },
      ]);
    } catch (error) {
      console.error("Error saving recipe:", error);
      setAiMessages((prevMessages) => [
        ...prevMessages,
        { text: "Oops! Recipe save Failed 🥺", sender: "ai" },
      ]);
    }
  };

  const formatRecipe = (recipeText) => {
    if (!recipeText) return <p>No recipe content found.</p>;

    // Extract Recipe Name
    const titleMatch = recipeText.match(/^Recipe Name:\s*(.+?)\n/);
    const title = titleMatch ? titleMatch[1].trim() : "Untitled Recipe";

    // Extract Description
    const descriptionMatch = recipeText.match(/Description:\s*(.+?)\n/);
    const description = descriptionMatch
      ? descriptionMatch[1].trim()
      : "No description provided.";

    let ingredientsList = [];
    let instructionsList = [];

    // Extract Ingredients
    const ingredientsMatch = recipeText.match(
      /Ingredients:\s*([\s\S]*?)(?=\nInstructions:|\n$)/i
    );
    if (ingredientsMatch) {
      const ingredientsText = ingredientsMatch[1];
      ingredientsList = ingredientsText
        .split("\n")
        .map((item) => item.trim().replace(/^\*/, ""))
        .filter((item) => item !== "")
        .map((item, index) => <li key={index}>{item}</li>);
    }

    // Extract Instructions and Remove Numbering
    const instructionsMatch = recipeText.match(/Instructions:\s*([\s\S]*)$/i);
    if (instructionsMatch) {
      const instructionsText = instructionsMatch[1];
      instructionsList = instructionsText
        .split("\n")
        .map((item) => item.trim().replace(/^\d+\.\s*/, ""))
        .filter((item) => item !== "");
    }

    return (
      <div className="formatted-recipe">
        <h3>{title}</h3>
        <p className="description">{description}</p>
        {selectedImage && (
          <div className="recipe-image-preview">
            <img
              src={selectedImage}
              alt="Uploaded Ingredients"
              style={{ maxWidth: "300px", maxHeight: "200px" }}
            />
          </div>
        )}
        <div className="ingredients">
          <h3>Ingredients:</h3>
          {ingredientsList.length > 0 ? (
            <ul>{ingredientsList}</ul>
          ) : (
            <p>No ingredients provided.</p>
          )}
        </div>
        <div className="instructions">
          <h3>Instructions:</h3>
          <ol>
            {instructionsList.map((step, index) => (
              <li key={index}>{step}</li>
            ))}{" "}
          </ol>
        </div>
        <div className="recipe-actions">
          <button
            className="cool-ai-btn save-recipe-btn"
            onClick={() => saveRecipe(recipeText)}
            aria-label="Save Recipe"
          >
            <FaSave /> Save Recipe
          </button>
          <button
            className="cool-ai-btn back-btn"
            onClick={() => {
              setShowIngredientSelection(true);
              setShowGenerateButton(true);
              setShowUploadImage(true);
              setAiMessages([
                {
                  text:
                    "Hey there! 👋 What deliciousness is hiding in your fridge? Select ingredients below or add your own!  Or upload an image of ingredients you have to get recipes!",
                  sender: "ai",
                },
              ]);
              setRecipes([]);
            }}
            aria-label="Back to Ingredients"
          >
            Back to Ingredients
          </button>
        </div>
        <p className="ai-disclaimer text-center mt-2">
          <small>disHcovered with AI – Experiment with caution! 🤖</small>
        </p>
      </div>
    );
  };

  const nextCategory = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + categories.length) % categories.length
    );
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  // Pagination dots component
  const CategoryPagination = ({
    categories,
    currentIndex,
    setCurrentIndex,
  }) => {
    return (
      <div className="category-pagination">
        {categories.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to category ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      id="cool-ai-container"
      className="cool-ai-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: "900px" }}
    >
      <h1 id="cool-ai-title" className="text-center fw-bold">
        disHcovery AI
      </h1>
      <p id="cool-ai-subtitle" className="text-center text-muted">
        Unlock culinary magic! Input your ingredients or select from our list,
        and let AI disHcover a recipe!
      </p>

      {/* AI Chat Section */}
      <motion.div id="ai-chat" className="ai-chat">
        <AnimatePresence>
          {aiMessages.map((msg, index) => (
            <motion.div
              key={index}
              className={`chat-bubble ${msg.sender} ${
                msg.type === "recipe" ? "recipe" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {msg.text}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              className="chat-bubble ai typing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              ...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Image Upload Section */}
      {showUploadImage && (
        <div id="image-upload-section" className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-control"
            aria-label="Upload ingredient image"
          />
          {/* Display Image Preview */}
          {selectedImage && (
            <div className="image-preview mt-3">
              <img
                src={selectedImage}
                alt="Uploaded Ingredients"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Ingredient Selection Section  */}
      <AnimatePresence>
        {showIngredientSelection && (
          <motion.div
            id="ingredient-selection"
            className="ingredient-selection"
            key="ingredientSelection"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Carousel */}
            {categories.length > 0 && categories[currentIndex] && (
              <div id="category-carousel" className="category-carousel">
                <button
                  className="cool-ai-btn arrow-btn"
                  onClick={prevCategory}
                  aria-label="Previous Category"
                >
                  <FaChevronLeft />
                </button>

                <div id="category-card" className="category-card">
                  <h5 className="text-center">
                    {categories[currentIndex].category}
                  </h5>
                  <div id="ingredient-grid" className="ingredient-grid">
                    {categories[currentIndex]?.ingredients?.map((item) => (
                      <motion.div
                        key={item.name}
                        className={`ingredient-card ${
                          ingredients.includes(item.name) ? "selected" : ""
                        }`}
                        onClick={() => selectIngredient(item)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="ingredient-image"
                        />
                        <p className="ingredient-name">{item.name}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button
                  className="cool-ai-btn arrow-btn"
                  onClick={nextCategory}
                  aria-label="Next Category"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}

            {/* Category Pagination Dots */}
            {categories.length > 1 && (
              <CategoryPagination
                categories={categories}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            )}

            {/* Selected Ingredients */}
            <div
              id="selected-ingredients-container"
              className="selected-ingredients-container"
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5>🛒 My Ingredients:</h5>
                {ingredients.length > 0 && (
                  <button
                    className="toggle-edit-btn"
                    onClick={() => setShowRemove(!showRemove)}
                    aria-label="Toggle Edit Mode"
                  >
                    {showRemove ? "✅ Done" : "✏️ Edit"}
                  </button>
                )}
              </div>

              <div id="selected-ingredients" className="selected-ingredients">
                {ingredients.length > 0 ? (
                  ingredients.map((ingredient, index) => {
                    const found = categories
                      .flatMap((cat) => cat.ingredients)
                      .find((item) => item.name === ingredient);
                    return (
                      <motion.div
                        key={index}
                        className="ingredient-item"
                        layout
                        transition={{ duration: 0.2 }}
                      >
                        {found?.image ? (
                          <img
                            src={found.image}
                            alt={ingredient}
                            className="ingredient-image-small"
                          />
                        ) : (
                          <div className="custom-ingredient-placeholder">+</div>
                        )}
                        <span className="ingredient-name">{ingredient}</span>

                        {showRemove && (
                          <button
                            className="remove-btn"
                            onClick={() => removeIngredient(ingredient)}
                            aria-label={`Remove ${ingredient}`}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-muted">
                    No ingredients selected yet. Add some!
                  </p>
                )}
              </div>
            </div>

            {/* Add Custom Ingredient */}
            <div id="custom-ingredient-input" className="mt-4 d-flex">
              <input
                type="text"
                placeholder="Add another ingredient..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="inp-bar form-control "
                aria-label="Add custom ingredient"
              />
              <button
                className="cool-ai-btn add-btn"
                onClick={addCustomIngredient}
                aria-label="Add ingredient"
              >
                <FaPlus /> Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fetch Recipes Button */}
      <AnimatePresence>
        {showGenerateButton && (
          <motion.button
            id="generate-recipes-button"
            className="cool-ai-btn fetch-btn mt-4"
            onClick={fetchRecipes}
            disabled={isLoadingRecipe}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isLoadingRecipe
              ? "Searching for Recipes... 🍳"
              : "✨ Generate Recipes!"}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Recipe Loading Spinner  - Replaced with the Loading Component*/}
      <AnimatePresence>
        {isLoadingRecipe && (
          <motion.div
            id="loading-component-container"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: Add a semi-transparent background
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10, // Ensure it's on top of other content
            }}
          >
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CoolAIFull;