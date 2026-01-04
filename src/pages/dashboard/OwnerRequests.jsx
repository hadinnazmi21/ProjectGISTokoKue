// src/pages/dashboard/OwnerRequests.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Plus, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import TokoForm from '../../components/dashboard/TokoForm';
import CustomAlert from '../../components/dashboard/CustomAlert';
import { 
  getRequestsByUserId, 
  createTokoRequest, 
  deleteRequest,
  logoutUser,
  addLog
} from '../../lib/SupabaseClient';

export default function OwnerRequests() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

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
    loadRequests(parseInt(storedUserId));
  }, [navigate]);

  const loadRequests = async (ownerId) => {
    setIsLoading(true);
    try {
      const result = await getRequestsByUserId(ownerId);
      if (result.success) {
        setRequests(result.data);
      } else {
        setAlert({ type: 'error', message: 'Gagal memuat data request' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan saat memuat data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRequest = async (formData) => {
    setIsSubmitting(true);
    try {
      const requestData = {
        ...formData,
        user_id: userId
      };

      const result = await createTokoRequest(requestData);
      if (result.success) {
        // ✅ CATAT LOG CREATE REQUEST
        await addLog({
          userEmail,
          userRole: 'owner',
          action: 'create_request',
          tokoId: null,
          tokoName: formData.nama,
          description: `Owner mengirim request toko baru "${formData.nama}"`
        });

        setAlert({ type: 'success', message: 'Request berhasil dikirim! Menunggu persetujuan admin.' });
        loadRequests(userId);
        setIsFormOpen(false);
      } else {
        setAlert({ type: 'error', message: 'Gagal mengirim request: ' + result.error });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan: ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Yakin ingin menghapus request ini?')) return;

    try {
      // Cari request untuk ambil nama toko
      const request = requests.find(r => r.id === requestId);
      
      const result = await deleteRequest(requestId);
      if (result.success) {
        // ✅ CATAT LOG DELETE REQUEST
        if (request) {
          await addLog({
            userEmail,
            userRole: 'owner',
            action: 'delete_request',
            tokoId: null,
            tokoName: request.nama,
            description: `Owner menghapus request toko "${request.nama}"`
          });
        }

        setAlert({ type: 'success', message: 'Request berhasil dihapus!' });
        loadRequests(userId);
      } else {
        setAlert({ type: 'error', message: 'Gagal menghapus request' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan' });
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
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle
    };
    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        <Icon className="w-3 h-3" />
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
            <div className="flex items-center gap-3 mb-2">
              <Send className="w-8 h-8 text-amber-600" />
              <h1 className="text-3xl font-bold text-slate-800">Request Toko</h1>
            </div>
            <p className="text-slate-600">Kirim request untuk menambahkan toko baru</p>
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

          {/* Add Button */}
          <div className="mb-6">
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Request Toko Baru
            </button>
          </div>

          {/* Requests List */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-slate-200">
              <Send className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-slate-800 mb-2">Belum ada request</p>
              <p className="text-slate-600">Mulai kirim request toko baru Anda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200 hover:border-amber-300 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-800">{request.nama}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p><strong>Produk:</strong> {request.produk}</p>
                        <p><strong>Jalan:</strong> {request.jalan || '-'}</p>
                        <p><strong>Kecamatan:</strong> {request.kecamatan}</p>
                        <p><strong>Dikirim:</strong> {formatDate(request.created_at)}</p>
                        {request.admin_note && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-xs font-semibold text-slate-700 mb-1">Catatan Admin:</p>
                            <p className="text-sm text-slate-600">{request.admin_note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </button>
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <TokoForm
          toko={null}
          onSubmit={handleSubmitRequest}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
        />
      )}

      {/* Detail Modal */}
      {selectedRequest && (
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
            <div className="p-6 border-t-2 border-slate-200">
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}