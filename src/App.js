import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPages";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("kamikart_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("kamikart_user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("kamikart_user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="app-loader">
        <div className="loader-logo">
          <span className="loader-k">K</span>
          <span className="loader-dot">✦</span>
        </div>
        <div className="loader-bar"><div className="loader-fill" /></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <SignupPage onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={user ? <LandingPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;