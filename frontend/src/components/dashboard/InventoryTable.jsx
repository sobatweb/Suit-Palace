import React, { useState, useRef } from 'react';
import { Search, Printer, Download, Edit, Trash2, MessageCircle, ShoppingBag, Tag, Save, Box, CheckCircle, CreditCard } from 'lucide-react';

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
  history_orders: ['order_date', 'customer_name', 'customer_phone', 'bank_account', 'package_name', 'omset_order', 'denda_paid', 'return_date', 'condition_return'],
  laundry: ['id_jas', 'id_kemeja', 'id_celana', 'id_vest', 'id_tuxedo', 'id_changshan', 'id_dasi', 'status_laundry'] 
};



const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:3000"
  : "https://abc.domainanda.com"; // Alamat backend saat di hosting


const InventoryTable = ({ activeTab, data, db, fetchData, setEditingItem, setModalType, setDeleteConfirm, setFinishOrderData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [filterValue, setFilterValue] = useState("all");
  const [sortValue, setSortValue] = useState("all");
  const [tempDiscount, setTempDiscount] = useState("0"); // State untuk menyimpan pilihan diskon sementara
  const tableRef = useRef(null);

  const formatDateFull = (dateStr) => {
    if (!dateStr || dateStr === '0000-00-00' || dateStr === 'null' || dateStr === '-') return '-';

    // Pastikan hanya mengambil bagian tanggal (YYYY-MM-DD) baik dari format ISO (T) maupun MySQL (spasi)
    const cleanDate = dateStr.toString().split('T')[0].split(' ')[0];
    const parts = cleanDate.split('-'); // [YYYY, MM, DD]

    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return '-';
  };
  // 2. Format Harga: Bulat tanpa .00
  const formatIDR = (amount) => {
    const value = Math.floor(Number(amount || 0));
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const getDisplayData = () => {
    let baseData = data || [];

    if (activeTab === 'order_items' && db) {
      baseData = baseData.map(order => {
        const customer = db.customers?.find(c => String(c.id_customer) === String(order.id_customer)) || {};
        const packageData = db.packages?.find(p => String(p.id_package) === String(order.id_package)) || {};
        const bookingRow = db.booked?.find(b => String(b.id_booked) === String(order.id_booked)) || {};

        const bookedItemsList = [];
        ['jas', 'kemeja', 'celana', 'changshan', 'dasi', 'vest', 'tuxedo'].forEach(cat => {
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
    }

    // Logika pengurutan Ascending untuk tab tertentu
    const sortTabs = ['packages', 'jas', 'kemeja', 'celana', 'changshan', 'dasi', 'vest', 'tuxedo'];
    if (sortTabs.includes(activeTab)) {
      return [...baseData].sort((a, b) => {
        const key = activeTab === 'packages' ? 'package_name' :
          activeTab === 'dasi' ? 'kode_dasi' : `name_${activeTab}`;

        const valA = (a[key] || "").toString();
        const valB = (b[key] || "").toString();
        return valA.localeCompare(valB);
      });
    }

    return baseData;
  };

  const [priceDetails, setPriceDetails] = useState(null);
  const isProductTab = ['jas', 'celana', 'kemeja', 'dasi', 'changshan', 'vest', 'tuxedo', 'packages'].includes(activeTab);

  const monthOptions = React.useMemo(() => {
    if (activeTab !== 'order_items' || !data) return [];
    const months = data.map(item => {
      if (!item.start_dates) return null;
      const d = new Date(item.start_dates);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
    }).filter(Boolean);
    return [...new Set(months)].sort((a, b) => new Date(b) - new Date(a));
  }, [activeTab, data]);

  const baseFilteredData = getDisplayData().filter(item => {
    const matchesSearch = isProductTab
      ? (item[`name_${activeTab}`] || item[`kode_${activeTab}`] || item.package_name || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
      : Object.values(item).some(v => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesDropdown = true;
    if (filterValue !== "all") {
      if (activeTab === 'order_items') {
        matchesDropdown = (item.display_customer === filterValue || item.customer_name === filterValue);
      } else if (activeTab === 'history_orders') {
        if (!item.order_date) {
          matchesDropdown = false;
        } else {
          const d = new Date(item.order_date);
          const itemPeriod = !isNaN(d.getTime())
            ? d.toLocaleString('en-GB', { month: 'long', year: 'numeric' })
            : null;
          matchesDropdown = itemPeriod === filterValue;
        }
      } else if (activeTab === 'packages') {
        matchesDropdown = item.package_name === filterValue;
      } else if (isProductTab) {
        // Mencocokkan nama produk (contoh: name_jas atau kode_jas)
        matchesDropdown = item[`name_${activeTab}`] === filterValue || item[`kode_${activeTab}`] === filterValue;
      }
    }

    return matchesSearch && matchesDropdown;
  });

  const filteredData = activeTab === 'order_items'
    ? (() => {
        let result = [...baseFilteredData];
        if (sortValue === "all") {
          // Urutkan berdasarkan Order Date Ascending secara default
          result.sort((a, b) => new Date(a.order_date) - new Date(b.order_date));
        } else if (sortValue === "SORT_DATE_ASC") {
          result.sort((a, b) => new Date(a.start_dates) - new Date(b.start_dates));
        } else {
          // Filter berdasarkan bulan (start_dates)
          result = result.filter(item => {
            if (!item.start_dates) return false;
            const d = new Date(item.start_dates);
            const itemPeriod = d.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
            return itemPeriod === sortValue;
          }).sort((a, b) => new Date(a.start_dates) - new Date(b.start_dates));
        }
        return result;
      })()
    : activeTab === 'history_orders'
      ? [...baseFilteredData].sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
      : baseFilteredData;
  // Fungsi untuk simpan diskon customer
  const handleSaveDiscount = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/customers/${selectedInfo.data.id_customer}`, {
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
        const custNames = currentData.map(item => item.display_customer || item.customer_name);
        const sortedCustNames = [...new Set(custNames)].filter(Boolean).sort((a, b) => a.localeCompare(b));
        // Tambahkan opsi urutan tanggal di awal list
        return sortedCustNames;

      case 'history_orders':
        const periods = currentData.map(item => {
          if (!item.order_date) return null;
          const d = new Date(item.order_date);
          if (isNaN(d.getTime())) return null;
          return d.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
        }).filter(Boolean);

        const currentPeriod = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' });
        if (!periods.includes(currentPeriod)) {
          periods.push(currentPeriod);
        }

        return [...new Set(periods)].sort((a, b) => {
          return new Date(b) - new Date(a);
        });

      default:
        return [];
    }
  }, [activeTab, db, data]);

  // Tambahkan effect ini agar filter reset saat pindah tab
  React.useEffect(() => {
    if (activeTab === 'history_orders') {
      const currentPeriod = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' });
      setFilterValue(currentPeriod);
    } else {
      setFilterValue("all");
    }
    setSortValue("all");
  }, [activeTab]);

  const handlePrint = () => {
    if (!tableRef.current) return;

    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=1000,height=700');

    printWindow.document.write(`
    <html>
      <head>
        <title>Print ${activeTab}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            font-size: 12px;
          }
          th {
            background-color: #f3f3f3;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <h2>${activeTab.toUpperCase()}</h2>
        ${printContent}
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Tambahkan di dalam komponen InventoryTable, di bawah handlePrint
  const handleExportExcel = () => {
    const table = tableRef.current;
    const fileName = `Laporan_${activeTab}_${new Date().toLocaleDateString()}.csv`;

    // Logika sederhana export ke CSV (yang bisa dibuka Excel) tanpa library tambahan
    let csvContent = "";
    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {
      const cols = row.querySelectorAll("th, td");
      const rowData = Array.from(cols)
        .map(col => `"${col.innerText.replace(/"/g, '""')}"`)
        .join(",");
      csvContent += rowData + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-4xl shadow-sm border overflow-hidden">
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
                placeholder={
                  activeTab === 'order_items' ? 'Cari Nama Customer' :
                    activeTab === 'packages' ? 'Cari Nama Paket' :
                      isProductTab ? `Cari Nama ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` :
                        'Cari Data...'
                }
                className="pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm outline-none w-full sm:w-64 shadow-sm focus:ring-2 focus:ring-slate-200"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Dropdown Filter Dinamis */}
            {activeTab !== 'notes' && (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Filter Utama (Customer/Periode/Paket) */}
                {filterOptions.length > 0 && (
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      className="w-full sm:min-w-50 px-4 py-2.5 bg-white border rounded-xl text-[11px] font-black uppercase outline-none shadow-sm focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none pr-10"
                    >
                      <option value="all">
                        {activeTab === 'order_items' ? '--- SEMUA CUSTOMER ---' :
                          activeTab === 'history_orders' ? '--- SEMUA PERIODE ---' :
                            `--- NAMA ${activeTab.toUpperCase()} ---`}
                      </option>
                      {filterOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Dropdown Sort khusus Order Items */}
                {activeTab === 'order_items' && (
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={sortValue}
                      onChange={(e) => setSortValue(e.target.value)}
                      className="w-full sm:min-w-50 px-4 py-2.5 bg-white border rounded-xl text-[11px] font-black uppercase outline-none shadow-sm focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none pr-10"
                    >
                      <option value="all">--- SEMUA ORDER ---</option>
                      <option value="SORT_DATE_ASC">--- TANGGAL TERDEKAT ---</option>
                      {monthOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sisi Kanan: Action Buttons (Printer & Download) */}
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button onClick={handlePrint} className="flex-1 sm:flex-none p-2.5 bg-white border rounded-xl shadow-sm hover:bg-gray-50 text-gray-600 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <Printer size={16} /> <span className="sm:hidden">Print</span>
            </button>

            {activeTab !== 'order_items' && (
              <button
                onClick={handleExportExcel}
                className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 border border-slate-900 rounded-xl shadow-lg shadow-slate-200 hover:bg-black text-white flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
              >
                <Download size={16} className="text-emerald-400" />
                <span>Excel</span>
              </button>
            )}

          </div>

        </div>
      </div>
      <div className="overflow-x-auto" ref={tableRef}>
        <table className="w-full text-left">
          <thead className={`bg-white ${activeTab === 'history_orders' ? 'text-[12px]' : 'text-[14px]'} font-black uppercase text-gray-900 tracking-widest border-b`}>
            {activeTab === 'order_items' ? (
              <tr>
                <th className="px-6 py-5">Order Date</th>
                <th className="px-6 py-6">Customer</th>
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
                {(tableSchemas[activeTab] || (data.length > 0 ? Object.keys(data[0]).filter(key => !key.startsWith('id_')) : []))
                  .map(key => {
                    let displayName = key.replace('_', ' ');
                    if (key.startsWith('id_')) {
                        displayName = key.replace('id_', '');
                      }
                    if (activeTab === 'history_orders') {
                      if (key === 'omset_order') displayName = 'Package Price';
                      if (key === 'return_date') displayName = 'Finish Order';
                      if (key === 'condition_return') displayName = 'Description Order';
                    }
                    return <th key={key} className="px-6 py-5">{displayName}</th>;
                  })}
                {activeTab !== 'history_orders' && <th className="px-6 py-5 text-right sticky right-0 bg-white">Action</th>}
              </tr>
            )}
          </thead>

          
<tbody className={`${activeTab === 'history_orders' ? 'text-[12px]' : 'text-[14px]'} font-bold text-gray-800`}>
  {filteredData.map((item, idx) => (
    <tr key={idx} className="border-b hover:bg-amber-50/30 transition-colors">
      {activeTab === 'order_items' ? (
        <>
          <td className="px-6 py-4 text-gray-800">{formatDateFull(item.order_date)}</td>
          <td className="px-6 py-4 text-blue-600 cursor-pointer hover:underline font-black" onClick={() => {
            const currentDisc = item.customer_full?.discount;
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
            <button onClick={() => setSelectedInfo({ type: 'items', data: item.booked_items, description: item.condition_return })} className="text-[10px] bg-gray-100 px-3 py-1.5 rounded-full font-black flex items-center gap-2 hover:bg-gray-200 uppercase">
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
        (tableSchemas[activeTab] || Object.keys(item).filter(k => !k.startsWith('id_laundry')))
          .map((key, i) => {
           const val = item[key];

// LOGIKA KHUSUS LAUNDRY - Foreign Keys
if (activeTab === 'laundry' && key.startsWith('id_') && key !== 'id_laundry') {
  const category = key.replace('id_', '');
  const targetTable = db[category] || [];
  const found = targetTable.find(t => String(t[`id_${category}`]) === String(val));
  
  if (!found || !val) {
    return <td key={i} className="px-6 py-4 text-gray-300 italic text-[11px]">--</td>;
  }
  
  return (
    <td key={i} className="px-6 py-4">
      <div className="flex flex-col leading-tight">
        <span className="font-black text-[12px] text-gray-900">
          {found[`name_${category}`] || found[`kode_${category}`]}
        </span>
        <span className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">
          {found[`size_${category}`]} • {found[`color_${category}`]}
        </span>
      </div>
    </td>
  );
}

// LOGIKA KHUSUS STATUS LAUNDRY
if (key === 'status_laundry') {
  return (
    <td key={i} className="px-6 py-4">
      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
        val === 'Selesai' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
      }`}>
        {val || 'Belum Selesai'}
      </span>
    </td>
  );
}

// LOGIKA DEFAULT
return (
              <td key={i} className="px-6 py-4">
                {key.includes('price') || key.includes('amount') || key.includes('deposit') || key.includes('fee') || key.includes('pendapatan') || key.includes('total') || key.includes('denda') || key.includes('omset')
                  ? formatIDR(val)
                  : (key.includes('date') || key.includes('at') || key.includes('mark') || key.includes('time')) && !key.includes('duration')
                    ? formatDateFull(val) 
                    : val?.toString() || '-'}
              </td>
            );
          })
      )}
      {activeTab !== 'history_orders' && (
        <td className="px-5 py-4 text-right sticky right-0 bg-white/90 border-l">
          <div className="flex justify-end gap-10">
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
            ) :(
        /* Tombol Delete: Hanya muncul JIKA bukan tab laundry */
        activeTab !== 'laundry' && (
          <Trash2 
            size={16} 
            className="text-gray-400 hover:text-rose-500 cursor-pointer" 
            onClick={() => setDeleteConfirm({ id: Object.values(item)[0], table: activeTab })} 
          />
        )
      )}
    </div>
        </td>
      )}
    </tr>
  ))}
</tbody>
          
        </table>
      </div>

      {/* SUMMARY INFO FOR ORDER ITEMS & HISTORY */}
      {(activeTab === 'order_items' || activeTab === 'history_orders') && (
        <div className="p-6 border-t bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                {activeTab === 'order_items' ? 'Total Amount Paid' : 'Total Omset'}
              </span>
              <span className="text-2xl font-black text-slate-900">
                {formatIDR(filteredData.reduce((sum, item) => {
                  if (activeTab === 'order_items') {
                    return sum + Number(item.amount_paid || 0);
                  }
                  return sum + Number(item.omset_order || 0) + Number(item.denda_paid || 0);
                }, 0))}
              </span>
            </div>

            {activeTab === 'order_items' && (
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-1">
                  Total Estimasi Omset
                </span>
                <span className="text-2xl font-black text-amber-600">
                  {formatIDR(filteredData.reduce((sum, item) => {
                    const hargaDasar = Number(item.total_price || 0);
                    const diskonPersen = Number(item.customer_full?.discount || 0);
                    const nominalDiskon = (hargaDasar * diskonPersen / 100);

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const endDate = new Date(item.end_dates?.split('T')[0] || new Date());
                    endDate.setHours(0, 0, 0, 0);

                    const returnDateStr = item.actual_return_date ? item.actual_return_date.split('T')[0] : null;
                    const calculationDate = (item.status_rent === 'Dikembalikan' && returnDateStr)
                      ? new Date(returnDateStr)
                      : today;
                    calculationDate.setHours(0, 0, 0, 0);

                    let penaltyFee = 0;
                    if (calculationDate > endDate) {
                      const daysLate = Math.floor((calculationDate - endDate) / (1000 * 60 * 60 * 24));
                      penaltyFee = daysLate * (item.package_full?.penalty_fee || 0);
                    }
                    return sum + (hargaDasar - nominalDiskon) + penaltyFee;
                  }, 0))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DETAIL HARGA OVERLAY */}
      {priceDetails && (
        <div className="fixed inset-0 z-600 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setPriceDetails(null)}>
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md relative shadow-2xl border-b-8 border-slate-900" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPriceDetails(null)} className="absolute top-6 right-6 text-2xl text-gray-300 hover:text-black">&times;</button>

            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8D775F] mb-6 border-b pb-2 flex items-center gap-2">
              <Tag size={14} /> Rincian Pembayaran
            </h4>

            <div className="space-y-4">
              {/* Nama Paket */}
              <div className="text-center mb-4">
                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Paket Terpilih</p>
                <p className="text-lg font-black text-slate-900">{priceDetails.display_package}</p>
              </div>

              {/* Harga Sewa */}
              <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center border border-gray-100">
                <span className="text-[14px] font-black uppercase text-gray-700">Harga Sewa</span>
                <span className="text-sm font-black text-gray-900">
                  {formatIDR(priceDetails.total_price)}
                </span>
              </div>

              {/* Diskon */}
              {Number(priceDetails.customer_full?.discount || 0) > 0 && (
                <div className="bg-emerald-50 p-4 rounded-2xl flex justify-between items-center border border-emerald-100">
                  <span className="text-[14px] font-black uppercase text-emerald-600">Diskon ({priceDetails.customer_full?.discount}%)</span>
                  <span className="text-sm font-black text-emerald-900">
                    - {formatIDR(Number(priceDetails.total_price) * Number(priceDetails.customer_full?.discount) / 100)}
                  </span>
                </div>
              )}

              {/* Deposit dari Tabel Paket */}
              <div className="bg-amber-50 p-4 rounded-2xl flex justify-between items-center border border-amber-100">
                <span className="text-[14px] font-black uppercase text-amber-600">Deposit Jaminan</span>
                <span className="text-sm font-black text-amber-900">
                  {formatIDR(priceDetails.package_full?.deposit || 0)}
                </span>
              </div>

              {/*  PENALTY FEE  */}
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const calculationDate = (priceDetails.status_rent === 'Dikembalikan' && priceDetails.actual_return_date)
                  ? new Date(priceDetails.actual_return_date.split('T')[0])
                  : today;

                const endDate = new Date(priceDetails.end_dates.split('T')[0]);
                endDate.setHours(0, 0, 0, 0);

                let penaltyFee = 0;
                let daysLate = 0;

                if (calculationDate > endDate) {
                  daysLate = Math.floor((calculationDate - endDate) / (1000 * 60 * 60 * 24));
                  penaltyFee = daysLate * (priceDetails.package_full?.penalty_fee || 0);
                }

                if (penaltyFee > 0) {
                  return (
                    <div className="bg-rose-50 p-4 rounded-2xl flex justify-between items-center border border-rose-100">
                      <div>
                        <span className="text-[14px] font-black uppercase text-rose-600">Penalty Fee</span>
                        <p className="text-[11px] text-rose-400 font-bold">({daysLate} hari keterlambatan)</p>
                      </div>
                      <span className="text-sm font-black text-rose-900">
                        + {formatIDR(penaltyFee)}
                      </span>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Baris Estimasi Omset */}
              <div className="flex justify-between items-center px-1 mt-10">
                <span className="text-[10px] font-bold uppercase text-slate-500">Estimasi Total Omset </span>
                <span className="text-sm font-bold text-slate-700">
                  {(() => {
                    // 1. Harga Paket
                    const hargaDasar = Number(priceDetails.total_price || 0);

                    // 2. Nominal Diskon
                    const diskonPersen = Number(priceDetails.customer_full?.discount || 0);
                    const nominalDiskon = (hargaDasar * diskonPersen / 100);

                    // 3. Hitung Denda (Tanpa Deposit)
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const endDate = new Date(priceDetails.end_dates.split('T')[0]);
                    endDate.setHours(0, 0, 0, 0);

                    const returnDateStr = priceDetails.actual_return_date ? priceDetails.actual_return_date.split('T')[0] : null;
                    const calculationDate = (priceDetails.status_rent === 'Dikembalikan' && returnDateStr)
                      ? new Date(returnDateStr)
                      : today;
                    calculationDate.setHours(0, 0, 0, 0);

                    let penaltyFee = 0;
                    if (calculationDate > endDate) {
                      const daysLate = Math.floor((calculationDate - endDate) / (1000 * 60 * 60 * 24));
                      penaltyFee = daysLate * (priceDetails.package_full?.penalty_fee || 0);
                    }

                    // RUMUS OMSET: Harga Paket - Diskon + Denda (TANPA DEPOSIT)
                    const estimasiOmset = (hargaDasar - nominalDiskon) + penaltyFee;

                    return formatIDR(estimasiOmset);
                  })()}
                </span>
              </div>
              {/* Garis Total */}
              <div className="flex justify-between items-center px-1 border-t pt-4 mt-2">
                <span className="text-[14px] font-black uppercase text-slate-900">Total Tagihan </span>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-900">
                    {(() => {
                      // 1. Pastikan mengambil harga paket yang konsisten
                      const hargaDasar = Number(priceDetails.total_price || 0);

                      // 2. Ambil diskon dari customer_full
                      const diskonPersen = Number(priceDetails.customer_full?.discount || 0);
                      const nominalDiskon = (hargaDasar * diskonPersen / 100);

                      // 3. Ambil Deposit
                      const deposit = Number(priceDetails.package_full?.deposit || 0);

                      // 4. Hitung Denda (Penalty)
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      // Ambil tanggal akhir (end_dates)
                      const endDate = new Date(priceDetails.end_dates.split('T')[0]);
                      endDate.setHours(0, 0, 0, 0);

                      // Gunakan tanggal kembali jika sudah ada, jika belum gunakan hari ini
                      const returnDateStr = priceDetails.actual_return_date ? priceDetails.actual_return_date.split('T')[0] : null;
                      const calculationDate = (priceDetails.status_rent === 'Dikembalikan' && returnDateStr)
                        ? new Date(returnDateStr)
                        : today;
                      calculationDate.setHours(0, 0, 0, 0);

                      let penaltyFee = 0;
                      if (calculationDate > endDate) {
                        const daysLate = Math.floor((calculationDate - endDate) / (1000 * 60 * 60 * 24));
                        penaltyFee = daysLate * (priceDetails.package_full?.penalty_fee || 0);
                      }

                      // RUMUS SESUAI REQUEST: Harga Paket - Diskon + Deposit + Denda
                      const totalAkhir = (hargaDasar - nominalDiskon) + deposit + penaltyFee;

                      return formatIDR(totalAkhir);
                    })()}
                  </p>
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
        <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedInfo(null)}>
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-120 relative shadow-2xl" onClick={e => e.stopPropagation()}>
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
                  <p className="text-[11px] text-gray-500 uppercase tracking-tighter">Nama Customer</p>
                  <p className="text-sm font-black">{selectedInfo.data.customer_name}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-[11px] text-green-600 uppercase tracking-tighter">WhatsApp Number</p>
                    <p className="text-sm font-black">{selectedInfo.data.customer_phone}</p>
                  </div>
                  <a href={`https://wa.me/${selectedInfo.data.customer_phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-200"><MessageCircle size={18} /></a>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-[11px] text-blue-600 uppercase tracking-tighter">Bank Account</p>
                    <p className="text-sm font-black">{selectedInfo.data.bank_account || '-'}</p>
                  </div>
                  <div className="p-3 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-200">
                    <CreditCard size={18} />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-amber-600 mb-2 block ml-1">Set Discount</label>
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
                <div className="text-center p-6 bg-amber-50 rounded-4xl border border-amber-100">
                  <h3 className="text-lg font-black text-amber-900">{selectedInfo.data.package_name}</h3>
                  <p className="text-[12px] font-bold text-amber-600 uppercase tracking-widest">{selectedInfo.data.duration_day} Hari Sewa</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[11px] text-gray-600 uppercase">Harga</p>
                    <p className="text-xs font-black">{formatIDR(selectedInfo.data.package_price)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[11px] text-gray-600 uppercase">Deposit</p>
                    <p className="text-xs font-black">{formatIDR(selectedInfo.data.deposit)}</p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-2xl col-span-2">
                    <p className="text-[11px] text-rose-400 uppercase">Denda Keterlambatan</p>
                    <p className="text-xs font-black text-rose-600">{formatIDR(selectedInfo.data.penalty_fee)} / Hari</p>
                  </div>
                </div>
              </div>
            )}

            {/* DETAIL BOOKED ITEMS */}
            {selectedInfo.type === 'items' && (
              <div className="space-y-15">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scroll">
                  {selectedInfo.data.length > 0 ? selectedInfo.data.map((p, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-2xl border flex justify-between items-center group hover:bg-white transition-all">
                      <div>
                        <p className="text-[15px] font-black text-gray-900 tracking-tighter">{p.name}</p>
                        <p className="text-[12px] text-gray-600 font-black">{p.category} • {p.color}</p>
                      </div>
                      <span className="text-[11px] font-black px-3 py-1 bg-white border rounded-lg shadow-sm">SIZE: {p.size}</span>
                    </div>
                  )) : <p className="text-center text-xs text-gray-400 py-10 font-bold uppercase italic tracking-widest">Tidak ada item terpilih</p>}
                </div>

                {selectedInfo.description && (
                  <div className="pt-4 border-t border-dashed border-gray-200">
                    <p className="text-[15px] font-black uppercase text-gray-500 mb-1">Deskripsi Order:</p>
                    <p className="text-[13px] text-gray-900 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
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