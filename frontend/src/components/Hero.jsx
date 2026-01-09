import { motion } from "framer-motion";
import { businessConfig } from "../config/businessConfig";
import { Sparkles, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-svh bg-[#FDFDFD] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-80 md:w-150 h-80 md:h-150 bg-gray-100/50 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-60 md:w-120 h-60 md:h-120 bg-[#E5E5E5]/40 blur-[80px] md:blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center mt-10 md:mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-gray-100 bg-white/50 shadow-sm">
            <Sparkles size={12} className="text-[#A8A8A8]" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[#1A1A1A]">Elevate Your Look</span>
          </div>
          
          <h1 className="text-[14vw] md:text-[8vw] lg:text-[7vw] font-black uppercase italic leading-[0.85] tracking-tighter mb-8 md:mb-10 text-[#1A1A1A]">
            Suit <br /> 
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#1A1A1A] via-[#A8A8A8] to-[#1A1A1A]">Palace.</span>
          </h1>

          <p className="text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] mb-10 md:mb-16 max-w-260px md:max-w-xl leading-relaxed mx-auto">
            Premium Suit Rental & Custom Tailoring in Tangerang.
          </p>

          <motion.a 
            href={businessConfig.waLink} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative bg-[#1A1A1A] text-white px-8 py-4 md:px-20 md:py-6 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-xl overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 md:gap-3">
              Book Consultation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;