import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State untuk menu mobile

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['Home', 'About', 'Services', 'Gallery', 'Contact'];

  return (
    <nav className="fixed w-full z-100 flex justify-center px-4 py-4 md:py-8 pointer-events-none">
      <motion.div
        layout
        initial={{ maxWidth: "1400px", width: "95%" }}
        animate={{ 
          maxWidth: scrolled ? "1000px" : "1400px",
          width: "100%",
          backgroundColor: scrolled || isOpen ? "rgba(44, 30, 18, 0.98)" : "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
        }}
        className={`pointer-events-auto flex items-center justify-between px-6 md:px-10 py-3 md:py-5 rounded-full border border-white/10 transition-all duration-500`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-10 border md:h-10 bg-[#8D775F] rounded-full flex items-center justify-center overflow-hidden shadow-inner shrink-0">
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className={`font-black tracking-tighter italic text-sm md:text-xl transition-colors ${
            scrolled || isOpen ? 'text-white' : 'text-[#2C1E12]'
          }`}>
            SUIT PALACE
          </span>
        </div>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className={`hidden md:flex items-center gap-8 font-bold text-[10px] uppercase tracking-[0.2em] ${
          scrolled ? 'text-white/70' : 'text-[#2C1E12]'
        }`}>
          {links.map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="hover:text-[#8D775F] transition-colors"
            >
              {item}
            </a>
          ))}
          <a 
            href={businessConfig.waLink} 
            className="bg-[#8D775F] text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-white hover:text-[#2C1E12] transition-all"
          >
            <Phone size={12} /> <span className="text-[9px]">Book Now</span>
          </a>
        </div>

        {/* Mobile Toggle Button (Visible only on Mobile) */}
        <button 
          className="md:hidden p-2 text-[#8D775F]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed inset-x-4 top-24 bg-[#2C1E12] rounded-4xl p-8 flex flex-col gap-6 items-center shadow-2xl border border-white/10 md:hidden pointer-events-auto"
          >
            {links.map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={() => setIsOpen(false)}
                className="text-white font-black uppercase tracking-widest text-sm hover:text-[#8D775F]"
              >
                {item}
              </a>
            ))}
            <a 
              href={businessConfig.waLink} 
              className="w-full bg-[#8D775F] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase text-xs"
            >
              <Phone size={16} /> WhatsApp Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;