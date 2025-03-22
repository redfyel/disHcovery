import React from "react";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import emptyCookingAnimation from "../../assets/animations/not-found.json"; 
import RouletteIcon from '../../assets/images/roulette-icon.png';
import { HiSparkles } from "react-icons/hi";
import { FaHeart, FaSave} from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import "./NoRecipesMessage.css";

const NoRecipesMessage = ({ type }) => {
  const navigate = useNavigate();

  // Function to reset filters before navigating
  const resetFilters = () => {
    navigate("/recipes", { replace: true }); 
  };

  // Define messages and actions based on type
  const messages = {
    saved: {
      text: "No saved recipes yet.",
      subtext: "Start saving your favorite dishes!",
      buttonText: (
        <>
          <FaSave size={23}/> Explore Recipes
        </>
      ),
      buttonAction: () => navigate("/recipes"),
    },
    liked: {
      text: "You haven't liked any recipes yet.",
      subtext: "Discover and like tasty dishes!",
      buttonText: (
        <>
          <FaHeart color="red" /> Browse Recipes
        </>
      ),
      buttonAction: () => navigate("/recipes"),
    },
    filters: {
      text: "No recipes match your filters.",
      subtext: "Try adjusting the filters for better results.",
      buttonText: (
        <>
          <GrPowerReset size={20} /> Reset Filters
        </>
      ),
      buttonAction: () => navigate("/recipes"),
    },
    ai: {
      text: "No AI-generated recipes yet.",
      subtext: "Let AI whip up a dish for you from your ingredients!",
      buttonText: (
        <>
          <HiSparkles size={23}/> Generate Recipe
        </>
      ),
      buttonAction: () => navigate("/ai-ingredients"),
    },
    roulette: {
      text: "No recipes from roulette yet.",
      subtext: (
        <>
          Click the  <img
            src={RouletteIcon}
            alt="Roulette Icon"
            style={{ height: "30px", verticalAlign: "middle", margin: "2px 3px" }}
          />{"  "} icon in the search bar to spin!
        </>
      ),
      buttonText: null, 
      buttonAction: null,
    },
  };

 // Use the passed type, or default to "filters" to prevent crashes
const { text, subtext, buttonText, buttonAction } = messages[type] || messages.filters;

return (
  <div className="no-recipes-wrapper">
    <div className="no-recipes-container">
      <Lottie animationData={emptyCookingAnimation} loop={true} className="no-recipes-animation" />
      
      <div className="no-recipes-header">
        <h2 className="no-recipes-text">{text}</h2>
      </div>

      <p className="no-recipes-subtext">{subtext}</p>

      {buttonText && buttonAction && (
        <button onClick={buttonAction} className="nf-explore-button">
          {buttonText}
        </button>
      )}
    </div>
  </div>
);

};

export default NoRecipesMessage;
