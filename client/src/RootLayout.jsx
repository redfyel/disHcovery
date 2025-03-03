import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import CoolAI from "./components/ai-ingredients/CoolAI";
import Loading from "./components/loading/Loading";

function RootLayout() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true); 

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 800); 

    return () => clearTimeout(timeout);
  }, [location]);

  // Hide Footer and CoolAI button only for "/ai-ingredients" route
  const hideFooterCoolAI = location.pathname === "/ai-ingredients";

  // Hide CoolAI button for '/login' and '/register'
  const hideCoolAI = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <Loading />
        </div>
      )}
      <Header />
      <div style={{ minHeight: "100vh", opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease-in-out" }}>
        <Outlet />
      </div>
      {!hideFooterCoolAI && <Footer />}
      {!hideFooterCoolAI && !hideCoolAI && <CoolAI />}

      {/* Styles for full-screen loading */}
      <style>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.9);
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}

export default RootLayout;
