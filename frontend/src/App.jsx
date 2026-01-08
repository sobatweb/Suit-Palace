import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
// import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
// import Chatbot from './components/Chatbots';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login'; 
import Register from "./components/Register";

/* =========================
   GUARD (SAMA DENGAN useEffect view)
========================= */
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function LandingPage({ onAdminClick }) {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Contact />
      <Footer onAdminClick={onAdminClick} />
    </>
  );
}

function App() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/adminMaster");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-white text-slate-900 scroll-smooth">
      <Routes>
        {/* LANDING */}
        <Route path="/" 
          element={<LandingPage onAdminClick={() => navigate("/login")} />} 
        />

        {/* LOGIN */}
        <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/adminMaster"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />

        {/* REGISTER ADMIN (PAGE SENDIRI) */}
        <Route
          path="/adminMaster/register"
          element={
            <RequireAuth>
              <Register />
            </RequireAuth>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;