import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';

const NoteModal = ({ selectedFullDate, onClose, onSave }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    
    if (!title.trim()) return;

    onSave({ 
      id_note: Date.now(), 
      date: selectedFullDate, 
      title: title,
      content: title // Menyimpan konten yang sama dengan judul agar tidak kosong
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] p-8 w-full max-w-xs shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-black transition-colors">
          <X size={18}/>
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-3">
            <FileText size={24} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-600">Add Daily Note</h3>
          <p className="text-[8px] font-bold text-gray-400 mt-1">{selectedFullDate}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[8px] font-black uppercase text-gray-400 ml-1 mb-1 block">Isi Catatan</label>
            <textarea 
              name="title" 
              required 
              rows="3"
              placeholder="Tulis catatan penting hari ini..." 
              className="w-full p-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none ring-1 ring-gray-100 focus:ring-amber-500 transition-all resize-none shadow-inner"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all active:scale-95"
          >
            Save Note
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default NoteModal;