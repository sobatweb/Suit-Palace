import { motion } from "framer-motion";
import { ShieldCheck, Ruler, Star, Zap } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

function SuitModel() {
  const { scene } = useGLTF("/suit.glb");
  return <primitive object={scene} scale={1.5} />;
}

const About = () => {
  const values = [
    { icon: Ruler, label: "Bespoke Fit", desc: "Setiap jas disesuaikan dengan proporsi tubuh Anda." },
    { icon: ShieldCheck, label: "Premium Grade", desc: "Menggunakan wool dan lining kualitas terbaik." },
    { icon: Star, label: "Luxury Look", desc: "Desain yang memberikan impresi berkelas." },
    { icon: Zap, label: "Ready to Wear", desc: "Proses cepat tanpa kompromi kualitas." },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-[#F4F4F4] overflow-hidden text-[#2C1E12]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-16 items-center">
          
          {/* Model 3D - Muncul di atas pada mobile */}
          <div className="lg:col-span-6 order-1 lg:order-1 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative h-87.5 sm:h-125 md:h-150 w-full rounded-4xl bg-linear-to-b from-[#E5E5E5] to-[#D4C5B9]/20 shadow-inner overflow-hidden border border-white"
            >
              <Canvas dpr={[1, 2]} camera={{ fov: 35 }}>
                <Stage environment="studio" intensity={0.5}>
                  <SuitModel />
                </Stage>
                <OrbitControls enableZoom={false} autoRotate />
              </Canvas>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-50">360 Interactive View </p>
              </div>
            </motion.div>
          </div>

          {/* Konten Teks */}
          <div className="lg:col-span-6 order-2 lg:order-2 space-y-8 md:space-y-12">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}>
              <h4 className="text-[#8D775F] font-black uppercase tracking-[0.4em] text-[10px] mb-4 text-center lg:text-left">The Heritage</h4>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase italic leading-[0.9] tracking-tighter mb-8 text-center lg:text-left">
                Uncompromising <br /> <span className="text-[#8D775F]">Elegance.</span>
              </h2>
              <p className="text-[#2C1E12]/70 text-sm md:text-lg font-medium leading-relaxed italic border-l-0 lg:border-l-4 border-[#8D775F] lg:pl-8 text-center lg:text-left">
                "Look polished. Feel confident. Return with ease."
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 pt-8 border-t border-[#2C1E12]/10">
              {values.map((v, i) => (
                <div key={i} className="group p-4 md:p-6 rounded-2xl bg-white/50 border border-transparent hover:border-white hover:bg-white transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2C1E12] text-white flex items-center justify-center group-hover:bg-[#8D775F] transition-colors">
                      <v.icon size={16} />
                    </div>
                    <span className="font-black uppercase text-[9px] tracking-widest">{v.label}</span>
                  </div>
                  <p className="text-[10px] md:text-[11px] text-[#2C1E12]/50 font-bold">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;