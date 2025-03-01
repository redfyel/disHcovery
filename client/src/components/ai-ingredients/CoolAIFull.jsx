import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CoolAIFull.css";

export default function CoolAIFull() {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [showRemove, setShowRemove] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { text: "Hi there! What's in your fridge? Select ingredients here or add your own.", sender: "ai" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

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

  const fetchRecipes = async () => {
    if (ingredients.length === 0) {
      setAiMessages((prev) => [
        ...prev,
        { text: "You haven't selected any ingredients yet! Try adding some.", sender: "ai" },
      ]);
      return;
    }

    setIsTyping(true);
    setAiMessages((prev) => [...prev, { text: "Let me think...", sender: "ai" }]);

    try {
      const response = await fetch("http://localhost:4000/airecipes-api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredients }),
      });

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        const errorText = await response.text(); // Get the error message from the server
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const data = await response.json();
      const aiResponse = data.recipe;

      setIsTyping(false);
      setAiMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "Let me think..."),
        { text: aiResponse, sender: "ai" },
      ]);

      setRecipes([aiResponse]); 

    } catch (error) {
      console.error("Error fetching AI response:", error);
      setIsTyping(false);
      setAiMessages((prev) => [...prev, { text: "Oops! Something went wrong. Try again later.", sender: "ai" }]);
    }
  };


  const nextCategory = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <div className="cool-ai-container">
      <h1 className="text-center fw-bold">disHcovery: AI Recipe Finder</h1>
      <p className="text-center text-muted">
        Select ingredients, get instant AI-generated recipes, and discover ingredient alternatives!
      </p>

      {/* AI Chat Section */}
      <div className="ai-chat">
        {aiMessages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="chat-bubble ai typing">...</div>}
      </div>

      {/* Category Carousel */}
      {categories.length > 0 && categories[currentIndex] && (
        <div className="category-carousel">
          <button className="cool-ai-btn arrow-btn" onClick={prevCategory}>
            <FaChevronLeft />
          </button>

          <div className="category-card">
            <h5 className="text-center">{categories[currentIndex].category}</h5>
            <div className="ingredient-grid">
              {categories[currentIndex]?.ingredients?.map((item) => (
                <div
                  key={item.name}
                  className={`ingredient-card ${ingredients.includes(item.name) ? "selected" : ""}`}
                  onClick={() => selectIngredient(item)}
                >
                  <img src={item.image} alt={item.name} className="ingredient-image" />
                  <p className="ingredient-name">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          <button className="cool-ai-btn arrow-btn" onClick={nextCategory}>
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Selected Ingredients */}
      <div className="selected-ingredients-container">
        <div className="d-flex justify-content-between align-items-center">
          <h5>🛒 Selected Ingredients:</h5>
          <button className="toggle-edit-btn" onClick={() => setShowRemove(!showRemove)}>
            {showRemove ? "✅ Done" : "✏️ Quick Edit"}
          </button>
        </div>

        <div className="selected-ingredients">
          {ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => {
              const found = categories.flatMap((cat) => cat.ingredients).find((item) => item.name === ingredient);
              return (
                <div key={index} className="ingredient-item">
                  {found?.image ? (
                    <img src={found.image} alt={ingredient} className="ingredient-image-small" />
                  ) : (
                    <div className="custom-ingredient-placeholder">+</div>
                  )}
                  <span className="ingredient-name">{ingredient}</span>

                  {showRemove && (
                    <button
                      className="remove-btn"
                      onClick={() => setIngredients(ingredients.filter((i) => i !== ingredient))}
                    >
                      −
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-muted">No ingredients selected</p>
          )}
        </div>
      </div>

      {/* Add Custom Ingredient */}
      <div className="input-group mt-4">
        <input
          type="text"
          placeholder="Type an ingredient and press Add..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="form-control"
        />
        <button className="cool-ai-btn add-btn" onClick={addCustomIngredient}>
          ➕ Add
        </button>
      </div>

      {/* Fetch Recipes Button */}
      <button className="cool-ai-btn fetch-btn w-100 mt-4" onClick={fetchRecipes}>
        🔥 Generate Recipes
      </button>

      {/* Display Recipes */}
      {recipes.length > 0 && (
        <div className="ai-recipe-section">
          <h4 className="fw-bold">🍽️ Suggested Recipes:</h4>
          <div className="ai-recipe-grid">
            {recipes.map((recipe, index) => (
              <div key={index} className="ai-recipe-card">
                {recipe}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}