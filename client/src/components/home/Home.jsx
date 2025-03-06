import React from "react";
import { Link } from "react-router-dom";
import videoBg from "../../assets/videos/Homevideo.mp4";
import Breakfast from "../../assets/images/breakfast.jpg";
import Lunch from "../../assets/images/lunch.jpg";
import Dinner from "../../assets/images/dinner.jpg";
import Snacks from "../../assets/images/snacks.jpg";
import Desserts from "../../assets/images/dessert.jpg";
import Healthy from "../../assets/images/Healthy.jpg";
import "./Home.css"; // Keep custom styles if needed

const Home = () => {
  return (
    <div className="home-container"> {/*  Added a wrapper div */}
      <div className="container-fluid p-0">
        {/* Background Video Section */}
        <div className="position-relative text-center">
          <video autoPlay loop muted className="w-100 home-video" > {/* Added home-video class*/}
            <source src={videoBg} type="video/mp4" />
          </video>
          <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
            <h1 className="display-4 fw-bold">Welcome to disHcovery</h1>
            <p className="lead">Explore a world of delicious recipes tailored just for you!</p>
            <Link to="/explore" className="btn btn-primary btn-lg mt-3">
              Get Started
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="container my-5">
          <h2 className="text-center fw-bold mb-4">Why Choose disHcovery?</h2>
          <div className="row text-center">
            <div className="col-md-4">
              <div className="p-4 border rounded shadow-sm">
                <span className="fs-1">🤖</span>
                <h3 className="fw-bold mt-3">AI-Powered Recipes</h3>
                <p>Enter ingredients and let AI suggest amazing recipes!</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded shadow-sm">
                <span className="fs-1">🌎</span>
                <h3 className="fw-bold mt-3">Global Cuisine</h3>
                <p>Explore dishes from different cultures and flavors.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded shadow-sm">
                <span className="fs-1">⚡</span>
                <h3 className="fw-bold mt-3">Quick & Easy</h3>
                <p>Find recipes that fit your time and taste preferences.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Categories */}
        <div className="container my-5">
          <h2 className="text-center fw-bold mb-4">Explore Categories</h2>
          <div className="row g-4">
            {[
              { name: "Breakfast", img: Breakfast },
              { name: "Lunch", img: Lunch },
              { name: "Dinner", img: Dinner },
              { name: "Snacks", img: Snacks },
              { name: "Desserts", img: Desserts },
              { name: "Healthy", img: Healthy },
            ].map((category, index) => (
              <div className="col-md-4" key={index}>
                <Link to={`/category/${category.name.toLowerCase()}`} className="text-decoration-none">
                  <div className="card shadow border-0">
                    <img src={category.img} alt={category.name} className="card-img-top" />
                    <div className="card-body text-center">
                      <h5 className="card-title fw-bold">{category.name}</h5>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;