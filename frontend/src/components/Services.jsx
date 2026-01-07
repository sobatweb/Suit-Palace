import { motion } from 'framer-motion';
import { Ruler, Sparkles, ShieldCheck } from 'lucide-react';

const Services = () => {
  const experiences = [
    { title: "Bespoke Fitting", icon: Ruler, detail: "Penyesuaian presisi oleh master tailor untuk siluet tubuh yang sempurna." },
    { title: "Premium Curation", icon: Sparkles, detail: "Koleksi jas dari material wool & silk premium dengan standar internasional." },
    { title: "Valet Care", icon: ShieldCheck, detail: "Layanan dry-cleaning & pemeliharaan profesional tanpa biaya tambahan." }
  ];

  return (
    <section id="services" className="py-40 bg-[#2C1E12] text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-24">
          <h2 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6">
            The <span className="text-[#8D775F]">Palace</span> <br /> Experience.
          </h2>
          <div className="h-1 w-24 bg-[#8D775F]"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-20">
          {experiences.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-[#8D775F] transition-all duration-500">
                <item.icon className="text-[#8D775F] group-hover:text-white" size={32} />
              </div>
              <h3 className="text-2xl font-black italic uppercase mb-4">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Services;