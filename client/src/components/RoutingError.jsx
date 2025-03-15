import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GiKnifeFork } from "react-icons/gi";
import sadEgg from "../assets/animations/sad_egg.mp4";

export default function RoutingError() {
  return (
    <motion.div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ backgroundColor: "#F8F6F1" }}
    >
      <div className="position-relative d-flex flex-column align-items-center justify-content-center">
        {/* Fork & Spoon - Positioned just outside the plate */}
        <GiKnifeFork
          size={70}
          color="#698F3F"
          style={{
            position: "absolute",
            left: "-90px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <GiKnifeFork
          size={70}
          color="#698F3F"
          style={{
            position: "absolute",
            right: "-90px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        {/* Plate with Shadow Effect */}
        <motion.div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{
            width: "500px",
            height: "500px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            boxShadow:
              "0px 8px 25px rgba(0,0,0,0.2), inset 0px 3px 6px rgba(0,0,0,0.05)",
            border: "12px solid #E7DECD",
          }}
          initial={{ scale: 0.45 }}
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* 404 Styling */}
          <div className="d-flex align-items-center gap-3">
            <h1
              className="display-1 fw-bold"
              style={{ color: "#0A122A" }}
              animate={{ scale: [1, 1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              4
            </h1>
            <div
              className="position-relative rounded-circle overflow-hidden shadow-sm"
              style={{
                width: "110px",
                height: "110px",
                backgroundColor: "#E7DECD",
              }}
            >
              <video
                src={sadEgg}
                autoPlay
                loop
                muted
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            </div>

            <h1
              className="display-1 fw-bold"
              style={{ color: "#0A122A" }}
              animate={{ scale: [1, 1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              4
            </h1>
          </div>

          {/* Error Message inside Plate */}
          <motion.h2
            className="fw-bold mt-3"
            style={{ color: "#698F3F" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Uh-oh! This page is scrambled. 🍳
          </motion.h2>
          <motion.p
            className="lead mt-2 px-4"
            style={{ color: "#0A122A", maxWidth: "80%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Looks like we dropped the recipe! Let’s get you back to the main
            menu.
          </motion.p>
        </motion.div>
      </div>

      {/* Back to Home Button */}
      <motion.div
        className="mt-4"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/"
          className="btn fw-semibold shadow-sm"
          style={{
            backgroundColor: "#698F3F",
            color: "#FBFAF8",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "1.2rem",
          }}
        >
          Take Me Home
        </Link>
      </motion.div>
    </motion.div>
  );
}
