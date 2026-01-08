import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Database, Plus, Trash2, User, Phone, CreditCard } from 'lucide-react';

const FormModal = ({ activeTab, editingItem, db, onClose, onSave }) => {
  const table = editingItem?.fromTable || activeTab;
  const isOrderTable = table === 'order_items';

  // State Header Customer (Hanya untuk Order Baru)
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: editingItem?.customer_name || '',
    customer_phone: editingItem?.customer_phone || '',
    bank_account: editingItem?.bank_account || ''
  });

  // State Rows (Berbagi untuk Order maupun Master)
  const [rows, setRows] = useState(() => {
    if (editingItem) return [editingItem];
    return [{}];
  });

  const addRow = () => setRows([...rows, {}]);
  const removeRow = (index) => rows.length > 1 && setRows(rows.filter((_, i) => i !== index));

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    if (isOrderTable && (field === 'id_package' || field === 'start_dates')) {
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
    setRows(newRows);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900">
            {editingItem ? `Edit Data ${table.replace('_', ' ')}` : isOrderTable ? 'Input Order Baru' : `Tambah ${table.replace('_', ' ')}`}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
        </div>

        <form className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">

          {isOrderTable && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Nama Customer</label>
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="text" placeholder="Ketik Nama..." value={customerInfo.customer_name} onChange={(e) => setCustomerInfo({ ...customerInfo, customer_name: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-900 rounded-2xl text-sm font-bold outline-none focus:border-black transition-all" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Nomor Telepon</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="text" placeholder="08..." value={customerInfo.customer_phone} onChange={(e) => setCustomerInfo({ ...customerInfo, customer_phone: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-900 rounded-2xl text-sm font-bold outline-none focus:border-black transition-all" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Rekening</label>
                <div className="relative">
                  <CreditCard size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="BCA - xxxxx" value={customerInfo.bank_account} onChange={(e) => setCustomerInfo({ ...customerInfo, bank_account: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-900 rounded-2xl text-sm font-bold outline-none focus:border-black transition-all" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                {isOrderTable ? 'Daftar Paket Pesanan' : 'Data Item'}
              </h4>
              {isOrderTable && !editingItem && (
                <button type="button" onClick={addRow} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[12px] font-black uppercase hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100">
                  <Plus size={14} /> Tambah Paket
                </button>
              )}
            </div>

            {rows.map((row, index) => (
              <div key={index} className={isOrderTable ? "p-6 rounded-[2rem] border-2 border-slate-100 bg-white relative" : "p-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50/30 relative"}>
                {rows.length > 1 && (
                  <button type="button" onClick={() => removeRow(index)} className="absolute -right-2 -top-2 p-2 bg-white text-rose-500 rounded-full shadow-md border border-slate-100 hover:bg-rose-50 transition-all">
                    <Trash2 size={16} />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {isOrderTable ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Pilih Paket</label>
                        <select required value={row.id_package || ''} onChange={(e) => handleInputChange(index, 'id_package', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-900 rounded-2xl text-sm font-bold focus:border-black">
                          <option value="">-- Pilih Paket --</option>
                          {db.packages.map(p => <option key={p.id_package} value={p.id_package}>{p.package_name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Tanggal Mulai</label>
                        <input type="date" value={row.start_dates || ''} onChange={(e) => handleInputChange(index, 'start_dates', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-900 rounded-2xl text-sm font-bold focus:border-black" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Tanggal Selesai (Auto)</label>
                        <input readOnly type="date" value={row.end_dates || ''} className="w-full px-4 py-3 bg-slate-100 border border-slate-900 rounded-2xl text-sm font-bold text-slate-400" />
                      </div>
                      {/* Grid Item Barang */}
                      <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                        {['jas', 'kemeja', 'celana', 'dasi', 'changshan'].map(prod => (
                          <div key={prod} className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1">{prod}</label>
                            <select value={row[`id_${prod}`] || ''} onChange={(e) => handleInputChange(index, `id_${prod}`, e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-900 rounded-xl text-[11px] font-bold focus:border-black">
                              <option value="">Kosong</option>
                              {db[prod]?.map(p => (
                                <option key={p[`id_${prod}`]} value={p[`id_${prod}`]}>{p[`name_${prod}`] || p[`kode_${prod}`]} ({p[`size_${prod}`]})</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                      {/* Description input */}
                      <div className="col-span-1 md:col-span-3 mt-2">
                        <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Deskripsi Order</label>
                        <textarea
                          value={row.description_rent || ''}
                          onChange={e => handleInputChange(index, 'description_rent', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-900 rounded-2xl text-sm font-bold min-h-[60px] focus:border-black"
                          placeholder="Catatan/deskripsi tambahan untuk order ini..."
                        />
                      </div>
                    </>
                  ) : (
                    Object.keys(db[table]?.[0] || {}).filter((_, i) => i !== 0).map((key) => (
                      <div key={key} className="space-y-1">
                        <label className="text-[12px] font-black uppercase text-slate-400 ml-1">{key.replace('_', ' ')}</label>
                        <input required type={key.includes('stock') ? 'number' : 'text'} value={row[key] || ''} onChange={(e) => handleInputChange(index, key, e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-900 rounded-2xl text-sm font-bold outline-none focus:border-black transition-all" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isOrderTable && !editingItem && (
            <button type="button" onClick={addRow} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all flex items-center justify-center gap-2 font-black text-[12px] uppercase tracking-widest">
              <Plus size={16} /> Input Data Baru Lainnya
            </button>
          )}
        </form>

        <div className="p-6 bg-white border-t border-slate-100 flex gap-4">
          <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase hover:bg-slate-200 transition-all">Cancel</button>
          <button type="button" onClick={() => onSave(isOrderTable ? rows.map(r => ({ ...r, ...customerInfo })) : rows)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">
            {isOrderTable ? 'Simpan Transaksi Order' : 'Simpan Data'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FormModal;