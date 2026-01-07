import { motion } from "framer-motion";
import { ZoomIn, ArrowUpRight } from "lucide-react";

const Gallery = () => {
  const suits = [
    { title: "The Midnight Tuxedo", cat: "Wedding Elite", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800" },
    { title: "Charcoal Executive", cat: "Business", img: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800" },
    { title: "Ivory Summer Blazer", cat: "Gala Dinner", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800" },
    { title: "Classic British Plaid", cat: "Heritage", img: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800" }
  ];

  return (
    <section id="gallery" className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 md:mb-20">
          <div className="text-center md:text-left w-full">
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.85] text-[#2C1E12]">
              The Palace <br /> <span className="text-[#8D775F]">Collections.</span>
            </h2>
          </div>
        </div>

        {/* Grid Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {suits.map((suit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-100 md:h-125 overflow-hidden rounded-3xl bg-[#F4F4F4]"
            >
              {/* Overlay Content */}
              <div className="absolute inset-0 z-10 bg-linear-to-t from-[#2C1E12] via-transparent to-transparent opacity-80 md:opacity-0 group-hover:opacity-90 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
                <p className="text-[#8D775F] font-black uppercase tracking-[0.3em] text-[8px] mb-2">{suit.cat}</p>
                <h3 className="text-white text-xl md:text-2xl font-black uppercase italic leading-none mb-4">{suit.title}</h3>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white">
                    <ZoomIn size={14} />
                  </div>
                </div>
              </div>

              {/* Image */}
              <img 
                src={suit.img} 
                alt={suit.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;