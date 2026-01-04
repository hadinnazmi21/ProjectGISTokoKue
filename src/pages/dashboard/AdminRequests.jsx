// src/pages/dashboard/AdminRequests.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Check, X, Eye, Search, Filter } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import CustomAlert from '../../components/dashboard/CustomAlert';
import { 
  getAllRequests, 
  approveRequest, 
  rejectRequest,
  logoutUser,
  addLog
} from '../../lib/SupabaseClient';

export default function AdminRequests() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [approvalType, setApprovalType] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('userRole');

    if (!user || role !== 'admin') {
      navigate('/login');
      return;
    }

    setUserEmail(user.email);
    loadRequests();
  }, [navigate]);

  useEffect(() => {
    let filtered = requests;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.users?.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [searchQuery, filterStatus, requests]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const result = await getAllRequests();
      if (result.success) {
        setRequests(result.data);
        setFilteredRequests(result.data);
      } else {
        setAlert({ type: 'error', message: 'Gagal memuat data request' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan saat memuat data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setApprovalType('approve');
    setApprovalNote('');
    setIsApprovalModalOpen(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setApprovalType('reject');
    setApprovalNote('');
    setIsApprovalModalOpen(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedRequest) return;

    try {
      if (approvalType === 'approve') {
        // ✅ APPROVE REQUEST
        const result = await approveRequest(selectedRequest.id, approvalNote);
        if (result.success) {
          // ✅ CATAT LOG APPROVE
          await addLog({
            userEmail,
            userRole: 'admin',
            action: 'approve_request',
            tokoId: result.data?.id || null,
            tokoName: selectedRequest.nama,
            description: `Admin menyetujui request toko "${selectedRequest.nama}" dari owner ${selectedRequest.users?.email || 'Unknown'}`
          });
          
          setAlert({ type: 'success', message: 'Request disetujui! Toko berhasil ditambahkan.' });
        } else {
          setAlert({ type: 'error', message: 'Gagal menyetujui request: ' + result.error });
        }
      } else {
        // ✅ REJECT REQUEST
        const result = await rejectRequest(selectedRequest.id, approvalNote);
        if (result.success) {
          // ✅ CATAT LOG REJECT
          await addLog({
            userEmail,
            userRole: 'admin',
            action: 'reject_request',
            tokoId: null,
            tokoName: selectedRequest.nama,
            description: `Admin menolak request toko "${selectedRequest.nama}" dari owner ${selectedRequest.users?.email || 'Unknown'}. Alasan: ${approvalNote || 'Tidak ada catatan'}`
          });
          
          setAlert({ type: 'success', message: 'Request ditolak.' });
        } else {
          setAlert({ type: 'error', message: 'Gagal menolak request: ' + result.error });
        }
      }
      loadRequests();
      setIsApprovalModalOpen(false);
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

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
      pending: 'Menunggu',
      approved: 'Disetujui',
      rejected: 'Ditolak'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-slate-800">Request Approval</h1>
            </div>
            <p className="text-slate-600">Kelola request toko dari owner</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
              <p className="text-slate-600 text-sm mb-1">Total Request</p>
              <p className="text-3xl font-bold text-slate-800">{requests.length}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-amber-100 text-sm mb-1">Menunggu</p>
              <p className="text-3xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-green-100 text-sm mb-1">Disetujui</p>
              <p className="text-3xl font-bold">{requests.filter(r => r.status === 'approved').length}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
              <p className="text-red-100 text-sm mb-1">Ditolak</p>
              <p className="text-3xl font-bold">{requests.filter(r => r.status === 'rejected').length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama toko atau email owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-11 pr-8 py-3 border-2 border-slate-200 rounded-xl outline-none bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Requests List */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-slate-200">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-slate-800 mb-2">Tidak ada request</p>
              <p className="text-slate-600">Belum ada request dari owner</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200 hover:border-orange-300 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-800">{request.nama}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p><strong>Owner:</strong> {request.users?.email || '-'}</p>
                        <p><strong>Produk:</strong> {request.produk}</p>
                        <p><strong>Jalan:</strong> {request.jalan || '-'}</p>
                        <p><strong>Kecamatan:</strong> {request.kecamatan}</p>
                        <p><strong>Dikirim:</strong> {formatDate(request.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(request)}
                            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Setuju
                          </button>
                          <button
                            onClick={() => handleReject(request)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Tolak
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && !isApprovalModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Detail Request</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Nama Toko</p>
                <p className="text-lg font-semibold text-slate-800">{selectedRequest.nama}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Status</p>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Owner</p>
                <p className="text-slate-800">{selectedRequest.users?.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Produk</p>
                <p className="text-slate-800">{selectedRequest.produk}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Jalan</p>
                <p className="text-slate-800">{selectedRequest.jalan || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Kecamatan</p>
                  <p className="text-slate-800">{selectedRequest.kecamatan}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Kelurahan</p>
                  <p className="text-slate-800">{selectedRequest.kelurahan}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Latitude</p>
                  <p className="text-slate-800">{selectedRequest.lat}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Longitude</p>
                  <p className="text-slate-800">{selectedRequest.lng}</p>
                </div>
              </div>
              {selectedRequest.admin_note && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Catatan Admin:</p>
                  <p className="text-slate-600">{selectedRequest.admin_note}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t-2 border-slate-200 flex gap-3">
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest);
                    }}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedRequest);
                    }}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
                  >
                    Tolak
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b-2 border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">
                {approvalType === 'approve' ? 'Setujui Request' : 'Tolak Request'}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-4">
                {approvalType === 'approve' 
                  ? 'Yakin ingin menyetujui request ini? Toko akan ditambahkan ke sistem.'
                  : 'Yakin ingin menolak request ini?'}
              </p>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Catatan (opsional)
              </label>
              <textarea
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="Tambahkan catatan untuk owner..."
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                rows="3"
              />
            </div>
            <div className="p-6 border-t-2 border-slate-200 flex gap-3">
              <button
                onClick={() => setIsApprovalModalOpen(false)}
                className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmApproval}
                className={`flex-1 py-3 text-white rounded-xl font-semibold transition-all ${
                  approvalType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {approvalType === 'approve' ? 'Setujui' : 'Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}