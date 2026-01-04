// src/pages/dashboard/DashboardOwner.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Send } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import TokoCard from '../../components/dashboard/TokoCard';
import TokoForm from '../../components/dashboard/TokoForm';
import CustomAlert from '../../components/dashboard/CustomAlert';
import { 
  getTokoByUserId, 
  updateToko, 
  deleteToko, 
  logoutUser, 
  addLog 
} from '../../lib/SupabaseClient';

export default function DashboardOwner() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tokoList, setTokoList] = useState([]);
  const [filteredTokoList, setFilteredTokoList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduk, setFilterProduk] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedToko, setSelectedToko] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('userRole');
    const storedUserId = localStorage.getItem('userId');

    if (!user || role !== 'owner' || !storedUserId) {
      navigate('/login');
      return;
    }

    setUserEmail(user.email);
    setUserId(parseInt(storedUserId));
    loadToko(parseInt(storedUserId));
  }, [navigate]);

  const loadToko = async (ownerId) => {
    setIsLoading(true);
    try {
      const result = await getTokoByUserId(ownerId);
      if (result.success) {
        setTokoList(result.data);
        setFilteredTokoList(result.data);
      } else {
        setAlert({ type: 'error', message: 'Gagal memuat data toko' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan saat memuat data' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = tokoList;

    if (filterProduk !== 'all') {
      filtered = filtered.filter(t => t.produk === filterProduk);
    }

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.nama.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTokoList(filtered);
  }, [searchQuery, filterProduk, tokoList]);

  const handleEditToko = (toko) => {
    setSelectedToko(toko);
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (formData) => {
    setIsSubmitting(true);
    try {
      const dataWithUserId = {
        ...formData,
        user_id: userId
      };

      const result = await updateToko(selectedToko.id, dataWithUserId);
      if (result.success) {
        // ✅ CATAT LOG UPDATE
        await addLog({
          userEmail,
          userRole: 'owner',
          action: 'update',
          tokoId: selectedToko.id,
          tokoName: formData.nama,
          description: `Owner mengedit toko "${formData.nama}"`
        });

        setAlert({ type: 'success', message: 'Toko berhasil diupdate!' });
        loadToko(userId);
        setIsFormOpen(false);
      } else {
        setAlert({ type: 'error', message: 'Gagal update toko: ' + result.error });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan: ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteToko = async (toko) => {
    if (toko.user_id !== userId) {
      setAlert({ type: 'error', message: 'Anda tidak memiliki akses untuk menghapus toko ini!' });
      return;
    }

    if (!window.confirm(`Yakin ingin menghapus "${toko.nama}"?`)) {
      return;
    }

    try {
      const result = await deleteToko(toko.id);
      if (result.success) {
        // ✅ CATAT LOG DELETE
        await addLog({
          userEmail,
          userRole: 'owner',
          action: 'delete',
          tokoId: toko.id,
          tokoName: toko.nama,
          description: `Owner menghapus toko "${toko.nama}"`
        });

        setAlert({ type: 'success', message: 'Toko berhasil dihapus!' });
        loadToko(userId);
      } else {
        setAlert({ type: 'error', message: 'Gagal menghapus toko: ' + result.error });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan: ' + error.message });
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('Yakin ingin logout?')) return;
    await logoutUser();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <DashboardNavbar
        onMenuClick={() => setIsSidebarOpen(true)}
        userEmail={userEmail}
        userRole="owner"
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userRole="owner"
        onLogout={handleLogout}
      />

      <div className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Toko Saya</h1>
            <p className="text-slate-600">Toko yang sudah disetujui admin</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-blue-100 mb-1">Total Toko Aktif</p>
              <p className="text-4xl font-bold">{tokoList.length}</p>
            </div>
            <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-rose-100 mb-1">Toko Kue</p>
              <p className="text-4xl font-bold">{tokoList.filter(t => t.produk === 'Kue').length}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-amber-100 mb-1">Toko Brownies</p>
              <p className="text-4xl font-bold">{tokoList.filter(t => t.produk === 'Brownies').length}</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">Ingin Menambahkan Toko Baru?</h3>
                <p className="text-slate-600 mb-3">Kirim request ke admin untuk menambahkan toko baru. Admin akan meninjau dan menyetujui request Anda.</p>
                <button
                  onClick={() => navigate('/dashboard/owner/requests')}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Kirim Request
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama toko..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={filterProduk}
                  onChange={(e) => setFilterProduk(e.target.value)}
                  className="pl-11 pr-8 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none appearance-none bg-white"
                >
                  <option value="all">Semua Produk</option>
                  <option value="Kue">Kue</option>
                  <option value="Brownies">Brownies</option>
                </select>
              </div>
            </div>
          </div>

          {/* Toko List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTokoList.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-slate-200">
              <div className="text-6xl mb-4">🏪</div>
              <p className="text-xl font-semibold text-slate-800 mb-2">
                {searchQuery || filterProduk !== 'all' 
                  ? 'Tidak ada toko ditemukan' 
                  : 'Belum ada toko aktif'}
              </p>
              <p className="text-slate-600 mb-4">
                {searchQuery || filterProduk !== 'all'
                  ? 'Coba ubah filter atau pencarian'
                  : 'Kirim request untuk menambahkan toko pertama Anda'}
              </p>
              <button
                onClick={() => navigate('/dashboard/owner/requests')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Request Toko Baru
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokoList.map((toko) => (
                <TokoCard
                  key={toko.id}
                  toko={toko}
                  onEdit={handleEditToko}
                  onDelete={handleDeleteToko}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <TokoForm
          toko={selectedToko}
          onSubmit={handleSubmitForm}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}