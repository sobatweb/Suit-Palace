import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Database, Plus, Trash2, User, Phone, CreditCard, Clock } from 'lucide-react';

const tableSchemas = {
  packages: ['package_name', 'package_price', 'duration_day', 'deposit', 'penalty_fee'],
  jas: ['name_jas', 'size_jas', 'color_jas', 'stock_jas', 'condition_jas'],
  kemeja: ['name_kemeja', 'size_kemeja', 'color_kemeja', 'stock_kemeja', 'condition_kemeja'],
  celana: ['name_celana', 'size_celana', 'color_celana', 'stock_celana', 'condition_celana'],
  changshan: ['name_changshan', 'size_changshan', 'color_changshan', 'stock_changshan', 'condition_changshan'],
  dasi: ['kode_dasi', 'color_dasi', 'stock_dasi', 'description_dasi'],
  vest: ['name_vest', 'size_vest', 'color_vest', 'stock_vest', 'condition_vest'],
  tuxedo: ['name_tuxedo', 'size_tuxedo', 'color_tuxedo', 'stock_tuxedo', 'condition_tuxedo'],
  customers: ['customer_name', 'customer_phone', 'bank_account', 'discount', 'penalty_fee'],
  notes: ['title_note', 'description_note'],
  history_orders: ['customer_name', 'package_name', 'omset_order', 'denda_paid', 'return_date', 'condition_return']
};

