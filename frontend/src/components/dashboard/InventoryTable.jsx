import React, { useState } from 'react';
import { Search, Printer, Download, Edit, Trash2 } from 'lucide-react';

const InventoryTable = ({ activeTab, data, setEditingItem, setModalType, setDeleteConfirm }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter(item => 
    Object.values(item).some(v => v?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-300" size={14}/>
          <input 
            type="text" 
            placeholder={`Cari di ${activeTab}...`} 
            className="pl-10 pr-4 py-2.5 bg-white border rounded-xl text-xs font-bold outline-none w-64 shadow-sm" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-white border rounded-xl shadow-sm hover:bg-gray-50"><Printer size={16}/></button>
          <button className="p-2.5 bg-white border rounded-xl shadow-sm hover:bg-gray-50"><Download size={16}/></button>
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left min-w-[1200px]">
          <thead className="bg-white text-[9px] font-black uppercase text-gray-400 tracking-widest border-b">
            <tr>
              {data.length > 0 && Object.keys(data[0]).map(key => <th key={key} className="px-6 py-5 whitespace-nowrap">{key.replace('_', ' ')}</th>)}
              <th className="px-6 py-5 text-right sticky right-0 bg-white">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-[10px] font-bold text-gray-600">
            {filteredData.map((item, idx) => {
              const idField = Object.keys(item)[0];
              return (
                <tr key={idx} className="border-b hover:bg-gray-50/50">
                  {Object.values(item).map((val, i) => <td key={i} className="px-6 py-4 truncate max-w-[200px]">{val?.toString() || '-'}</td>)}
                  <td className="px-6 py-4 text-right flex justify-end gap-3 sticky right-0 bg-white/80 backdrop-blur-sm">
                    <Edit size={14} className="text-gray-300 hover:text-black cursor-pointer" onClick={() => {setEditingItem({...item, fromTable: activeTab}); setModalType('form_db');}} />
                    <Trash2 size={14} className="text-gray-300 hover:text-rose-500 cursor-pointer" onClick={() => setDeleteConfirm({ table: activeTab, idField, id: item[idField] })} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;