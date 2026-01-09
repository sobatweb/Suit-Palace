import React, { useState } from 'react';
import { Menu, Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from "../components/modals/LogoutConfirmModal";

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

  const navigate = useNavigate();

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('calendar');
  const [viewDate, setViewDate] = useState(new Date(2026, 0, 1));
  const [selectedDay, setSelectedDay] = useState(3);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [finishOrderData, setFinishOrderData] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const selectedFullDate = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  // Helper to get headers with Auth
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch initial data
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [dashboardRes, customersRes, jasRes, kemejaRes, celanaRes, changshanRes, dasiRes, packagesRes, ordersRes, bookedRes] = await Promise.all([
        fetch('/api/dashboard', { headers }).then(res => res.json()),
        fetch('/api/customers', { headers }).then(res => res.json()),
        fetch('/api/inventory/jas', { headers }).then(res => res.json()),
        fetch('/api/inventory/kemeja', { headers }).then(res => res.json()),
        fetch('/api/inventory/celana', { headers }).then(res => res.json()),
        fetch('/api/inventory/changshan', { headers }).then(res => res.json()),
        fetch('/api/inventory/dasi', { headers }).then(res => res.json()),
        fetch('/api/inventory/packages', { headers }).then(res => res.json()),
        fetch('/api/transaction/orders', { headers }).then(res => res.json()),
        fetch('/api/inventory/booked', { headers }).then(res => res.json())
      ]);

      setDb(prev => ({
        ...prev,
        history_orders: Array.isArray(dashboardRes?.history_orders) ? dashboardRes.history_orders : (Array.isArray(dashboardRes?.history) ? dashboardRes.history : []),
        marks: Array.isArray(dashboardRes?.marks) ? dashboardRes.marks : [],
        notes: Array.isArray(dashboardRes?.notes) ? dashboardRes.notes : [],
        customers: Array.isArray(customersRes) ? customersRes : [],
        jas: Array.isArray(jasRes) ? jasRes : [],
        kemeja: Array.isArray(kemejaRes) ? kemejaRes : [],
        celana: Array.isArray(celanaRes) ? celanaRes : [],
        changshan: Array.isArray(changshanRes) ? changshanRes : [],
        dasi: Array.isArray(dasiRes) ? dasiRes : [],
        packages: Array.isArray(packagesRes) ? packagesRes : [],
        order_items: Array.isArray(ordersRes) ? ordersRes : [],
        booked: Array.isArray(bookedRes) ? bookedRes : []
      }));
    } catch (error) {
      console.error("Failed to fetch data", error);
      if (error.message.includes('401')) {
        navigate('/login');
      }
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSaveItem = async (items) => {
    try {
      const table = editingItem?.fromTable || activeTab;
      const isEdit = !!editingItem;

      let customerId = null;

      // Jika membuat order baru, simpan data customer terlebih dahulu ke tabel customers
      if (table === 'order_items' && !isEdit && items.length > 0) {
        const customerResponse = await fetch('/api/customers', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            customer_name: items[0].customer_name,
            customer_phone: items[0].customer_phone,
            bank_account: items[0].bank_account
          }),
        });

        if (!customerResponse.ok) {
          const errData = await customerResponse.json();
          throw new Error(errData.message || 'Gagal menyimpan data customer');
        }

        const customerData = await customerResponse.json();
        customerId = customerData.id_customer || customerData.id;
      }

      // items adalah array yang dikirim dari FormModal
      for (const item of items) {
        const method = isEdit ? 'PUT' : 'POST';

        let url = '';
        let body = item;

        if (table === 'order_items') {
          const id = isEdit ? editingItem.id_order : '';
          url = isEdit ? `/api/transaction/orders/${id}` : `/api/transaction/orders`;

          if (!isEdit) {
            const { customer_name, customer_phone, bank_account, ...rest } = item;
            body = {
              orderData: { ...rest, id_customer: customerId },
              bookingData: { ...rest }
            };
          } else {
            // Update Customer Info first if it's an order edit
            const customerId = editingItem.id_customer;
            if (customerId) {
              await fetch(`/api/customers/${customerId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                  customer_name: item.customer_name,
                  customer_phone: item.customer_phone,
                  bank_account: item.bank_account
                })
              });
            }

            // For Edit, strip synthetic fields
            const cleanedBody = {};
            Object.keys(item).forEach(key => {
              if (!key.startsWith('display_') && !key.startsWith('customer_') && !key.startsWith('package_') && key !== 'booked_items' && key !== 'fromTable' && key !== 'id_order') {
                cleanedBody[key] = item[key];
              }
            });
            body = cleanedBody;
          }
        } else if (table === 'customers') {
          const id = isEdit ? editingItem.id_customer : '';
          url = isEdit ? `/api/customers/${id}` : `/api/customers`;

          // Strip fromTable
          const { fromTable, id_customer, ...rest } = item;
          body = rest;
        } else {
          // Inventory tables (jas, kemeja, etc.)
          const idField = editingItem ? Object.keys(editingItem)[0] : '';
          const id = isEdit ? editingItem[idField] : '';
          url = isEdit
            ? `/api/inventory/${table}/${id}`
            : `/api/inventory/${table}`;

          // Strip fromTable and the primary key ID field
          const cleanedBody = {};
          Object.keys(item).forEach(key => {
            if (key !== 'fromTable' && key !== idField) {
              cleanedBody[key] = item[key];
            }
          });
          body = cleanedBody;
        }

        const response = await fetch(url, {
          method,
          headers: getAuthHeaders(),
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to save item');
        }
      }

      fetchData(); // Refresh data
      setModalType(null);
      setEditingItem(null);
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert(`Terjadi kesalahan saat menyimpan data: ${error.message}`);
    }
  };

  const handleSaveMarkNote = async (table, newData) => {
    // Determine endpoint based on table
    const endpoint = table === 'marks' ? '/api/dashboard/marks' : '/api/dashboard/notes';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newData)
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("Server error details:", errData);
        throw new Error(errData.message || `HTTP error! status: ${response.status}`);
      }
      await fetchData();
    } catch (error) {
      console.error("Save Mark/Note failed", error);
      alert('Failed to save. See console for details.');
    }
  };

  const executeFinish = async (orderId, condition) => {
    try {
      // 1. Selesaikan pesanan (memicu trigger history di database)
      await fetch(`/api/transaction/orders/${orderId}/finish`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          description_rent: condition
        })
      });

      // 2. Cari id_customer untuk pembersihan otomatis
      const orderData = db.order_items.find(o => String(o.id_order) === String(orderId));
      const customerId = orderData?.id_customer;

      // 3. Hapus order_items secara otomatis
      await fetch(`/api/transaction/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      // 4. Hapus customer secara otomatis
      if (customerId) {
        await fetch(`/api/customers/${customerId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      }

      fetchData();
      setFinishOrderData(null);
    } catch (error) {
      console.error("Finish order failed", error);
    }
  };

  const handleDeleteMarkNote = (table, id) => {
    setDeleteConfirm({ table, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { table, id } = deleteConfirm;
    try {
      if (table === 'order_items') {
        // Cari id_customer dari data order sebelum dihapus
        const orderToDelete = db.order_items.find(o => String(o.id_order) === String(id));
        const customerId = orderToDelete?.id_customer;

        // 1. Hapus Order terlebih dahulu (karena adanya relasi Foreign Key)
        await fetch(`/api/transaction/orders/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        // 2. Hapus Customer yang terkait jika ditemukan
        if (customerId) {
          await fetch(`/api/customers/${customerId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
        }
      } else {
        let url = `/api/inventory/${table}/${id}`;
        if (table === 'customers') {
          url = `/api/customers/${id}`;
        } else if (table === 'marks' || table === 'notes') {
          url = `/api/dashboard/${table}/${id}`;
        }

        await fetch(url, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      }

      fetchData(); // Refresh data
    } catch (error) {
      console.error("Delete failed", error);
      alert('Gagal menghapus data.');
    } finally {
      setDeleteConfirm(null); // Close modal
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1A120B]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        // Kita memfilter key yang tidak ingin ditampilkan di menu navigasi
        dbKeys={Object.keys(db).filter(key => !['admins', 'booked', 'marks', 'customers'].includes(key))}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogoutClick={() => setShowLogoutConfirm(true)}
      />

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
            onDeleteMarkNote={handleDeleteMarkNote}
          />
        ) : (
          <InventoryTable
            activeTab={activeTab}
            data={db[activeTab]}
            db={db} //
            fetchData={fetchData}
            setEditingItem={setEditingItem}
            setModalType={setModalType}
            setDeleteConfirm={setDeleteConfirm}
            setFinishOrderData={setFinishOrderData}
          />
        )}
      </main>

      <AnimatePresence>
        {modalType === 'form_db' && <FormModal activeTab={activeTab} editingItem={editingItem} db={db} onClose={() => setModalType(null)} onSave={handleSaveItem} />}
        {modalType === 'mark' && <MarkModal selectedFullDate={selectedFullDate} onClose={() => setModalType(null)} onSave={(m) => handleSaveMarkNote('marks', m)} />}
        {modalType === 'note' && <NoteModal selectedFullDate={selectedFullDate} onClose={() => setModalType(null)} onSave={(n) => handleSaveMarkNote('notes', n)} />}
        {deleteConfirm && <DeleteConfirmModal deleteConfirm={deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={confirmDelete} />}
        {finishOrderData && <FinishOrderModal order={finishOrderData} onClose={() => setFinishOrderData(null)} onConfirm={executeFinish} />}
        {showLogoutConfirm && (<LogoutConfirmModal onConfirm={handleLogout} onCancel={() => setShowLogoutConfirm(false)} />)}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;