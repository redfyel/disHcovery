import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Recipe.css"; // Import CSS file

const Recipe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe; // Get the recipe data from navigation state

  if (!recipe) {
    return (
      <div className="error">
        No recipe selected. <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="recipe-details">
      <h1 className="recipe-title">{recipe.title}</h1>

      {/* Image & Main Details Section */}
      <div className="recipe-main">
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
        <div className="recipe-info">
          <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
          <p><strong>Meal Type:</strong> {recipe.meal_type}</p>
          <p><strong>Category:</strong> {recipe.category}</p>
          <p><strong>Prep Time:</strong> {recipe.prep_time}</p>
          <p><strong>Cook Time:</strong> {recipe.cook_time}</p>
          <p><strong>Total Time:</strong> {recipe.total_time}</p>
          <p><strong>Servings:</strong> {recipe.servings}</p>
        </div>
      </div>

      {/* Remaining Details */}
      <div className="recipe-extra">
        <h3>Dietary Filters:</h3>
        <ul>
          {recipe.diet_filters?.map((filter, index) => (
            <li key={index}>{filter}</li>
          ))}
        </ul>

        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients?.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        <h3>Optional Mix-ins:</h3>
        <ul>
          {recipe.optional_mixins?.map((mix, index) => (
            <li key={index}>{mix}</li>
          ))}
        </ul>

        <h3>Steps:</h3>
        <ol>
          {recipe.steps?.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>

        <h3>Allergy Warnings:</h3>
        <ul>
          {recipe.allergy_warnings?.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>

        {recipe.video_url && (
          <div className="recipe-video">
            <h3>Recipe Video:</h3>
            <iframe
              width="560"
              height="315"
              src={recipe.video_url.replace("watch?v=", "embed/")}
              title="Recipe Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>

      <button onClick={() => navigate(-1)} className="back-button">Go Back</button>
    </div>
  );
};

export default Recipe;
