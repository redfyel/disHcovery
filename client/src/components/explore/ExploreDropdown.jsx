import React from "react";
import ReactDOM from "react-dom";
import "./Explore.css"; 
function ExploreDropdown({ show, anchorRef, onFilterClick, categories }) {
  if (!show) return null;

  const rect = anchorRef.current?.getBoundingClientRect();
  
  return (
    <div
      className={`exp-dropdown wide-dropdown ${show ? "show" : ""}`}
      style={{
        position: "absolute",
        top: "100%", // Places it directly below the button
        left: "0", // Aligns with the button's left edge
        zIndex: 9999,
      }}
    >
      {Object.entries(categories).map(([category, { icon, filters }]) => (
        <div key={category} className="wide-category">
          <h4 className="wide-category-title">
            {icon} {category}
          </h4>
          <div className="wide-items">
            {filters.map((filter) => (
              <div
                key={filter}
                className="wide-item"
                onClick={() => onFilterClick(category, filter)}
              >
                {filter}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


export default ExploreDropdown;