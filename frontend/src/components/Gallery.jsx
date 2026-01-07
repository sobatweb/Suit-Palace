import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";

const Gallery = () => {
  const suits = [
    { title: "Classic Black Tux", cat: "Wedding", img: "https://images.unsplash.com/photo-1594932224010-75f2a77afaa9?q=80&w=800&auto=format" },
    { title: "Charcoal Wool", cat: "Executive", img: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=800&auto=format" },
    { title: "Imperial Changsan", cat: "Cultural", img: "https://images.unsplash.com/photo-1617130863154-8250122e4f5a?q=80&w=800&auto=format" },
    { title: "Silver Grey Suit", cat: "Prom Night", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format" }
  ];

  return (
    <section id="gallery" className="py-32 bg-[#FDFDFD]">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <p className="text-[#A8A8A8] font-black uppercase tracking-[0.4em] text-[10px] mb-4">Our Masterpieces</p>
          <h2 className="text-5xl md:text-7xl font-black text-[#1A1A1A] uppercase italic tracking-tighter leading-none">
            The <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-400 to-gray-200">Exhibition.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {suits.map((suit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative h-[600px] overflow-hidden rounded-[3rem] bg-gray-100 border border-gray-200 shadow-xl"
            >
              {/* Silver Gradient Overlay */}
              <div className="absolute inset-0 z-10 bg-linear-to-t from-[#1A1A1A] via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              
              <img 
                src={suit.img} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                alt={suit.title}
                onError={(e) => { e.target.src = "https://via.placeholder.com/800x1200?text=Suit+Palace"; }}
              />

              <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[#A8A8A8] font-black uppercase tracking-[0.3em] text-[9px] mb-2">{suit.cat}</span>
                <h3 className="text-white text-3xl font-black uppercase italic leading-none mb-6 tracking-tighter">{suit.title}</h3>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;