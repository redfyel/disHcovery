import React, { useState, useEffect, useContext } from "react";
import { Wheel } from "react-custom-roulette";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import pointerIcon from "../../assets/images/pointer-icon.png";
import { userLoginContext } from "../../contexts/UserLoginContext";
import "./RecipeRoulette.css";

const RecipeRoulette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const { loginStatus, currentUser, setCurrentUser, token } =
    useContext(userLoginContext);

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
        console.error("Error fetching recipes:", err.message);
      }
    }

    if (isOpen) fetchRecipes();
  }, [isOpen]);

  if (!loginStatus) {
    navigate("/access-denied");
    return;
  }

  const onRecipeSelect = (recipe) => {
    if (!recipe || !recipe.title) return;
    onClose();
    const sanitizedTitle = recipe.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    navigate(`/recipe/${sanitizedTitle}`);
  };

  const handleSpinClick = () => {
    if (recipes.length > 0) {
      setShowConfetti(false);
      setSelectedRecipe(null);
      const randomIndex = Math.floor(Math.random() * recipes.length);
      setPrizeNumber(randomIndex);
      setTimeout(() => setMustSpin(true), 50);
    }
  };

  const handleStopSpinning = async () => {
    setMustSpin(false);

    if (prizeNumber !== null && recipes[prizeNumber]) {
      const selected = recipes[prizeNumber];
      setShowConfetti(true);
      setConfettiOpacity(1);
      setSelectedRecipe(selected);

      try {
        // const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        console.log("Sending token:", token);

        const res = await fetch("http://localhost:4000/user-api/spin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipe: selected }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to save spun recipe");
        }

        console.log("Recipe successfully saved to user:", data);

        // Update user state with new recipe
        setCurrentUser((prevUser) => ({
          ...prevUser,
          roulette_recipes: [...(prevUser.roulette_recipes || []), selected],
        }));
      } catch (error) {
        console.error("Error saving spun recipe:", error.message);
      }

      setTimeout(() => {
        setConfettiOpacity(0);
        setTimeout(() => setShowConfetti(false), 2500);
      }, 3000);
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
                  You got {selectedRecipe.title}!
                </h1>
                <p className="text-muted">Your dinner fate is sealed!</p>
                {selectedRecipe.image && (
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    className="img-fluid rounded shadow mt-3"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                  />
                )}
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
                data={recipes.map((r) => ({
                  option:
                    r.title.length > 17
                      ? r.title.substring(0, 20) + "..."
                      : r.title,
                }))}
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
            <div className="d-flex flex-column">
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
                  backgroundColor: "#E7DECD",
                  color: "#0A122A",
                  fontSize: "18px",
                  padding: "10px",
                }}
              >
                Spin Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeRoulette;
