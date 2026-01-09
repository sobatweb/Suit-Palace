import React, { useState } from 'react';
import { Search, Printer, Download, Edit, Trash2, MessageCircle, ShoppingBag, Tag, Save, Box, CheckCircle } from 'lucide-react';

const InventoryTable = ({ activeTab, data, db, fetchData, setEditingItem, setModalType, setDeleteConfirm, setFinishOrderData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [filterValue, setFilterValue] = useState("all");
  const [tempDiscount, setTempDiscount] = useState("0"); // State untuk menyimpan pilihan diskon sementara
  const formatDateFull = (dateStr) => {
    if (!dateStr || dateStr === '0000-00-00' || dateStr === 'null' || dateStr === '-') return '-';

    // Karena sudah datestrings:true, kita cukup split stringnya
    const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = cleanDate.split('-'); // [YYYY, MM, DD]

    if (parts.length === 3) {
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      return `${parseInt(parts[2])} ${monthNames[parseInt(parts[1]) - 1]} ${parts[0]}`;
    }
    return '-';
  };
  // 2. Format Harga: Bulat tanpa .00
  const formatIDR = (amount) => {
    const value = Math.floor(Number(amount || 0));
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const getDisplayData = () => {
    if (activeTab !== 'order_items' || !db) return data || [];
    return data.map(order => {
      const customer = db.customers?.find(c => String(c.id_customer) === String(order.id_customer)) || {};
      const packageData = db.packages?.find(p => String(p.id_package) === String(order.id_package)) || {};
      const bookingRow = db.booked?.find(b => String(b.id_booked) === String(order.id_booked)) || {};

      const bookedItemsList = [];
      ['jas', 'kemeja', 'celana', 'changshan', 'dasi'].forEach(cat => {
        const productId = bookingRow[`id_${cat}`];
        if (productId) {
          const prod = db[cat]?.find(p => String(p[`id_${cat}`]) === String(productId));
          if (prod) {
            bookedItemsList.push({
              category: cat.toUpperCase(),
              name: prod[`name_${cat}`] || prod[`kode_${cat}`],
              size: prod[`size_${cat}`] || '-',
              color: prod[`color_${cat}`] || '-'
            });
          }
        }
      });

      return {
        ...order,
        display_customer: customer.customer_name || 'Unknown',
        display_package: packageData.package_name || 'No Package',
        customer_full: customer,
        package_full: packageData,
        booked_items: bookedItemsList
      };
    });
  };

  const [priceDetails, setPriceDetails] = useState(null);
const filteredData = getDisplayData().filter(item => {
  const matchesSearch = Object.values(item).some(v => 
    v?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  let matchesDropdown = true;
  if (filterValue !== "all") {
    if (activeTab.includes('order')) {
      matchesDropdown = (item.display_customer === filterValue || item.customer_name === filterValue);
    } else if (activeTab === 'packages') {
      matchesDropdown = item.package_name === filterValue;
    } else if (['jas', 'celana', 'kemeja', 'dasi', 'changshan'].includes(activeTab)) {
      // Mencocokkan nama produk (contoh: name_jas atau kode_jas)
      matchesDropdown = item[`name_${activeTab}`] === filterValue || item[`kode_${activeTab}`] === filterValue;
    }
  }

  return matchesSearch && matchesDropdown;
});
  // Fungsi untuk simpan diskon customer
  const handleSaveDiscount = async () => {
    try {
      const response = await fetch(`/api/customers/${selectedInfo.data.id_customer}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...selectedInfo.data, discount: tempDiscount })
      });
      if (response.ok) {
        await fetchData(); // Refresh data agar state db di parent terupdate
        setSelectedInfo(null);
      }
    } catch (error) {
      console.error("Gagal simpan diskon", error);
    }
  };

const filterOptions = React.useMemo(() => {
  if (!db) return [];
  
  const currentData = getDisplayData();

  switch (activeTab) {
    case 'order_items':
    case 'history_order': // Pastikan nama tab history sesuai
    case 'history_orders': 
      const custNames = currentData.map(item => item.display_customer || item.customer_name);
      // Set untuk unik, filter untuk buang null, sort() untuk Ascending (A-Z)
      return [...new Set(custNames)].filter(Boolean).sort((a, b) => a.localeCompare(b));
      
    case 'packages':
      return (db.packages?.map(p => p.package_name) || []).sort();

    case 'jas': case 'celana': case 'kemeja': case 'dasi': case 'changshan':
      const productNames = data.map(item => item[`name_${activeTab}`] || item[`kode_${activeTab}`]);
      return [...new Set(productNames)].filter(Boolean).sort((a, b) => a.localeCompare(b));
      
    default:
      return [];
  }
}, [activeTab, db, data]);

// Tambahkan effect ini agar filter reset saat pindah tab
React.useEffect(() => {
  setFilterValue("all");
}, [activeTab]);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
 {/* TOOLBAR SEARCH - RESPONSIVE VERSION */}
<div className="p-4 md:p-6 border-b bg-gray-50/50">
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
    
    {/* Sisi Kiri: Search & Filter */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
      
      {/* Input Search */}
      <div className="relative flex-1 sm:flex-none">
        <Search className="absolute left-3 top-3 text-gray-400" size={15} />
        <input 
          type="text" 
          placeholder={`Cari di ${activeTab}...`} 
          className="pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm outline-none w-full sm:w-64 shadow-sm focus:ring-2 focus:ring-slate-200" 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* Dropdown Filter Dinamis */}
      {activeTab !== 'notes' && filterOptions.length > 0 && (
        <div className="relative flex-1 sm:flex-none">
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-full sm:min-w-[200px] px-4 py-2.5 bg-white border rounded-xl text-[11px] font-black uppercase outline-none shadow-sm focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none pr-10"
          >
            <option value="all">
              {activeTab.includes('order') || activeTab.includes('history') ? '--- SEMUA CUSTOMER ---' : 
               activeTab === 'packages' ? '--- SEMUA PAKET ---' : '--- SEMUA KOLEKSI ---'}
            </option>
            {filterOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}
    </div>

    {/* Sisi Kanan: Action Buttons (Printer & Download) */}
    <div className="flex gap-2 w-full sm:w-auto justify-end">
      <button className="flex-1 sm:flex-none p-2.5 bg-white border rounded-xl shadow-sm hover:bg-gray-50 text-gray-600 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
        <Printer size={16} /> <span className="sm:hidden">Print</span>
      </button>
      <button className="flex-1 sm:flex-none p-2.5 bg-white border rounded-xl shadow-sm hover:bg-gray-50 text-gray-600 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
        <Download size={16} /> <span className="sm:hidden">Export</span>
      </button>
    </div>

  </div>
</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1200px]">
          <thead className="bg-white text-[13px] font-black uppercase text-gray-800 tracking-widest border-b">
            {activeTab === 'order_items' ? (
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Package</th>
                <th className="px-6 py-5">Booked</th>
                <th className="px-6 py-5">Start Date</th>
                <th className="px-6 py-5">End Date</th>
                <th className="px-6 py-5">Actual Return</th>
                <th className="px-6 py-5 ">Total Harga</th>
                <th className="px-6 py-5 text-right sticky right-0 bg-white">Action</th>
              </tr>
            ) : (
              <tr>
                {data.length > 0 && Object.keys(data[0]).map(key => <th key={key} className="px-6 py-5">{key.replace('_', ' ')}</th>)}
                <th className="px-6 py-5 text-right sticky right-0 bg-white">Action</th>
              </tr>
            )}
          </thead>

          <tbody className="text-[14px] font-bold text-gray-800">
            {filteredData.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-amber-50/30 transition-colors">
                {activeTab === 'order_items' ? (
                  <>
                    <td className="px-6 py-4">{item.id_order}</td>
                    <td className="px-6 py-4 text-blue-600 cursor-pointer hover:underline font-black" onClick={() => { 
                      const currentDisc = item.customer_full?.discount;
                      // Normalisasi: "5.00" -> 5 -> "5" agar match dengan <option value="5">
                      const normalizedDisc = currentDisc ? parseFloat(currentDisc).toString() : "0";
                      setSelectedInfo({ type: 'customer', data: item.customer_full }); 
                      setTempDiscount(normalizedDisc); 
                    }}>
                      {item.display_customer}
                    </td>
                    <td className="px-6 py-4 text-amber-700 cursor-pointer hover:underline font-black" onClick={() => setSelectedInfo({ type: 'package', data: item.package_full })}>
                      {item.display_package}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setSelectedInfo({ type: 'items', data: item.booked_items, description: item.description_rent })} className="text-[10px] bg-gray-100 px-3 py-1.5 rounded-full font-black flex items-center gap-2 hover:bg-gray-200 uppercase">
                        <ShoppingBag size={12} /> Detail
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-800">{formatDateFull(item.start_dates)}</td>
                    <td className="px-6 py-4 text-gray-800">{formatDateFull(item.end_dates)}</td>
                    <td className="px-6 py-4 text-gray-800">{formatDateFull(item.actual_return_date)}</td>
                    <td className="px-6 py-4">
                      <span
                        onClick={() => setPriceDetails(item)}
                        className="text-blue-600 cursor-pointer hover:underline font-black text-[12px] uppercase tracking-tighter decoration-blue-300 underline-offset-4"
                      >
                        Lihat Harga
                      </span>
                    </td>
                  </>
                ) : (
                  Object.entries(item).map(([key, val], i) => (
                    <td key={i} className="px-6 py-4">
                      {key.includes('price') || key.includes('amount') || key.includes('deposit') || key.includes('fee') || key.includes('pendapatan') || key.includes('total') || key.includes('denda') || key.includes('omset')
                        ? formatIDR(val)
                        : (key.includes('date') || key.includes('at') || key.includes('mark') || key.includes('time')) && !key.includes('duration')
                          ? formatDateFull(val) : val?.toString() || '-'}
                    </td>
                  ))
                )}
                <td className="px-6 py-4 text-right sticky right-0 bg-white/90 border-l">
                {activeTab !== 'history_orders' && (
                  <div className="flex justify-end gap-3">
                    <Edit size={16} className="text-gray-400 hover:text-black cursor-pointer" onClick={() => { setEditingItem({ ...item, fromTable: activeTab }); setModalType('form_db'); }} />
                    {activeTab === 'order_items' ? (
                      <CheckCircle
                        size={16}
                        className={`cursor-pointer transition-colors ${(item.status_rent === 'Dikembalikan' || item.status_rent === 'Cancel')
                            ? "text-emerald-500 hover:text-emerald-700"
                            : "text-gray-300 cursor-not-allowed opacity-50"
                          }`}
                        onClick={() => {
                          if (item.status_rent === 'Dikembalikan' || item.status_rent === 'Cancel') {
                            setFinishOrderData(item);
                          }
                        }}
                        title={(item.status_rent === 'Dikembalikan' || item.status_rent === 'Cancel') ? "Konfirmasi Pesanan" : "Hanya bisa diselesaikan jika status sudah Dikembalikan atau Cancel"}
                      />
                    ) : (
                      <Trash2 size={16} className="text-gray-400 hover:text-rose-500 cursor-pointer" onClick={() => setDeleteConfirm({ id: Object.values(item)[0], table: activeTab })} />
                    )}
                  </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL HARGA OVERLAY */}
      {priceDetails && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setPriceDetails(null)}>
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm relative shadow-2xl border-b-8 border-slate-900" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPriceDetails(null)} className="absolute top-6 right-6 text-2xl text-gray-300 hover:text-black">&times;</button>

            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8D775F] mb-6 border-b pb-2 flex items-center gap-2">
              <Tag size={14} /> Rincian Pembayaran
            </h4>

            <div className="space-y-4">
              {/* Nama Paket */}
              <div className="text-center mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paket Terpilih</p>
                <p className="text-lg font-black text-slate-900">{priceDetails.display_package}</p>
              </div>

              {/* Harga Sewa */}
              <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center border border-gray-100">
                <span className="text-[9px] font-black uppercase text-gray-400">Harga Sewa</span>
                <span className="text-sm font-black text-gray-900">
                  {formatIDR(priceDetails.total_price)}
                </span>
              </div>

              {/* Deposit dari Tabel Paket */}
              <div className="bg-amber-50 p-4 rounded-2xl flex justify-between items-center border border-amber-100">
                <span className="text-[9px] font-black uppercase text-amber-600">Deposit Jaminan</span>
                <span className="text-sm font-black text-amber-900">
                  {formatIDR(priceDetails.package_full?.deposit || 0)}
                </span>
              </div>

              {/* Garis Total */}
              <div className="pt-2 mt-2 border-t-2 border-dashed border-gray-100">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-900">Total Dibayar</span>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900">
                      {formatIDR(Number(priceDetails.total_price) + Number(priceDetails.package_full?.deposit || 0))}
                    </p>

                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setPriceDetails(null)}
              className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
      {/* MODAL DETAIL OVERLAY */}
      {selectedInfo && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedInfo(null)}>
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedInfo(null)} className="absolute top-6 right-6 text-2xl text-gray-300 hover:text-black">&times;</button>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8D775F] mb-6 border-b pb-2 flex items-center gap-2">
              {selectedInfo.type === 'customer' && <Tag size={14} />}
              {selectedInfo.type === 'package' && <Box size={14} />}
              {selectedInfo.type === 'items' && <ShoppingBag size={14} />}
              {selectedInfo.type} Info
            </h4>

            {/* DETAIL CUSTOMER & DISCOUNT */}
            {selectedInfo.type === 'customer' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-[9px] text-gray-400 uppercase tracking-tighter">Nama Customer</p>
                  <p className="text-sm font-black">{selectedInfo.data.customer_name}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-[9px] text-green-600 uppercase tracking-tighter">WhatsApp Number</p>
                    <p className="text-sm font-black">{selectedInfo.data.customer_phone}</p>
                  </div>
                  <a href={`https://wa.me/${selectedInfo.data.customer_phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-200"><MessageCircle size={18} /></a>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl">
                  <p className="text-[9px] text-rose-600 uppercase tracking-tighter">Total Denda Terakumulasi</p>
                  <p className="text-sm font-black text-rose-900">{formatIDR(selectedInfo.data.penalty_fee)}</p>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-amber-600 mb-2 block ml-1">Set Discount</label>
                  <select
                    value={tempDiscount}
                    onChange={(e) => setTempDiscount(e.target.value)}
                    className="w-full p-4 bg-amber-50 rounded-2xl text-xs font-bold border-none outline-none ring-1 ring-amber-100 mb-4"
                  >
                    <option value="0">Normal (0%)</option>
                    <option value="5">3 paket (5%)</option>
                    <option value="7.5">4 paket (7.5%)</option>
                    <option value="10">5 paket (10%)</option>
                  </select>
                  <button
                    onClick={handleSaveDiscount}
                    className="w-full py-4 bg-[#1A120B] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all"
                  >
                    <Save size={14} /> Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* DETAIL PACKAGE */}
            {selectedInfo.type === 'package' && (
              <div className="space-y-3">
                <div className="text-center p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                  <h3 className="text-lg font-black text-amber-900">{selectedInfo.data.package_name}</h3>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{selectedInfo.data.duration_day} Hari Sewa</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[8px] text-gray-400 uppercase">Harga</p>
                    <p className="text-xs font-black">{formatIDR(selectedInfo.data.package_price)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[8px] text-gray-400 uppercase">Deposit</p>
                    <p className="text-xs font-black">{formatIDR(selectedInfo.data.deposit)}</p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-2xl col-span-2">
                    <p className="text-[8px] text-rose-400 uppercase">Denda Keterlambatan</p>
                    <p className="text-xs font-black text-rose-600">{formatIDR(selectedInfo.data.penalty_fee)} / Hari</p>
                  </div>
                </div>
              </div>
            )}

            {/* DETAIL BOOKED ITEMS */}
            {selectedInfo.type === 'items' && (
              <div className="space-y-4">
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scroll">
                  {selectedInfo.data.length > 0 ? selectedInfo.data.map((p, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-2xl border flex justify-between items-center group hover:bg-white transition-all">
                      <div>
                        <p className="text-xs font-black text-gray-800 uppercase tracking-tighter">{p.name}</p>
                        <p className="text-[9px] text-gray-400 font-black uppercase">{p.category} • {p.color}</p>
                      </div>
                      <span className="text-[10px] font-black px-3 py-1 bg-white border rounded-lg shadow-sm">SIZE {p.size}</span>
                    </div>
                  )) : <p className="text-center text-xs text-gray-400 py-10 font-bold uppercase italic tracking-widest">Tidak ada item terpilih</p>}
                </div>

                {selectedInfo.description && (
                  <div className="pt-4 border-t border-dashed border-gray-200">
                    <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Deskripsi Order:</p>
                    <p className="text-[11px] text-gray-600 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {selectedInfo.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;