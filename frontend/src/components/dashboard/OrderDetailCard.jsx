

import React, { useMemo } from 'react';
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

  // GROUPING LOGIC: Group by Customer ID + Start Date
  const groupedOrders = useMemo(() => {
    const groups = {};
    filteredOrders.forEach(order => {
      const key = `${order.id_customer}_${getDateString(order.start_dates)}`;
      if (!groups[key]) {
        // Cari SEMUA order dalam grup yang sama dari database lengkap
        const allRelated = db.order_items.filter(o =>
          Number(o.id_customer) === Number(order.id_customer) &&
          getDateString(o.start_dates) === getDateString(order.start_dates)
        ).sort((a, b) => {
          const dateA = new Date(getDateString(a.end_dates));
          const dateB = new Date(getDateString(b.end_dates));
          return dateA - dateB;
        });

        // --- TAMBAHKAN LOGIK UNTUK MENCARI TANGGAL TERJAUH ---
        const maxEndDate = allRelated.reduce((max, curr) => {
          const currentEnd = getDateString(curr.end_dates);
          return currentEnd > max ? currentEnd : max;
        }, getDateString(order.end_dates));
        // ----------------------------------------------------

        groups[key] = {
          ...order,
          relatedOrders: allRelated,
          maxEndDate: maxEndDate // Simpan tanggal terjauh di sini
        };
      }
    });
    return Object.values(groups);
  }, [filteredOrders, db.order_items]);

  return (
    <div className="space-y-4 max-h-270 overflow-y-auto pr-2 scrollbar-hide">


      {/* RENDER PESANAN */}
      {groupedOrders.length === 0 ? (
        <div className="text-center py-10 opacity-20 font-black uppercase text-[15px] tracking-widest">No Orders Today</div>
      ) : (
        groupedOrders.map(order => {
          const cust = db.customers.find(c => Number(c.id_customer) === Number(order.id_customer));

          // Calculate Totals for the Group
          let totalGroupTagihan = 0;
          let totalGroupPaid = 0;
          let totalGroupSisa = 0;
          let isGroupLate = false;
          let totalGroupHargaPaket = 0;
          let totalGroupDiscount = 0;
          let totalGroupDeposit = 0;
          let totalGroupPenalty = 0;

          // Iterate related orders to calculate totals and build item list
          const groupDetails = order.relatedOrders.map(subOrder => {
            const pkg = db.packages.find(p => Number(p.id_package) === Number(subOrder.id_package));

            // --- PINDAHKAN INI KE PALING ATAS ---
            // Ambil nilai yang sudah dibayar supaya tetap tampil di Card walaupun di-cancel
            const amountPaid = Math.round(Number(subOrder.amount_paid || 0));
            totalGroupPaid += amountPaid;

            // 1. CEK CANCEL
            if (subOrder.status_rent === 'Cancel') {
              // Jika cancel, sisa bayar menjadi minus (karena tagihan 0 tapi ada uang masuk)
              // Ini yang membuat tampilan di Card jadi update
              const sisaBayar = 0 - amountPaid;
              totalGroupSisa += sisaBayar;

              return {
                pkgName: pkg?.package_name || 'Unknown Package',
                items: [], // Kosongkan item jika cancel
                status: subOrder.status_rent,
                description: subOrder.condition_return || subOrder.description,
                price: 0,
                deposit: 0,
                penalty: 0,
                duration: pkg?.duration_day || 0,
                endDate: subOrder.end_dates
              };
            }

            // 2. JIKA TIDAK CANCEL, LANJUT HITUNG NORMAL
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const calculationDate = (subOrder.status_rent === 'Dikembalikan' && subOrder.actual_return_date)
              ? new Date(getDateString(subOrder.actual_return_date))
              : today;

            const endDate = new Date(getDateString(subOrder.end_dates));
            endDate.setHours(0, 0, 0, 0);

            let penaltyFee = 0;
            if (calculationDate > endDate) {
              const daysLate = Math.floor((calculationDate - endDate) / (1000 * 60 * 60 * 24));
              penaltyFee = daysLate * (pkg?.penalty_fee || 0);
              isGroupLate = true;
            }

            const hargaPaket = Math.round(Number(subOrder.total_price));
            const discount = Number(cust?.discount || 0);
            const discountAmount = Math.round(hargaPaket * (discount / 100));
            const deposit = Math.round(Number(pkg?.deposit || 0));
            const totalTagihan = (hargaPaket - discountAmount) + deposit + penaltyFee;

            // 3. UPDATE VARIABLE TOTAL (Hanya untuk yang tidak cancel)
            totalGroupTagihan += totalTagihan;

            const sisaBayar = totalTagihan - amountPaid;
            totalGroupSisa += sisaBayar;

            totalGroupHargaPaket += hargaPaket;
            totalGroupDiscount += discountAmount;
            totalGroupDeposit += deposit;
            totalGroupPenalty += penaltyFee;

            // Ambil daftar item yang di-book
            const bookingRow = db.booked?.find(b => Number(b.id_booked) === Number(subOrder.id_booked)) || {};
            const items = [];
            ['jas', 'kemeja', 'celana', 'changshan', 'dasi', 'vest', 'tuxedo'].forEach(cat => {
              const productId = bookingRow[`id_${cat}`];
              if (productId) {
                const prod = db[cat]?.find(p => Number(p[`id_${cat}`]) === Number(productId));
                if (prod) {
                  items.push({
                    category: cat.toUpperCase(),
                    name: prod[`name_${cat}`] || prod[`kode_${cat}`],
                    size: prod[`size_${cat}`] || '-',
                    color: prod[`color_${cat}`] || '-'
                  });
                }
              }
            });

            return {
              pkgName: pkg?.package_name,
              items,
              status: subOrder.status_rent,
              description: subOrder.condition_return || subOrder.description,
              price: hargaPaket,
              deposit: deposit,
              penalty: penaltyFee,
              duration: pkg?.duration_day || 0,
              endDate: subOrder.end_dates
            };
          });

          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={order.id_order} className="bg-white p-5 rounded-4xl shadow-xl border relative overflow-hidden">
              <div className="absolute top-3 right-4 flex gap-1.5">
                {order.relatedOrders.map((subOrder, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full shadow-sm ${getStatusColor(subOrder.status_rent, subOrder.end_dates)}`}
                    title={`${subOrder.status_rent}${subOrder.status_rent !== 'Dikembalikan' && subOrder.end_dates && new Date().toISOString().split('T')[0] > subOrder.end_dates.split('T')[0] ? ' (Overdue)' : ''}`}
                  />
                ))}
              </div>

              <div className="space-y-3 mt-4">
                {/* Bagian Customer */}
                <div className="flex items-center gap-3">
                  <User size={14} className="text-gray-400" />
                  <div className="text-[17px] font-black tracking-tighter">
                    {cust?.customer_name}
                    <span className="text-gray-600 ml-2">({cust?.customer_phone})</span>
                  </div>
                </div>

                {/* Bagian Tanggal (SUDAH DIUBAH) */}
                <div className="flex items-center gap-3">
                  <CalendarDays size={14} className="text-gray-400" />
                  <div className="text-[12px] font-bold text-[#8D775F]">
                    {formatDisplayDate(order.start_dates)} - {formatDisplayDate(order.maxEndDate)}
                  </div>
                </div>
              </div>

              {/* Rincian Biaya */}
              <div className="bg-gray-50 rounded-2xl p-4 text-[13px] space-y-1 my-4 font-bold border border-gray-100 shadow-inner">
                <div className="flex justify-between text-gray-500"><span>Total Harga Paket</span><span>Rp {totalGroupHargaPaket.toLocaleString('id-ID')}</span></div>
                {totalGroupDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600"><span>Diskon ({cust?.discount}%)</span><span>- Rp {totalGroupDiscount.toLocaleString('id-ID')}</span></div>
                )}
                {totalGroupDeposit > 0 && (
                  <div className="flex justify-between text-gray-500"><span>Deposit</span><span>Rp {totalGroupDeposit.toLocaleString('id-ID')}</span></div>
                )}
                {totalGroupPenalty > 0 && (
                  <div className="flex justify-between text-rose-600"><span>Denda Keterlambatan</span><span>+ Rp {totalGroupPenalty.toLocaleString('id-ID')}</span></div>
                )}
                <div className="flex justify-between pt-2 border-t font-black uppercase text-[13px]"><span>Total Tagihan ({order.relatedOrders.length} Order)</span><span>Rp {totalGroupTagihan.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-emerald-600"><span>Total Dibayar</span><span>- Rp {totalGroupPaid.toLocaleString('id-ID')}</span></div>
                <div className={`flex justify-between font-black pt-1 border-t uppercase text-[13px] ${totalGroupSisa > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                  <span>{totalGroupSisa > 0 ? 'Sisa Tagihan' : 'Lunas'}</span>
                  <span>Rp {totalGroupSisa.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Booked Items & Description */}
              <div className="pt-4 border-t border-dashed border-gray-400">
                {groupDetails.map((detail, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-[11px] font-black uppercase text-gray-800">{detail.pkgName}</div>
                      <span className={`text-[9px] px-2 py-0.5 rounded ${getStatusColor(detail.status)} text-white font-bold`}>{detail.status}</span>
                    </div>
                    <table className="w-full">
                      <tbody>
                        {detail.items.map((item, i) => (
                          <tr key={i} className="text-[12px] font-bold">
                            <td className="pl-3 py-1.5 w-24 uppercase text-gray-500 tracking-tighter border-b border-gray-50">
                              {item.category}
                            </td>
                            <td className="py-1.5 text-center text-gray-400 w-4 border-b border-gray-50">:</td>
                            <td className="pr-3 py-1.5 text-gray-800 border-b border-gray-50">
                              {item.category === 'DASI'
                                ? `${item.name} (${item.color})`
                                : `${item.name} (${item.color} - ${item.size})`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {detail.items.length === 0 && <span className="text-[9px] italic text-gray-400">Tidak ada item</span>}

                    {detail.description && (
                      <div className="mt-2 pl-1 border-l-2 border-rose-200">
                        <div className="text-[10px] font-black uppercase text-gray-400 mb-0.5">Deskripsi:</div>
                        <p className="text-[12px] font-bold text-gray-700 leading-relaxed italic">
                          * {detail.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

              </div>


              {/* AKSI */}
              <div className="flex gap-2 mt-5 ">
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
                      bank_account: currentCustomer?.bank_account || '',
                      customer_full: currentCustomer, // TAMBAHKAN INI (untuk akses discount)
                    });
                    setModalType('form_db');
                  }}
                  className="flex-1 py-3 bg-gray-100 rounded-xl text-[10px] font-black uppercase hover:bg-gray-200 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => setFinishOrderData(order)} // Membuka FinishOrderModal
                  disabled={(() => {
                    const allDone = order.relatedOrders.every(o => o.status_rent === 'Dikembalikan' || o.status_rent === 'Cancel');
                    return !allDone;
                  })()}
                  title={(() => {
                    const allDone = order.relatedOrders.every(o => o.status_rent === 'Dikembalikan' || o.status_rent === 'Cancel');
                    return !allDone ? "Semua paket dalam pesanan ini harus berstatus Dikembalikan atau Cancel" : "";
                  })()}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${(() => {
                    return order.relatedOrders.every(o => o.status_rent === 'Dikembalikan' || o.status_rent === 'Cancel');
                  })()
                    ? "bg-[#1A120B] text-white hover:bg-black"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                    }`}
                >
                  <CheckCircle size={12} /> {order.relatedOrders.length > 1 ? 'Selesaikan Semua' : 'Selesai'}
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
