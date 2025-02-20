import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Recipes.css"; // Import the CSS file

const Recipes = () => {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState([]);
  const [selectedCookTime, setSelectedCookTime] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState([]);

  // Fetch recipes from the backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:4000/recipe-api/recipes");
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        console.log(data);
        setRecipes(data.payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search input and selected filters
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
    // Add logic for other filters based on selected state variables
    // ... (implement filter logic for ingredients, meal type, diet, etc.)
    return matchesSearch; // Include additional conditions for filters
  });

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recipes-page">
      <h1 className="recipes-title">Discover Delicious Recipes</h1>

      {/* Main layout for filters and recipes */}
      <div className="layout">
        <div className="filter-sidebar">
          <h3>Filter</h3>
          <div className="filter-section">
            <h4>Ingredients</h4>
            {/* Add your ingredient checkboxes */}
            {['Milk', 'Eggs', 'Bread', 'Potatoes'].map(ingredient => (
              <div key={ingredient}>
                <input 
                  type="checkbox" 
                  value={ingredient} 
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedIngredients(prev => 
                      prev.includes(value)
                        ? prev.filter(item => item !== value)
                        : [...prev, value]
                    );
                  }} 
                />
                {ingredient}
              </div>
            ))}
          </div>

          <div className="filter-section">
            <h4>Meal Type</h4>
            {/* Add your meal type checkboxes */}
            {['Appetizers', 'Beverages', 'Breads', 'Breakfast'].map(meal => (
              <div key={meal}>
                <input 
                  type="checkbox" 
                  value={meal} 
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedMealType(prev => 
                      prev.includes(value)
                        ? prev.filter(item => item !== value)
                        : [...prev, value]
                    );
                  }} 
                />
                {meal}
              </div>
            ))}
          </div>

          {/* Add similar sections for Diet, Cook Time, Cuisine, and Nutrition */}

        </div>

        {/* Recipe Listing */}
        <div className="recipe-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card">
                <img
                  src={recipe.image} // Ensure your recipe model has an imageURL field
                  alt={recipe.title}
                  className="recipe-image"
                />
                <h3 className="recipe-name">{recipe.title}</h3>
                <p className="recipe-cuisine">{recipe.cuisine}</p>
                <p className="recipe-time">⏱ {recipe.cook_time}</p>
                <Link to={`/recipe/${recipe._id}`} className="view-details">
                  View Details →
                </Link>
              </div>
            ))
          ) : (
            <p className="no-results">No recipes found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;