const FormModal = ({ activeTab, editingItem, db, onClose, onSave }) => {
  const table = editingItem?.fromTable || activeTab;
  const isOrderTable = table === 'order_items';

  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const [isNewCustomer, setIsNewCustomer] = useState(true);
  

  // State Header Customer
const [customerInfo, setCustomerInfo] = useState({
  // Ambil dari editingItem jika ada, jika tidak kosongkan
  id_customer: editingItem?.id_customer || null,
  customer_name: editingItem?.customer_name || editingItem?.display_customer || '',
  customer_phone: editingItem?.customer_phone || editingItem?.customer_full?.customer_phone || '',
  bank_account: editingItem?.bank_account || editingItem?.customer_full?.bank_account || '',
  discount: editingItem?.customer_full?.discount || 0
});

// State Rows (Berbagi untuk Order maupun Master)
const [rows, setRows] = useState(() => {
  if (editingItem) {
    // Buat salinan data agar tidak merubah data asli secara langsung
    const rowData = { ...editingItem };

    // Format data agar ramah input form
    Object.keys(rowData).forEach(key => {
      // 1. Hilangkan desimal pada semua angka (termasuk yang datang sebagai string dari DB)
      const isNumberField = key.includes('price') || key.includes('stock') || key.includes('paid') || key.includes('pendapatan') || key.includes('denda') || key.includes('fee') || key.includes('omset');
      if (isNumberField && rowData[key] !== null && rowData[key] !== undefined) {
        rowData[key] = Math.round(Number(rowData[key]));
      }
      // 2. Format tanggal (YYYY-MM-DD) agar muncul di input type="date"
      if (key.includes('date') && rowData[key] && typeof rowData[key] === 'string') {
        rowData[key] = rowData[key].split('T')[0];
      }
      // 3. Ubah ukuran (size) menjadi UPPERCASE saat load data edit
      if (key.includes('size') && rowData[key] && typeof rowData[key] === 'string') {
        rowData[key] = rowData[key].toUpperCase();
      }
    });
    return [rowData];
  }
  return [{}];
});

  const addRow = () => setRows([...rows, {}]);
  const removeRow = (index) => rows.length > 1 && setRows(rows.filter((_, i) => i !== index));

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];

    // Otomatis ubah input ukuran (size) menjadi UPPERCASE saat mengetik
    let finalValue = value;
    if (typeof value === 'string' && field.includes('size')) {
      finalValue = value.toUpperCase();
    }
    newRows[index][field] = finalValue;

    if (isOrderTable && (field === 'id_package' || field === 'start_dates')) {
      const pkgId = field === 'id_package' ? value : newRows[index].id_package;
      const startDate = field === 'start_dates' ? value : newRows[index].start_dates;
      const pkg = db.packages.find(p => String(p.id_package) === String(pkgId));

      if (pkg && startDate) {
        const start = new Date(startDate);
        start.setDate(start.getDate() + (parseInt(pkg.duration_day) - 1));
        newRows[index].end_dates = start.toISOString().split('T')[0];
        newRows[index].total_price = Math.round(Number(pkg.package_price));

          if (!editingItem) {
          newRows[index].total_price = Math.round(Number(pkg.package_price));
        }
      }
    }
    setRows(newRows);
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`${table === 'notes' ? 'bg-[#FFFDF0]' : 'bg-white'} rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border border-slate-200`}>

        {/* HEADER */}
        <div className={`flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 ${table === 'notes' ? 'bg-[#FFFDF0]' : 'bg-white'} z-10`}>
          <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900">
            {table === 'notes' ? (editingItem ? 'Edit Note' : 'Write New Note') : (editingItem ? `Edit Data ${table.replace('_', ' ')}` : isOrderTable ? 'Input Order Baru' : `Tambah ${table.replace('_', ' ')}`)}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
        </div>

        <form className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">

          {isOrderTable && (
            <div className={`grid grid-cols-1 ${editingItem ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 pb-6 border-b border-slate-100`}>
              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[12px] font-black uppercase text-slate-400">Nama Customer</label>
                  {!editingItem && (
                    <button 
                      type="button"
                      onClick={() => {
                        setIsNewCustomer(!isNewCustomer);
                        setCustomerInfo({ id_customer: null, customer_name: '', customer_phone: '', bank_account: '' });
                      }}
                      className="text-[9px] font-black uppercase text-blue-600 hover:underline"
                    >
                      {isNewCustomer ? 'Pilih Pelanggan Lama' : 'Input Pelanggan Baru'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  {isNewCustomer || editingItem ? (
                    <input 
                      readOnly={!!editingItem}
                      required 
                      type="text" 
                      placeholder="Ketik Nama..." 
                      value={customerInfo.customer_name} 
                      onChange={(e) => setCustomerInfo({ ...customerInfo, customer_name: e.target.value })} 
                      className={`w-full pl-11 pr-4 py-3 border border-slate-900 rounded-2xl text-sm font-bold outline-none focus:border-black transition-all ${editingItem ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50'}`} 
                    />
                  ) : (
                    <select
                      required
                      value={customerInfo.id_customer || ''}
                      onChange={(e) => {
                        const cust = db.customers.find(c => String(c.id_customer) === String(e.target.value));
                        if (cust) {
                          setCustomerInfo({
                            id_customer: cust.id_customer,
                            customer_name: cust.customer_name,
                            customer_phone: cust.customer_phone,
                            bank_account: cust.bank_account
                          });
                        }
                      }}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-900 rounded-2xl text-sm font-bold outline-none focus:border-black transition-all"
                    >
                      <option value="">-- Pilih Pelanggan --</option>
                      {db.customers.map(c => (
                        <option key={c.id_customer} value={c.id_customer}>{c.customer_name} ({c.customer_phone})</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Nomor Telepon</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    readOnly={!isNewCustomer && !editingItem}
                    required 
                    type="text" 
                    placeholder="08..." 
                    value={customerInfo.customer_phone} 
                    onChange={(e) => setCustomerInfo({ ...customerInfo, customer_phone: e.target.value })} 
                    className={`w-full pl-11 pr-4 py-3 border border-slate-900 rounded-2xl text-sm font-bold outline-none focus:border-black transition-all ${(!isNewCustomer && !editingItem) ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50'}`} 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Rekening</label>
                <div className="relative">
                  <CreditCard size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    readOnly={!isNewCustomer && !editingItem}
                    type="text" 
                    placeholder="BCA - xxxxx" 
                    value={customerInfo.bank_account} 
                    onChange={(e) => setCustomerInfo({ ...customerInfo, bank_account: e.target.value })} 
                    className={`w-full pl-11 pr-4 py-3 border border-slate-900 rounded-2xl text-sm font-bold outline-none focus:border-black transition-all ${(!isNewCustomer && !editingItem) ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50'}`} 
                  />
                </div>
              </div>
              {editingItem && (
                <div className="space-y-1">
                  <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Status Rent</label>
                  <select 
                    value={rows[0].status_rent || 'Booked'} 
                    onChange={(e) => handleInputChange(0, 'status_rent', e.target.value)}
                    className="w-full px-4 py-3 bg-amber-50 border border-slate-900 rounded-2xl text-sm font-bold focus:border-black"
                  >
                    <option value="Booked">Booked</option>
                    <option value="Diambil">Diambil</option>
                    <option value="Dikembalikan">Dikembalikan</option>
                    <option value="Cancel">Cancel</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div className={table === 'notes' ? "hidden" : "space-y-6"}>
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
              <div key={index} className={isOrderTable ? "p-6 rounded-2rem border-2 border-slate-100 bg-white relative" : "p-6 rounded-2rem border-2 border-slate-50 bg-slate-50/30 relative"}>
                {rows.length > 1 && (
                  <button type="button" onClick={() => removeRow(index)} className="absolute -right-2 -top-2 p-2 bg-white text-rose-500 rounded-full shadow-md border border-slate-100 hover:bg-rose-50 transition-all">
                    <Trash2 size={16} />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {isOrderTable ? (
                    <>
                      {!editingItem && (
                        <div className="space-y-1">
                          <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Pilih Paket</label>
                          <select required value={row.id_package || ''} onChange={(e) => handleInputChange(index, 'id_package', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-900 rounded-2xl text-sm font-bold focus:border-black">
                            <option value="">-- Pilih Paket --</option>
                            {db.packages.map(p => <option key={p.id_package} value={p.id_package}>{p.package_name}</option>)}
                          </select>
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Tanggal Mulai</label>
                        <input type="date" min={today} value={row.start_dates || ''} onChange={(e) => handleInputChange(index, 'start_dates', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-900 rounded-2xl text-sm font-bold focus:border-black" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Tanggal Selesai (Auto)</label>
                        <input readOnly type="date" value={row.end_dates || ''} className="w-full px-4 py-3 bg-slate-100 border border-slate-900 rounded-2xl text-sm font-bold text-slate-400" />
                      </div>
                      {editingItem && (
                        <div className="space-y-1">
                          <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Total Dibayar (Amount Paid)</label>
                          <input 
                            type="number" 
                            step="1"
                            value={row.amount_paid !== undefined ? Math.round(Number(row.amount_paid)) : 0} 
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : Math.round(Number(e.target.value));
                              handleInputChange(index, `amount_paid`, val);
                            }} 
                            className="w-full px-4 py-3 bg-emerald-50 border border-slate-900 rounded-2xl text-sm font-bold focus:border-black" 
                          />
                        </div>
                      )}
                      {/* Grid Item Barang */}
                      {!editingItem && (
                        <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
                          {['jas', 'kemeja', 'celana', 'dasi', 'changshan', 'vest', 'tuxedo'].map(prod => (
                            <div key={prod} className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">{prod}</label>
                              <select value={row[`id_${prod}`] || ''} onChange={(e) => handleInputChange(index, `id_${prod}`, e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-900 rounded-xl text-[11px] font-bold focus:border-black">
                                <option value="">Kosong</option>
                                {db[prod]?.slice().sort((a, b) => {
                                  const nameA = (a[`name_${prod}`] || a[`kode_${prod}`] || "").toString();
                                  const nameB = (b[`name_${prod}`] || b[`kode_${prod}`] || "").toString();
                                  return nameA.localeCompare(nameB);
                                }).map(p => (
                                  <option key={p[`id_${prod}`]} value={p[`id_${prod}`]}>
                                    {p[`name_${prod}`] || p[`kode_${prod}`]} 
                                    {p[`size_${prod}`] ? ` (${p[`size_${prod}`].toString().toUpperCase()})` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Description input */}
                      <div className="col-span-1 md:col-span-3 mt-2">
                        <label className="text-[12px] font-black uppercase text-slate-400 ml-1">Deskripsi Order</label>
                        <textarea
                          value={row.condition_return || row.description || ''}
                          onChange={e => handleInputChange(index, 'condition_return', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-900 rounded-2xl text-sm font-bold min-h-60px focus:border-black"
                          placeholder="Catatan/deskripsi tambahan untuk order ini..."
                        />
                      </div>
                    </>
                  ) : (
                    (tableSchemas[table] || Object.keys(db[table]?.[0] || {}).filter((key, i) => i !== 0 && key !== 'actual_return_date'))
                      .map((key) => {
                        // 1. Tentukan Tipe Input
                        const isNumber = key.includes('price') || key.includes('stock') || key.includes('paid') || key.includes('pendapatan') || key.includes('denda') || key.includes('fee') || key.includes('omset');
                        const isDate = key.includes('date') || key === 'created_at';
                        const inputType = isNumber ? 'number' : (isDate ? 'date' : 'text');

                        // 2. Ambil & Bersihkan Nilai (Pre-fill logic)
                        let displayValue = row[key] || '';
                        
                        // Jika tanggal, potong agar formatnya YYYY-MM-DD (Syarat input type="date")
                        if (isDate && typeof displayValue === 'string' && displayValue.includes('T')) {
                          displayValue = displayValue.split('T')[0];
                        }
                        
                        // Jika angka, pastikan bulat (hilangkan .00)
                        if (isNumber && displayValue !== '') {
                          displayValue = Math.round(Number(displayValue));
                        }

                        // Jika ukuran, pastikan UPPERCASE untuk tampilan input
                        if (key.includes('size') && displayValue) {
                          displayValue = displayValue.toString().toUpperCase();
                        }

                        let displayName = key.replace('_', ' ');
                        if (table === 'history_orders') {
                          if (key === 'return_date') displayName = 'Finish Order';
                          if (key === 'condition_return') displayName = 'Description Order';
                        }

                        return (
                          <div key={key} className={key.includes('note') || key.includes('content') ? 'col-span-1 md:col-span-2' : ''}>
                            <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block ml-1">
                              {displayName}
                            </label>
                            <input 
                              required 
                              type={inputType}
                              step={isNumber ? "1" : undefined}
                              min={isDate ? today : undefined}
                              value={displayValue} 
                              onChange={(e) => {
                                let val = e.target.value;
                                if (isNumber) val = val === '' ? '' : Math.round(Number(val));
                                handleInputChange(index, key, val);
                              }} 
                              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-[13px] font-black text-slate-900 outline-none focus:border-slate-900 shadow-sm" 
                            />
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            ))}
          </div>

          {table === 'notes' && (
            <div className="space-y-8 py-4">
              <div className="relative">
                <div className="absolute -top-2 right-0 flex items-center gap-2 text-amber-600/40">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {editingItem ? new Date(editingItem.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[12px] font-black uppercase text-amber-600/50 ml-1">Note Title</label>
                    <input 
                      required
                      type="text"
                      placeholder="Enter title..."
                      value={rows[0].title_note || ''}
                      onChange={(e) => handleInputChange(0, 'title_note', e.target.value)}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-amber-100 text-3xl font-black text-slate-800 outline-none focus:border-amber-400 transition-all placeholder:text-slate-300 tracking-tighter"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-black uppercase text-amber-600/50 ml-1">Content</label>
                    <textarea 
                      required
                      placeholder="Write your thoughts here..."
                      value={rows[0].description_note || ''}
                      onChange={(e) => handleInputChange(0, 'description_note', e.target.value)}
                      className="w-full px-8 py-10 bg-white/60 border-2 border-amber-50 rounded-4xl text-lg font-medium text-slate-700 outline-none focus:border-amber-200 transition-all min-h-100 shadow-inner italic font-serif leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isOrderTable && !editingItem && table !== 'notes' && (
            <button type="button" onClick={addRow} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2rem text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all flex items-center justify-center gap-2 font-black text-[12px] uppercase tracking-widest">
              <Plus size={16} /> Input Data Baru Lainnya
            </button>
          )}
        </form>

        <div className={`p-6 ${table === 'notes' ? 'bg-[#FFFDF0]' : 'bg-white'} border-t border-slate-100 flex gap-4`}>
          <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase hover:bg-slate-200 transition-all">Cancel</button>
          <button type="button" onClick={() => onSave(isOrderTable ? rows.map(r => ({ ...r, ...customerInfo })) : rows)} className={`flex-1 py-4 ${table === 'notes' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-black'} text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl transition-all`}>
            {table === 'notes' ? 'Save Note' : (isOrderTable ? 'Simpan Transaksi Order' : 'Simpan Data')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FormModal;