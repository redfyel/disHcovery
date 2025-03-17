import React, { useEffect } from "react";
import { FaUtensils, FaClock, FaConciergeBell, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/images/logoo.png'

function Print() {
  const navigate = useNavigate();

  useEffect(() => {
    window.print(); // Trigger print dialog

    // After printing, return to the previous page
    const backTimeout = setTimeout(() => navigate(-1), 500);

    return () => clearTimeout(backTimeout);
  }, [navigate]);

  // UNCOMMENT FOR TESTING
  // useEffect(() => {
  //   window.print(); 
  // }, []);
  

  const recipe = JSON.parse(localStorage.getItem("recipeToPrint"));
  if (!recipe) {
    return (
      <div className="print-container">
        <h1>Error: No recipe data found.</h1>
      </div>
    );
  }

  return (
    <div className="print-container">
      {/* Header Section */}
      <div className="header">
        <h1>{recipe.title}</h1>
        <img className="logo" src={logo} alt="Dishcovery Logo" />
      </div>

      {/* Recipe Image */}
      <img className="recipe-image" src={recipe.image} alt={recipe.title} />

      {/* Info Section */}
      <div className="info">
        <div className="tag"><FaUtensils /> {recipe.cuisine}</div>
        <div className="tag"><FaConciergeBell /> {recipe.mealType}</div>
        <div className="tag"><FaClock /> Prep: {recipe.preparationTime}</div>
        <div className="tag"><FaClock /> Cook: {recipe.cookingTime}</div>
        <div className="tag"><FaClock /> Total: {recipe.totalTime}</div>
        <div className="tag"><FaUsers /> Servings: {recipe.servings}</div>
      </div>

      {/* Ingredients */}
      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients?.map((ing, idx) => (
          <li key={idx}>{ing.amount} {ing.unit} {ing.name}</li>
        ))}
      </ul>

      {/* Steps */}
      <h3>Steps:</h3>
      <ol>
        {recipe.steps?.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>

      {/* Allergy Warnings */}
      {Array.isArray(recipe.allergyWarnings) && recipe.allergyWarnings.length > 0 && (
        <>
          <h3>Allergy Warnings:</h3>
          <ul>
            {recipe.allergyWarnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </>
      )}

      {/* Styles */}
      <style>{`
        .print-container {
          font-family: Arial, sans-serif;
          padding: 20px;
          text-align: left;
          max-width: 1200px;
          margin: auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #ddd;
          padding-bottom: 10px;
        }

        .logo {
          width: auto;
          height: 100px;
          opacity: 0.7;
        }

        .recipe-image {
          width: 100%;
          max-width: 250px;
          height : 100%;
          display: block;
          margin: 15px auto;
          border-radius: 10px;
        }

        .info {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 10px;
          background: #f8f8f8;
          border-radius: 8px;
        }

        .tag {
          display: flex;
          align-items: center;
          background: #fffae5;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
          font-weight: bold;
        }

        .tag svg {
          margin-right: 5px;
        }

        h3 {
          margin-top: 15px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }

        @media print {
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; }
          .tag { background: none; }
        }
      `}</style>
    </div>
  );
}

export default Print;
