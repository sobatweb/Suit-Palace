import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Services = () => {
  const categories = [
    {
      title: "Suit + Pants Rental",
      items: [
        { name: "Paket Classic", price: "350k", period: "3 Days / 2 Nights", features: ["1 Set Suit + Pants", "Premium Dry Clean", "Free Adjustment"], highlight: false },
        { name: "Paket Signature", price: "400k", period: "4 Days / 3 Nights", features: ["1 Set Suit + Pants", "Premium Dry Clean", "Free Adjustment"], highlight: true },
        { name: "Paket Premium", price: "500k", period: "7 Days / 6 Nights", features: ["1 Set Suit + Pants", "Premium Dry Clean", "Free Adjustment"], highlight: false },
      ]
    },
    {
      title: "Suit + Pants + Vest/Shirt Rental",
      items: [
        { name: "Paket Classic", price: "425K", period: "3 Days / 2 Nights", features: ["1 Set Suit + Pants + Vest/Shirt", "Premium Dry Clean", "Free Adjustment"], highlight: false },
        { name: "Paket Signature", price: "500K", period: "4 Days / 3 Nights", features: ["1 Set Suit + Pants + Vest/Shirt", "Premium Dry Clean", "Free Adjustment"], highlight: true },
        { name: "Paket Premium", price: "625K", period: "7 Days / 6 Nights", features: ["1 Set Suit + Pants + Vest/Shirt", "Premium Dry Clean", "Free Adjustment"], highlight: false },
      ]
    },
    {
      title: "Suit / Tuxedo Full Set Rental",
      items: [
        { name: "Paket Classic", price: "550K", period: "3 Days / 2 Nights", features: ["1 Set Suit + Pants + Vest + Shirt/Tuxedo Shirt + Bow Tie", "Premium Dry Clean", "Free Adjustment"], highlight: false },
        { name: "Paket Signature", price: "625K", period: "4 Days / 3 Nights", features: ["1 Set Suit + Pants + Vest + Shirt/Tuxedo Shirt + Bow Tie", "Premium Dry Clean", "Free Adjustment"], highlight: true },
        { name: "Paket Premium", price: "750K", period: "7 Days / 6 Nights", features: ["1 Set Suit + Pants + Vest + Shirt/Tuxedo Shirt + Bow Tie", "Premium Dry Clean", "Free Adjustment"], highlight: false },
      ]
    },
    {
      title: "House of Changsan",
      items: [
        { name: "Classic Changsan", price: "475k", period: "3 Days / 2 Nights", features: ["S - XXL Available", "Authentic Design", "Dry Clean Laundry"], highlight: false },
        { name: "Modern Changsan", price: "750k", period: "3 Days / 2 Nights", features: ["S - XXL Available", "Authentic Design", "Dry Clean Laundry"], highlight: true },
        { name: "Family Package", price: "Disc Up To 10%", period: "3 Days / 2 Nights", features: ["Free Dry Clean Laundry "], highlight: false },
      ]
    },
  ];

  return (
    <section id="services" className="py-24 md:py-40 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-center mb-24">Packages.</h2>
        
        <div className="space-y-32">
          {categories.map((cat, idx) => (
            <div key={idx}>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] mb-12 border-l-4 border-[#A8A8A8] pl-6">{cat.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {cat.items.map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10 }}
                    viewport={{ once: true }}
                    className={`p-10 md:p-12 rounded-[3.5rem] border transition-all duration-500 flex flex-col ${
                      item.highlight 
                      ? 'bg-[#1A1A1A] text-white shadow-2xl scale-100 lg:scale-105' 
                      : 'bg-gray-50 border-gray-100 text-[#1A1A1A]'
                    }`}
                  >
                    <h4 className="text-3xl font-black uppercase italic mb-2 tracking-tight">{item.name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-8">{item.period}</p>
                    
                    <div className="text-5xl font-black italic tracking-tighter mb-8 pb-6 border-b border-gray-200/20">
                      {item.price}
                    </div>

                    <ul className="space-y-4">
                      {item.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-[11px] font-bold uppercase leading-tight">
                          <Check size={16} className="mt-0.5 shrink-0" /> 
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;