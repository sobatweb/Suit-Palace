import { businessConfig } from '../config/businessConfig';
import { Instagram, Mail, Phone, ArrowUp } from 'lucide-react';

const Footer = ({ onAdminClick }) => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Data sosial media dengan link yang bisa diklik
  const socialLinks = [
    { 
      icon: Instagram, 
      link: "https://instagram.com/suitpalace.id", // Updated username
      label: "Instagram" 
    },
    { 
      icon: Mail, 
      link: "mailto:suitpalace.id@gmail.com", // Ganti dengan email Anda jika berbeda
      label: "Email" 
    },
    { 
      icon: Phone, 
      link: businessConfig.waLink, 
      label: "WhatsApp" 
    },
  ];

  return (
    <footer className="relative bg-[#F8F9FA] py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
              <h2 className="text-4xl font-black italic text-[#1A1A1A] uppercase tracking-tighter">
                SUIT PALACE<span className="text-[#A8A8A8]">.</span>
              </h2>
              <p className="text-gray-500 text-sm font-medium italic leading-relaxed max-w-sm mx-auto lg:mx-0">
                "{businessConfig.description}"
              </p>
              
              {/* Social Icons - Now Clickable */}
              <div className="flex justify-center lg:justify-start gap-5">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="text-center md:text-left">
                <h5 className="text-[10px] font-black uppercase text-[#A8A8A8] tracking-[0.3em] mb-4">Location</h5>
                <p className="text-[11px] leading-relaxed text-[#1A1A1A] font-bold italic">{businessConfig.address}</p>
              </div>
              <div className="text-center md:text-left">
                <h5 className="text-[10px] font-black uppercase text-[#A8A8A8] tracking-[0.3em] mb-4">Schedule</h5>
                <p className="text-[11px] leading-relaxed text-[#1A1A1A] font-bold italic">{businessConfig.hours}</p>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest cursor-default select-none text-center">
                © 2026 Suit Palace Tangerang • All Rights <span onClick={onAdminClick} className="hover:text-[#A8A8A8] cursor-pointer">Reserved.</span>
              </p>
            </div>
            
            <button 
              onClick={scrollToTop}
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]"
            >
              Scroll to Top
              <div className="w-10 h-10 rounded-full border border-[#1A1A1A] flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                <ArrowUp size={16} />
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Blob */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gray-100 blur-[120px] rounded-full pointer-events-none opacity-50" />
    </footer>
  );
};

export default Footer;