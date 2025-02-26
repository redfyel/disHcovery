import React, { useState } from "react";
import RecipeRoulette from "../recipe-roulette/RecipeRoulette";
import rouletteIcon from "../../assets/roulette-icon.png";
import { FaSearch } from "react-icons/fa";
import "./Search.css"; 

function Search() {
  const [showRoulette, setShowRoulette] = useState(false);
  const [query, setQuery] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="search-container">
           {/* Search Bar with Icon */}
           <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>


      {/* Button with Tooltip */}
      <div 
        className="roulette-wrapper" 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button className="roulette-btn" onClick={() => setShowRoulette(true)}>
          <img 
            src={rouletteIcon} 
            alt="Roulette Icon" 
            style={{ width: "24px", height: "24px", marginRight: "2px" }} 
          />
        </button>
        
        {/* Tooltip */}
        {showTooltip && (
          <div className="tooltip">Spin the Roulette!</div>
        )}
      </div>

      {/* Recipe Roulette Modal */}
      <RecipeRoulette isOpen={showRoulette} onClose={() => setShowRoulette(false)}  />
    </div>
  );
}

export default Search;
