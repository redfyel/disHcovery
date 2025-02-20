import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CoolAIFull() {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [recipes, setRecipes] = useState([]);

  const categories = {
    Veggies: ["Onion", "Tomato", "Potato", "Spinach"],
    Dairy: ["Paneer", "Milk", "Curd", "Butter"],
    Spices: ["Turmeric", "Cumin", "Coriander", "Garam Masala"],
  };

  const selectIngredient = (item) => {
    setIngredients((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const addCustomIngredient = () => {
    if (input.trim() && !ingredients.includes(input)) {
      setIngredients((prev) => [...prev, input.trim()]);
      setInput("");
    }
  };

  const fetchRecipes = () => {
    setRecipes([
      "Paneer Butter Masala",
      "Aloo Jeera Fry",
      "Spinach Dal Tadka",
      "Tomato Rasam",
    ]);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">AI Cooking Assistant</h2>
      <p className="text-center text-muted">Select ingredients to get recipe suggestions</p>

      {/* Display Categories */}
      {Object.entries(categories).map(([category, items]) => (
        <div key={category} className="mt-4">
          <h5>{category}</h5>
          <div className="d-flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                key={item}
                className={`btn btn-sm ${
                  ingredients.includes(item) ? "btn-success" : "btn-outline-secondary"
                }`}
                onClick={() => selectIngredient(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Add Custom Ingredient */}
      <div className="input-group mt-4">
        <input
          type="text"
          placeholder="Add custom ingredient..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-success" onClick={addCustomIngredient}>
          Add
        </button>
      </div>

      {/* Fetch Recipes Button */}
      <button className="btn btn-primary w-100 mt-4" onClick={fetchRecipes}>
        Get Recipes
      </button>

      {/* Display Recipes */}
      {recipes.length > 0 && (
        <div className="mt-4">
          <h5 className="fw-bold">Suggested Recipes:</h5>
          <div className="d-flex flex-wrap gap-3 p-2">
            {recipes.map((recipe, index) => (
              <div key={index} className="card shadow-sm p-3 text-center" style={{ minWidth: "150px" }}>
                {recipe}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
