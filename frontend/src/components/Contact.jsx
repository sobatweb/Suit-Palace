import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Instagram, Send } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

const Contact = () => {
  const contactCards = [
    { 
      icon: MapPin, 
      title: "Boutique Location", 
      detail: businessConfig.address,
      action: "Open in Maps",
      link: "https://maps.google.com/?q=" + encodeURIComponent(businessConfig.address)
    },
    { 
      icon: Phone, 
      title: "Direct Booking", 
      detail: "+62 812-3757-5168",
      action: "Chat via WhatsApp",
      link: businessConfig.waLink
    },
    { 
      icon: Clock, 
      title: "Business Hours", 
      detail: businessConfig.hours,
      action: "",
      link: null
    }
  ];

  return (
    <section id="contact" className="py-32 md:py-48 bg-[#F8F9FA] relative overflow-hidden">
      {/* Background Decor agar tidak sepi */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-[-10%] w-500px h-500px bg-gray-100 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-1/4 right-[-10%] w-500px h-500px bg-gray-100 blur-[120px] rounded-full opacity-50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Center */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-32"
        >
          <h2 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.8] tracking-tighter mb-8">
            Let's Get <br /> <span className="text-[#A8A8A8]">In Touch.</span>
          </h2>
          <p className="text-[11px] md:text-xs font-black uppercase tracking-[0.4em] text-gray-400">
            Exclusive Tailoring & Premium Rental Service
          </p>
        </motion.div>

        {/* Info Cards Grid - 3 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {contactCards.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-10 md:p-12 bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-2rem flex items-center justify-center mb-8 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-500 shadow-inner">
                <item.icon size={32} strokeWidth={1.5} />
              </div>
              
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A8A8A8] mb-4">
                {item.title}
              </h4>
              
              <p className="text-sm md:text-base font-bold italic text-gray-800 leading-relaxed mb-8 min-h-50px">
                {item.detail}
              </p>

              {item.link ? (
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-1 hover:text-[#A8A8A8] hover:border-[#A8A8A8] transition-all"
                >
                  {item.action} <Send size={12} />
                </a>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                  {item.action}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 md:mt-32 text-center"
        >
          <div className="inline-flex items-center gap-6 p-2 pr-8 bg-white border border-gray-100 rounded-full shadow-lg">
             <div className="w-12 h-12 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center">
                <Instagram size={20} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
               Follow us for updates <a href="https://instagram.com/suitpalace.id" className="text-[#1A1A1A] ml-2">@suitpalace.id</a>
             </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;