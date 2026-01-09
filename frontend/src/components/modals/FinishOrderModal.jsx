import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const FinishOrderModal = ({ order, onClose, onConfirm }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const kondisi = e.target.kondisi.value;
    onConfirm(order.id_order, kondisi);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X size={20}/></button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
            <CheckCircle size={32} />
          </div>
          <h4 className="text-sm font-black uppercase tracking-widest">Selesaikan Pesanan</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">ID Order: {order.id_order}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[9px] font-black uppercase text-gray-400 ml-1 mb-1 block">Kondisi Pengembalian</label>
           <input 
                name="kondisi" 
                type="text"
                placeholder="Contoh: Baik, Robek di lengan, dll..."
                className="w-full p-3.5 bg-gray-50 rounded-2xl text-xs font-bold border-none ring-1 ring-gray-100 outline-none focus:ring-[#1A120B]" 
              />
          </div>
          <button type="submit" className="w-full py-4 bg-[#1A120B] text-white rounded-[1.5rem] text-[10px] font-black uppercase shadow-xl mt-2 transition-all hover:bg-black">
            Konfirmasi & Masuk History
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default FinishOrderModal;