import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RecipeAI() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [recipes, setRecipes] = useState([]);

  const categories = {
    Veggies: ["Onion", "Tomato", "Potato", "Spinach"],
    Dairy: ["Paneer", "Milk", "Curd", "Butter"],
    Spices: ["Turmeric", "Cumin", "Coriander", "Garam Masala"],
  };

  const toggleOpen = () => setOpen(!open);

  const handleInput = (e) => setInput(e.target.value);

  const handleSend = () => {
    if (input.toLowerCase() === "hi") {
      setStage(1);
    }
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
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
    <div className="position-fixed bottom-0 end-0 m-4">
      {!open ? (
        <button className="btn btn-primary rounded-circle p-3" onClick={toggleOpen}>
          🤖
        </button>
      ) : (
        <div className="card p-4 shadow-lg" style={{ width: stage === 0 ? "22rem" : "26rem" }}>
          <button className="btn-close position-absolute top-0 end-0 m-2" onClick={toggleOpen}></button>
          <h4 className="text-center">AI Cooking Assistant</h4>

          {stage === 0 && (
            <div className="d-flex align-items-center mt-3">
              <input
                type="text"
                placeholder="Text 'hi' to get started"
                value={input}
                onChange={handleInput}
                onKeyPress={handleKeyPress}
                className="form-control"
              />
              <button className="btn btn-primary ms-2" onClick={handleSend}>
                Send
              </button>
            </div>
          )}

          {stage === 1 && (
            <div>
              <h5 className="mt-3">Select Your Ingredients</h5>
              {Object.entries(categories).map(([category, items]) => (
                <div key={category} className="mt-2">
                  <h6>{category}</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {items.map((item) => (
                      <button
                        key={item}
                        className={`btn btn-sm ${ingredients.includes(item) ? "btn-success" : "btn-outline-secondary"}`}
                        onClick={() => selectIngredient(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="input-group mt-3">
                <input
                  type="text"
                  placeholder="Add custom ingredient..."
                  value={input}
                  onChange={handleInput}
                  className="form-control"
                />
                <button className="btn btn-success" onClick={addCustomIngredient}>
                  Add
                </button>
              </div>
              <button className="btn btn-primary w-100 mt-3" onClick={fetchRecipes}>
                Get Recipes
              </button>
            </div>
          )}

          {recipes.length > 0 && (
            <div className="mt-3">
              <h5 className="fw-bold">Suggested Recipes:</h5>
              <div className="d-flex overflow-auto gap-3 p-2">
                {recipes.map((recipe, index) => (
                  <div key={index} className="card shadow-sm p-3 text-center" style={{ minWidth: "150px" }}>
                    {recipe}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
