import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import sadEgg from "../assets/animations/sad_egg.mp4";

export default function RoutingError() {
  return (
    <motion.div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* 404 with Seamless Egg Animation */}
      <div className="d-flex align-items-center">
        <motion.h1
          className="display-1 fw-bold text-warning me-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          4
        </motion.h1>
        <motion.div
          className="position-relative rounded-circle overflow-hidden"
          style={{ width: "120px", height: "150px" }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <video
            src={sadEgg}
            autoPlay
            loop
            muted
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </motion.div>
        <motion.h1
          className="display-1 fw-bold text-warning ms-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          4
        </motion.h1>
      </div>

      {/* Error Message */}
      <motion.h2
        className="fw-bold text-danger mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        Oops! This Page is Missing! 🍳
      </motion.h2>
      <motion.p
        className="lead text-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        Looks like our chef dropped the recipe! Let’s whisk you back to the menu.
      </motion.p>

      {/* Back to Home Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/" className="btn btn-warning fw-semibold shadow-sm">
          Go Back!
        </Link>
      </motion.div>
    </motion.div>
  );
}
