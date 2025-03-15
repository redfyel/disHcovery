import React, { useState, useRef } from "react";
import RecipeRoulette from "../recipe-roulette/RecipeRoulette";
import rouletteIcon from "../../assets/images/roulette-icon.png";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import SearchBox from "./SearchBox";
import "./Search.css";

function Search() {
  const [showRoulette, setShowRoulette] = useState(false);
  const [query, setQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef(null); // Create a ref for the input element

  const renderTooltip = (props) => (
    <Tooltip {...props}>
      Can't decide what to cook? Spin for a surprise recipe!
    </Tooltip>
  );

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsDropdownVisible(true); // Show dropdown on input change
  };

  const handleInputFocus = () => {
    setIsDropdownVisible(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsDropdownVisible(false);
    }, 100);
  };

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
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          ref={inputRef} // Assign the ref to the input element
        />
      </div>

      {/* Conditionally render the SearchBox (dropdown), passing query and ref*/}
      {isDropdownVisible && (
        <SearchBox searchTerm={query} searchInputRef={inputRef} />
      )}

      {/* Button with Tooltip */}
      {!showRoulette ? (
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <button
            className="roulette-btn"
            onClick={() => setShowRoulette(true)}
          >
            <img
              src={rouletteIcon}
              alt="Roulette Icon"
              style={{ width: "24px", height: "24px", marginRight: "2px" }}
            />
          </button>
        </OverlayTrigger>
      ) : (
        // Recipe Roulette Modal
        <RecipeRoulette
          isOpen={showRoulette}
          onClose={() => setShowRoulette(false)}
        />
      )}
    </div>
  );
}

export default Search;