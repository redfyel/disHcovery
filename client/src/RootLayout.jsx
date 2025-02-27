import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import CoolAI from "./components/ai-ingredients/CoolAI";

function RootLayout() {
  const location = useLocation();

  // Hide Footer and CoolAI button only for "/ai-ingredients" route
  const hideFooterCoolAI = location.pathname === "/ai-ingredients";

  // Hode CoolAi button for '/login' and '/register'
  const hideCoolAI = location.pathname === "/login" || location.pathname === '/register'
 
  return (
    <div>
      <Header />
      <div style={{ minHeight: "100vh" }}>
        <Outlet />
      </div>
      {!hideFooterCoolAI && <Footer />}
      {!hideFooterCoolAI && !hideCoolAI && <CoolAI />}
    </div>
  );
}

export default RootLayout;
