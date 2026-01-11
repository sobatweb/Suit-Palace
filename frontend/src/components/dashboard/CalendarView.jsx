import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';
import DailyStock from './DailyStock';
import OrderDetailCard from './OrderDetailCard';

const CalendarView = ({ db, viewDate, setViewDate, selectedDay, setSelectedDay, selectedFullDate, setModalType, setEditingItem, setDeleteConfirm, setFinishOrderData, onDeleteMarkNote }) => {
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const getStatusColor = (status, endDate) => {
    const today = todayStr;

    if (status === 'Dikembalikan') return 'bg-blue-500';

    // Logika Overdue (Merah)
    if (status !== 'Dikembalikan' && endDate && today > endDate) return 'bg-rose-600';

    switch (status) {
      case 'Diambil': return 'bg-amber-400';
      case 'Booked': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  const processedOrders = useMemo(() => {
    const orders = (db.order_items || []).filter(o => o.status_order !== 'Sudah Selesai');
    const sorted = [...orders].sort((a, b) => a.start_dates.localeCompare(b.start_dates));
    const rows = [];
    sorted.forEach(order => {
      let assignedRow = 0; let foundSlot = false;
      while (!foundSlot) {
        if (!rows[assignedRow]) { rows[assignedRow] = []; foundSlot = true; }
        else {
          const hasConflict = rows[assignedRow].some(ex => (order.start_dates <= ex.end_dates && order.end_dates >= ex.start_dates));
          if (!hasConflict) foundSlot = true; else assignedRow++;
        }
      }
      rows[assignedRow].push(order); order.visualRow = assignedRow;
    });
    return { sorted, totalRows: rows.length || 0 };
  }, [db.order_items]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8 space-y-4">
        <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-800">
          <div className="flex justify-between items-center mb-6 px-2">
            <button onClick={() => setViewDate(new Date(currentYear, currentMonth - 1, 1))}><ChevronLeft size={20} /></button>
            <h3 className="font-black uppercase text-sm tracking-widest">
              {viewDate.toLocaleString('en-GB', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={() => setViewDate(new Date(currentYear, currentMonth + 1, 1))}><ChevronRight size={20} /></button>
          </div>

          <div className="grid grid-cols-7 border-t border-l border-gray-200 rounded-2xl overflow-hidden bg-white shadow-inner">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
              <div key={d} className="bg-gray-200 py-2 md:py-3 text-center text-[10px] md:text-[12px] font-black uppercase border-b border-r border-gray-200">{d}</div>
            ))}
            {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="bg-gray-50/20 min-h-20 md:min-h-30 border-r border-b border-gray-200" />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;

              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateStr === todayStr;
              const dayOrders = processedOrders.sorted.filter(o => {
                const start = o.start_dates.split('T')[0];
                const end = o.end_dates.split('T')[0];
                return dateStr >= start && dateStr <= end;
              });

              return (
                <div key={day} onClick={() => setSelectedDay(day)} className={`min-h-20 md:min-h-28 border-r border-b border-gray-300 relative cursor-pointer hover:bg-gray-100 transition-all ${selectedFullDate === dateStr ? 'bg-gray-300' : ''}`}
                >
                  <div className="p-1.5 md:p-2 flex justify-between items-start h-6 md:h-8 shrink-0 relative">
                    {/* Sekarang isToday sudah terdefinisi dan bisa digunakan di bawah ini */}
                    <span className={`text-[10px] md:text-[12px] font-black rounded px-1.5 md:px-2 py-0.5 ${selectedFullDate === dateStr ? 'bg-gray-500 text-white' : isToday ?  'bg-[#1A120B] text-white' : 'text-gray-900'}`}>
                      {day}
                    </span>

                    {/* Icon PIN juga menggunakan isToday */}
                    {/* PIN MARK LOGIC */}
                    {(() => {
                      const activeMark = (db.marks || []).find(m => {
                        const rawDate = m.date || m.date_mark;
                        return rawDate && rawDate.split('T')[0] === dateStr;
                      });

                      if (activeMark) {
                        return (
                          <div className="absolute top-1 left-1" style={{ zIndex: 40 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <circle
                                cx="12" cy="12" r="10"
                                fill={activeMark.color_mark || (isToday ? '#f59e42' : '#e11d48')}
                              />
                              <rect x="10.5" y="6" width="3" height="8" rx="1.5" fill="white" />
                            </svg>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>

                  {/* Ikon Note di Kalender */}
                  {(db.notes || []).some(n => n.date === dateStr) && (
                    <div className="absolute bottom-1 right-1 text-amber-500"><FileText size={10} /></div>
                  )}

                  <div className="flex-1 flex flex-col gap-1 pb-2">
                    {[...Array(Math.max(processedOrders.totalRows, 3))].map((_, rowIndex) => {
                      const order = dayOrders.find(o => o.visualRow === rowIndex);

                      if (!order) return <div key={rowIndex} className="h-1.5 md:h-2.5 w-full" />;

                      // PERBAIKAN: Ambil hanya tanggal saja agar perbandingan akurat
                      const orderStart = order.start_dates.split('T')[0];
                      const orderEnd = order.end_dates.split('T')[0];

                      const isStart = dateStr === orderStart;
                      const isEnd = dateStr === orderEnd;

                      return (
                        <div
                          key={rowIndex}
                          className={`h-1.5 md:h-2.5 w-full ${getStatusColor(order.status_rent, order.end_dates)} relative flex items-center shrink-0 transition-all duration-300`}
                          style={{
                            // 1. EFEK LENGKUNG (CAPSULE)
                            // Menggunakan 999px memastikan ujung benar-benar bulat sempurna
                            borderTopLeftRadius: isStart ? '999px' : '0',
                            borderBottomLeftRadius: isStart ? '999px' : '0',
                            borderTopRightRadius: isEnd ? '999px' : '0',
                            borderBottomRightRadius: isEnd ? '999px' : '0',

                            // 2. LOGIKA KONEKSI (MENYAMBUNG TANPA CELAH)
                            marginLeft: isStart ? '4px' : '0',
                            marginRight: isEnd ? '4px' : '0',

                            // Lebar dilebihkan 1-2px agar garis menyeberang border kotak kalender
                            width: isStart || isEnd ? 'calc(100% - 4px)' : 'calc(100% + 2px)',
                            left: !isStart ? '-1px' : '0',

                            zIndex: isStart ? 20 : 10
                          }}
                        >
                          {/* 3. MENAMPILKAN ID HANYA DI START */}
                          {isStart && (
                            <span className="hidden md:block text-[7px] font-black text-white ml-2.5 uppercase truncate pointer-events-none drop-shadow-md">
                              {db.customers?.find(c => Number(c.id_customer) === Number(order.id_customer))?.customer_name || `#${order.id_order}`}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-3 md:p-4 bg-white border-b flex flex-wrap gap-3 md:gap-6 items-center justify-center shadow-sm rounded-2xl">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm"></div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Diambil</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Dikembalikan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-600 shadow-sm"></div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Overdue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-500 shadow-sm"></div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Cancel</span>
          </div>
        </div>
        <DailyStock db={db} selectedFullDate={selectedFullDate} />
      </div>

      <div className="xl:col-span-4 space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setModalType('mark')} className="flex-1 py-4 bg-[#7c7167] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Add Mark</button>
        </div>

        {/* List Mark agar data yang diketik muncul */}
        <div className="bg-white p-5 rounded-4xl border border-gray-800 shadow-sm">
          <h4 className="text-[10px] font-black uppercase mb-4 tracking-widest text-gray-400">Marks - {new Date(selectedFullDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</h4>
          <div className="space-y-2 max-h-50 overflow-y-auto pr-1">
            {(db.marks || []).filter(m => {
              const rawDate = m.date || m.date_mark;
              return rawDate && rawDate.split('T')[0] === selectedFullDate;
            }).map(m => (
              <div key={m.id_marks || m.id_mark} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color_mark || '#e11d48' }} />
                  <p className="text-[11px] font-bold text-gray-800">{m.note_mark || m.note}</p>
                </div>
                <X
                  size={14}
                  className="cursor-pointer text-gray-300 hover:text-red-500 transition-colors"
                  onClick={() => onDeleteMarkNote('marks', m.id_marks || m.id_mark)}
                />
              </div>
            ))}
          </div>
        </div>

        <OrderDetailCard db={db} selectedFullDate={selectedFullDate} setEditingItem={setEditingItem} setModalType={setModalType} setDeleteConfirm={setDeleteConfirm} getStatusColor={getStatusColor} setFinishOrderData={setFinishOrderData} />
      </div>
    </div>
  );
};

export default CalendarView;