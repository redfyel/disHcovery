import React from "react";
import ReactDOM from "react-dom";
import "./Explore.css";

/**
 * Renders the dropdown in a portal, positioned near the anchor element.
 * 
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the dropdown.
 * @param {React.RefObject<HTMLElement>} props.anchorRef - The ref to the Explore button.
 * @param {function} props.onFilterClick - Callback when a filter is clicked.
 * @param {function} props.onMouseEnter - Keep dropdown open on hover.
 * @param {function} props.onMouseLeave - Close dropdown on mouse leave.
 * @param {Object} props.categories - Categories data for rendering.
 */
function ExploreDropdown({
  show,
  anchorRef,
  onFilterClick,
  onMouseEnter,
  onMouseLeave,
  categories,
}) {
  // If dropdown is hidden, return null to unmount the portal
  if (!show) return null;

  // Get the position of the anchor (Explore button)
  const rect = anchorRef.current?.getBoundingClientRect();

  // Default to (0,0) if no rect is found
  const top = rect ? rect.bottom + window.scrollY : 0; 
  const left = rect ? rect.left + window.scrollX : 0;

  // Render the dropdown in a portal attached to the <body>
  return ReactDOM.createPortal(
    <div
      className="dropdown show"
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {Object.entries(categories).map(([category, { icon, filters }]) => (
        <div key={category} className="dropdown-category">
          <h4>
            {icon} {category}
          </h4>
          <div className="dropdown-items">
            {filters.map((filter) => (
              <div
                key={filter}
                className="dropdown-item"
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
