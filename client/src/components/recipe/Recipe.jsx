import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Recipe.css"; // Import CSS file

const Recipe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const originalRecipe = location.state?.recipe; // Get the original recipe data from navigation state

  // const [recipe, setRecipe] = useState(originalRecipe); // Initialize recipe with the original recipe
  const storedRecipe = localStorage.getItem("savedRecipe");

  const [recipe, setRecipe] = useState(
    storedRecipe ? JSON.parse(storedRecipe) : originalRecipe
  );
  

  if (!originalRecipe) {
    return (
      <div className="error">
        No recipe selected. <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }
//   const openGoogleTranslate = (text) => {
//   const encodedText = encodeURIComponent(text);
//   window.open(`https://translate.google.com/?sl=en&tl=fr&text=${encodedText}&op=translate`);
// };


  const handlePrint = () => {
    localStorage.setItem("recipeToPrint", JSON.stringify(recipe));
    localStorage.setItem("recipeTitle", recipe.title); // Optional: Store title

    // Use React Router to navigate within the same tab
    navigate("/print");
  };
  // const loadGoogleTranslate = () => {
  //   return new Promise((resolve) => {
  //     if (window.google && window.google.translate) {
  //       resolve(); // If already loaded, just resolve
  //       return;
  //     }
  
  //     const script = document.createElement("script");
  //     script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  //     script.async = true;
  //     script.onload = resolve;
  //     document.body.appendChild(script);
  //   });
  // };
  
  // const translatePage = async () => {
  //   // Save recipe state before translation
  //   if (recipe) {
  //     localStorage.setItem("savedRecipe", JSON.stringify(recipe));
  //   }
  
  //   await loadGoogleTranslate();
  
  //   window.googleTranslateElementInit = () => {
  //     new window.google.translate.TranslateElement(
  //       {
  //         pageLanguage: "en",
  //         includedLanguages: "fr,es,de,zh,hi,ja,ko",
  //         layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
  //       },
  //       "google_translate_element"
  //     );
  //   };
  
  //   window.googleTranslateElementInit();
  // };
  
  return (
    <div className="recipe-details">
      <h1 className="recipe-title">{recipe.title}</h1>

      {/* Image & Main Details Section */}
      <div className="recipe-main">
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
        <div className="recipe-info">
          <p>
            <strong>Cuisine:</strong> {recipe.cuisine}
          </p>
          <p>
            <strong>Meal Type:</strong> {recipe.mealType}
          </p>
          <p>
            <strong>Category:</strong> {recipe.category}
          </p>
          <p>
            <strong>Prep Time:</strong> {recipe.preparationTime}
          </p>
          <p>
            <strong>Cook Time:</strong> {recipe.cookingTime}
          </p>
          <p>
            <strong>Total Time:</strong> {recipe.totalTime}
          </p>
          <p>
            <strong>Servings:</strong> {recipe.servings}
          </p>
        </div>
      </div>

      {/* Remaining Details */}
      <div className="recipe-extra">
        <h3>Dietary Filters:</h3>
        <ul>
          {recipe.dietFilters?.map((filter, index) => (
            <li key={index}>{filter}</li>
          ))}
        </ul>

        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients?.map((ingredient, index) => (
            <li key={index}>
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>

        {recipe.optional_mixins && ( // Conditionally render if optional_mixins exists
          <>
            <h3>Optional Mix-ins:</h3>
            <ul>
              {recipe.optional_mixins?.map((mix, index) => (
                <li key={index}>{mix}</li>
              ))}
            </ul>
          </>
        )}

        <h3>Steps:</h3>
        <ol>
          {recipe.steps?.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>

        {Array.isArray(recipe.allergyWarnings) && recipe.allergyWarnings.length > 0 && (
          <>
            <h3>Allergy Warnings:</h3>
            <ul>
              {recipe.allergyWarnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </>
        )}

        {recipe.videoURL && (
          <div className="recipe-video">
            <h3>Recipe Video:</h3>
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
        )}
      </div>
      {/* <button onClick={translatePage} className="translate-button">
  🌍 Translate Page
</button> */}



      <button onClick={() => navigate(-1)} className="back-button">
        Go Back
      </button>
      <button onClick={handlePrint} className="print-button">
        Print Recipe
      </button>{" "}
      {/* Print Button */}
    </div>
  );
};

export default Recipe;