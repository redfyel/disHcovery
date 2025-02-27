import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react"; // ✅ Use lottie-react instead
import cookingAnimation from "../../assets/animations/cooking.json"; // 🍳 Lottie JSON animation

export default function AccessDenied() {
  return (
    <motion.div 
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center bg-light p-5"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* 🔒 Lock + Cooking Animation */}
      <div className="d-flex align-items-center">
        <i className="bi bi-lock-fill text-danger display-3"></i>
        <div style={{ width: "300px", height: "240px" }}> {/* Adjusted size */}
          <Lottie animationData={cookingAnimation} loop autoplay />
        </div>
      </div>

      {/* 🔥 Access Denied Message */}
      <motion.h1 
        className="display-4 fw-bold text-danger mt-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1  }}
        transition={{ duration: 0.3 }}
      >
        Oops! You're Locked Out! 🔒
      </motion.h1>

      <p className="fs-4 text-secondary">
        This kitchen is off-limits! Sign in to get a taste of what’s cooking. 🍕
      </p>

      {/* 🔄 Smooth Button Hover Animation */}
      <motion.div
        whileHover={{ scale: 1.1 }}  // Slightly increase the button size on hover
        transition={{ duration: 0.3 }}
      >
        <Link to="/login" className="btn btn-danger px-3 py-2 fw-semibold shadow-sm mt-3">
          🔑 Sign In
        </Link>
      </motion.div>
    </motion.div>
  );
}
