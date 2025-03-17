import React from "react";
import ReactDOM from "react-dom";
import "./Explore.css"; 

function ExploreDropdown({ show, anchorRef, onFilterClick, categories }) {
  if (!show) return null;

  const rect = anchorRef.current?.getBoundingClientRect();
  const top = rect ? rect.bottom + 10 : 50;
  const left = 0; 

  return ReactDOM.createPortal(
    <div
      className="exp-dropdown show wide-dropdown"  
      style={{
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
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
    </div>,
    document.body
  );
}

export default ExploreDropdown;