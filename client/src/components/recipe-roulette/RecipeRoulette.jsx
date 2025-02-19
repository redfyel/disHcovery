import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

const RecipeRoulette = () => {
  const allRecipes = [
    { name: "Spaghetti Carbonara", image: "https://via.placeholder.com/150" },
    { name: "Avocado Toast", image: "https://via.placeholder.com/150" },
    { name: "Chicken Alfredo", image: "https://via.placeholder.com/150" },
    { name: "Banana Pancakes", image: "https://via.placeholder.com/150" },
    { name: "Tomato Basil Soup", image: "https://via.placeholder.com/150" }
  ];

  const [recipes, setRecipes] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const shuffled = allRecipes.sort(() => 0.5 - Math.random()).slice(0, 3);
    setRecipes(shuffled);
  }, []);

  const handleSpinClick = () => {
    if (recipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      setPrizeNumber(randomIndex);
      setMustSpin(true);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Confetti lasts 3s
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#F5E6C8] min-h-screen text-[#5A3825]">
      {showConfetti && <Confetti />}
      <h1 className="text-4xl font-bold mb-6">🍽️ Recipe Roulette 🎰</h1>
      {recipes.length > 0 && (
        <Wheel 
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={recipes.map(r => ({ option: r.name, style: { backgroundColor: "#FFB703", color: "#023047" } }))}
          onStopSpinning={handleStopSpinning}
          outerBorderColor="#FB8500"
          pointerProps={{ style: { borderBottomColor: "#FF6600" } }}
        />
      )}
      <button 
        onClick={handleSpinClick} 
        className="mt-6 px-6 py-3 bg-[#FB8500] text-white text-lg rounded-lg shadow-md hover:bg-[#E76F51] transition-all duration-300 transform hover:scale-105"
      >
        Give it a Whirl! 🎡
      </button>
      {prizeNumber !== null && (
        <motion.div 
          className="mt-6 p-4 bg-white shadow-lg rounded-lg text-center"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold">You got: {recipes[prizeNumber].name}!</h2>
          <img src={recipes[prizeNumber].image} alt={recipes[prizeNumber].name} className="mt-4 w-40 h-40 rounded-lg" />
        </motion.div>
      )}
    </div>
  );
};

export default RecipeRoulette;
