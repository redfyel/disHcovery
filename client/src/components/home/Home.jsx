import React from 'react';
import { FaSearch, FaUser } from "react-icons/fa";
import { Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "./Home.css";

export default function HomePage() {
  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-3"
      >
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="navbar-brand fw-bold">disHcovery</h1>
          <div className="d-flex align-items-center border rounded-pill px-3 py-1">
            <FaSearch className="text-muted" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="form-control border-0 ms-2"
            />
          </div>
          <Button variant="outline-primary" className="d-flex align-items-center gap-2">
            <FaUser /> Login / Signup
          </Button>
        </div>
      </motion.nav>

      {/* Video Section */}
      <section className="position-relative w-100" style={{ height: "500px" }}>
        <video 
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
          autoPlay loop muted
        >
          <source src="../../assets/home.mp4" type="video/mp4" />
        </video>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column justify-content-center align-items-center text-white">
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
        <div className="row mt-4">
          {[
            { id: 1, title: "Explore Recipes", desc: "Discover a variety of global cuisines." },
            { id: 2, title: "Save & Share", desc: "Save recipes and share with your friends." },
            { id: 3, title: "Personalized Suggestions", desc: "Get meal recommendations tailored for you." },
          ].map((feature) => (
            <motion.div 
              key={feature.id}
              className="col-md-4 p-3"
              whileHover={{ scale: 1.05 }}
            >
              <Card className="shadow-sm p-3">
                <Card.Body>
                  <h4 className="fw-semibold">{feature.title}</h4>
                  <p className="text-muted">{feature.desc}</p>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Meal Categories Section */}
      <section className="container text-center my-5">
        <h3 className="fw-semibold fs-3 mb-4">Explore Meals</h3>
        <div className="row">
          {[
            { id: 1, title: "Breakfast", image: "/images/breakfast.jpg" },
            { id: 2, title: "Lunch", image: "/images/lunch.jpg" },
            { id: 3, title: "Dinner", image: "/images/dinner.jpg" },
          ].map((meal, index) => (
            <motion.div 
              key={meal.id}
              className="col-md-4 p-3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="shadow-sm overflow-hidden">
                <Card.Img variant="top" src={meal.image} className="h-100 object-fit-cover" />
                <Card.Body className="text-center">
                  <h4 className="fw-semibold">{meal.title}</h4>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-dark text-white text-center p-3 mt-5"
      >
        &copy; {new Date().getFullYear()} disHcovery. All Rights Reserved.
      </motion.footer>
    </div>
  );
}