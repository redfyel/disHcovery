import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import cookingAnimation from "../../assets/animations/cooking.json";

export default function AccessDenied({ compact = false }) {
  return (
    <motion.div
      className={`d-flex flex-column align-items-center text-center p-3 ${
        compact ? "w-100" : "min-vh-100 justify-content-center bg-light"
      }`}
      initial={{ opacity: 0, y: compact ? 10 : 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={compact ? { maxWidth: "400px", margin: "0 auto" } : {}}
    >
      {/* Animation & Lock Icon */}
      <div className="d-flex align-items-center justify-content-center">
        <i className="bi bi-lock-fill text-danger fs-3 me-2"></i>
        <div
          style={{
            width: compact ? "80px" : "300px",
            height: compact ? "80px" : "240px",
          }}
        >
          <Lottie animationData={cookingAnimation} loop autoplay />
        </div>
      </div>

      {/* Access Denied Message */}
      <motion.h1
        className={`fw-bold text-danger mt-2 ${compact ? "mb-1" : "display-4"}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        Oops! You're Locked Out! 🔒
      </motion.h1>

      <p className={`text-muted ${compact ? "small mb-2" : "fs-4"}`}>
        This kitchen is off-limits! Sign in to get a taste of what’s cooking. 🍕
      </p>

      {/*  Smooth Button Hover Animation */}
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
      <Link to="/login" className={`btn btn-danger ${compact ? "btn-sm px-3 py-1" : "px-3 py-2"} fw-semibold shadow-sm`}>
          🔑 Sign In
        </Link>
      </motion.div>
    </motion.div>
  );
}
