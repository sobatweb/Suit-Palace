import React from 'react';
import { motion } from 'framer-motion';
import { X, Database, Save } from 'lucide-react';

const FormModal = ({ activeTab, editingItem, db, onClose, onSave }) => {
  const table = editingItem?.fromTable || activeTab;
  const fields = Object.keys(db[table][0] || {});

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400"><X size={20}/></button>
        <h3 className="text-sm font-black uppercase mb-8 text-[#8D775F] tracking-widest flex items-center gap-3"><Database size={20}/> {editingItem ? 'Edit Data' : 'Tambah Baru'}</h3>
        <form onSubmit={onSave} className="grid grid-cols-2 gap-4">
          {fields.map((key, i) => {
            if (i === 0) return null; // Sembunyikan ID
            return (
              <div key={key} className={key.includes('description') || key.includes('content') ? 'col-span-2' : 'col-span-1'}>
                <label className="text-[9px] font-black uppercase text-gray-400 mb-1.5 block ml-1">{key.replace('_', ' ')}</label>
                {key.includes('status') ? (
                  <select name={key} defaultValue={editingItem ? editingItem[key] : ''} className="w-full p-3.5 bg-gray-50 rounded-2xl text-xs font-bold border-none ring-1 ring-gray-100 outline-none">
                    {key === 'status_rent' ? (
                      <><option>Booking</option><option>Persiapan</option><option>Overdue</option><option>Dikembalikan</option></>
                    ) : (
                      <><option>Belum Selesai</option><option>Sudah Selesai</option></>
                    )}
                  </select>
                ) : (
                  <input name={key} type={key.includes('date') ? 'date' : (key.includes('price') || key.includes('paid') || key.includes('stock') ? 'number' : 'text')} defaultValue={editingItem ? editingItem[key] : ''} className="w-full p-3.5 bg-gray-50 rounded-2xl text-xs font-bold border-none ring-1 ring-gray-100 outline-none" />
                )}
              </div>
            );
          })}
          <button type="submit" className="col-span-2 py-4.5 bg-[#1A120B] text-white rounded-[1.5rem] text-[10px] font-black uppercase shadow-xl mt-6 flex items-center justify-center gap-2">
            <Save size={14}/> Simpan Perubahan
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default FormModal;