import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

function RecipeRoulette() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("http://localhost:4000/recipe-api/recipes");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        const shuffled = data.payload.sort(() => 0.5 - Math.random()).slice(0, 6);
        setRecipes(shuffled);
      } catch (err) {
        console.error("Error fetching recipes...", err.message);
        setError(err);
      }
    }

    fetchRecipes();
  }, []);

  const handleSpinClick = () => {
    if (recipes.length > 0) {
      setSelectedRecipe(null);
      const randomIndex = Math.floor(Math.random() * recipes.length);
      setPrizeNumber(randomIndex);
      setMustSpin(true);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setShowConfetti(true);
    setSelectedRecipe(recipes[prizeNumber]);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#FFFAF0] to-[#F4A261] min-h-screen text-[#5A3825]">
      {showConfetti && <Confetti />}
      <h1 className="text-4xl font-bold mb-6">🍽️ Recipe Roulette 🎰</h1>

      {recipes.length > 0 && (
        <div className="relative">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={recipes.map((r) => ({
              option: r.title.length > 25 ? r.title.substring(0, 25) + "..." : r.title,
              style: { backgroundColor: "#F77F00", color: "#FFF" },
            }))}
            onStopSpinning={handleStopSpinning}
            outerBorderColor="#E63946"
            outerBorderWidth={8}
            innerBorderColor="#F4A261"
            radiusLineColor="#2A9D8F"
            radiusLineWidth={2}
            backgroundColors={["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"]}
            textColors={["#000"]}
            pointerProps={{ style: { borderBottomColor: "#E63946" } }}
          />
          <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#E63946] rounded-full"></div>
        </div>
      )}

      <button
        onClick={handleSpinClick}
        className="mt-6 px-6 py-3 bg-[#000] text-white text-lg rounded-lg shadow-md hover:bg-[#000] transition-all duration-300 transform hover:scale-105"
      >
        Give it a Whirl! 🎡
      </button>

      {selectedRecipe && (
        <motion.div
          className="mt-6 p-4 bg-white shadow-lg rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">You got: {selectedRecipe.title}!</h2>
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.title}
            className="mt-4 rounded-lg" style={{width: "50px"}}
          />
        </motion.div>
      )}
    </div>
  );
}

export default RecipeRoulette;
