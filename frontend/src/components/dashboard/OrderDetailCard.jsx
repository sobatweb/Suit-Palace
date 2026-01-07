import React from 'react';
import { motion } from 'framer-motion';
import { User, CalendarDays, X, CheckCircle } from 'lucide-react';

const OrderDetailCard = ({ 
  db, 
  selectedFullDate, 
  setEditingItem, 
  setModalType, 
  setDeleteConfirm, 
  getStatusColor, 
  setFinishOrderData // Gunakan prop ini, bukan handleFinishOrder
}) => {
  const filteredOrders = db.order_items.filter(o => selectedFullDate >= o.start_dates && selectedFullDate <= o.end_dates);

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 scrollbar-hide">
      {/* SECTION MARKS & NOTES */}
      <div className="flex flex-wrap gap-2 mb-2">
        {db.marks.filter(m => m.date === selectedFullDate).map(m => (
          <div key={m.id_mark} className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border shadow-sm" style={{borderColor: m.color}}>
            <span className="text-[9px] font-black uppercase">{m.note}</span>
            <X size={10} className="cursor-pointer text-gray-300 hover:text-rose-500" onClick={() => setDeleteConfirm({ table: 'marks', idField: 'id_mark', id: m.id_mark })} />
          </div>
        ))}
        {db.notes.filter(n => n.date === selectedFullDate).map(n => (
          <div key={n.id_note} className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
            <span className="text-[9px] font-black uppercase text-amber-700">{n.title}</span>
            <X size={10} className="cursor-pointer text-amber-300 hover:text-rose-500" onClick={() => setDeleteConfirm({ table: 'notes', idField: 'id_note', id: n.id_note })} />
          </div>
        ))}
      </div>

      {/* RENDER PESANAN */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 opacity-20 font-black uppercase text-[10px] tracking-widest">No Orders Today</div>
      ) : (
        filteredOrders.map(order => {
          const cust = db.customers.find(c => Number(c.id_customer) === Number(order.id_customer));
          const pkg = db.packages.find(p => Number(p.id_package) === Number(order.id_package));
          
          const hargaPaket = Number(order.total_price);
          const deposit = Number(pkg?.deposit || 0);
          const totalTagihan = hargaPaket + deposit;
          const sisaBayar = totalTagihan - Number(order.amount_paid);

          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={order.id_order} className="bg-white p-5 rounded-[2rem] shadow-xl border relative overflow-hidden">
              <div className={`absolute top-0 right-0 px-4 py-1 text-[8px] font-black text-white rounded-bl-xl ${getStatusColor(order.status_rent)}`}>
                {order.status_rent}
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3">
                  <User size={14} className="text-gray-400"/>
                  <div className="text-[11px] font-black uppercase tracking-tighter">
                    {cust?.customer_name} <span className="text-gray-300 ml-1">({cust?.customer_phone})</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays size={14} className="text-gray-400"/>
                  <div className="text-[10px] font-bold text-[#8D775F]">{order.start_dates} s/d {order.end_dates}</div>
                </div>
              </div>

              {/* Rincian Biaya */}
              <div className="bg-gray-50 rounded-2xl p-4 text-[10px] space-y-2 my-4 font-bold border border-gray-100 shadow-inner">
                <div className="flex justify-between"><span>Harga Paket</span><span>Rp {hargaPaket.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Deposit (Jaminan)</span><span>Rp {deposit.toLocaleString()}</span></div>
                <div className="flex justify-between pt-2 border-t font-black uppercase text-[9px]"><span>Total Bayar</span><span>Rp {totalTagihan.toLocaleString()}</span></div>
                <div className="flex justify-between text-emerald-600"><span>Sudah Dibayar</span><span>- Rp {Number(order.amount_paid).toLocaleString()}</span></div>
                <div className={`flex justify-between font-black pt-1 border-t uppercase text-[9px] ${sisaBayar > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                  <span>{sisaBayar > 0 ? 'Sisa Tagihan' : 'Lunas'}</span>
                  <span>Rp {sisaBayar.toLocaleString()}</span>
                </div>
              </div>

              {/* AKSI */}
              <div className="flex gap-2">
                <button 
                  onClick={() => {setEditingItem({...order, fromTable: 'order_items'}); setModalType('form_db');}} 
                  className="flex-1 py-3 bg-gray-100 rounded-xl text-[9px] font-black uppercase hover:bg-gray-200 transition-all"
                >
                  Edit
                </button>
                <button 
                  onClick={() => setFinishOrderData(order)} // Membuka FinishOrderModal
                  className="flex-1 py-3 bg-[#1A120B] text-white rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
                >
                  <CheckCircle size={12}/> Selesai
                </button>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default OrderDetailCard;