import React, { useMemo, useState } from 'react';
import { Database, Search } from 'lucide-react';

const DailyStock = ({ db, selectedFullDate }) => {
  const [stockSearch, setStockSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState('all');

  const availableStock = useMemo(() => {
    const categories = ['jas', 'kemeja', 'celana', 'changshan', 'dasi', 'vest', 'tuxedo'];
    let results = [];

    categories.forEach(cat => {
      if (categoryFilter !== 'all' && cat !== categoryFilter) return;
      
      const items = db[cat] || [];
      items.forEach(item => {
        const idField = cat === 'dasi' ? 'id_dasi' : `id_${cat}`;
        const nameField = cat === 'dasi' ? 'kode_dasi' : `name_${cat}`;
        const sizeValue = item.size || item[`size_${cat}`] || '-';
        const colorValue = item.color || item[`color_${cat}`] || '-';
        const totalStockInitial = Number(item[`stock_${cat}`]) || 0;

     // Copy bagian ini ke dalam loop items.forEach di DailyStock.jsx
const usedCount = (db.order_items || []).filter(order => {
  // 1. Identifikasi Item: Cek apakah item (jas/kemeja/dll) ini ada di pesanan tersebut
  const idInOrder = order[`id_${cat}`];
  if (!idInOrder || !item[idField]) return false;
  if (String(idInOrder) !== String(item[idField])) return false;

  // 2. Filter Tanggal: Cek apakah hari yang dipilih berada dalam rentang sewa
  const start = order.start_dates ? order.start_dates.split('T')[0] : '';
  const end = order.end_dates ? order.end_dates.split('T')[0] : '';
  const isDateOverlap = selectedFullDate >= start && selectedFullDate <= end;
  if (!isDateOverlap) return false;

  // 3. LOGIKA STATUS (Sesuai Struktur DB Anda):
  // Kita anggap stok berkurang HANYA jika statusnya sedang 'Booked' atau 'Diambil'
  const statusRent = order.status_rent; // 'Booked', 'Diambil', 'Dikembalikan', 'Cancel'
  
  // Jika berubah dari 'Booked' ke 'Diambil', hasil isOccupied tetap TRUE (stok tidak berubah)
  // Jika berubah ke 'Cancel' atau 'Dikembalikan', hasil isOccupied jadi FALSE (stok kembali)
  const isOccupied = (statusRent === 'Booked' || statusRent === 'Diambil');

  // 4. Double Check: Pastikan order secara keseluruhan belum diselesaikan
  const isNotFinished = order.status_order !== 'Sudah Selesai';

  return isOccupied && isNotFinished;
}).length;

        const currentRemaining = totalStockInitial - usedCount;

        if (
          item[nameField]?.toLowerCase().includes(stockSearch.toLowerCase()) ||
          sizeValue.toString().toLowerCase().includes(stockSearch.toLowerCase()) ||
          colorValue.toString().toLowerCase().includes(stockSearch.toLowerCase())
        ) {
          results.push({
            id: item[idField],
            name: item[nameField],
            category: cat,
            size: sizeValue,
            color: colorValue,
            remaining: currentRemaining
          });
        }
      });
    });
    return results;
  }, [db, selectedFullDate, stockSearch, categoryFilter]);

  return (
    <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1A120B] text-white rounded-xl"><Database size={20} /></div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-800">Cek Stok Tersedia</h4>
            <p className="text-[9px] font-bold text-gray-400 uppercase">{selectedFullDate}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select 
            className="bg-gray-50 border-none ring-1 ring-gray-200 rounded-xl text-[10px] font-black uppercase px-4 py-2 outline-none focus:ring-[#1A120B]"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Semua</option>
            <option value="jas">Jas</option>
            <option value="kemeja">Kemeja</option>
            <option value="celana">Celana</option>
            <option value="changshan">Changshan</option>
            <option value="dasi">Dasi</option>
            <option value="vest">Vest</option>
            <option value="tuxedo">Tuxedo</option>
          </select>
          <div className="relative w-48">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Cari Nama / Warna" 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black outline-none border-none ring-1 ring-gray-200 focus:ring-[#1A120B]"
              onChange={(e) => setStockSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-75 overflow-y-auto pr-2 scrollbar-hide">
        {availableStock.map((s, idx) => (
          <div key={idx} className={`p-4 rounded-3xl border transition-all ${s.remaining <= 0 ? 'bg-rose-50 border-rose-100' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] font-black text-gray-500 uppercase px-2 py-0.5 bg-white rounded-lg border">{s.category}</span>
              <span className="text-[10px] font-black text-gray-900 bg-white border px-2 py-0.5 rounded-lg">{s.size}</span>
            </div>
            <p className="text-[11px] font-black text-gray-800 leading-tight mb-3 uppercase truncate">{s.name}</p>
            <p className="text-[10px] font-black text-gray-500 mb-2">{s.color}</p>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Stock</span>
              <span className={`text-[14px] font-black ${s.remaining <= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {s.remaining}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyStock;