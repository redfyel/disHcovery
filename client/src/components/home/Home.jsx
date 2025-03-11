import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import videoBg from "../../assets/videos/Homevideo.mp4";
import Breakfast from "../../assets/images/breakfast.jpg";
import Lunch from "../../assets/images/lunch.jpg";
import Dinner from "../../assets/images/dinner.jpg";
import Snacks from "../../assets/images/snacks.jpg";
import Desserts from "../../assets/images/dessert.jpg";
import Healthy from "../../assets/images/Healthy.jpg";

const Home = () => {
  const categories = [
    { name: "Breakfast", img: Breakfast },
    { name: "Lunch", img: Lunch },
    { name: "Dinner", img: Dinner },
    { name: "Snack", img: Snacks },
    { name: "Dessert", img: Desserts },
    { name: "Healthy", img: Healthy },
  ];

  const [expandedFeature, setExpandedFeature] = useState(null);

  const toggleFeature = (index) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };
  const fetchRecipes = async () => {
    try {
      const query = filters.categories.length
        ? `?category=${filters.categories.join(",")}`
        : "";
      const response = await fetch(`http://localhost:4000/recipe-api/recipes${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setRecipes(data.payload || []);
      setFilteredRecipes(data.payload || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  
  return (
    <div className="homepage-container">
      {/* Background Video Section */}
      <div className="homepage-video-wrapper">
        <video autoPlay loop muted className="homepage-video">
          <source src={videoBg} type="video/mp4" />
        </video>
        <div className="homepage-overlay">
          <h1 className="homepage-title">Welcome to disHcovery</h1>
          <p className="homepage-subtitle">Explore a world of delicious recipes tailored just for you!</p>
          <Link to="/explore" className="homepage-button">
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="homepage-features">
        <h2 className="homepage-section-title">Why Choose disHcovery?</h2>
        <div className="homepage-feature-grid">
          {["AI-Powered Recipes", "Global Cuisine", "Quick & Easy", "Recipe Roulette"].map((feature, index) => (
            <div
              key={index}
              className={`homepage-feature-card ${expandedFeature === index ? "expanded" : ""}`}
              onClick={() => toggleFeature(index)}
            >
              <span className="homepage-feature-icon">{index === 0 ? "🤖" : index === 1 ? "🌎" : index === 2 ? "⚡" : "🎲"}</span>
              <h3>{feature}</h3>
              {expandedFeature === index && (
                <div className="homepage-feature-expanded">
                  <p className="homepage-feature-details">
                    {index === 0 && "Enter ingredients and let AI suggest amazing recipes! Discover how our AI bot can make cooking easy."}
                    {index === 1 && "Explore dishes from different cultures and flavors. Find traditional and modern recipes from around the world!"}
                    {index === 2 && "Find recipes that fit your time and taste preferences. Quick, easy, and delicious!"}
                    {index === 3 && "Not sure what to cook? Spin the Recipe Roulette and get a surprise meal idea!"}
                  </p>
                  <span className="homepage-feature-minimize" onClick={(e) => { e.stopPropagation(); toggleFeature(index); }}>
                    &minus;
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Explore Categories */}
      <div className="homepage-categories">
        <h2 className="homepage-section-title">Explore Categories</h2>
        <div className="homepage-category-grid">
        {categories.map((category, index) => (
  <Link to={`/recipes/category/${category.name.toLowerCase()}`} className="homepage-category-card" key={index}>
    <div className="homepage-category-circle">
      <img src={category.img} alt={category.name} className="homepage-category-image" />
    </div>
    <h5 className="homepage-category-name">{category.name}</h5>
  </Link>
))}
        </div>
      </div>
    </div>
  );
};

export default Home;