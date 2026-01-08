import React from 'react';
import { X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, dbKeys, isOpen, setIsOpen }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-[100] w-64 bg-[#1A120B] text-white p-6 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <h1 className="text-xl font-black italic uppercase mb-8">Suit<span className="text-[#A0A0A0]">Palace</span></h1>
      <nav className="space-y-1 h-[80vh] overflow-y-auto scrollbar-hide">
        {['calendar', ...dbKeys].map(tab => (
          <button 
            key={tab} 
            onClick={() => {setActiveTab(tab); setIsOpen(false);}} 
            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'bg-[#A0A0A0] text-white' : 'text-gray-500 hover:bg-white/5'}`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;