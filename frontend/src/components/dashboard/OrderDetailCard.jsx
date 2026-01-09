import React from 'react';
import { motion } from 'framer-motion';
import { User, CalendarDays, X, CheckCircle } from 'lucide-react';
const getDateString = (dateStr) => (dateStr ? (dateStr.includes('T') ? dateStr.split('T')[0] : dateStr) : '');

const OrderDetailCard = ({
  db,
  selectedFullDate,
  setEditingItem,
  setModalType,
  setDeleteConfirm,
  getStatusColor,
  setFinishOrderData // Gunakan prop ini, bukan handleFinishOrder
}) => {
  const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const date = new Date(cleanDate);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
  const filteredOrders = db.order_items.filter(o => {
    const startDate = getDateString(o.start_dates);
    const endDate = getDateString(o.end_dates);
    return (
      selectedFullDate >= startDate &&
      selectedFullDate <= endDate &&
      o.status_order !== 'Sudah Selesai'
    );
  });

  

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 scrollbar-hide">


      {/* RENDER PESANAN */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 opacity-20 font-black uppercase text-[15px] tracking-widest">No Orders Today</div>
      ) : (
        filteredOrders.map(order => {
          const cust = db.customers.find(c => Number(c.id_customer) === Number(order.id_customer));
          const pkg = db.packages.find(p => Number(p.id_package) === Number(order.id_package));

          // Hitung Penalty Fee: Gunakan actual_return_date jika sudah kembali, jika belum gunakan hari ini
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const calculationDate = (order.status_rent === 'Dikembalikan' && order.actual_return_date)
            ? new Date(getDateString(order.actual_return_date))
            : today;

          const endDate = new Date(getDateString(order.end_dates));
          endDate.setHours(0, 0, 0, 0);
          
          let penaltyFee = 0;
          let daysLate = 0;
          
          if (calculationDate > endDate) {
            daysLate = Math.floor((calculationDate - endDate) / (1000 * 60 * 60 * 24));
            penaltyFee = daysLate * (pkg?.penalty_fee || 0);
          }

          const hargaPaket = Math.round(Number(order.total_price));
          const deposit = Math.round(Number(pkg?.deposit || 0));
          const totalTagihan = hargaPaket + deposit + penaltyFee;
          const sisaBayar = totalTagihan - Math.round(Number(order.amount_paid));

          // Ambil daftar item yang di-book
          const bookingRow = db.booked?.find(b => Number(b.id_booked) === Number(order.id_booked)) || {};
          const bookedItemsList = [];
          ['jas', 'kemeja', 'celana', 'changshan', 'dasi'].forEach(cat => {
            const productId = bookingRow[`id_${cat}`];
            if (productId) {
              const prod = db[cat]?.find(p => Number(p[`id_${cat}`]) === Number(productId));
              if (prod) {
                bookedItemsList.push({
                  category: cat.toUpperCase(),
                  name: prod[`name_${cat}`] || prod[`kode_${cat}`],
                  size: prod[`size_${cat}`] || '-'
                });
              }
            }
          });

          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={order.id_order} className="bg-white p-5 rounded-4xl shadow-xl border relative overflow-hidden">
              <div className={`absolute top-0 right-0 px-4 py-1 text-[13px] font-black text-white  rounded-bl-xl ${getStatusColor(order.status_rent)}`}>
                {order.status_rent}
              </div>

              <div className="space-y-3 mt-4">
                {/* Bagian Customer */}
                <div className="flex items-center gap-3">
                  <User size={14} className="text-gray-400" />
                  <div className="text-[15px] font-black uppercase tracking-tighter">
                    {db.customers.find(c => Number(c.id_customer) === Number(order.id_customer))?.customer_name} 
                    <span className="text-gray-600 ml-1">({db.customers.find(c => Number(c.id_customer) === Number(order.id_customer))?.customer_phone})</span>
                  </div>
                </div>

                {/* Bagian Tanggal (SUDAH DIUBAH) */}
                <div className="flex items-center gap-3">
                  <CalendarDays size={14} className="text-gray-400" />
                  <div className="text-[11px] font-bold text-[#8D775F]">
                    {formatDisplayDate(order.start_dates)} s/d {formatDisplayDate(order.end_dates)}
                  </div>
                </div>
              </div>

              {/* Rincian Biaya */}
              <div className="bg-gray-50 rounded-2xl p-4 text-[13px] space-y-2 my-4 font-bold border border-gray-100 shadow-inner">
                <div className="flex justify-between"><span>Harga Paket</span><span>Rp {hargaPaket.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span>Deposit (Jaminan)</span><span>Rp {deposit.toLocaleString('id-ID')}</span></div>
                {penaltyFee > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Penalty Fee ({daysLate} Hari)</span>
                    <span>+ Rp {penaltyFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-black uppercase text-[13px]"><span>Total Bayar</span><span>Rp {totalTagihan.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-emerald-600"><span>Sudah Dibayar</span><span>- Rp {Math.round(Number(order.amount_paid)).toLocaleString('id-ID')}</span></div>
                <div className={`flex justify-between font-black pt-1 border-t uppercase text-[13px] ${sisaBayar > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                  <span>{sisaBayar > 0 ? 'Sisa Tagihan' : 'Lunas'}</span>
                  <span>Rp {sisaBayar.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Booked Items & Description */}
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <div className="text-[10px] font-black uppercase text-gray-400 mb-2">Item Terpesan:</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {bookedItemsList.map((item, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 rounded-lg text-[9px] font-bold uppercase">
                      {item.category}: {item.name} ({item.size})
                    </span>
                  ))}
                  {bookedItemsList.length === 0 && <span className="text-[9px] italic text-gray-400">Tidak ada item</span>}
                </div>
                
                {order.description_rent && (
                  <>
                    <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Deskripsi:</div>
                    <p className="text-[11px] text-gray-600 italic leading-relaxed">{order.description_rent}</p>
                  </>
                )}
              </div>

              {/* AKSI */}
              <div className="flex gap-2">
               

                <button
                  onClick={() => {
                    // Cari data customer dan package terlebih dahulu untuk dikirim ke modal
                    const currentCustomer = db.customers.find(c => Number(c.id_customer) === Number(order.id_customer));
                    
                    setEditingItem({ 
                      ...order, 
                      fromTable: 'order_items',
                      // Tambahkan field ini agar FormModal bisa langsung melakukan pre-fill
                      customer_name: currentCustomer?.customer_name || '',
                      customer_phone: currentCustomer?.customer_phone || '',
                      bank_account: currentCustomer?.bank_account || ''
                    }); 
                    setModalType('form_db'); 
                  }}
                  className="flex-1 py-3 bg-gray-100 rounded-xl text-[10px] font-black uppercase hover:bg-gray-200 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => setFinishOrderData(order)} // Membuka FinishOrderModal
                  disabled={order.status_rent !== 'Dikembalikan' && order.status_rent !== 'Cancel'}
                  title={order.status_rent !== 'Dikembalikan' && order.status_rent !== 'Cancel' ? "Hanya bisa diselesaikan jika status sudah Dikembalikan atau Cancel" : ""}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${
                    (order.status_rent === 'Dikembalikan' || order.status_rent === 'Cancel')
                      ? "bg-[#1A120B] text-white hover:bg-black"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                  }`}
                >
                  <CheckCircle size={12} /> Selesai
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