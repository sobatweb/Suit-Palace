import React from 'react';
import { X, LogOut, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, dbKeys, isOpen, setIsOpen, onLogoutClick }) => {
  const navigate = useNavigate();

  return (
    <aside className={`fixed inset-y-0 left-0 z-[100] w-64 bg-[#1A120B] text-white p-6 transition-transform lg:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-black italic uppercase select-none">
          S
          <span
            className="cursor-default"
            onClick={(e) => {
              if (e.ctrlKey) {
                setIsOpen(false);
                navigate("/adminMaster/register");
              }
            }}
            title=""
          >
            u
          </span>
          it
          <span className="text-[#A0A0A0]">Palace</span>
        </h1>
        <button className="lg:hidden text-white" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
        {['calendar', ...dbKeys].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setIsOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'bg-[#A0A0A0] text-white' : 'text-gray-500 hover:bg-white/5'}`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </nav>

      {/* ACTIONS */}
      <div className="mt-auto pt-6 border-t border-white/10 space-y-2">


        {/* LOGOUT */}
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;