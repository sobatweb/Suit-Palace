import React from 'react';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import DailyStock from './DailyStock';
import OrderDetailCard from './OrderDetailCard';

const CalendarView = ({
  db,
  viewDate,
  setViewDate,
  selectedDay,
  setSelectedDay,
  selectedFullDate,
  setModalType,
  setEditingItem,
  setDeleteConfirm,
  setFinishOrderData // Menerima prop dari AdminDashboard
}) => {
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Helper to format date from YYYY-MM-DD to DD Month YYYY
  // const formatDate = (dateStr) => {
  //   if (!dateStr) return '';
  //   const [year, month, day] = dateStr.split('-');
  //   const monthNames = [
  //     'January', 'February', 'March', 'April', 'May', 'June',
  //     'July', 'August', 'September', 'October', 'November', 'December'
  //   ];
  //   return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
  // };
  

  const getStatusColor = (status) => {
    switch (status) {
      case 'Overdue': return 'bg-red-500';
      case 'Diambil': return 'bg-yellow-400';
      case 'Booked': return 'bg-green-500';
      case 'Dikembalikan': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };
  const activeOrders = db.order_items.filter(o => 
    o.status_rent !== 'Dikembalikan' && o.status_order !== 'Sudah Selesai'
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-8 space-y-4">
        {/* KALENDER */}
        <div className="bg-white p-6 rounded-2rem shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 px-2">
            <button onClick={() => setViewDate(new Date(currentYear, currentMonth - 1, 1))} className="p-2 hover:bg-gray-50 rounded-full transition-all"><ChevronLeft size={20} /></button>
            <h3 className="font-black uppercase text-sm tracking-widest">{viewDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</h3>
            <button onClick={() => setViewDate(new Date(currentYear, currentMonth + 1, 1))} className="p-2 hover:bg-gray-50 rounded-full transition-all"><ChevronRight size={20} /></button>
          </div>

          <div className="grid grid-cols-7 border rounded-2xl overflow-hidden shadow-inner bg-white">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
              <div key={d} className="bg-gray-200 py-3 text-center text-[12px] font-black uppercase text-gray-800 border-b">{d}</div>
            ))}
            {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="bg-gray-50/20 min-h-95px border-[0.5px] border-gray-50" />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayOrders = db.order_items.filter(o =>
                dateStr >= o.start_dates &&
                dateStr <= o.end_dates &&
                o.status_rent !== 'Dikembalikan' &&
                o.status_order !== 'Sudah Selesai'
              );
              const dayMarks = db.marks.filter(m => m.date === dateStr);
              const dayNotes = db.notes.filter(n => n.date === dateStr);

              return (
                <div key={day} onClick={() => setSelectedDay(day)} className={`min-h-95px p-2 border-[0.5px] border-gray-50 cursor-pointer transition-all ${selectedDay === day ? 'bg-slate-100/50 ring-2 ring-inset ring-slate-200' : 'hover:bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-13">
                    <span className={`text-[10px] font-black ${selectedFullDate === dateStr ? 'bg-[#1A120B] text-white px-1.5 py-0.5 rounded' : 'text-gray-500'}`}>{day}</span>
                    <div className="flex gap-0.5">
                      {dayMarks.map((m, idx) => <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />)}
                      {dayNotes.length > 0 && <FileText size={8} className="text-amber-500" />}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    {dayOrders.map(o => <div key={o.id_order} className={`h-1.5 w-full rounded-full ${getStatusColor(o.status_rent)}`} />)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* LEGEND KETERANGAN WARNA */}
          <div className="mt-1 ml-5 pt-5 border-t border-gray-50 flex flex-wrap gap-5">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-[9px] font-black uppercase text-gray-500">Overdue</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400"></div><span className="text-[9px] font-black uppercase text-gray-500">Harus Dipersiapan</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-[9px] font-black uppercase text-gray-500">Booking</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-500"></div><span className="text-[9px] font-black uppercase text-gray-500">Dikembalikan</span></div>
          </div>
        </div>

        <DailyStock db={db} selectedFullDate={selectedFullDate} />
      </div>

      <div className="xl:col-span-4 space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setModalType('mark')} className="flex-1 py-3.5 bg-[#1A120B] text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-md hover:scale-[1.02] transition-all">Add Mark</button>
          <button onClick={() => setModalType('note')} className="flex-1 py-3.5 bg-amber-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-md hover:scale-[1.02] transition-all">Add Note</button>
        </div>

        {/* ORDER DETAIL CARD */}
        <OrderDetailCard
          db={db}
          selectedFullDate={selectedFullDate}
          setEditingItem={setEditingItem}
          setModalType={setModalType}
          setDeleteConfirm={setDeleteConfirm}
          getStatusColor={getStatusColor}
          setFinishOrderData={setFinishOrderData} // Meneruskan state pengontrol modal
        />
      </div>
    </div>
  );
};

export default CalendarView;