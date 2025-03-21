import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
   MdFastfood,
   MdOutlineCasino, 
   MdOutlineSearch, 
   MdPublic, 
   MdHealthAndSafety,
  MdFilterList,
   MdKitchen } from "react-icons/md";

import "./Home.css";
import videoBg from "../../assets/videos/Homevideo.mp4";
import Breakfast from "../../assets/images/breakfast.jpg";
import Lunch from "../../assets/images/lunch.jpg";
import Dinner from "../../assets/images/dinner.jpg";
import Snacks from "../../assets/images/snacks.jpg";
import Desserts from "../../assets/images/dessert.jpg";
import Healthy from "../../assets/images/Healthy.jpg";
import Roulette from "../../assets/images/roulette-icon.png";

// Placeholder image URL
const featureImages = [
  "https://static-00.iconduck.com/assets.00/sparkles-emoji-512x458-hmw467tt.png", // AI-Powered Recipe Generator
  Roulette, // Recipe Roulette (Imported image)
  "https://static.thenounproject.com/png/3810268-200.png", // Saved Recipes
  "https://static-00.iconduck.com/assets.00/search-icon-256x256-7tnrxmcc.png", // Efficient Search
  "https://static-00.iconduck.com/assets.00/filter-icon-2048x1617-97le7v6v.png", // Advanced Filters
  "https://cdn-icons-png.flaticon.com/512/2388/2388956.png", // Recipe Page
];

const Home = () => {
 const categories = [
  { name: "Breakfast", img: Breakfast },
  { name: "Lunch", img: Lunch },
  { name: "Dinner", img: Dinner },
  { name: "Snack", img: Snacks },
  { name: "Dessert", img: Desserts },
  { name: "Healthy", img: Healthy },
];


const features = [
  {
    icon: <MdFastfood />,
    title: "AI-Powered Recipe Generator",
    desc: "Generate recipes via text input, image upload, or manual selection. AI suggests relevant recipes based on available ingredients.",
    image: featureImages[0],
  },
  {
    icon: <MdOutlineCasino />,
    title: "Recipe Roulette ",
    desc: "Spin the wheel for a random recipe. Spun recipes are saved in the 'Saved Recipe Roulette' section for later reference.",
    image: featureImages[1], // Using the imported image
  },
  {
    icon: <MdHealthAndSafety />,
    title: "Saved Recipes ",
    desc: "Organized into categories: manually saved, recipe roulette results, and AI-generated recipes. 'All Saved' combines all lists.",
    image: featureImages[2],
  },
  {
    icon: <MdOutlineSearch />,
    title: "Efficient Search ",
    desc: "A fast, intelligent search bar to instantly find recipes based on keywords and preferences.",
    image: featureImages[3],
  },
  {
    icon: <MdFilterList />,
    title: "Advanced Filters ",
    desc: "Refine searches using categories, diet preferences, meal type, and cuisine for personalized results.",
    image: featureImages[4],
  },
  {
    icon: <MdKitchen />,
    title: "Recipe Page ",
    desc: "Includes like, share, comment, nutrition info, allergy warnings, AI-powered ingredient alternatives, and personal notes.",
    image: featureImages[5],
  },
];


  // Variants for scroll-reveal on each feature card.
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };


  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video" poster="/path-to-poster-image.jpg">
          <source src={videoBg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay">
          <motion.h1 className="hero-title" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            Welcome to <span>disHcovery</span>
          </motion.h1>
          <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            Discover new flavors, plan your meals, and cook with ease!
          </motion.p>
          <Link to="/explore" className="hero-button" aria-label="Explore disHcovery">
            Get Started
          </Link>
        </div>
      </div>




     {/* Features Section with Full-Page Snap Scrolling */}
<section className="features-section">
  <h2 className="section-title">Why Choose disHcovery?</h2>
  <div className="features-wrapper">
    <div className="features-scroll">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className={`feature-card ${index % 2 !== 0 ? "reverse" : ""}`}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="feature-text">
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
          <div className="feature-image">
            <img src={feature.image} alt={feature.title} />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>;

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Explore Categories</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <motion.div key={index} className="category-card" whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <Link to={`/recipes/category/${category.name.toLowerCase()}`} aria-label={`Explore ${category.name}`}>
                <div className="category-circle">
                  <img src={category.img} alt={category.name} className="category-image" loading="lazy" />
                </div>
                <h5 className="category-name">{category.name}</h5>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};




export default Home;


