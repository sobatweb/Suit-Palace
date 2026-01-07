import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Bot } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { businessConfig } from '../config/businessConfig';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true); // Untuk kontrol pesan sambutan
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Halo! Saya Palace Bot. Ada yang bisa saya bantu dengan kebutuhan jas Anda hari ini?' }
  ]);
  const chatEndRef = useRef(null);

  const qa = [
    { q: 'Cara Booking?', a: 'Kunjungi butik kami di Ruko Hampton atau hubungi WhatsApp kami untuk fitting privat.' },
    { q: 'Durasi Sewa?', a: 'Standar sewa adalah 3 hari. Bisa diperpanjang saat sesi fitting.' },
    { q: 'Ukuran Custom?', a: 'Ya, kami menyediakan jasa permak minor agar jas pas dengan bentuk tubuh Anda.' }
  ];

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // Sembunyikan tooltip setelah 8 detik agar tidak mengganggu
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleAsk = (item) => {
    if (isTyping) return;
    setMessages(prev => [...prev, { role: 'user', text: item.q }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: item.a }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-9999 flex flex-col items-end">
      
      {/* WINDOW CHATBOT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="mb-6 w-[88vw] md:w-96 bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20"
          >
            {/* Header */}
            <div className="bg-[#2C1E12] p-5 md:p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8D775F] rounded-full flex items-center justify-center border border-white/20">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Palace Bot</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] text-white/50 uppercase font-bold tracking-widest">Available Now</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="h-72 md:h-80 overflow-y-auto p-5 md:p-6 space-y-4 bg-slate-50/50 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-[11px] font-medium leading-relaxed shadow-sm ${
                    msg.role === 'bot' ? 'bg-white text-[#2C1E12] rounded-tl-none' : 'bg-[#8D775F] text-white rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && <div className="text-[10px] text-slate-400 italic">Palace Bot sedang mengetik...</div>}
              <div ref={chatEndRef} />
            </div>

            {/* Actions */}
            <div className="p-5 bg-white border-t border-slate-100 space-y-4">
              <div className="flex flex-wrap gap-2">
                {qa.map((item, i) => (
                  <button key={i} onClick={() => handleAsk(item)} className="text-[9px] font-black uppercase px-4 py-2 bg-[#F4F4F4] rounded-full hover:bg-[#2C1E12] hover:text-white transition-all border border-slate-200">
                    {item.q}
                  </button>
                ))}
              </div>
              <a href={businessConfig.waLink} className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all">
                <Phone size={14} /> Hubungi WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TRIGGER: THE MINI MONOLITH BOT */}
      <motion.div 
        className="relative group cursor-pointer flex flex-col items-center justify-center"
        onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* TOOLTIP SAMBUTAN (Untuk memberitahu user ini Bot Pertanyaan) */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute -top-16 right-0 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-2xl z-30 whitespace-nowrap"
            >
              <p className="text-[10px] font-black text-[#2C1E12] uppercase tracking-tighter">
                Butuh Bantuan? <span className="text-[#8D775F]">Tanya Saya!</span>
              </p>
              {/* Panah Tooltip */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifikasi Badge (Angka 1 merah berdenyut) */}
        {!isOpen && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-2 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white z-40 shadow-lg"
            >
              1
            </motion.div>
        )}

        {/* Orbital Rings - Ukuran disesuaikan agar tetap terlihat di mobile */}
        <motion.div 
          animate={{ rotate: 360, rotateX: 75 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-20 h-20 md:w-24 md:h-24 border border-[#8D775F]/40 rounded-full"
        />

        {/* Robot Structure */}
        <div className="relative flex flex-col items-center scale-90 md:scale-100">
          {/* Kepala */}
          <motion.div 
            animate={{ rotateZ: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-10 h-8 bg-[#2C1E12] rounded-xl border-2 border-[#8D775F] flex items-center justify-center z-20 shadow-xl"
          >
            <div className="flex gap-1.5">
              <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]" />
              <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }} className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]" />
            </div>
          </motion.div>

          {/* Badan */}
          <div className="w-12 h-14 bg-linear-to-b from-[#2C1E12] to-black rounded-2xl border-2 border-[#8D775F]/50 mt-1 z-10 shadow-2xl relative">
            <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-cyan-400/5" />
          </div>

          {/* Tangan Magnetis */}
          <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -left-3 top-10 w-2 h-6 bg-[#2C1E12] border border-[#8D775F]/30 rounded-full" />
          <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} className="absolute -right-3 top-10 w-2 h-6 bg-[#2C1E12] border border-[#8D775F]/30 rounded-full" />
        </div>

        {/* Shadow */}
        <motion.div 
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-10 h-2 bg-black rounded-full blur-lg mt-4"
        />
      </motion.div>
    </div>
  );
};

export default Chatbot;