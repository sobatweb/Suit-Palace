import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const MarkModal = ({ selectedFullDate, onClose, onSave }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const note = e.target.note.value;
    const color = e.target.col.value;
    onSave({ id_mark: Date.now(), date: selectedFullDate, note, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-xs shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-black"><X size={18}/></button>
        <h3 className="text-[10px] font-black uppercase mb-6 text-center tracking-widest text-[#8D775F]">Add Mark</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="note" required placeholder="Label Mark..." className="w-full p-3.5 bg-gray-50 rounded-xl text-xs font-bold outline-none ring-1 ring-gray-100 focus:ring-slate-300 transition-all" />
          <input name="col" type="color" defaultValue="#e11d48" className="w-full h-11 rounded-xl cursor-pointer" />
          <button type="submit" className="w-full py-4 bg-[#1A120B] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Save Mark</button>
        </form>
      </motion.div>
    </div>
  );
};

export default MarkModal;