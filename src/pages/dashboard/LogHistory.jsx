// src/pages/dashboard/LogHistory.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Calendar, User, Activity, Filter, RefreshCw } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import { getAllLogs, getLogsByUserEmail, logoutUser } from '../../lib/SupabaseClient';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('userRole');

    if (!user) {
      navigate('/login');
      return;
    }

    setUserEmail(user.email);
    setUserRole(role);
    loadLogs(role, user.email);
  }, [navigate]);

  const loadLogs = async (role, email) => {
    console.log('🔄 Starting to load logs...');
    console.log('👤 User role:', role);
    console.log('📧 User email:', email);
    
    setIsLoading(true);
    setError(null);
    try {
      let result;
      
      // ✅ ADMIN: Lihat semua log
      if (role === 'admin') {
        console.log('👑 Admin detected - fetching ALL logs');
        result = await getAllLogs();
      } 
      // ✅ OWNER: Hanya lihat log mereka sendiri
      else if (role === 'owner') {
        console.log('🏪 Owner detected - fetching ONLY their logs');
        result = await getLogsByUserEmail(email);
      }
      
      console.log('📦 Result from database:', result);
      
      if (result.success) {
        console.log('✅ Success! Logs data:', result.data);
        console.log('📊 Number of logs:', result.data.length);
        
        if (result.data.length > 0) {
          console.log('🔍 First log sample:', result.data[0]);
        }
        
        setLogs(result.data);
        setFilteredLogs(result.data);
      } else {
        console.error('❌ Failed to load logs:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('❌ Error loading logs:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      console.log('✅ Load logs completed');
    }
  };

  // Filter logs
  useEffect(() => {
    console.log('🔍 Filtering logs...');
    console.log('Total logs:', logs.length);
    console.log('Filter action:', filterAction);
    console.log('Filter role:', filterRole);
    console.log('Search query:', searchQuery);
    
    let filtered = logs;

    // Filter by action
    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
      console.log(`After action filter (${filterAction}):`, filtered.length);
    }

    // Filter by role (hanya untuk admin)
    if (filterRole !== 'all' && userRole === 'admin') {
      filtered = filtered.filter(log => log.user_role === filterRole);
      console.log(`After role filter (${filterRole}):`, filtered.length);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.toko_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log(`After search filter (${searchQuery}):`, filtered.length);
    }

    console.log('📊 Final filtered logs:', filtered.length);
    setFilteredLogs(filtered);
  }, [searchQuery, filterAction, filterRole, logs, userRole]);

  const handleLogout = async () => {
    if (!window.confirm('Yakin ingin logout?')) return;
    await logoutUser();
    localStorage.clear();
    navigate('/login');
  };

  const getActionBadge = (action) => {
    const styles = {
      create: 'bg-green-100 text-green-700 border-green-200',
      update: 'bg-blue-100 text-blue-700 border-blue-200',
      delete: 'bg-red-100 text-red-700 border-red-200',
      create_request: 'bg-amber-100 text-amber-700 border-amber-200',
      approve_request: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      reject_request: 'bg-rose-100 text-rose-700 border-rose-200',
      delete_request: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    const labels = {
      create: '➕ Tambah Toko',
      update: '✏️ Edit Toko',
      delete: '🗑️ Hapus Toko',
      create_request: '📤 Kirim Request',
      approve_request: '✅ Setujui Request',
      reject_request: '❌ Tolak Request',
      delete_request: '🗑️ Hapus Request'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[action] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
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
      <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[role] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
        {labels[role] || role || '-'}
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
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <History className="w-8 h-8 text-purple-600" />
                  <h1 className="text-3xl font-bold text-slate-800">Log History</h1>
                </div>
                <p className="text-slate-600">
                  {userRole === 'admin' 
                    ? 'Riwayat aktivitas sistem dari semua pengguna' 
                    : 'Riwayat aktivitas Anda'}
                </p>
              </div>
              <button
                onClick={() => loadLogs(userRole, userEmail)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Info Banner untuk Owner */}
          {userRole === 'owner' && (
            <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Catatan untuk Owner</p>
                  <p className="text-sm text-slate-600">Anda hanya dapat melihat log aktivitas yang berkaitan dengan akun Anda</p>
                </div>
              </div>
            </div>
          )}

          {/* Debug Info */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-700 font-semibold">❌ Error: {error}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
              <p className="text-slate-600 text-sm mb-1">Total Log</p>
              <p className="text-3xl font-bold text-slate-800">{logs.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-green-100 text-sm mb-1">
                {userRole === 'admin' ? 'Toko Ditambah' : 'Toko Dibuat'}
              </p>
              <p className="text-3xl font-bold">{logs.filter(l => l.action === 'create').length}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-amber-100 text-sm mb-1">Request</p>
              <p className="text-3xl font-bold">
                {logs.filter(l => ['create_request', 'approve_request', 'reject_request'].includes(l.action)).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-blue-100 text-sm mb-1">Edit/Update</p>
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
                  placeholder="Cari nama toko atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                />
              </div>

              {/* Filter Role - Hanya untuk Admin */}
              {userRole === 'admin' && (
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
              )}

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
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600">Memuat log history...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-slate-200">
              <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-slate-800 mb-2">Tidak ada log</p>
              <p className="text-slate-600">
                {logs.length === 0 
                  ? userRole === 'admin'
                    ? 'Belum ada aktivitas yang tercatat di sistem.' 
                    : 'Belum ada aktivitas dari Anda. Mulai tambahkan toko atau kirim request.'
                  : 'Tidak ditemukan log dengan filter yang dipilih'}
              </p>
              {logs.length === 0 && (
                <button
                  onClick={() => loadLogs(userRole, userEmail)}
                  className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-all"
                >
                  Refresh Data
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
              {/* Mobile View - Cards */}
              <div className="md:hidden divide-y divide-slate-200">
                {filteredLogs.map((log, idx) => (
                  <div key={log.id || idx} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      {getActionBadge(log.action)}
                      {userRole === 'admin' && getRoleBadge(log.user_role)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                      {userRole === 'admin' && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <User className="w-4 h-4" />
                          <span className="truncate">{log.user_email || '-'}</span>
                        </div>
                      )}
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
                  <div className={`grid ${userRole === 'admin' ? 'grid-cols-12' : 'grid-cols-10'} gap-4 text-white font-semibold text-sm`}>
                    <div className="col-span-2">Waktu</div>
                    {userRole === 'admin' && <div className="col-span-2">User</div>}
                    {userRole === 'admin' && <div className="col-span-1">Role</div>}
                    <div className="col-span-2">Aktivitas</div>
                    <div className="col-span-2">Toko</div>
                    <div className={userRole === 'admin' ? 'col-span-3' : 'col-span-4'}>Deskripsi</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-200">
                  {filteredLogs.map((log, idx) => (
                    <div
                      key={log.id || idx}
                      className="px-6 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`grid ${userRole === 'admin' ? 'grid-cols-12' : 'grid-cols-10'} gap-4 items-center text-sm`}>
                        <div className="col-span-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 text-xs">{formatDate(log.timestamp)}</span>
                        </div>
                        {userRole === 'admin' && (
                          <div className="col-span-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-slate-700 truncate text-xs" title={log.user_email}>
                              {log.user_email?.split('@')[0] || '-'}
                            </span>
                          </div>
                        )}
                        {userRole === 'admin' && (
                          <div className="col-span-1">
                            {getRoleBadge(log.user_role)}
                          </div>
                        )}
                        <div className="col-span-2">
                          {getActionBadge(log.action)}
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-800 font-medium truncate text-xs" title={log.toko_name}>
                            {log.toko_name || '-'}
                          </span>
                        </div>
                        <div className={userRole === 'admin' ? 'col-span-3' : 'col-span-4'}>
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