import { motion } from "framer-motion";
import { businessConfig } from "../config/businessConfig";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen bg-[#F4F4F4] flex items-center justify-center overflow-hidden">
      {/* Background Decor - Tetap dipertahankan untuk tekstur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-150 h-150 bg-[#8D775F]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-125 h-125 bg-[#2C1E12]/5 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="flex flex-col items-center"
        >
          {/* Tagline Kecil di Atas */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-[#8D775F]"></div>
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] text-[#8D775F]">
              The Tailor's Art
            </span>
            <div className="w-12 h-px bg-[#8D775F]"></div>
          </div>

          {/* Judul Utama Tengah */}
          <h1 className="text-[15vw] lg:text-[180px] leading-[0.8] font-black text-[#2C1E12] uppercase italic mb-10 tracking-tighter">
            SUIT <span className="text-[#8D775F]">PALACE.</span>
          </h1>

          {/* Deskripsi Tengah */}
          <p className="max-w-xl text-[#2C1E12]/70 text-sm md:text-base font-medium mb-14 leading-relaxed italic">
            Elevate your look, effortlessly. Premium style meets smart choice for those who value sharp details and confidence.
          </p>

          {/* Tombol & Info Tambahan */}
          <div className="flex flex-col items-center gap-8">
            <motion.a 
              href={businessConfig.waLink} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-[#2C1E12] text-white px-16 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#8D775F] transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            >
              Book Appointment
            </motion.a>
            
            <div className="flex gap-6 items-center opacity-40 text-[9px] font-black uppercase tracking-widest text-[#2C1E12]">
              <span>Business</span>
              <div className="w-1 h-1 bg-[#8D775F] rounded-full"></div>
              <span>Wedding</span>
              <div className="w-1 h-1 bg-[#8D775F] rounded-full"></div>
              <span>Gala Dinner</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20">
        <div className="w-px h-20 bg-linear-to-b from-[#2C1E12] to-transparent"></div>
        <p className="text-[8px] font-black uppercase tracking-[0.5em] rotate-180 [writing-mode:vertical-lr]">Scroll</p>
      </div>
    </section>
  );
};

export default Hero;