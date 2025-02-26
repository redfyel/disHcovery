import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CoolAIFull() {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/ingredient-api/ingredients")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
        console.log("Fetched categories:", data);
      })
      .catch((err) => console.error("Error fetching ingredients:", err));
  }, []);

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
    // Call AI API with selected ingredients
    setRecipes([
      "Paneer Butter Masala",
      "Aloo Jeera Fry",
      "Spinach Dal Tadka",
      "Tomato Rasam",
    ]);
  };

  const nextCategory = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">AI Cooking Assistant</h2>
      <p className="text-center text-muted">Select ingredients to get recipe suggestions</p>

      {/* Category Carousel */}
{categories.length > 0 && categories[currentIndex] && (
  <div className="d-flex align-items-center justify-content-center mt-4 position-relative">
    <button className="btn btn-outline-secondary me-3" onClick={prevCategory}>
      <FaChevronLeft />
    </button>

    <div className="card p-4 shadow-sm w-75 text-center">
      <h5>{categories[currentIndex].category}</h5>
      <div className="d-flex flex-wrap gap-2 mt-2">
        {categories[currentIndex]?.ingredients?.map((item) => (
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

    <button className="btn btn-outline-secondary ms-3" onClick={nextCategory}>
      <FaChevronRight />
    </button>
  </div>
)}


      {/* Pagination Dots */}
      <div className="d-flex justify-content-center mt-3">
        {categories.map((_, index) => (
          <span
            key={index}
            className={`mx-1 rounded-circle ${index === currentIndex ? "bg-primary" : "bg-secondary"}`}
            style={{ width: "10px", height: "10px", display: "inline-block" }}
          ></span>
        ))}
      </div>

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
