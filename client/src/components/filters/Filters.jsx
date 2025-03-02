// filters.jsx - No changes needed
import React, { useState, useEffect } from "react";
import "./Filters.css"; // Import the updated CSS file

const RecipeFilter = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    mealType: [],
    diet: [],
    cookTime: [],
    cuisine: [],
    hasVideo: false, // Added hasVideo
  });

  const categories = [
    "Main Course",
    "Appetizer",
    "Salad",
    "Soup",
    "Sweet",
    "Quick & Easy",
  ];
  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
  const diets = [
    "Lacto Vegetarian",
    "Ovo Vegetarian",
    "Ovo-Lacto Vegetarian",
    "Pescatarian",
    "Vegan",
    "Vegetarian",
    "Low Carb",
    "Mediterranean",
    "Keto",
    "Paleo",
    "Dairy Free",
    "Gluten Free",
  ];
  const cookTimes = ["Under 15 min", "Under 30 min", "Under 60 min"];
  const cuisines = ["American", "British", "Italian", "Mexican", "Indian"];

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters]);

  const toggleFilter = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

    const handleVideoFilterChange = () => {
        setSelectedFilters((prev) => ({
            ...prev,
            hasVideo: !prev.hasVideo,
        }));
    };

    // Convert hasVideo to be handled like other filters
    const hasVideoOptions = ["Recipes with Videos"];


    const renderFilterSection = (filterType, items, isVideo = false) => {
        return (
            <div className="filter-section">
                <h3>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</h3>
                <div className="filter-tags">
                    {items.map((item) => (
                        <span
                            key={item}
                            className={`filter-tag ${isVideo
                                ? selectedFilters[filterType]
                                    ? "selected"
                                    : ""
                                : selectedFilters[filterType].includes(item)
                                    ? "selected"
                                    : ""
                                }`}
                            onClick={() => {
                                if (isVideo) {
                                    handleVideoFilterChange();
                                } else {
                                    toggleFilter(filterType, item);
                                }
                            }}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        );
    };


    return (
        <div className="filter-container">
            <h2>Filters</h2>
            {renderFilterSection("categories", categories)}
            {renderFilterSection("mealType", mealTypes)}
            {renderFilterSection("diet", diets)}
            {renderFilterSection("cookTime", cookTimes)}
            {renderFilterSection("cuisine", cuisines)}
            {renderFilterSection("hasVideo", hasVideoOptions, true)} {/* Render hasVideo like other filters */}
        </div>
    );
};

export default RecipeFilter;