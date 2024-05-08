import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./index.css";
import App from "./App";
import LoginPage from "./components/LoginPage/LoginPage";
import reportWebVitals from "./reportWebVitals";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import CatalogPage from "./components/CatalogPage/CatalogPage";

const root = createRoot(document.getElementById("root")); 
const user = "Шевченко Тарас";

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App user={user} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/catalog" element={<CatalogPage user={user} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

reportWebVitals();
