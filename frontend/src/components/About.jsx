import { motion } from "framer-motion";
import { ShieldCheck, Ruler, Star, Zap } from "lucide-react";

const About = () => {
  const values = [
    { icon: Ruler, label: "Bespoke Fit", desc: "Penyesuaian presisi sesuai proporsi tubuh untuk kenyamanan maksimal." },
    { icon: ShieldCheck, label: "Premium Material", desc: "Seleksi material terbaik yang memberikan kesan mewah dan tahan lama." },
    { icon: Star, label: "Luxury Design", desc: "Desain eksklusif yang dirancang untuk meningkatkan kepercayaan diri Anda." },
    { icon: Zap, label: "Express Ready", desc: "Layanan cepat dan profesional tanpa mengorbankan kualitas jahitan." },
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-[#FFFFFF] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* FOTO / LOGO - Tetap Besar */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 flex justify-center order-1"
          >
            <div className="relative w-full max-w-500px aspect-square rounded-[3rem] bg-[#FDFDFD] border border-gray-100 p-12 shadow-2xl">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </motion.div>

          {/* CONTENT */}
          <div className="lg:col-span-7 order-2">
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-[0.9] mb-10 text-center lg:text-left tracking-tighter">
                The Art of <br /> <span className="text-[#A8A8A8]">Tailoring.</span>
              </h2>
              <p className="text-gray-500 text-sm md:text-lg italic mb-12 border-l-0 lg:border-l-4 border-gray-100 lg:pl-8 text-center lg:text-left">
                "Suit Palace adalah destinasi utama bagi Anda yang menginginkan kualitas premium dalam setiap jahitan."
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-3xl bg-[#FDFDFD] border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-[#1A1A1A] flex items-center justify-center">
                      <v.icon size={18} />
                    </div>
                    <h5 className="font-black uppercase text-[10px] tracking-widest text-[#1A1A1A]">{v.label}</h5>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;