import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Keep all styles isolated to this file
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
    { name: "Snacks", img: Snacks },
    { name: "Desserts", img: Desserts },
    { name: "Healthy", img: Healthy },
  ];

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
          <div className="homepage-feature-card">
            <span className="homepage-feature-icon">🤖</span>
            <h3>AI-Powered Recipes</h3>
            <p>Enter ingredients and let AI suggest amazing recipes!</p>
          </div>
          <div className="homepage-feature-card">
            <span className="homepage-feature-icon">🌎</span>
            <h3>Global Cuisine</h3>
            <p>Explore dishes from different cultures and flavors.</p>
          </div>
          <div className="homepage-feature-card">
            <span className="homepage-feature-icon">⚡</span>
            <h3>Quick & Easy</h3>
            <p>Find recipes that fit your time and taste preferences.</p>
          </div>
        </div>
      </div>

      {/* Explore Categories */}
      <div className="homepage-categories">
        <h2 className="homepage-section-title">Explore Categories</h2>
        <div className="homepage-category-grid">
          {categories.map((category, index) => (
            <Link to={`/category/${category.name.toLowerCase()}`} className="homepage-category-card" key={index}>
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