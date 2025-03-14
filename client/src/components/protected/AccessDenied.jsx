import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { BiSolidLock } from "react-icons/bi";
import { FaPizzaSlice } from "react-icons/fa6";
import { IoKey } from "react-icons/io5";
import cookingAnimation from "../../assets/animations/cooking.json";

export default function AccessDenied() {
  // Updated clipPath string with extra bottom space (ending at 600)
  const clipPathString =
    "path('M50 30 Q90 0, 130 30 T220 30 T310 30 Q350 0, 390 30 T480 30 T570 30 Q600 0, 630 30 L630 600 Q600 630, 570 600 T480 600 T390 600 Q350 630, 310 600 T220 600 T130 600 Q90 630, 50 600 Z')";
  
  // The same path string used for our outline SVG
  const svgPath =
    "M50 30 Q90 0, 130 30 T220 30 T310 30 Q350 0, 390 30 T480 30 T570 30 Q600 0, 630 30 L630 600 Q600 630, 570 600 T480 600 T390 600 Q350 630, 310 600 T220 600 T130 600 Q90 630, 50 600 Z";

  return (
    <motion.div
      className="d-flex flex-column align-items-center justify-content-center text-center min-vh-100"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* 🍕 Super Gooey Melty Cheese Container with Outline */}
      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{
          scale: [1, 1.02, 1],
          rotate: [-1, 1, -1],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 3,
          ease: "easeInOut",
        }}
        style={{
          position: "relative",
          padding: "6rem 6rem 8rem 6rem", // increased bottom padding to 8rem
          maxWidth: "650px",
          backgroundColor: "#F8F6F1",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
          clipPath: clipPathString,
        }}
      >
        {/* Outline Border via SVG */}
        <svg
          viewBox="0 0 680 640"
          style={{
            position: "absolute",
            top: -15,
            left: 15,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <path d={svgPath} stroke="#698F3F" strokeWidth="3" fill="none" />
        </svg>

        {/* Animation Container with Lock Overlay */}
        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ width: "280px", height: "200px", margin: "0 auto" }}
          >
            <Lottie animationData={cookingAnimation} loop autoplay />
          </motion.div>
          <BiSolidLock
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#0A122A",
              fontSize: "3.5rem",
            }}
          />
        </div>

        {/* ❌ Gooey Access Denied Message */}
        <motion.h1
          className="fw-bold mb-3"
          style={{ color: "#698F3F", fontSize: "2rem" }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          Oops! You're Locked Out! <BiSolidLock />
        </motion.h1>

        <p className="text-muted fs-5 mb-4">
          This kitchen is off-limits! Log in to get a taste of what’s cooking.{" "}
          <FaPizzaSlice />
        </p>

        {/* 🔑 Animated Log In Button */}
        <motion.div
          whileHover={{ scale: 1.15, rotate: -2 }}
          transition={{ duration: 0.3 }}
          style={{ display: "inline-block" }}
        >
          <Link
            to="/login"
            className="btn fw-semibold shadow-sm"
            style={{
              backgroundColor: "#698F3F",
              border: "none",
              color: "#FBFAF8",
              padding: "12px 25px",
              fontSize: "1.2rem",
              borderRadius: "10px",
            }}
          >
            <IoKey style={{ marginRight: "0.5rem" }} />
            Log In
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
