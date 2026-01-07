import React from 'react';
import { Lock, User, ArrowLeft } from 'lucide-react';

const Login = ({ onLogin, onBack }) => {
  return (
    <div className="min-h-screen bg-[#1A120B] flex items-center justify-center p-6">
      <button 
        onClick={onBack}
        className="absolute top-10 left-10 text-white/50 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
      >
        <ArrowLeft size={16} /> Back to Landing
      </button>

      <div className="w-full max-w-md space-y-8 bg-[#2C1E12] p-12 rounded-[2.5rem] shadow-2xl border border-white/5">
        <div className="text-center">
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">
            ADMIN <span className="text-[#8D775F]">PORTAL</span>
          </h2>
          <p className="text-[9px] text-white/40 uppercase tracking-[0.3em] mt-2">Authorized Access Only</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-[#8D775F] uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#8D775F] outline-none transition-all" placeholder="admin_user" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-[#8D775F] uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input type="password" text className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-[#8D775F] outline-none transition-all" placeholder="••••••••" />
            </div>
          </div>

          <button 
            onClick={onLogin}
            className="w-full bg-[#8D775F] hover:bg-[#a68d73] text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl"
          >
            Authenticate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;