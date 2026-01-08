import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Database, Plus, Trash2, UserPlus, Package, CheckCircle2, User } from 'lucide-react';

const FormModal = ({ activeTab, editingItem, db, onClose, onSave }) => {
  const table = editingItem?.fromTable || activeTab;
  const isOrderTable = table === 'order_items';
  // Helper untuk membersihkan nilai input
  const cleanValue = (key, val) => {
    if (val === null || val === undefined) return '';
    
    // 1. Hilangkan .00 pada harga/angka
    if (key.includes('price') || key.includes('stock') || key.includes('paid') || key.includes('pendapatan') || key.includes('denda') || key.includes('fee') || key.includes('deposit')) {
      return Math.floor(Number(val));
    }

    // 2. Format tanggal ISO (2026-01-08T15:00:00.000Z) ke format Input Date (2026-01-08)
    if (key.includes('date') || key === 'created_at') {
      if (typeof val === 'string' && val.includes('T')) {
        return val.split('T')[0];
      }
    }
    
    return val;
  };
  
  const [rows, setRows] = useState(() => {
  if (editingItem) {
    // Bersihkan setiap field di data yang akan diedit
    const cleanedItem = { ...editingItem };
    Object.keys(cleanedItem).forEach(key => {
      cleanedItem[key] = cleanValue(key, cleanedItem[key]);
    });
    return [cleanedItem];
  }
  return [{}];
});

  const addRow = () => setRows([...rows, {}]);
  
  const duplicateForSameCustomer = (index) => {
    const sourceRow = rows[index];
    const newRow = { 
      id_customer: sourceRow.id_customer,
      start_dates: sourceRow.start_dates,
      status_rent: 'Booked',
      is_connected: true // Penanda bahwa ini adalah baris lanjutan
    };
    const updatedRows = [...rows];
    updatedRows.splice(index + 1, 0, newRow);
    setRows(updatedRows);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    if (isOrderTable) {
      if (field === 'id_package' || field === 'start_dates') {
        const pkgId = field === 'id_package' ? value : newRows[index].id_package;
        const startDate = field === 'start_dates' ? value : newRows[index].start_dates;
        
        const pkg = db.packages.find(p => String(p.id_package) === String(pkgId));
        if (pkg && startDate) {
          const start = new Date(startDate);
          start.setDate(start.getDate() + parseInt(pkg.duration_day));
          newRows[index].end_dates = start.toISOString().split('T')[0];
          newRows[index].total_price = pkg.package_price;
        }
      }
    }
    setRows(newRows);
  };

  return (
   <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-md p-2 lg:p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white rounded-[2rem] lg:rounded-[2.5rem] p-5 lg:p-8 w-full max-w-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] lg:max-h-[90vh] border border-slate-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">
              <Database size={20}/>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                {editingItem ? `Edit ${table}` : `Tambah ${table}`}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Suit Palace Database Serpong</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24}/></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(rows); }} className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scroll pb-4">
          {rows.map((row, index) => {
            // Logika sembunyikan nama customer jika baris sebelumnya punya id_customer yang sama
            const isConnected = index > 0 && row.id_customer && row.id_customer === rows[index-1].id_customer;

            return (
              <div key={index} className={`p-6 rounded-[2rem] border transition-all relative ${isConnected ? 'bg-white border-dashed border-slate-300 -mt-2 pt-8 ml-8 border-l-4 border-l-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                
                {rows.length > 1 && (
                  <button type="button" onClick={() => removeRow(index)} className="absolute -right-2 -top-2 p-2 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 active:scale-90 transition-all z-10">
                    <Trash2 size={14}/>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {isOrderTable ? (
                    <>
                      {/* CUSTOMER SELECTION - Sembunyikan jika isConnected */}
                      {!isConnected ? (
                        <div className="col-span-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 mb-1.5 block ml-1 tracking-wider">Customer Name</label>
                          <div className="relative">
                            <User size={14} className="absolute left-4 top-3.5 text-slate-400" />
                            <select required value={row.id_customer || ''} onChange={(e) => handleInputChange(index, 'id_customer', e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-[13px] font-black text-slate-900 outline-none focus:border-slate-900 transition-all appearance-none shadow-sm">
                              <option value="">-- Pilih Customer --</option>
                              {db.customers.map(c => <option key={c.id_customer} value={c.id_customer}>{c.customer_name}</option>)}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="col-span-2 flex items-center gap-2 mb-2">
                           <div className="h-[2px] w-8 bg-amber-400"></div>
                           <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest italic">Pesanan tambahan untuk customer di atas</span>
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 mb-1.5 block ml-1 tracking-wider">Pilih Paket</label>
                        <select required value={row.id_package || ''} onChange={(e) => handleInputChange(index, 'id_package', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-[13px] font-black text-slate-900 outline-none focus:border-slate-900 shadow-sm">
                          <option value="">-- Paket --</option>
                          {db.packages.map(p => <option key={p.id_package} value={p.id_package}>{p.package_name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 mb-1.5 block ml-1 tracking-wider">Mulai Sewa</label>
                        <input type="date" required value={row.start_dates || ''} onChange={(e) => handleInputChange(index, 'start_dates', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-[13px] font-black text-slate-900 outline-none focus:border-slate-900 shadow-sm" />
                      </div>

                      {/* ITEM GRID */}
                      {!editingItem && (
                        <div className="col-span-2 grid grid-cols-3 gap-3 pt-2">
                          {['jas', 'kemeja', 'celana', 'dasi', 'changshan'].map(prod => (
                            <div key={prod}>
                              <label className="text-[9px] font-black uppercase text-slate-400 mb-1 block ml-1">{prod}</label>
                              <select value={row[`id_${prod}`] || ''} onChange={(e) => handleInputChange(index, `id_${prod}`, e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:border-slate-400">
                                <option value="">- {prod} -</option>
                                {db[prod]?.map(p => (
                                  <option key={p[`id_${prod}`]} value={p[`id_${prod}`]}>{p[`name_${prod}`] || p[`kode_${prod}`]} ({p[`size_${prod}`]})</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 mb-1.5 block ml-1 tracking-wider">Status</label>
                        <select value={row.status_rent || 'Booked'} onChange={(e) => handleInputChange(index, 'status_rent', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-[12px] font-black text-slate-900 outline-none focus:border-slate-900 shadow-sm">
                          <option value="Booked">Booked</option>
                          <option value="Diambil">Diambil</option>
                          <option value="Dikembalikan">Dikembalikan</option>
                          <option value="Cancel">Cancel</option>
                        </select>
                      </div>

                      <div className="pt-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 mb-1.5 block ml-1 tracking-wider">Actual Return</label>
                        <input type="date" value={row.actual_return_date || ''} onChange={(e) => handleInputChange(index, 'actual_return_date', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-[12px] font-black text-slate-900 outline-none focus:border-slate-900 shadow-sm" />
                      </div>

                      {!editingItem && row.id_customer && (
                        <div className="col-span-2 mt-4 flex justify-end">
                          <button type="button" onClick={() => duplicateForSameCustomer(index)} className="px-5 py-2.5 bg-amber-100 text-amber-800 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-amber-200 transition-all border border-amber-200 shadow-sm">
                            <UserPlus size={14}/> Tambah Item/Order Lagi ({db.customers.find(c => String(c.id_customer) === String(row.id_customer))?.customer_name})
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    // FORM MASTER DATA
                    Object.keys(db[table]?.[0] || {}).filter((_, i) => i !== 0).map((key) => (
                      <div key={key} className={key.includes('note') || key.includes('content') ? 'col-span-1 md:col-span-2' : ''}>
                      <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block ml-1">
                        {key.replace('_', ' ')}
                      </label>
                      <input 
                        required 
                        // Jika key adalah 'created_at' atau mengandung 'date', jadikan input kalender
                        type={
                          key.includes('price') || key.includes('stock') || key.includes('paid') || key.includes('pendapatan') || key.includes('denda') ? 'number' : 
                          (key.includes('date') || key === 'created_at') ? 'date' : 'text'
                        }
                        value={row[key] || ''} 
                        onChange={(e) => handleInputChange(index, key, e.target.value)} 
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-[13px] font-black text-slate-900 outline-none focus:border-slate-900 shadow-sm" 
                      />
                    </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {!editingItem && (
            <button type="button" onClick={addRow} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] mt-2">
              <Plus size={16}/> Input Data Baru Lainnya
            </button>
          )}
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 flex gap-4 bg-white">
          <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
          <button type="submit" onClick={(e) => { e.preventDefault(); onSave(rows); }} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
             Simpan Data
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FormModal;