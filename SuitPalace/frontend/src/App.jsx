import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbots';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Login from './components/Login';

function App() {
  // State untuk mengatur alur halaman (Flow)
  const [view, setView] = useState('landing'); // 'landing' | 'login' | 'admin'

  // State untuk input login/register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handler untuk login/register
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setView('admin'); // jika login berhasil, tampilkan dashboard admin
      } else {
        alert(data.message || 'Login gagal');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat login');
    }
  };

  return (
    <div className="bg-white text-slate-900 scroll-smooth min-h-screen">
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
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Login 
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            onLogin={handleLogin}
            onBack={() => setView('landing')} 
          />
        </div>
      )}

      {/* TAMPILAN DASHBOARD ADMIN */}
      {view === 'admin' && (
        <AdminDashboard onBack={() => setView('landing')} />
      )}
    </div>
  );
}

export default App;
