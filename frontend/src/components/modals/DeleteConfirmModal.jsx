import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmModal = ({ deleteConfirm, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl text-center border border-slate-100">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-inner"><AlertTriangle size={40} /></div>
        <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Konfirmasi Hapus</h4>
        <p className="text-[11px] text-gray-400 font-bold mb-10 leading-relaxed">Data akan dihapus permanen dari tabel <br/><span className="text-[#1A120B] px-2 py-0.5 bg-slate-100 rounded-md">{deleteConfirm.table}</span></p>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Batal</button>
          <button onClick={onConfirm} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all flex items-center justify-center gap-2">
            <Trash2 size={14} /> Ya, Hapus
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmModal;