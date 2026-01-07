import { motion } from 'framer-motion';
import { MapPin, Clock, Phone } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

const Contact = () => {
  return (
    <section id="contact" className="py-20 md:py-40 bg-[#F4F4F4] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
          
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h4 className="text-[#8D775F] font-black uppercase tracking-[0.4em] text-[10px] mb-4 text-center lg:text-left">Visit Our Boutique</h4>
            <h2 className="text-4xl md:text-6xl font-black text-[#2C1E12] uppercase italic leading-[0.9] tracking-tighter mb-10 text-center lg:text-left">
              Personal <br /> <span className="text-[#8D775F]">Consultation.</span>
            </h2>
            
            <div className="space-y-6 md:space-y-10">
              {[
                { icon: MapPin, title: "Location", detail: businessConfig.address },
                { icon: Clock, title: "Opening Hours", detail: businessConfig.hours }
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-6 items-center lg:items-start text-center lg:text-left">
                  <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#2C1E12] text-[#8D775F] rounded-full flex items-center justify-center">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-[#8D775F] mb-1">{item.title}</h5>
                    <p className="text-xs md:text-sm font-bold text-[#2C1E12] max-w-xs">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center lg:text-left">
              <motion.a 
                href={businessConfig.waLink}
                whileTap={{ scale: 0.95 }}
                className="mt-12 inline-flex items-center gap-4 bg-[#2C1E12] text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl"
              >
                <Phone size={14} /> Schedule Appointment
              </motion.a>
            </div>
          </motion.div>

          {/* Iframe Peta - Full width di mobile */}
          <div className="relative h-75 md:h-125 rounded-4xl overflow-hidden shadow-2xl border-4 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=..." // Gunakan link embed asli Anda
              className="w-full h-full grayscale border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;