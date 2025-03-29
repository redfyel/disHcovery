import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";
import videoBg from "../../assets/videos/Homevideo.mp4";
import Breakfast from "../../assets/images/breakfast.jpg";
import Lunch from "../../assets/images/lunch.jpg";
import Dinner from "../../assets/images/dinner.jpg";
import Snacks from "../../assets/images/snacks.jpg";
import Desserts from "../../assets/images/dessert.jpg";
import Healthy from "../../assets/images/Healthy.jpg";
import Roulette from "../../assets/images/roulette-icon.png";
import logo from "../../assets/images/logo_darkbg.png";
import logoo from "../../assets/images/logo_og.png";

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
      title: "Explore a World of Food",
      desc: "Browse recipes across various cuisines, meal types, and dietary preferences.",
      icon: "/icons/explore.svg",
      image:
        "https://media.istockphoto.com/id/1572636555/vector/categories-of-healthy-eating-types-of-food-vector-illustration-on-white-background.jpg?s=612x612&w=0&k=20&c=GLvnaxS9eOtfpS_RlzyirQQ2KxEfaNyC6k6QoXt6MeY=",
    },
    {
      title: "Smart Search & Powerful Filters",
      desc: "Use our search bar and advanced filters to quickly find the perfect recipe.",
      icon: "/icons/search.svg",
      image:
        "https://static.vecteezy.com/system/resources/previews/004/804/322/non_2x/illustration-graphic-of-food-search-logo-perfect-to-use-for-food-company-free-vector.jpg",
    },
    {
      title: "AI-Powered Recipe Discovery",
      desc: "Enter ingredients, pick from a list, or upload a photo—our AI suggests the best recipes!",
      icon: "/icons/ai.svg",
      image:
        "https://img.freepik.com/premium-vector/sparkles-icon-isolated-white-background-vector-illustration_736051-308.jpg?w=360",
    },
    {
      title: "Recipe Roulette – A Fun Way to Decide!",
      desc: "Not sure what to cook? Spin the wheel for a surprise dish!",
      icon: "/icons/roulette.svg",
      image: Roulette,
    },
    {
      title: "Nutritional & Allergy Insights",
      desc: "Get detailed nutrition facts, allergy warnings, and AI-powered ingredient swaps.",
      icon: "/icons/nutrition.svg",
      image:
        "https://media.istockphoto.com/id/909180104/vector/vegetables-sticked-on-fork-healthy-eating-concept.jpg?s=612x612&w=0&k=20&c=nO0QH3NQm8lBa_jttyo9ht6iD_z0OeMX0zusNVWvnSE=",
    },
    {
      title: "Interactive Recipe Page",
      desc: "Like, comment, take notes, print recipes, and get AI-powered ingredient suggestions. Watch for interactive visual videos too!",
      icon: "/icons/interactive.svg",
      image:
        "https://previews.123rf.com/images/maximlacrim/maximlacrim2302/maximlacrim230200186/198570604-like-comment-thumbs-up-share-and-save-modern-icons-for-social-media-and-app-vector-isolated-on.jpg",
    },
    {
      title: "Save & Share with Friends",
      desc: "Bookmark your favorite recipes and easily share them with loved ones.",
      icon: "/icons/save-share.svg",
      image:
        "https://media.istockphoto.com/id/1201642586/vector/people-take-food-from-a-plate.jpg?s=612x612&w=0&k=20&c=8DL3hJgAsYTRS4vhdO6yvdH30mha8MVrEZPiXrl8UJI=",
    },
    {
      title: "Your Personal Recipe Dashboard",
      desc: "All your preferences, favorite dishes, quick access links and past spins—organized in one place.",
      icon: "/icons/dashboard.svg",
      image: logoo,
    },
  ];

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={videoBg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="hero-overlay">
          <div className="hero-content">
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Welcome to <br></br>
              <img src={logo} alt="disHcovery" className="w-75" />
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              Discover, Create and Savor!{" "}
            </motion.p>
            <Link
              to="/recipes"
              className="hero-button"
              aria-label="Explore disHcovery"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose disHcovery?</h2>
        <div className="features-wrapper">
          <div className="features-scroll">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`feature-card ${
                  index % 2 !== 0 ? "reverse" : ""
                } theme-${index % 2 === 0 ? "dark" : "light"}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="feature-text">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {feature.desc}
                  </motion.p>
                </div>
                <motion.div
                  className="feature-image"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <img src={feature.image} alt={feature.title} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Explore Categories</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="category-card"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/recipes/category/${category.name.toLowerCase()}`}
                aria-label={`Explore ${category.name}`}
              >
                <div className="category-circle">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="category-image"
                    loading="lazy"
                  />
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
