import React from "react";
import { LogOut, UserPlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  onLogoutClick
}) => {
  const navigate = useNavigate();

  const dashboardTabs = [
    "calendar",
    "customers",
    "packages",
    "jas",
    "kemeja",
    "celana",
    "changshan",
    "dasi",
    "order_items"
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[100] w-64 bg-[#1A120B] text-white p-6 transition-transform lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-black italic uppercase">
          Suit<span className="text-[#A0A0A0]">Palace</span>
        </h1>
        <button className="lg:hidden" onClick={() => setIsOpen(false)}>
          <X size={18} />
        </button>
      </div>

      {/* DASHBOARD NAV */}
      <nav className="space-y-1 h-[60vh] overflow-y-auto scrollbar-hide">
        {dashboardTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${
              activeTab === tab
                ? "bg-[#A0A0A0] text-white"
                : "text-gray-500 hover:bg-white/5"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </nav>

      {/* ACTIONS */}
      <div className="mt-auto pt-6 border-t border-white/10 space-y-2">
        {/* REGISTER ADMIN */}
        <button
          onClick={() => {
            setIsOpen(false);
            navigate("/adminMaster/register");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all"
        >
          <UserPlus size={14} />
          Register Admin
        </button>

        {/* LOGOUT */}
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
