import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.css";
import UserLoginStatus from "./contexts/UserLoginStatus.jsx";
import{ ToastProvider }from "./contexts/ToastProvider.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
     <ToastProvider>
    <UserLoginStatus>
      <App />
    </UserLoginStatus>
    </ToastProvider>
  </StrictMode>
);
