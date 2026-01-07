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
  // --- DATABASE STATE ---
  const [db, setDb] = useState({
    admins: [],
    customers: [],
    packages: [],
    jas: [],
    kemeja: [],
    celana: [],
    changshan: [],
    dasi: [],
    booked: [],
    order_items: [],
    history_orders: [],
    notes: [],
    marks: []
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

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [dashboardRes, customersRes, jasRes, kemejaRes, celanaRes, changshanRes, dasiRes, packagesRes, ordersRes] = await Promise.all([
        fetch('/api/dashboard').then(res => res.json()),
        fetch('/api/customers').then(res => res.json()),
        fetch('/api/inventory/jas').then(res => res.json()),
        fetch('/api/inventory/kemeja').then(res => res.json()),
        fetch('/api/inventory/celana').then(res => res.json()),
        fetch('/api/inventory/changshan').then(res => res.json()),
        fetch('/api/inventory/dasi').then(res => res.json()),
        fetch('/api/inventory/packages').then(res => res.json()),
        fetch('/api/transaction/orders').then(res => res.json())
      ]);

      setDb(prev => ({
        ...prev,
        history_orders: dashboardRes.history || [],
        marks: dashboardRes.marks || [],
        notes: dashboardRes.notes || [],
        customers: customersRes || [],
        jas: jasRes || [],
        kemeja: kemejaRes || [],
        celana: celanaRes || [],
        changshan: changshanRes || [],
        dasi: dasiRes || [],
        packages: packagesRes || [],
        order_items: ordersRes || []
      }));
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    const table = editingItem?.fromTable || activeTab;
    const idField = Object.keys(db[table][0] || {})[0] || `id_${table}`; // Heuristic

    try {
      if (editingItem && editingItem[idField]) {
        // Update
        await fetch(`/api/inventory/${table}/${editingItem[idField]}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        // Create
        await fetch(`/api/inventory/${table}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      await fetchData(); // Reload all data for simplicity
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save");
    }

    setModalType(null);
    setEditingItem(null);
  };

  const handleSaveMarkNote = async (table, newData) => {
    // Determine endpoint based on table
    const endpoint = table === 'marks' ? '/api/dashboard/marks' : '/api/dashboard/notes';
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      fetchData();
    } catch (error) {
      console.error("Save Mark/Note failed", error);
    }
  };

  const executeFinish = async (orderId, condition, penalty) => {
    try {
      await fetch(`/api/transaction/orders/${orderId}/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          penalty_paid: penalty,
          description_rent: condition
        })
      });
      fetchData();
      setFinishOrderData(null);
    } catch (error) {
      console.error("Finish order failed", error);
    }
  };

  const confirmDelete = async () => {
    const { table, idField, id } = deleteConfirm;
    try {
      // Determine endpoint. Special case for customers?
      let url = `/api/inventory/${table}/${id}`;
      if (table === 'customers') url = `/api/customers/${id}`;

      await fetch(url, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error("Delete failed", error);
    }
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
            <button onClick={() => { setEditingItem(null); setModalType('form_db'); }} className="px-6 py-3 bg-[#1A120B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-black">
              <Plus size={14} /> Add New
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