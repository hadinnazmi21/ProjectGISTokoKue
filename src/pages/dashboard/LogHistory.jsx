// src/pages/dashboard/LogHistory.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Calendar, User, Activity, Filter } from 'lucide-react';
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
  const [filterRole, setFilterRole] = useState('all');
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
        console.log('📊 Loaded logs:', result.data);
        setLogs(result.data);
        setFilteredLogs(result.data);
      } else {
        console.error('❌ Failed to load logs:', result.error);
      }
    } catch (error) {
      console.error('❌ Error loading logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter logs
  useEffect(() => {
    let filtered = logs;

    // Filter by action
    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(log => log.user_role === filterRole);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.toko_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [searchQuery, filterAction, filterRole, logs]);

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
      create: '➕ Tambah Toko',
      update: '✏️ Edit Toko',
      delete: '🗑️ Hapus Toko',
      // Request actions
      create_request: '📤 Kirim Request',
      approve_request: '✅ Setujui Request',
      reject_request: '❌ Tolak Request',
      delete_request: '🗑️ Hapus Request'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[action] || 'bg-slate-100 text-slate-700'}`}>
        {labels[action] || action}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700 border-purple-200',
      owner: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    const labels = {
      admin: '👑 Admin',
      owner: '🏪 Owner'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[role] || 'bg-slate-100 text-slate-700'}`}>
        {labels[role] || role}
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
      minute: '2-digit',
      second: '2-digit'
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
            <p className="text-slate-600">Riwayat aktivitas sistem dari admin dan owner</p>
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
              <p className="text-amber-100 text-sm mb-1">Request Diproses</p>
              <p className="text-3xl font-bold">
                {logs.filter(l => ['create_request', 'approve_request', 'reject_request'].includes(l.action)).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-blue-100 text-sm mb-1">Total Edit</p>
              <p className="text-3xl font-bold">{logs.filter(l => l.action === 'update').length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama toko, email, atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="pl-11 pr-8 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                >
                  <option value="all">Semua Role</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-6 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
              >
                <option value="all">Semua Aktivitas</option>
                <optgroup label="🏪 Toko">
                  <option value="create">Tambah Toko</option>
                  <option value="update">Edit Toko</option>
                  <option value="delete">Hapus Toko</option>
                </optgroup>
                <optgroup label="📋 Request">
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
              <p className="text-xl font-semibold text-slate-800 mb-2">Tidak ada log</p>
              <p className="text-slate-600">
                {logs.length === 0 
                  ? 'Belum ada aktivitas yang tercatat' 
                  : 'Tidak ditemukan log dengan filter yang dipilih'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
              {/* Mobile View - Cards */}
              <div className="md:hidden divide-y divide-slate-200">
                {filteredLogs.map((log, idx) => (
                  <div key={log.id || idx} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      {getActionBadge(log.action)}
                      {log.user_role && getRoleBadge(log.user_role)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-4 h-4" />
                        <span className="truncate">{log.user_email || '-'}</span>
                      </div>
                      {log.toko_name && (
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-800">{log.toko_name}</span>
                        </div>
                      )}
                      {log.description && (
                        <p className="text-slate-600 text-xs mt-2 p-2 bg-slate-50 rounded">
                          {log.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 text-white font-semibold text-sm">
                    <div className="col-span-2">Waktu</div>
                    <div className="col-span-2">User</div>
                    <div className="col-span-1">Role</div>
                    <div className="col-span-2">Aktivitas</div>
                    <div className="col-span-2">Toko</div>
                    <div className="col-span-3">Deskripsi</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-200">
                  {filteredLogs.map((log, idx) => (
                    <div
                      key={log.id || idx}
                      className="px-6 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center text-sm">
                        <div className="col-span-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 text-xs">{formatDate(log.timestamp)}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 truncate text-xs" title={log.user_email}>
                            {log.user_email?.split('@')[0] || '-'}
                          </span>
                        </div>
                        <div className="col-span-1">
                          {log.user_role ? getRoleBadge(log.user_role) : '-'}
                        </div>
                        <div className="col-span-2">
                          {getActionBadge(log.action)}
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-800 font-medium truncate text-xs" title={log.toko_name}>
                            {log.toko_name || '-'}
                          </span>
                        </div>
                        <div className="col-span-3">
                          <span className="text-slate-600 text-xs line-clamp-2" title={log.description}>
                            {log.description || '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}