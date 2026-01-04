// src/pages/dashboard/DashboardAdmin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import TokoCard from '../../components/dashboard/TokoCard';
import TokoForm from '../../components/dashboard/TokoForm';
import CustomAlert from '../../components/dashboard/CustomAlert';
import {
  getAllToko,
  addToko,
  updateToko,
  deleteToko,
  logoutUser,
  addLog
} from '../../lib/SupabaseClient';

export default function DashboardAdmin() {
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

  // Check authentication
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('userRole');
    const storedUserId = localStorage.getItem('userId');

    if (!user || role !== 'admin') {
      navigate('/login');
      return;
    }

    setUserEmail(user.email);
    setUserId(parseInt(storedUserId));
    loadToko();
  }, [navigate]);

  // Admin bisa lihat semua toko
  const loadToko = async () => {
    setIsLoading(true);
    try {
      const result = await getAllToko();
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

  // Filter & Search
  useEffect(() => {
    let filtered = tokoList;

    if (filterProduk !== 'all') {
      filtered = filtered.filter((t) => t.produk === filterProduk);
    }

    if (searchQuery) {
      filtered = filtered.filter((t) =>
        t.nama.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTokoList(filtered);
  }, [searchQuery, filterProduk, tokoList]);

  const handleAddToko = () => {
    setSelectedToko(null);
    setIsFormOpen(true);
  };

  const handleEditToko = (toko) => {
    setSelectedToko(toko);
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (formData) => {
    setIsSubmitting(true);
    try {
      const dataWithUserId = {
        ...formData,
        user_id: formData.user_id || userId
      };

      if (selectedToko) {
        const result = await updateToko(selectedToko.id, dataWithUserId);
        if (result.success) {
          await addLog({
            userEmail,
            action: 'update',
            tokoName: formData.nama
          });
          setAlert({ type: 'success', message: 'Toko berhasil diupdate!' });
          loadToko();
          setIsFormOpen(false);
        } else {
          setAlert({
            type: 'error',
            message: 'Gagal update toko: ' + result.error
          });
        }
      } else {
        const result = await addToko(dataWithUserId);
        if (result.success) {
          await addLog({
            userEmail,
            action: 'create',
            tokoName: formData.nama
          });
          setAlert({
            type: 'success',
            message: 'Toko berhasil ditambahkan!'
          });
          loadToko();
          setIsFormOpen(false);
        } else {
          setAlert({
            type: 'error',
            message: 'Gagal menambahkan toko: ' + result.error
          });
        }
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Terjadi kesalahan: ' + error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteToko = async (toko) => {
    if (!window.confirm(`Yakin ingin menghapus "${toko.nama}"?`)) return;

    try {
      const result = await deleteToko(toko.id);
      if (result.success) {
        await addLog({
          userEmail,
          action: 'delete',
          tokoName: toko.nama
        });
        setAlert({
          type: 'success',
          message: 'Toko berhasil dihapus!'
        });
        loadToko();
      } else {
        setAlert({
          type: 'error',
          message: 'Gagal menghapus toko: ' + result.error
        });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Terjadi kesalahan: ' + error.message
      });
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
        userRole="admin"
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userRole="admin"
        onLogout={handleLogout}
      />

      <div className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Dashboard Admin
            </h1>
            <p className="text-slate-600">Kelola semua data toko kue</p>
          </div>

          {/* Stats Cards - 5 Cards (Total + 4 Kategori) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Total Semua Toko */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100 text-sm font-medium">Total Toko</p>
                <span className="text-3xl">🏪</span>
              </div>
              <p className="text-4xl font-bold">{tokoList.length}</p>
              <p className="text-blue-100 text-xs mt-1">Semua kategori</p>
            </div>

            {/* Toko Kue */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <p className="text-rose-100 text-sm font-medium">Toko Kue</p>
                <span className="text-3xl">🍰</span>
              </div>
              <p className="text-4xl font-bold">
                {tokoList.filter((t) => t.produk === 'Kue').length}
              </p>
              <p className="text-rose-100 text-xs mt-1">Kategori Kue</p>
            </div>

            {/* Toko Brownies */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <p className="text-amber-100 text-sm font-medium">Brownies</p>
                <span className="text-3xl">🍫</span>
              </div>
              <p className="text-4xl font-bold">
                {tokoList.filter((t) => t.produk === 'Brownies').length}
              </p>
              <p className="text-amber-100 text-xs mt-1">Kategori Brownies</p>
            </div>

            {/* Toko Pie */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <p className="text-purple-100 text-sm font-medium">Pie</p>
                <span className="text-3xl">🥧</span>
              </div>
              <p className="text-4xl font-bold">
                {tokoList.filter((t) => t.produk === 'Pie').length}
              </p>
              <p className="text-purple-100 text-xs mt-1">Kategori Pie</p>
            </div>

            {/* Toko Coklat */}
            <div className="bg-gradient-to-br from-yellow-500 to-red-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <p className="text-yellow-100 text-sm font-medium">Coklat</p>
                <span className="text-3xl">🍬</span>
              </div>
              <p className="text-4xl font-bold">
                {tokoList.filter((t) => t.produk === 'Coklat').length}
              </p>
              <p className="text-yellow-100 text-xs mt-1">Kategori Coklat</p>
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
                  <option value="Kue">🍰 Kue</option>
                  <option value="Brownies">🍫 Brownies</option>
                  <option value="Pie">🥧 Pie</option>
                  <option value="Coklat">🍬 Coklat</option>
                </select>
              </div>

              <button
                onClick={handleAddToko}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 justify-center"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Tambah Toko</span>
              </button>
            </div>
          </div>

          {/* Toko List */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredTokoList.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-slate-200">
              <div className="text-6xl mb-4">🏪</div>
              <p className="text-xl font-semibold text-slate-800 mb-2">
                {tokoList.length === 0 ? 'Belum ada toko' : 'Tidak ditemukan'}
              </p>
              <p className="text-slate-600">
                {tokoList.length === 0 
                  ? 'Mulai tambahkan toko kue' 
                  : 'Coba ubah filter atau kata kunci pencarian'
                }
              </p>
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