import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { GOOGLE_CLIENT_ID } from "./config/env";
import { AuthProvider } from "./context/AuthContext";

const appTree = (
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

createRoot(document.getElementById("root")).render(
  GOOGLE_CLIENT_ID ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{appTree}</GoogleOAuthProvider>
  ) : (
    appTree
  )
);
