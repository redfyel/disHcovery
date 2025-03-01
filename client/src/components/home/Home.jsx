import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button, Card, Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import { motion } from "framer-motion";
import logo from "../../assets/disHcovery_logo.jpg"; 
// import home from "../../assets/vdo.mp4";
import breakfast from "../../assets/breakfast.jpg";
import lunch from "../../assets/lunch.jpg";
import dinner from "../../assets/dinner.jpg";
import "./Home.css";

export default function HomePage() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme; 
  }, [theme]);

  const meals = [
    { id: 1, title: "Breakfast", image: breakfast },
    { id: 2, title: "Lunch", image: lunch },
    { id: 3, title: "Dinner", image: dinner },
  ];

  return (
    <div className={`min-vh-100 bg-light ${theme}`}>

      {/* Video Section */}
      <section className="position-relative w-100" style={{ height: "500px" }}>
        <video 
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
          autoPlay loop muted
        >
          {/* <source src={home} type="video/mp4" /> */}
        </video>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column justify-content-center align-items-center text-white text-center">
          <h2 className="fs-1 fw-semibold">Discover Delicious Recipes</h2>
          <p className="mt-2 fs-5">Find, save, and share your favorite recipes with ease.</p>
          <Button variant="primary" className="mt-3">Get Started</Button>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container text-center my-5"
      >
        <h3 className="fw-semibold fs-2">Why Choose disHcovery?</h3>
        <Row className="mt-4">
          {[
            { id: 1, title: "Explore Recipes", desc: "Discover a variety of global cuisines." },
            { id: 2, title: "Save & Share", desc: "Save recipes and share with your friends." },
            { id: 3, title: "Personalized Suggestions", desc: "Get meal recommendations tailored for you." },
          ].map((feature) => (
            <Col md={4} key={feature.id} className="p-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className={`shadow-sm p-3 ${theme}`}>
                  <Card.Body>
                    <h4 className="fw-semibold">{feature.title}</h4>
                    <p className="text-muted">{feature.desc}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.section>

      {/* Meals Section */}
      <section className="container text-center my-5">
        <h3 className="fw-semibold fs-2">Explore Meals</h3>
        <Row className="mt-4">
          {meals.map((meal, index) => (
            <Col md={4} key={meal.id} className="p-3">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className={`shadow-sm p-3 ${theme}`}>
                  <Card.Img variant="top" src={meal.image} className="meal-image"/>
                  <Card.Body className="text-center">
                    <h4 className="fw-semibold">{meal.title}</h4>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </section>

    </div>
  );
}
