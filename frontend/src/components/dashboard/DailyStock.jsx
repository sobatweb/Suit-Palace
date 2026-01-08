import React, { useMemo, useState } from 'react';
import { Database, Search } from 'lucide-react';

const DailyStock = ({ db, selectedFullDate }) => {
  const [stockSearch, setStockSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState('all');

  const availableStock = useMemo(() => {
    const categories = ['jas', 'kemeja', 'celana', 'changshan', 'dasi'];
    let results = [];

    categories.forEach(cat => {
      if (categoryFilter !== 'all' && cat !== categoryFilter) return;
      
      const items = db[cat] || [];
      items.forEach(item => {
        const idField = cat === 'dasi' ? 'id_dasi' : `id_${cat}`;
        const nameField = cat === 'dasi' ? 'kode_dasi' : `name_${cat}`;
        const sizeValue = item.size || item[`size_${cat}`] || '-';
        const totalStockInitial = Number(item[`stock_${cat}`]) || 0;

        // LOGIKA PENGURANGAN STOK OTOMATIS
        const usedCount = (db.order_items || []).filter(order => {
          const isDateOverlap = selectedFullDate >= order.start_dates && selectedFullDate <= order.end_dates;
          const hasThisItem = order.items && order.items.some(oi => 
            oi.category === cat && Number(oi.id_item) === Number(item[idField])
          );
          const isActive = order.status_rent !== 'Dikembalikan' && order.status_order !== 'Sudah Selesai';
          return isDateOverlap && hasThisItem && isActive;
        }).length;

        const currentRemaining = totalStockInitial - usedCount;

        if (
          item[nameField]?.toLowerCase().includes(stockSearch.toLowerCase()) ||
          sizeValue.toString().toLowerCase().includes(stockSearch.toLowerCase())
        ) {
          results.push({
            id: item[idField],
            name: item[nameField],
            category: cat,
            size: sizeValue,
            remaining: currentRemaining
          });
        }
      });
    });
    return results;
  }, [db, selectedFullDate, stockSearch, categoryFilter]);

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-800">
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
          </select>
          <div className="relative w-48">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Cari..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black outline-none border-none ring-1 ring-gray-200 focus:ring-[#1A120B]"
              onChange={(e) => setStockSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
        {availableStock.map((s, idx) => (
          <div key={idx} className={`p-4 rounded-3xl border transition-all ${s.remaining <= 0 ? 'bg-rose-50 border-rose-100' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[8px] font-black text-gray-400 uppercase px-2 py-0.5 bg-white rounded-lg border">{s.category}</span>
              <span className="text-[10px] font-black text-gray-900 bg-white border px-2 py-0.5 rounded-lg">SZ: {s.size}</span>
            </div>
            <p className="text-[11px] font-black text-gray-800 leading-tight mb-3 uppercase truncate">{s.name}</p>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Ready</span>
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