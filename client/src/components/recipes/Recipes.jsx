import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Recipes.css"; // Import the CSS file

// Sample Recipe Data
const sampleRecipes = [
  {
    _id: "1",
    name: "Spaghetti Carbonara",
    cuisine: "Italian",
    imageURL: "https://source.unsplash.com/300x200/?pasta",
    cookingTime: "30 mins",
  },
  {
    _id: "2",
    name: "Chicken Biryani",
    cuisine: "Indian",
    imageURL: "https://source.unsplash.com/300x200/?biryani",
    cookingTime: "45 mins",
  },
  {
    _id: "3",
    name: "Sushi Platter",
    cuisine: "Japanese",
    imageURL: "https://source.unsplash.com/300x200/?sushi",
    cookingTime: "60 mins",
  },
  {
    _id: "4",
    name: "Avocado Toast",
    cuisine: "American",
    imageURL: "https://source.unsplash.com/300x200/?toast",
    cookingTime: "10 mins",
  },
  {
    _id: "5",
    name: "Pad Thai",
    cuisine: "Thai",
    imageURL: "https://source.unsplash.com/300x200/?padthai",
    cookingTime: "35 mins",
  },
];

const Recipes = () => {
  const [search, setSearch] = useState("");

  // Filter recipes based on search input
  const filteredRecipes = sampleRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="recipes-page">
      <h1 className="recipes-title">Discover Delicious Recipes</h1>

      {/* Search Bar */}
      <div className="search-filter-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Recipe Listing */}
      <div className="recipe-grid">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <img
                src={recipe.imageURL}
                alt={recipe.name}
                className="recipe-image"
              />
              <h3 className="recipe-name">{recipe.name}</h3>
              <p className="recipe-cuisine">{recipe.cuisine}</p>
              <p className="recipe-time">⏱ {recipe.cookingTime}</p>
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
  );
};

export default Recipes;
