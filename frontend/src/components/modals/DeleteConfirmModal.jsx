import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ deleteConfirm, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2rem p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500"><AlertTriangle size={32} /></div>
        <h4 className="text-sm font-black uppercase mb-2">Konfirmasi Hapus</h4>
        <p className="text-[11px] text-gray-400 font-bold mb-8">Data akan dihapus permanen dari tabel <span className="text-[#1A120B]">{deleteConfirm.table}</span>.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 bg-gray-100 rounded-2xl text-[10px] font-black uppercase">Batal</button>
          <button onClick={onConfirm} className="flex-1 py-3.5 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase">Ya, Hapus</button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmModal;