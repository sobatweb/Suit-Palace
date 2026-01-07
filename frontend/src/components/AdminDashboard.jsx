import React, { useState } from 'react';
import { Menu, Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Import Komponen yang sudah dipecah
import Sidebar from '../components/dashboard/Sidebar';
import CalendarView from '../components/dashboard/CalendarView';
import InventoryTable from '../components/dashboard/InventoryTable';
import FormModal from '../components/modals/FormModal';
import MarkModal from '../components/modals/MarkModal';
import NoteModal from '../components/modals/NoteModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import FinishOrderModal from '../components/modals/FinishOrderModal';

const AdminDashboard = () => {
  // --- DATABASE STATE (Data tetap sama persis) ---
  const [db, setDb] = useState({
    admins: [{ id_admin: 1, username: 'admin_master' }],
    customers: [
      { id_customer: 1, customer_name: 'Budi Santoso', customer_phone: '0812345678', bank_account: 'BCA 12345', discount: 0 },
      { id_customer: 2, customer_name: 'Siti Aminah', customer_phone: '087712345', bank_account: 'Mandiri 998', discount: 10.00 }
    ],
    packages: [
      { id_package: 1, package_name: 'Wedding Premium', package_price: 750000, duration_day: 3, deposit: 100000, penalty_fee: 50000 },
      { id_package: 2, package_name: 'Pre-Wedding', package_price: 500000, duration_day: 2, deposit: 100000, penalty_fee: 30000 }
    ],
    jas: [{ id_jas: 1, name_jas: 'Slim Fit Charcoal', size_jas: 'L', color_jas: 'Abu Tua', stock_jas: 4, condition_jas: 'Baik' }],
    kemeja: [{ id_kemeja: 1, name_kemeja: 'White Poplin', size_kemeja: 'L', color_kemeja: 'Putih', stock_kemeja: 10, condition_kemeja: 'Baru' }],
    celana: [{ id_celana: 1, name_celana: 'Formal Black', size_celana: 'L', color_celana: 'Hitam', stock_celana: 8, condition_celana: 'Baik' }],
    changshan: [{ id_changshan: 1, name_changshan: 'Red Dragon Gold', size_changshan: 'XL', color_changshan: 'Merah', stock_changshan: 2, condition_changshan: 'Sangat Baik' }],
    dasi: [{ id_dasi: 1, kode_dasi: 'D-01', color_dasi: 'Navy', stock_dasi: 5, description_dasi: 'Silk Navy' }],
    booked: [
      { id_booked: 1, id_jas: 1, id_kemeja: 1, id_celana: 1, id_changshan: null, id_dasi: 1 },
      { id_booked: 2, id_jas: null, id_kemeja: null, id_celana: null, id_changshan: 1, id_dasi: null }
    ],
    order_items: [
      {
        id_order: 1, id_customer: 1, id_package: 1, id_booked: 1,
        start_dates: '2026-01-03', end_dates: '2026-01-05',
        total_price: 850000, amount_paid: 400000,
        status_rent: 'Overdue', status_order: 'Belum Selesai', description: 'Acara Hotel Mulia'
      }
    ],
    history_orders: [],
    notes: [{ id_note: 1, title: 'Info Cuci', content: 'Jas putih harus dry clean', date: '2026-01-06' }],
    marks: [{ id_mark: 1, date: '2026-01-06', note: 'Libur Nasional', color: '#e11d48' }]
  });

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('calendar');
  const [viewDate, setViewDate] = useState(new Date(2026, 0, 1));
  const [selectedDay, setSelectedDay] = useState(3);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [finishOrderData, setFinishOrderData] = useState(null);
  

  const selectedFullDate = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  const handleSaveItem = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    const table = editingItem?.fromTable || activeTab;
    const idField = Object.keys(db[table][0] || {})[0] || 'id';

    if (editingItem) {
      setDb(prev => ({
        ...prev,
        [table]: prev[table].map(item => Number(item[idField]) === Number(editingItem[idField]) ? { ...item, ...data } : item)
      }));
    } else {
      setDb(prev => ({
        ...prev,
        [table]: [...prev[table], { [idField]: Date.now(), ...data }]
      }));
    }
    setModalType(null);
    setEditingItem(null);
  };

  const handleSaveMarkNote = (table, newData) => {
    setDb(prev => ({ 
      ...prev, 
      [table]: [...(prev[table] || []), newData] 
    }));
  };

  const executeFinish = (orderId, condition, penalty) => {
    const order = db.order_items.find(o => o.id_order === orderId);
    if (!order) return;

    const omsetOrder = Number(order.total_price) + Number(penalty);
    const newHistory = {
      id_history: Date.now(),
      id_order: order.id_order,
      omset_order: omsetOrder,
      condition_return: condition
    };

    setDb(prev => ({
      ...prev,
      history_orders: [...prev.history_orders, newHistory],
      order_items: prev.order_items.filter(o => o.id_order !== orderId)
    }));
    setFinishOrderData(null);
  };

  const confirmDelete = () => {
    const { table, idField, id } = deleteConfirm;
    setDb(prev => ({ ...prev, [table]: prev[table].filter(item => item[idField] !== id) }));
    setDeleteConfirm(null);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1A120B]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} dbKeys={Object.keys(db)} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-x-hidden">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Menu className="lg:hidden cursor-pointer" onClick={() => setIsSidebarOpen(true)} />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">{activeTab.replace('_', ' ')}</h2>
          </div>
          {activeTab !== 'calendar' && (
            <button onClick={() => {setEditingItem(null); setModalType('form_db');}} className="px-6 py-3 bg-[#1A120B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-black">
              <Plus size={14}/> Add New
            </button>
          )}
        </header>

        {activeTab === 'calendar' ? (
          <CalendarView 
            db={db} 
            viewDate={viewDate} 
            setViewDate={setViewDate} 
            selectedDay={selectedDay} 
            setSelectedDay={setSelectedDay} 
            selectedFullDate={selectedFullDate} 
            setModalType={setModalType}
            setEditingItem={setEditingItem} 
            setDeleteConfirm={setDeleteConfirm}
            setFinishOrderData={setFinishOrderData}
            
          />
        ) : (
          <InventoryTable activeTab={activeTab} data={db[activeTab]} setEditingItem={setEditingItem} setModalType={setModalType} setDeleteConfirm={setDeleteConfirm} />
        )}
      </main>

      <AnimatePresence>
        {modalType === 'form_db' && <FormModal activeTab={activeTab} editingItem={editingItem} db={db} onClose={() => setModalType(null)} onSave={handleSaveItem} />}
        {modalType === 'mark' && <MarkModal selectedFullDate={selectedFullDate} onClose={() => setModalType(null)} onSave={(m) => handleSaveMarkNote('marks', m)} />}
        {modalType === 'note' && <NoteModal selectedFullDate={selectedFullDate} onClose={() => setModalType(null)} onSave={(n) => handleSaveMarkNote('notes', n)} />}
        {deleteConfirm && <DeleteConfirmModal deleteConfirm={deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={confirmDelete} />}
        {finishOrderData && <FinishOrderModal order={finishOrderData} onClose={() => setFinishOrderData(null)} onConfirm={executeFinish} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;