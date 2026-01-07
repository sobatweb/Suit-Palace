import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['Home', 'About', 'Services', 'Contact'];

  return (
    <nav className="fixed w-full z-[100] flex justify-center px-4 py-4 md:py-6 pointer-events-none">
      <motion.div
        layout
        animate={{ 
          maxWidth: scrolled ? "900px" : "1200px",
          backgroundColor: scrolled || isOpen ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          border: scrolled ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.1)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="pointer-events-auto w-full flex items-center justify-between px-6 md:px-10 py-3 md:py-4 rounded-full shadow-lg"
      >
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-lg md:text-xl font-black italic tracking-tighter text-[#1A1A1A]">
            SUIT PALACE<span className="text-[#A8A8A8]">.</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] hover:text-[#A8A8A8] transition-colors">
              {link}
            </a>
          ))}
        </div>

        {/* Desktop Button */}
        <a href={businessConfig.waLink} className="hidden md:flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#A8A8A8] transition-all">
          <Phone size={12} /> Book Now
        </a>

        {/* Mobile Toggle */}
        <button className="md:hidden text-[#1A1A1A] p-1" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-6 top-24 bg-white rounded-[2.5rem] p-8 flex flex-col gap-6 items-center shadow-2xl border border-gray-100 md:hidden pointer-events-auto"
          >
            {links.map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                onClick={() => setIsOpen(false)}
                className="text-xs font-black uppercase tracking-[0.2em] text-[#1A1A1A]"
              >
                {link}
              </a>
            ))}
            <div className="w-full h-px bg-gray-100 my-2" />
            {/* Mobile Button - Now Visible */}
            <a 
              href={businessConfig.waLink}
              className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest"
            >
              <Phone size={14} /> Book Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;