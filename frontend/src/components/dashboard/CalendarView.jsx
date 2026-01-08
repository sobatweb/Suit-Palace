import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';
import DailyStock from './DailyStock';
import OrderDetailCard from './OrderDetailCard';

const CalendarView = ({ db, viewDate, setViewDate, selectedDay, setSelectedDay, selectedFullDate, setModalType, setEditingItem, setDeleteConfirm, setFinishOrderData, onDeleteMarkNote }) => {
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const getStatusColor = (status, endDate) => {
    const today = new Date().toISOString().split('T')[0];

    // Jika sudah dikembalikan
    if (status === 'Dikembalikan') return 'bg-blue-500';

    // Jika status masih Booked/Diambil tapi melewati End Date
    if (status !== 'Dikembalikan' && today > endDate) return 'bg-rose-600'; // Merah (Overdue)

    // Status lainnya
    switch (status) {
      case 'Diambil': return 'bg-amber-400'; // Kuning (Persiapan/h-3 hari)
      case 'Booked': return 'bg-emerald-500'; // Hijau (Booked)
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
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-800">
          <div className="flex justify-between items-center mb-6 px-2">
            <button onClick={() => setViewDate(new Date(currentYear, currentMonth - 1, 1))}><ChevronLeft size={20} /></button>
            <h3 className="font-black uppercase text-sm tracking-widest">
              {viewDate.toLocaleString('en-GB', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={() => setViewDate(new Date(currentYear, currentMonth + 1, 1))}><ChevronRight size={20} /></button>
          </div>

          <div className="grid grid-cols-7 border rounded-2xl overflow-hidden bg-white shadow-inner">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
              <div key={d} className="bg-gray-200 py-3 text-center text-[12px] font-black uppercase border-b">{d}</div>
            ))}
            {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="bg-gray-50/20 min-h-[120px] border-[0.5px] border-gray-100" />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayOrders = processedOrders.sorted.filter(o => dateStr >= o.start_dates && dateStr <= o.end_dates);
              const todayStr = new Date().toISOString().split('T')[0];
              const isToday = dateStr === todayStr;

              return (
                <div key={day} onClick={() => setSelectedDay(day)} className={`min-h-[120px] border-[0.5px] border-gray-100 cursor-pointer relative flex flex-col items-stretch ${selectedFullDate === dateStr ? 'bg-slate-100' : 'hover:bg-gray-50'}`}>
                  <div className="p-2 flex justify-between items-start h-8 shrink-0 relative">
                    <span className={`text-[12px] font-black rounded px-2 py-0.5 ${selectedFullDate === dateStr ? 'bg-[#1A120B] text-white' : isToday ? 'bg-amber-200 text-amber-700' : 'text-gray-900'}`}>{day}</span>
                    <div className="flex gap-0.5">
                      {(db.marks || []).filter(m => m.date && m.date.startsWith(dateStr)).map((m, idx) => (
                        <div key={m.id_marks || idx} className="w-1.5 h-1.5 rounded-full" style={{ background: m.color_mark }} />
                      ))}
                    </div>
                    {/* PIN/ICON jika ada mark di tanggal ini, warna berbeda jika hari ini */}
                    {(db.marks || []).some(m => m.date && m.date.startsWith(dateStr)) && (
                      <div className="absolute top-1 left-1 z-20">
                        {(() => {
                          return (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                              <circle cx="12" cy="12" r="10" fill={isToday ? '#f59e42' : '#e11d48'} />
                              <rect x="10.5" y="6" width="3" height="8" rx="1.5" fill="white" />
                            </svg>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Ikon Note di Kalender */}
                  {(db.notes || []).some(n => n.date === dateStr) && (
                    <div className="absolute bottom-1 right-1 text-amber-500"><FileText size={10} /></div>
                  )}

                  <div className="flex-1 flex flex-col gap-1 pb-2">
                    {[...Array(Math.max(processedOrders.totalRows, 3))].map((_, rowIndex) => {
                      const order = dayOrders.find(o => o.visualRow === rowIndex);
                      if (!order) return <div key={rowIndex} className="h-3 w-full" />;
                      const isStart = dateStr === order.start_dates;
                      const isEnd = dateStr === order.end_dates;
                      return (
                        <div key={rowIndex} className={`h-1.5 w-full ${getStatusColor(order.status_rent)} relative flex items-center shrink-0`} style={{ borderTopLeftRadius: isStart ? '6px' : '0', borderBottomLeftRadius: isStart ? '6px' : '0', borderTopRightRadius: isEnd ? '6px' : '0', borderBottomRightRadius: isEnd ? '6px' : '0', marginLeft: isStart ? '2px' : '-1px', marginRight: isEnd ? '2px' : '-1px', width: `calc(100% + ${(!isStart ? 1 : 0) + (!isEnd ? 1 : 0)}px)`, zIndex: isStart ? 20 : 10 }}>
                          {isStart && <span className="text-[7px] font-black text-white ml-2 uppercase truncate pointer-events-none">ID:{order.id_order}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4 bg-white border-b flex flex-wrap gap-6 items-center justify-center shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm"></div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Persiapan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Dikembalikan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-600 shadow-sm"></div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Overdue</span>
          </div>
        </div>
        <DailyStock db={db} selectedFullDate={selectedFullDate} />
      </div>

      <div className="xl:col-span-4 space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setModalType('mark')} className="flex-1 py-4 bg-[#7c7167] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Add Mark</button>
        </div>

        {/* List Mark agar data yang diketik muncul */}
        <div className="bg-white p-5 rounded-[2rem] border border-gray-800 shadow-sm">
          <h4 className="text-[10px] font-black uppercase mb-4 tracking-widest text-gray-400">Marks - {new Date(selectedFullDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {(db.marks || []).filter(m => m.date && m.date.startsWith(selectedFullDate)).map(m => (
              <div key={m.id_marks} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: m.color_mark }} />
                  <p className="text-[11px] font-bold text-gray-800">{m.note_mark}</p>
                </div>
                <X size={14} className="cursor-pointer text-gray-300 hover:text-red-500" onClick={() => onDeleteMarkNote('marks', m.id_marks)} />
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