import React, { useState } from 'react';
import { Menu, Plus, Edit3, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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

const API_BASE = window.location.hostname === "localhost" 
  ? "http://localhost:3000" 
  : "https://abc.domainanda.com"; // Alamat backend saat di hosting

const AdminDashboard = () => {


  // --- DATABASE STATE ---
  const [db, setDb] = useState({
    admins: [],
    customers: [],
    packages: [],
    jas: [],
    kemeja: [],
    celana: [],
    dasi: [],
    changshan: [],
    vest: [],
    tuxedo: [],
    booked: [],
    order_items: [],
    history_orders: [],
    notes: [],
    marks: []
  });

  const navigate = useNavigate();

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('calendar');
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [finalConfirmData, setFinalConfirmData] = useState(null);
  const [finishOrderData, setFinishOrderData] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
      const [dashboardRes, customersRes, jasRes, kemejaRes, celanaRes, changshanRes, dasiRes, packagesRes, ordersRes, bookedRes, vestRes, tuxedoRes] = await Promise.all([
        fetch(`${API_BASE}/api/dashboard`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/customers`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/inventory/jas`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/inventory/kemeja`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/inventory/celana`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/inventory/changshan`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/inventory/dasi`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/inventory/packages`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/transaction/orders`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/inventory/booked`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/inventory/vest`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/api/inventory/tuxedo`, { headers }).then(res => res.json())
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
        vest: Array.isArray(vestRes) ? vestRes : [],
        tuxedo: Array.isArray(tuxedoRes) ? tuxedoRes : [],
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
        if (items[0].id_customer) {
          // Gunakan ID customer yang sudah ada
          customerId = items[0].id_customer;
        } else {
          // Buat customer baru
          const customerResponse = await fetch(`${API_BASE}/api/customers`, {
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
      }

      // items adalah array yang dikirim dari FormModal
      for (const item of items) {
        const method = isEdit ? 'PUT' : 'POST';

        let url = '';
        let body = item;

        if (table === 'order_items') {
          const id = isEdit ? editingItem.id_order : '';
          url = isEdit ? `${API_BASE}/api/transaction/orders/${id}` : `${API_BASE}/api/transaction/orders`;

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
              await fetch(`${API_BASE}/api/customers/${customerId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                  customer_name: item.customer_name,
                  customer_phone: item.customer_phone,
                  bank_account: item.bank_account,
                   discount: item.discount || 0
                })
              });
            }

            // For Edit, strip synthetic fields
            const cleanedBody = {};
            Object.keys(item).forEach(key => {
              if (!key.startsWith('display_') && !key.startsWith('customer_') && !key.startsWith('package_') && key !== 'booked_items' && key !== 'fromTable' && key !== 'id_order' && key !== 'order_date') {
                cleanedBody[key] = item[key];
              }
            });
            body = cleanedBody;
          }
        } else if (table === 'customers') {
          const id = isEdit ? editingItem.id_customer : '';
          url = isEdit ? `${API_BASE}/api/customers/${id}` : `${API_BASE}/api/customers`;

          // Strip fromTable
          const { fromTable, id_customer, ...rest } = item;
          body = rest;
        } else if (table === 'notes' || table === 'marks') {
          const idField = table === 'notes' ? 'id_note' : 'id_marks';
          const id = isEdit ? editingItem[idField] : '';
          url = isEdit ? `${API_BASE}/api/inventory/${table}/${id}` : `${API_BASE}/api/inventory/${table}`;

          const cleanedBody = {};
          Object.keys(item).forEach(key => {
            if (key !== 'fromTable' && key !== idField && key !== 'created_at') {
              cleanedBody[key] = item[key];
            }
          });
          body = cleanedBody;
        } else {
          // Inventory tables (jas, kemeja, etc.)
          const idField = editingItem ? Object.keys(editingItem)[0] : '';
          const id = isEdit ? editingItem[idField] : '';
          url = isEdit
            ? `${API_BASE}/api/inventory/${table}/${id}`
            : `${API_BASE}/api/inventory/${table}`;

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
      showToast(isEdit ? 'Data berhasil diperbarui' : 'Data berhasil disimpan');
      setModalType(null);
      setEditingItem(null);
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      showToast(error.message, 'error');
    }
  };

  const handleSaveMarkNote = async (table, newData) => {
    // Determine endpoint based on table
    const endpoint = table === 'marks' ? `${API_BASE}/api/inventory/marks` : `${API_BASE}/api/inventory/notes`;
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
      showToast(`${table === 'marks' ? 'Mark' : 'Note'} berhasil disimpan`);
    } catch (error) {
      console.error("Save Mark/Note failed", error);
      showToast('Gagal menyimpan data', 'error');
    }
  };

  const handleFinishRequest = (orderId, condition) => {
    setFinalConfirmData({ orderId, condition });
    setFinishOrderData(null);
  };

  const executeFinish = async (orderId, condition) => {
    try {
      // 1. Selesaikan pesanan (memicu trigger history di database)
      const response = await fetch(`${API_BASE}/api/transaction/orders/${orderId}/finish`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          condition_return: condition
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal menyelesaikan pesanan');
      }

      // 2. Cari id_customer untuk pembersihan otomatis
      const orderData = db.order_items.find(o => String(o.id_order) === String(orderId));
      const customerId = orderData?.id_customer;

      // 3. Hapus order_items secara otomatis
      await fetch(`${API_BASE}/api/transaction/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      // 4. Hapus customer secara otomatis
      if (customerId) {
        await fetch(`${API_BASE}/api/customers/${customerId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      }

      fetchData();
      showToast('Pesanan berhasil diselesaikan');
      setFinishOrderData(null);
    } catch (error) {
      console.error("Finish order failed", error);
      showToast(error.message, 'error');
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
        await fetch(`${API_BASE}/api/transaction/orders/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        // 2. Hapus Customer yang terkait jika ditemukan
        if (customerId) {
          await fetch(`${API_BASE}/api/customers/${customerId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
        }
      } else {
        let url = `${API_BASE}/api/inventory/${table}/${id}`;
        if (table === 'customers') {
          url = `${API_BASE}/api/customers/${id}`;
        } else if (table === 'marks' || table === 'notes') {
          url = `${API_BASE}/api/inventory/${table}/${id}`;
        }

        await fetch(url, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      }

      fetchData(); // Refresh data
      showToast('Data berhasil dihapus');
    } catch (error) {
      console.error("Delete failed", error);
      showToast('Gagal menghapus data', 'error');
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
          {activeTab !== 'calendar' && activeTab !== 'history_orders' && (
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
        ) : activeTab === 'notes' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {db.notes.map((note) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={note.id_note} 
                className="group relative bg-[#FFFDF0] p-10 rounded-sm shadow-xl border-l-11 border-amber-400 min-h-80 flex flex-col transition-all hover:rotate-1 hover:-translate-y-2"
              >
                <div className="absolute top-6 right-8 flex items-center gap-1.5 text-amber-600/40">
                  <Clock size={12} />
                  <span className="text-[13px] font-black uppercase tracking-tighter">
                    {new Date(note.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-xl font-black uppercase tracking-tighter mb-6 pr-20 text-slate-900 border-b-2 border-amber-300 pb-3">
                  {note.title_note}
                </h3>
                
                <p className="text-[17px] font-bold text-slate-600 leading-relaxed flex-1 whitespace-pre-wrap">
                  {note.description_note}
                </p>

                <div className="mt-8 pt-6 border-t border-amber-100/50 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingItem({ ...note, fromTable: 'notes' }); setModalType('form_db'); }}
                    className="p-2.5 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm({ table: 'notes', id: note.id_note })}
                    className="p-2.5 bg-rose-100 text-rose-700 rounded-xl hover:bg-rose-200 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-linear-to-tl from-amber-100/30 to-transparent rounded-tl-full"></div>
              </motion.div>
            ))}
          </div>
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
        {finishOrderData && <FinishOrderModal order={finishOrderData} onClose={() => setFinishOrderData(null)} onConfirm={handleFinishRequest} />}
        
        {finalConfirmData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border-b-8 border-rose-500 text-center"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Konfirmasi Akhir</h3>
              <p className="text-slate-500 text-sm font-bold leading-relaxed mb-8">
                Apakah Anda yakin ingin menyelesaikan pesanan ini? <br/>
                <span className="text-rose-500">Data akan dipindahkan ke History dan dihapus dari daftar aktif secara permanen.</span>
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setFinalConfirmData(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    executeFinish(finalConfirmData.orderId, finalConfirmData.condition);
                    setFinalConfirmData(null);
                  }}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all"
                >
                  Ya, Selesaikan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showLogoutConfirm && (<LogoutConfirmModal onConfirm={handleLogout} onCancel={() => setShowLogoutConfirm(false)} />)}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-9999">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}
            >
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <p className="text-[11px] font-black uppercase tracking-widest">{toast.message}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;