import React, { useMemo, useState } from 'react';
import { Database, Search } from 'lucide-react';

const DailyStock = ({ db, selectedFullDate }) => {
  const [stockSearch, setStockSearch] = useState("");

  const availableStock = useMemo(() => {
    const categories = ['jas', 'kemeja', 'celana', 'changshan', 'dasi'];
    let results = [];

    categories.forEach(cat => {
      db[cat].forEach(item => {
        // Ambil ID field sesuai kategori (contoh: id_jas)
        const idField = cat === 'dasi' ? 'id_dasi' : `id_${cat}`;
        const nameField = cat === 'dasi' ? 'kode_dasi' : `name_${cat}`;
        const totalStock = Number(item[`stock_${cat}`]);

        // HITUNG PENGGUNAAN:
        // Cari semua order yang aktif pada tanggal terpilih
        const usedCount = db.order_items.filter(order => {
          const isDateActive = selectedFullDate >= order.start_dates && selectedFullDate <= order.end_dates;
          if (!isDateActive) return false;

          // Cari data booked untuk order tersebut
          const bookedData = db.booked.find(b => Number(b.id_booked) === Number(order.id_booked));
          
          // Cek apakah di dalam pesanan tersebut ada ID barang ini
          return bookedData && Number(bookedData[idField]) === Number(item[idField]);
        }).length;

        results.push({ 
          category: cat, 
          name: item[nameField], 
          available: totalStock - usedCount, 
          total: totalStock 
        });
      });
    });

    return results.filter(r => r.name.toLowerCase().includes(stockSearch.toLowerCase()));
  }, [db, selectedFullDate, stockSearch]);

  return (
    <div className="bg-white p-6 rounded-[2rem] border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Database size={14}/> Sisa Stok: {selectedFullDate}
        </h4>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-300" size={14} />
          <input 
            type="text" 
            placeholder="Cari produk..." 
            className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-[#8D775F] w-48 shadow-inner" 
            onChange={(e)=>setStockSearch(e.target.value)} 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-48 overflow-y-auto pr-2 custom-scroll">
        {availableStock.map((s, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[7px] font-black text-[#8D775F] uppercase mb-1">{s.category}</p>
            <p className="text-[9px] font-bold leading-tight line-clamp-1">{s.name}</p>
            <div className={`mt-2 text-[11px] font-black ${s.available <= 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
              {s.available} <span className="text-[8px] text-gray-300">/ {s.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyStock;