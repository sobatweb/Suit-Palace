import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbots';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login'; 

function App() {
  // State untuk mengatur alur halaman (Flow)
  const [view, setView] = useState('landing'); // Pilihan: 'landing', 'login', 'admin'

  return (
    <div className="bg-white text-slate-900 scroll-smooth">
      {/* TAMPILAN LANDING PAGE UTAMA */}
      {view === 'landing' && (
        <>
          <Navbar />
          <Hero />
          <About />
          <Services />
          <Gallery />
          <Contact />
          <Footer onAdminClick={() => setView('login')} />
          <Chatbot />
        </>
      )}

      {/* TAMPILAN HALAMAN LOGIN */}
      {view === 'login' && (
        <Login 
          onLogin={() => setView('admin')} 
          onBack={() => setView('landing')} 
        />
      )}

      {/* TAMPILAN DASHBOARD ADMIN */}
      {view === 'admin' && (
        <AdminDashboard onBack={() => setView('landing')} />
      )}
    </div>
  );
}

export default App;