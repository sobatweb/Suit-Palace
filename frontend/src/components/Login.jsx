import React, { useState } from 'react';
import { Lock, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', { //ganti jadi lokasi backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login gagal');
        return;
      }

      if (!data.token) {
        setError('Token tidak diterima dari server');
        return;
      }

      // ✅ SIMPAN TOKEN
      localStorage.setItem('token', data.token);

      // ✅ REDIRECT KE ADMIN DASHBOARD
      navigate('/adminMaster', { replace: true });

    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-gray-200/50 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-gray-200/50 blur-[100px] rounded-full" />

      {/* BACK TO LANDING */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-10 left-10 text-[#1A1A1A]/50 hover:text-[#1A1A1A] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all z-20"
      >
        <ArrowLeft size={16} /> Back to Landing
      </button>

      <div className="w-full max-w-md space-y-8 bg-white p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-black italic text-[#1A1A1A] uppercase tracking-tighter">
            ADMIN <span className="text-[#A8A8A8]">PORTAL</span>
          </h2>
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] mt-2">
            Authorized Access Only
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">
            {error}
          </p>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-[#1A1A1A] uppercase tracking-widest ml-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-[#1A1A1A]"
                placeholder="admin_user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-[#1A1A1A] uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="password"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-[#1A1A1A]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#1A1A1A] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#333]"
          >
            Authenticate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
