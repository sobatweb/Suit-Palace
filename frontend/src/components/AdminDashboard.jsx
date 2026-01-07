// ...existing code...
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Shirt, Scissors, Package, ShoppingCart,
  Plus, Trash2, Edit, Calendar as CalendarIcon, Info,
  LogOut, Search, Database, Phone, CreditCard, User,
  AlertCircle, Clock, Tag, CheckCircle2, X, Banknote, History, Save
} from 'lucide-react';

const AdminDashboard = ({ onBack }) => {
  // State for custom calendar marks (pins)
  // Format: [{ day: 6, description: 'Acara penting', color: '#e11d48' }]
  const [calendarMarks, setCalendarMarks] = useState([]);
  // State for mark modal
  const [markModal, setMarkModal] = useState({ show: false, day: null, markIdx: null });
  // Temp state for editing/creating a mark
  const [markDraft, setMarkDraft] = useState({ description: '', color: '#e11d48' });

  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(6);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false, action: null, orderId: null });

  // State Baru untuk menangani Edit Data
  const [editItem, setEditItem] = useState(null);

  // Simulasi Tanggal Hari Ini: 6 Januari 2026
  const TODAY_STR = '2026-01-06';
  const today = new Date(TODAY_STR);

  // --- HELPER: FORMAT TANGGAL ---
  const formatIndoDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const [db, setDb] = useState({
    admin: [
      { id: 1, user: 'admin_master', role: 'Owner' },
      { id: 2, user: 'staff_tng_01', role: 'Admin' }
    ],
    jas: [
      { id: 1, nama: 'Slim Fit Charcoal', size: 'L', warna: 'Abu Tua', stok: 4, kondisi: 'Baik' },
      { id: 2, nama: 'Classic Tuxedo', size: 'M', warna: 'Hitam', stok: 2, kondisi: 'Baru' },
      { id: 3, nama: 'Navy Modern', size: 'XL', warna: 'Biru Dongker', stok: 3, kondisi: 'Baik' },
      { id: 4, nama: 'Grey Executive', size: 'L', warna: 'Abu Muda', stok: 1, kondisi: 'Cukup' }
    ],
    kemeja: [
      { id: 1, nama: 'White Poplin', size: 'L', warna: 'Putih', stok: 10, kondisi: 'Baru' },
      { id: 2, nama: 'Oxford Blue', size: 'M', warna: 'Biru', stok: 5, kondisi: 'Baik' },
      { id: 3, nama: 'Black Slim', size: 'L', warna: 'Hitam', stok: 3, kondisi: 'Baik' },
      { id: 4, nama: 'Grey Formal', size: 'XL', warna: 'Abu', stok: 2, kondisi: 'Cukup' }
    ],
    celana: [
      { id: 1, nama: 'Formal Black', size: 'L', warna: 'Hitam', stok: 8, kondisi: 'Baik' },
      { id: 2, nama: 'Slim Grey', size: 'M', warna: 'Abu', stok: 4, kondisi: 'Baru' },
      { id: 3, nama: 'Navy Classic', size: 'L', warna: 'Biru Dongker', stok: 2, kondisi: 'Baik' },
      { id: 4, nama: 'Chino Cream', size: 'XL', warna: 'Cream', stok: 1, kondisi: 'Cukup' }
    ],
    changsan: [
      { id: 1, nama: 'Red Dragon Gold', size: 'XL', warna: 'Merah', stok: 2, kondisi: 'Sangat Baik' },
      { id: 2, nama: 'Black Phoenix', size: 'L', warna: 'Hitam', stok: 1, kondisi: 'Baik' },
      { id: 3, nama: 'White Lotus', size: 'M', warna: 'Putih', stok: 1, kondisi: 'Baru' }
    ],
    dasi: [
      { id: 1, kode: 'D-001', deskripsi: 'Silk Navy Blue' },
      { id: 2, kode: 'D-002', deskripsi: 'Polos Hitam Slim' },
      { id: 3, kode: 'D-003', deskripsi: 'Motif Merah Maroon' },
      { id: 4, kode: 'D-004', deskripsi: 'Polkadot Abu Silver' }
    ],
    paket: [
      { id: 1, nama_paket: 'Wedding Premium', jas_id: 1, kemeja_id: 1, celana_id: 1, durasi: 3, harga: 750000 }
    ],
    orders: [
      {
        id: 1,
        nama_penyewa: 'Budi Santoso',
        no_telp: '0812345678',
        no_rekening: 'BCA 12345678',
        paket_id: 1,
        tgl_mulai: '2026-01-03',
        tgl_akhir: '2026-01-05',
        deskripsi: 'Jas bahu diperlebar 2cm, fitting ulang tanggal 2 sore.',
        deposit: 100000,
        harga_paket: 750000,
        baru_dibayar: 350000,
        status: 'diambil', // booked, diambil, kembali, selesai, batal
        status_pekerjaan: 'belum selesai', // belum selesai, sudah selesai
        color: 'bg-indigo-500',
        denda: 0
      },
      {
        id: 2,
        nama_penyewa: 'Andi Wijaya',
        no_telp: '0877889900',
        no_rekening: 'Mandiri 998877',
        paket_id: 1,
        tgl_mulai: '2026-01-09',
        tgl_akhir: '2026-01-11',
        deskripsi: 'Celana potong 3cm.',
        deposit: 50000,
        harga_paket: 350000,
        baru_dibayar: 400000,
        status: 'booked',
        status_pekerjaan: 'belum selesai',
        color: 'bg-emerald-500',
        denda: 0
      },
      {
        id: 3,
        nama_penyewa: 'Titus',
        no_telp: '0877889900',
        no_rekening: 'Mandiri 998877',
        paket_id: 1,
        tgl_mulai: '2026-01-10',
        tgl_akhir: '2026-01-12',
        deskripsi: 'Celana potong 3cm.',
        deposit: 50000,
        harga_paket: 350000,
        baru_dibayar: 400000,
        status: 'booked',
        status_pekerjaan: 'belum selesai',
        color: 'bg-emerald-500',
        denda: 0
      },
    ],
    history: []
  });

  // --- LOGIKA PERHITUNGAN & VALIDASI (KODE ASLI DIJAGA) ---
  const getOrderPerformance = (order) => {
    const startDate = new Date(order.tgl_mulai);
    const endDate = new Date(order.tgl_akhir);
    const isOverdue = today > endDate && order.status === 'diambil';
    const diffTime = startDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isPrep = order.status === 'booked' && diffDays <= 3 && diffDays >= 0;
    return { isOverdue, isPrep };
  };

  const checkAvailability = (itemId, category, targetDate) => {
    const dateStr = `2026-01-${targetDate < 10 ? '0' + targetDate : targetDate}`;
    const item = db[category].find(i => i.id === itemId);
    if (!item) return 0;
    const rented = db.orders.filter(o => {
      const isWithin = dateStr >= o.tgl_mulai && dateStr <= o.tgl_akhir;
      const usesItem = o.paket_id && db.paket.find(p => p.id === o.paket_id)[`${category}_id`] === itemId;
      return isWithin && usesItem && (o.status !== 'Cancel' && o.status !== 'dikembalikan');
    }).length;
    return item.stok - rented;
  };

  // --- UI COMPONENTS ---
  const renderRibbons = (day) => {
    const dateStr = `2026-01-${day < 10 ? '0' + day : day}`;
    return db.orders.map((order) => {
      const isActive = dateStr >= order.tgl_mulai && dateStr <= order.tgl_akhir;
      if (!isActive) return <div key={order.id} className="h-2 w-full mb-0.5 opacity-0" />;
      const isStart = order.tgl_mulai === dateStr;
      const isEnd = order.tgl_akhir === dateStr;
      const { isOverdue, isPrep } = getOrderPerformance(order);
      return (
        <div key={order.id} className="h-2 w-full flex items-center mb-0.5">
          <div className={`h-full w-full transition-all
            ${isOverdue ? 'bg-rose-600' : isPrep ? 'bg-amber-400' : order.color}
            ${isStart ? 'rounded-l-full ml-1' : ''} ${isEnd ? 'rounded-r-full mr-1' : ''}`}
          />
        </div>
      );
    });
  };

  const OrderCardDetail = ({ order }) => {
    // Logika Perhitungan Baru
    const totalTagihan = order.harga_paket + order.deposit + (order.denda || 0);
    const sisaBayar = totalTagihan - order.baru_dibayar;
    const { isOverdue, isPrep } = getOrderPerformance(order);
    // State lokal untuk input denda
    const [inputDenda, setInputDenda] = useState(order.denda || 0);
    // Sync jika order berubah
    React.useEffect(() => {
      setInputDenda(order.denda || 0);
    }, [order.denda, order.id]);

    const handleDendaChange = (e) => {
      setInputDenda(e.target.value);
    };

    const handleDendaKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (window.confirm('Simpan perubahan denda keterlambatan untuk order ini?')) {
          setDb(prev => ({
            ...prev,
            orders: prev.orders.map(o => o.id === order.id ? { ...o, denda: Number(inputDenda) } : o)
          }));
        } else {
          setInputDenda(order.denda || 0);
        }
      }
    };
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className={`bg-[#1A120B] text-white p-6 rounded-2rem shadow-2xl relative overflow-hidden border-l-4 ${isOverdue ? 'border-rose-500' : isPrep ? 'border-amber-400' : 'border-[#8D775F]'}`}>

        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl font-black uppercase italic leading-none">{order.nama_penyewa}</h4>
            <p className="text-[10px] font-bold text-gray-500 mt-1 flex items-center gap-2"><Phone size={12} /> {order.no_telp}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${isOverdue ? 'bg-rose-500 animate-pulse' : 'bg-[#8D775F]'}`}>{order.status}</span>
            <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-md ${order.status_pekerjaan === 'sudah selesai' ? 'bg-emerald-500' : 'bg-amber-500'}`}>{order.status_pekerjaan}</span>
          </div>
        </div>

        <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-[8px] text-gray-500 uppercase font-black">Harga Paket</p><p className="text-xs font-bold">Rp {order.harga_paket.toLocaleString()}</p></div>
            <div><p className="text-[8px] text-gray-500 uppercase font-black">Deposit</p><p className="text-xs font-bold text-[#8D775F]">Rp {order.deposit.toLocaleString()}</p></div>
          </div>
          {isOverdue && (
            <div className="pt-3 border-t border-white/5">
              <div className="flex justify-between mb-1 items-center">
                <span className="text-[9px] text-rose-400 uppercase font-bold">Denda Keterlambatan</span>
                <input type="number" min={0} value={inputDenda} onChange={handleDendaChange} onKeyDown={handleDendaKeyDown} className="w-28 p-1 rounded bg-white/10 text-xs text-rose-400 font-bold border border-rose-400" />
              </div>
              <div className="text-[9px] text-gray-400 italic mt-1">* Denda dapat diubah oleh staf jika ada charge keterlambatan</div>
            </div>
          )}
          <div className="pt-3 border-t border-white/5">
            <div className="flex justify-between mb-1"><span className="text-[9px] text-gray-400 uppercase font-bold">Total (Paket + Depo{isOverdue ? ' + Denda' : ''})</span><span className="text-[10px] font-black text-white">Rp {totalTagihan.toLocaleString()}</span></div>
            <div className="flex justify-between mb-1"><span className="text-[9px] text-gray-400 uppercase font-bold">Baru Dibayar</span><span className="text-[10px] font-black text-emerald-400">Rp {order.baru_dibayar.toLocaleString()}</span></div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className={`text-[9px] uppercase font-black italic ${sisaBayar > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>Sisa Pembayaran</span>
              <span className={`text-sm font-black ${sisaBayar > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>Rp {sisaBayar.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-3 bg-white/5 rounded-xl text-[9px] text-gray-300 italic font-serif leading-relaxed border border-white/5">
            "{order.deskripsi}"
          </div>
          <div className="flex items-center gap-3 text-[9px] text-gray-400 font-bold uppercase tracking-widest"><CreditCard size={14} /> {order.no_rekening}</div>
          {/* Format Tanggal Diubah di Sini */}
          <div className="flex items-center gap-3 text-[9px] text-gray-400 font-bold uppercase tracking-widest"><Clock size={14} /> {formatIndoDate(order.tgl_mulai)} — {formatIndoDate(order.tgl_akhir)}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setEditItem({ type: 'orders', data: order })} className="py-3 bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2"><Edit size={12} /> Edit Info</button>
          <button onClick={() => setConfirmModal({ show: true, action: 'dikembalikan', orderId: order.id })} className="py-3 bg-emerald-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">SELESAI</button>
        </div>
      </motion.div>
    );
  };

  // --- HANDLER UPDATE ---
  const handleUpdateStatus = (id, newStatus) => {
    setDb(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === id ? { ...o, status: newStatus, status_pekerjaan: newStatus === 'dikembalikan' ? 'sudah selesai' : o.status_pekerjaan } : o)
    }));
    setConfirmModal({ show: false, action: null, orderId: null });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedFields = Object.fromEntries(formData.entries());

    // Konversi angka agar tetap tipe number
    const numericFields = ['harga', 'deposit', 'baru_dibayar', 'harga_paket', 'durasi'];
    numericFields.forEach(field => {
      if (updatedFields[field]) updatedFields[field] = Number(updatedFields[field]);
    });

    setDb(prev => ({
      ...prev,
      [editItem.type]: prev[editItem.type].map(item => item.id === editItem.data.id ? { ...item, ...updatedFields } : item)
    }));
    setEditItem(null);
  };

  const selectedDayOrders = useMemo(() => {
    const dateStr = `2026-01-${selectedDate < 10 ? '0' + selectedDate : selectedDate}`;
    return db.orders.filter(o => dateStr >= o.tgl_mulai && dateStr <= o.tgl_akhir);
  }, [selectedDate, db.orders]);

  return (
    <div className="flex min-h-screen bg-[#F0F2F5] text-[#1A120B] font-sans overflow-x-hidden">

      {/* SIDEBAR (KODE ASLI) */}
      <aside className={`fixed inset-y-0 left-0 z-90 w-64 bg-[#1A120B] text-white p-6 transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Suit<span className="text-[#8D775F]">Palace</span></h1>
          <p className="text-[8px] font-bold text-gray-500 mt-2 tracking-widest uppercase opacity-50">Staff Panel</p>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          {['calendar', 'paket', 'jas', 'kemeja', 'celana', 'changsan', 'dasi', 'orders', 'history'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === tab ? 'bg-[#8D775F]' : 'text-gray-500 hover:bg-white/5'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">{tab}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 transition-all">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{activeTab}<span className="text-[#8D775F]">_Module</span></h2>
            {/* Format Tanggal Hari Ini */}
            <p className="text-[9px] font-bold text-gray-400 uppercase mt-2 tracking-[0.2em]">Today: {formatIndoDate(TODAY_STR)}</p>
          </div>
        </header>

        {activeTab === 'calendar' ? (

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

            {/* KALENDER PITA (KODE ASLI) */}
            <div className="xl:col-span-8 bg-white p-6 rounded-[2.5rem] shadow-xl border border-black/5 overflow-hidden">
              {/* ... (Isi kalender tetap sama seperti kode Anda) ... */}
              <div className="grid grid-cols-7 rounded-2xl overflow-hidden shadow-sm border-2 border-[#C7A07A] bg-white">
                {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map(d => (
                  <div key={d} className="bg-gray-50 text-center text-[12px] font-extrabold text-[#8D775F] uppercase py-3">{d}</div>
                ))}
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isToday = day === 6;
                  const isSelected = selectedDate === day;
                  // Find marks for this day
                  const marks = calendarMarks.filter(m => m.day === day);
                  return (
                    <div key={day} className={`min-h-90px bg-white transition-all cursor-pointer relative flex flex-col items-center pt-2 ${isSelected ? 'bg-[#8D775F]/10' : ''}`}
                      onClick={() => setSelectedDate(day)}>
                      <span className={`text-[16px] font-extrabold mb-2 transition-all ${isToday ? 'bg-[#8D775F] text-white px-2 rounded' : isSelected ? 'text-[#1A120B]' : 'text-gray-500'} relative drop-shadow`}
                        style={{letterSpacing: '0.03em'}}>
                        {day}
                        {/* Render pins/marks as colored dots on the number, with edit/delete */}
                        {marks.length > 0 && (
                          <span className="absolute -top-2 -right-3 flex flex-col items-end">
                            {marks.map((mark, idx) => (
                              <span key={idx} title={mark.description} className="w-4 h-4 rounded-full border-2 border-white mb-1 shadow cursor-pointer group"
                                style={{ background: mark.color, marginTop: idx > 0 ? 4 : 0 }}
                                onClick={e => { e.stopPropagation(); setMarkModal({ show: true, day, markIdx: idx }); setMarkDraft({ description: mark.description, color: mark.color }); }}
                              />
                            ))}
                          </span>
                        )}
                      </span>
                      <div className="w-full px-0 space-y-0">
                        {renderRibbons(day)}
                      </div>
                    </div>
                  );
                })}
                    {/* MODAL UNTUK ADD/EDIT MARK */}
                    <AnimatePresence>
                      {markModal.show && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl">
                            <div className="bg-[#1A120B] p-4 text-white flex justify-between items-center">
                              <h3 className="font-black uppercase italic tracking-tighter text-xs">{markModal.markIdx !== null ? 'Edit Mark' : 'Tambah Mark'} Hari {markModal.day}</h3>
                              <button onClick={() => setMarkModal({ show: false, day: null, markIdx: null })} className="text-white/50 hover:text-white"><X size={18}/></button>
                            </div>
                            <form onSubmit={e => {
                              e.preventDefault();
                              setCalendarMarks(prev => {
                                const newMark = { day: markModal.day, description: markDraft.description, color: markDraft.color };
                                if (markModal.markIdx !== null) {
                                  // Edit
                                  let found = 0;
                                  return prev.map((m) => {
                                    if (m.day === markModal.day) {
                                      if (found === markModal.markIdx) { found++; return newMark; }
                                      found++; return m;
                                    }
                                    return m;
                                  });
                                } else {
                                  // Add
                                  return [...prev, newMark];
                                }
                              });
                              setMarkModal({ show: false, day: null, markIdx: null });
                            }} className="p-6 space-y-4">
                              <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase">Deskripsi</label>
                                <input required value={markDraft.description} onChange={e => setMarkDraft(d => ({ ...d, description: e.target.value }))} className="w-full mt-1 p-2 bg-gray-50 border-none rounded-xl text-xs font-bold" />
                              </div>
                              <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase">Warna Pin</label>
                                <input type="color" value={markDraft.color} onChange={e => setMarkDraft(d => ({ ...d, color: e.target.value }))} className="w-8 h-8 p-0 border-none rounded-full" />
                              </div>
                              <div className="flex gap-2">
                                <button type="submit" className="flex-1 py-2 bg-[#1A120B] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#8D775F] transition-all">Simpan</button>
                                {markModal.markIdx !== null && (
                                  <button type="button" className="flex-1 py-2 bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all"
                                    onClick={() => {
                                      setCalendarMarks(prev => {
                                        let found = 0;
                                        return prev.filter((m) => {
                                          if (m.day === markModal.day) {
                                            if (found === markModal.markIdx) { found++; return false; }
                                            found++; return true;
                                          }
                                          return true;
                                        });
                                      });
                                      setMarkModal({ show: false, day: null, markIdx: null });
                                    }}
                                  >Hapus</button>
                                )}
                              </div>
                            </form>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
              </div>

              {/* SHOW MARK DESCRIPTIONS FOR SELECTED DAY */}
              {calendarMarks.filter(m => m.day === selectedDate).length > 0 && (
                <div className="mb-2 mt-4">
                  <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Mark pada hari {selectedDate}:</div>
                  <div className="flex flex-wrap gap-2">
                    {calendarMarks.filter(m => m.day === selectedDate).map((mark, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold" style={{ background: mark.color }}>
                        {mark.description}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* LEGEND FOR DOT COLORS */}
              <div className="flex flex-wrap gap-4 items-center mb-2 text-[10px]">
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-rose-600 border border-white" /> <span>Overdue</span></span>
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-amber-400 border border-white" /> <span>Persiapan (Booked, 3 hari lagi)</span></span>
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 border border-white" /> <span>Booked</span></span>
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-blue-500 border border-white" /> <span>Selesai</span></span>
              </div>
              {/* ADD MARK BUTTON BELOW LEGEND */}
              {selectedDate && (
                <button
                  className="mt-2 mb-4 px-4 py-2 bg-[#8D775F] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1A120B] transition-all"
                  onClick={() => { setMarkModal({ show: true, day: selectedDate, markIdx: null }); setMarkDraft({ description: '', color: '#e11d48' }); }}
                >
                  Tambahkan Mark
                </button>
              )}
            </div>
            <div className="xl:col-span-4 space-y-4">
              <div className="bg-[#1A120B] p-5 rounded-2rem text-white shadow-xl relative overflow-hidden">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-[#8D775F] mb-4">Stock Check: {selectedDate} Jan</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] border-b border-white/5 pb-2"><span>Jas Charcoal (L)</span><span className="font-black">{checkAvailability(1, 'jas', selectedDate)} Ready</span></div>
                  <div className="flex justify-between text-[10px] border-b border-white/5 pb-2"><span>Changsan Red (XL)</span><span className="font-black">{checkAvailability(1, 'changsan', selectedDate)} Ready</span></div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {selectedDayOrders.length > 0 ? (
                  selectedDayOrders.map(o => <OrderCardDetail key={o.id} order={o} />)
                ) : (
                  <div className="bg-white p-12 rounded-2rem border border-dashed border-gray-200 text-center flex flex-col items-center justify-center min-h-300px">
                    <CalendarIcon size={32} className="text-gray-100 mb-2" />
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Selection</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : activeTab === 'orders' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {db.orders.map(o => <OrderCardDetail key={o.id} order={o} />)}
          </div>
        ) : (
          /* TABEL MODUL INVENTORY / ADMIN / PAKET */
          <div className="bg-white rounded-2rem shadow-xl border border-black/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                    <th className="p-6">ID</th>

                    {/* Modul Paket (Baru) */}
                    {activeTab === 'paket' && (
                      <>
                        <th className="p-6">Nama Paket</th>
                        <th className="p-6">Isi (Jas/Kem/Cel)</th>
                        <th className="p-6">Durasi</th>
                        <th className="p-6">Harga Paket</th>
                      </>
                    )}

                    {['jas', 'kemeja', 'celana', 'changsan'].includes(activeTab) && (
                      <>
                        <th className="p-6">Nama Barang</th>
                        <th className="p-6">Size</th>
                        <th className="p-6">Warna</th>
                        <th className="p-6">Stok</th>
                        <th className="p-6">Kondisi</th>
                      </>
                    )}
                    {activeTab === 'dasi' && (
                      <>
                        <th className="p-6">Kode</th>
                        <th className="p-6">Deskripsi</th>
                      </>
                    )}
                    <th className="p-6 text-right">Aksi</th>
                  </tr>
                </thead>

                <tbody className="text-[11px] font-bold uppercase tracking-tight">
                  {db[activeTab]?.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      {activeTab === 'paket' && (
                        <>
                          <td className="p-6">{item.nama_paket}</td>
                          <td className="p-6 text-gray-400">J:{item.jas_id} K:{item.kemeja_id} C:{item.celana_id}</td>
                          <td className="p-6">{item.durasi} Hari</td>
                          <td className="p-6 text-emerald-600">Rp {item.harga.toLocaleString()}</td>
                        </>
                      )}
                      {['jas', 'kemeja', 'celana', 'changsan'].includes(activeTab) && (
                        <>
                          <td className="p-6 text-gray-300">#{item.id}</td>
                          <td className="p-6">{item.nama}</td>
                          <td className="p-6 text-gray-400">{item.size}</td>
                          <td className="p-6">{item.warna}</td>
                          <td className="p-6">{item.stok} Unit</td>
                          <td className="p-6">{item.kondisi}</td>
                        </>
                      )}
                      {activeTab === 'dasi' && (
                        <>
                          <td className="p-6 text-gray-300">#{item.id}</td>
                          <td className="p-6">{item.kode}</td>
                          <td className="p-6">{item.deskripsi}</td>
                        </>
                      )}
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => setEditItem({ type: activeTab, data: item })} className="text-gray-300 hover:text-black transition-colors"><Edit size={16} /></button>
                        <button className="text-gray-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL EDIT (BARU) */}
      <AnimatePresence>
        {editItem && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="bg-[#1A120B] p-6 text-white flex justify-between items-center">
                <h3 className="font-black uppercase italic tracking-tighter">Edit Data_{editItem.type}</h3>
                <button onClick={() => setEditItem(null)} className="text-white/50 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveEdit} className="p-8 space-y-4">
                {editItem.type === 'paket' ? (
                  <>
                    <div><label className="text-[9px] font-black text-gray-400 uppercase">Nama Paket</label>
                      <input name="nama_paket" defaultValue={editItem.data.nama_paket} className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl text-xs font-bold" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[9px] font-black text-gray-400 uppercase">Durasi (Hari)</label>
                        <input name="durasi" type="number" defaultValue={editItem.data.durasi} className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl text-xs font-bold" /></div>
                      <div><label className="text-[9px] font-black text-gray-400 uppercase">Harga (Rp)</label>
                        <input name="harga" type="number" defaultValue={editItem.data.harga} className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl text-xs font-bold" /></div>
                    </div>
                  </>
                ) : editItem.type === 'orders' ? (
                  <>
                    <div><label className="text-[9px] font-black text-gray-400 uppercase">Nama Penyewa</label>
                      <input name="nama_penyewa" defaultValue={editItem.data.nama_penyewa} className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl text-xs font-bold" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[9px] font-black text-gray-400 uppercase">No. Telp</label>
                        <input name="no_telp" defaultValue={editItem.data.no_telp} className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl text-xs font-bold" /></div>
                      <div><label className="text-[9px] font-black text-gray-400 uppercase">No. Rekening</label>
                        <input name="no_rekening" defaultValue={editItem.data.no_rekening} className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl text-xs font-bold" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[9px] font-black text-gray-400 uppercase">Deposit</label>
                        <input name="deposit" type="number" defaultValue={editItem.data.deposit} className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl text-xs font-bold" /></div>
                      <div><label className="text-[9px] font-black text-gray-400 uppercase">Sudah Bayar</label>
                        <input name="baru_dibayar" type="number" defaultValue={editItem.data.baru_dibayar} className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl text-xs font-bold" /></div>
                    </div>
                    <div><label className="text-[9px] font-black text-gray-400 uppercase">Status Sewa</label>
                      <select name="status" defaultValue={editItem.data.status} className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl text-xs font-bold">
                        <option value="booked">Booked</option>
                        <option value="diambil">Diambil</option>
                        <option value="dikembalikan">Dikembalikan</option>
                        <option value="Cancel">Cancel</option>
                      </select></div>
                  </>
                ) : null}
                <button type="submit" className="w-full py-4 bg-[#1A120B] text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#8D775F] transition-all"><Save size={16} /> Simpan Perubahan</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION MODAL (KODE ASLI) */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-2rem max-w-sm w-full text-center shadow-2xl">
              <AlertCircle size={32} className="mx-auto mb-4 text-amber-500" />
              <h4 className="text-lg font-black uppercase italic mb-2 tracking-tighter">Status Confirmation</h4>
              <p className="text-[11px] text-gray-500 font-medium mb-8 leading-relaxed">Ubah status pesanan menjadi <span className="text-[#1A120B] font-black underline">"{confirmModal.action}"</span>?</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmModal({ show: false })} className="flex-1 py-3 text-[10px] font-black uppercase text-gray-400">Cancel</button>
                <button onClick={() => handleUpdateStatus(confirmModal.orderId, confirmModal.action)} className="flex-1 py-3 bg-[#1A120B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OVERLAY MOBILE */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-80 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default AdminDashboard;