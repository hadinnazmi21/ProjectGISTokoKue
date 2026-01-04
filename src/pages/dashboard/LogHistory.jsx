// src/pages/dashboard/LogHistory.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Calendar, User, Activity } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import { getAllLogs, logoutUser } from '../../lib/SupabaseClient';

export default function LogHistory() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('userRole');

    if (!user) {
      navigate('/login');
      return;
    }

    setUserEmail(user.email);
    setUserRole(role);
    loadLogs();
  }, [navigate]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const result = await getAllLogs();
      if (result.success) {
        setLogs(result.data);
        setFilteredLogs(result.data);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter logs
  useEffect(() => {
    let filtered = logs;

    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.toko_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [searchQuery, filterAction, logs]);

  const handleLogout = async () => {
    if (!window.confirm('Yakin ingin logout?')) return;
    await logoutUser();
    localStorage.clear();
    navigate('/login');
  };

  const getActionBadge = (action) => {
    const styles = {
      // Toko actions
      create: 'bg-green-100 text-green-700 border-green-200',
      update: 'bg-blue-100 text-blue-700 border-blue-200',
      delete: 'bg-red-100 text-red-700 border-red-200',
      // Request actions
      create_request: 'bg-amber-100 text-amber-700 border-amber-200',
      approve_request: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      reject_request: 'bg-rose-100 text-rose-700 border-rose-200',
      delete_request: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    const labels = {
      // Toko actions
      create: 'Tambah Toko',
      update: 'Edit Toko',
      delete: 'Hapus Toko',
      // Request actions
      create_request: 'Kirim Request',
      approve_request: 'Setujui Request',
      reject_request: 'Tolak Request',
      delete_request: 'Hapus Request'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[action] || 'bg-slate-100 text-slate-700'}`}>
        {labels[action] || action}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar
        onMenuClick={() => setIsSidebarOpen(true)}
        userEmail={userEmail}
        userRole={userRole}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userRole={userRole}
        onLogout={handleLogout}
      />

      <div className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <History className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-slate-800">Log History</h1>
            </div>
            <p className="text-slate-600">Riwayat aktivitas admin dan owner</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
              <p className="text-slate-600 text-sm mb-1">Total Log</p>
              <p className="text-3xl font-bold text-slate-800">{logs.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-green-100 text-sm mb-1">Toko Ditambah</p>
              <p className="text-3xl font-bold">{logs.filter(l => l.action === 'create').length}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-amber-100 text-sm mb-1">Request</p>
              <p className="text-3xl font-bold">
                {logs.filter(l => ['create_request', 'approve_request', 'reject_request', 'delete_request'].includes(l.action)).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-red-100 text-sm mb-1">Dihapus</p>
              <p className="text-3xl font-bold">{logs.filter(l => l.action === 'delete').length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama toko atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                />
              </div>

              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-6 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
              >
                <option value="all">Semua Aktivitas</option>
                <optgroup label="Toko">
                  <option value="create">Tambah Toko</option>
                  <option value="update">Edit Toko</option>
                  <option value="delete">Hapus Toko</option>
                </optgroup>
                <optgroup label="Request">
                  <option value="create_request">Kirim Request</option>
                  <option value="approve_request">Setujui Request</option>
                  <option value="reject_request">Tolak Request</option>
                  <option value="delete_request">Hapus Request</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Log Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-slate-200">
              <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-slate-800 mb-2">Belum ada log</p>
              <p className="text-slate-600">Log aktivitas akan muncul di sini</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 text-white font-semibold">
                  <div className="col-span-3">Waktu</div>
                  <div className="col-span-2">User</div>
                  <div className="col-span-3">Aktivitas</div>
                  <div className="col-span-4">Nama Toko</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-200">
                {filteredLogs.map((log, idx) => (
                  <div
                    key={log.id || idx}
                    className="px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3 flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{formatDate(log.timestamp)}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 truncate" title={log.user_email}>
                          {log.user_email?.split('@')[0]}
                        </span>
                      </div>
                      <div className="col-span-3">
                        {getActionBadge(log.action)}
                      </div>
                      <div className="col-span-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-800 font-medium truncate" title={log.toko_name}>
                          {log.toko_name || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}