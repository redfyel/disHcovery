import React from 'react';
import { FaSearch, FaUser } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import "./Home.css";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center p-4 bg-white shadow-md"
      >
        <h1 className="text-2xl font-bold">disHcovery</h1>
        <div className="flex items-center border rounded-full px-3 py-1">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search recipes..."
            className="outline-none px-2"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <FaUser /> Login / Signup
        </Button>
      </motion.nav>

      {/* 1. Video Section */}
      <section className="relative w-full h-[500px]">
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay loop muted
        >
          <source src="/videos/food-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
          <h2 className="text-4xl font-semibold">Discover Delicious Recipes</h2>
          <p className="mt-2">Find, save, and share your favorite recipes with ease.</p>
          <Button className="mt-4">Get Started</Button>
        </div>
      </section>

      {/* 2. Features Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-8 text-center bg-white"
      >
        <h3 className="text-3xl font-semibold">Why Choose disHcovery?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[
            { id: 1, title: "Explore Recipes", desc: "Discover a variety of global cuisines." },
            { id: 2, title: "Save & Share", desc: "Save recipes and share with your friends." },
            { id: 3, title: "Personalized Suggestions", desc: "Get meal recommendations tailored for you." },
          ].map((feature) => (
            <motion.div 
              key={feature.id}
              className="p-6 bg-gray-100 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <h4 className="text-xl font-semibold">{feature.title}</h4>
              <p className="mt-2 text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 3. Meal Categories Section */}
      <section className="p-8">
        <h3 className="text-2xl font-semibold mb-4 text-center">Explore Meals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 1, title: "Breakfast", image: "/images/breakfast.jpg" },
            { id: 2, title: "Lunch", image: "/images/lunch.jpg" },
            { id: 3, title: "Dinner", image: "/images/dinner.jpg" },
          ].map((meal, index) => (
            <motion.div 
              key={meal.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4 text-center">
                  <h4 className="text-lg font-semibold">{meal.title}</h4>
                </CardContent>
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
        className="bg-gray-900 text-white text-center p-4 mt-8"
      >
        &copy; {new Date().getFullYear()} disHcovery. All Rights Reserved.
      </motion.footer>
    </div>
  );
}
