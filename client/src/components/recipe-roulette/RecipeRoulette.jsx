import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import pointerIcon from "../../assets/pointer-icon.png";
import "./RecipeRoulette.css";

const RecipeRoulette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("http://localhost:4000/recipe-api/recipes");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        const shuffled = data.payload
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);
        setRecipes(shuffled);
      } catch (err) {
        console.error("Error fetching recipes...", err.message);
        setError(err);
      }
    }

    if (isOpen) fetchRecipes();
  }, [isOpen]);

  const onRecipeSelect = (recipe) => {
    if (!recipe) return;
    onClose();
    navigate("/recipe", { state: { recipe } });
  };

  const handleSpinClick = () => {
    if (recipes.length > 0) {
      setShowConfetti(false); // Hide confetti on new spin


      setSelectedRecipe(null); // Reset selected recipe
      const randomIndex = Math.floor(Math.random() * recipes.length);
      
      // Ensure state updates correctly before spinning
      setPrizeNumber(randomIndex);
      
      // Slight delay before setting mustSpin to ensure state updates
      setTimeout(() => setMustSpin(true), 50);
    }
  };
  

  const handleStopSpinning = () => {
  setMustSpin(false);
  
  // Ensure prizeNumber is not null before setting the recipe
  if (prizeNumber !== null && recipes[prizeNumber]) {
    setShowConfetti(true);
    setConfettiOpacity(1);
    setSelectedRecipe(recipes[prizeNumber]);
    setTimeout(() => {
      setConfettiOpacity(0); // Reduce opacity
      setTimeout(() => setShowConfetti(false), 2500); // Remove confetti after fade-out
    }, 3000); // Show confetti for 2.5s before starting fade-out
  } else {
    console.error("Error: Invalid prizeNumber or missing recipe data.");
  }
};

  return (
    <div
      className={`modal fade ${isOpen ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content p-4"
          style={{ backgroundColor: "#FBFAF8", color: "#0A122A" }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn-close position-absolute top-0 end-0 m-3"
          ></button>
          
          {showConfetti && (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: confettiOpacity }}
    transition={{ duration: 0.5 }}
  >
    <Confetti width={500} height={500} numberOfPieces={230} />
  </motion.div>
)}


          <div className="text-center mb-3">
            <FaUtensils size={40} color="#804E49" />
            {selectedRecipe ? (
              <>
                <h1 className="mt-2" style={{ color: "#698F3F" }}>
                  Ready to Cook {selectedRecipe.title}?
                </h1>
                <p className="text-muted">Your dinner fate is sealed!</p>
              </>
            ) : (
              <>
                <h1 className="mt-2" style={{ color: "#698F3F" }}>
                  Roll the Dice on Dinner
                </h1>
                <p className="text-muted">
                  Spin the wheel, discover a dish, and let fate decide your next
                  meal!
                </p>
              </>
            )}
          </div>

          {!selectedRecipe && recipes.length > 0 && (
            <div className="d-flex justify-content-center mt-3">
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={recipes.map((r) => {
                  const cleanedTitle = r.title.replace(/\s*\(.*?\)\s*/g, "");
                  return {
                    option:
                      cleanedTitle.length > 17
                        ? cleanedTitle.substring(0, 20) + "..."
                        : cleanedTitle,
                  };
                })}
                onStopSpinning={handleStopSpinning}
                outerBorderColor="#804E49"
                outerBorderWidth={8}
                innerBorderColor="#698F3F"
                radiusLineColor="#fff"
                radiusLineWidth={2}
                textDistance={55}
                fontSize={16}
                backgroundColors={["#0A122A", "#E7DECD", "#698F3F", "#FBFAF8"]}
                textColors={["#E7DECD", "#0A122A"]}
                pointerProps={{ src: pointerIcon }}
              />
            </div>
          )}

          {!selectedRecipe ? (
            <button
              onClick={handleSpinClick}
              className="btn w-100 mt-4"
              style={{
                backgroundColor: "#804E49",
                color: "#FBFAF8",
                fontSize: "20px",
                padding: "10px",
              }}
            >
              Spin & Feast!
            </button>
          ) : (
            <motion.div
              className="alert mt-3 text-center"
              style={{ backgroundColor: "#E7DECD", color: "#0A122A" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2>You got: {selectedRecipe.title}!</h2>
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="rounded mt-2"
                style={{ width: "120px" }}
              />
              <button
                onClick={() => onRecipeSelect(selectedRecipe)}
                className="btn w-100 mt-3"
                style={{
                  backgroundColor: "#698F3F",
                  color: "#FBFAF8",
                  fontSize: "18px",
                  padding: "10px",
                }}
              >
                Get Cooking
              </button>

              <button
                onClick={handleSpinClick}
                className="btn w-100 mt-2"
                style={{
                  backgroundColor: "#804E49",
                  color: "#FBFAF8",
                  fontSize: "18px",
                  padding: "10px",
                }}
              >
                Spin Again
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeRoulette;
