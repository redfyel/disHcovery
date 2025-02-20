import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import CoolAI from "./components/ai-ingredients/CoolAI";

function RootLayout() {
  return (
    <div>
      <Header />
      <div style={{ minHeight: "100vh" }}>
        <Outlet />
        <CoolAI/>
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout;
