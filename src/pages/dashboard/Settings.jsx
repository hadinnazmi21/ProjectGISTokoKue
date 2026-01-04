// src/pages/dashboard/Settings.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, User, Mail, Shield, Save, Key, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import CustomAlert from '../../components/dashboard/CustomAlert';
import { 
  logoutUser, 
  getUserByEmail, 
  updateUserProfile, 
  changeUserPassword,
  addLog 
} from '../../lib/SupabaseClient';

export default function Settings() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('userRole');
    const storedUserId = localStorage.getItem('userId');

    if (!user) {
      navigate('/login');
      return;
    }

    setUserEmail(user.email);
    setUserRole(role);
    setUserId(parseInt(storedUserId));

    // Load user data from database
    loadUserData(user.email);
  }, [navigate]);

  const loadUserData = async (email) => {
    try {
      const result = await getUserByEmail(email);
      if (result.success && result.data) {
        setFullName(result.data.nama_lengkap || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setAlert({ type: 'error', message: 'Nama lengkap tidak boleh kosong!' });
      return;
    }

    setIsLoadingProfile(true);
    try {
      const result = await updateUserProfile(userId, fullName.trim());
      
      if (result.success) {
        // Update localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        user.nama_lengkap = fullName.trim();
        localStorage.setItem('user', JSON.stringify(user));

        // Catat log
        await addLog({
          userEmail,
          userRole,
          action: 'update_profile',
          tokoId: null,
          tokoName: null,
          description: `${userRole === 'admin' ? 'Admin' : 'Owner'} mengubah nama lengkap menjadi "${fullName.trim()}"`
        });

        setAlert({ type: 'success', message: 'Profil berhasil diperbarui!' });
      } else {
        setAlert({ type: 'error', message: 'Gagal memperbarui profil: ' + result.error });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan: ' + error.message });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validasi
    if (!currentPassword) {
      setAlert({ type: 'error', message: 'Password saat ini harus diisi!' });
      return;
    }

    if (newPassword.length < 6) {
      setAlert({ type: 'error', message: 'Password baru minimal 6 karakter!' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'Konfirmasi password tidak cocok!' });
      return;
    }

    if (currentPassword === newPassword) {
      setAlert({ type: 'error', message: 'Password baru harus berbeda dengan password saat ini!' });
      return;
    }

    setIsLoadingPassword(true);
    try {
      const result = await changeUserPassword(userId, currentPassword, newPassword);
      
      if (result.success) {
        // Catat log
        await addLog({
          userEmail,
          userRole,
          action: 'change_password',
          tokoId: null,
          tokoName: null,
          description: `${userRole === 'admin' ? 'Admin' : 'Owner'} mengubah password akun`
        });

        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setAlert({ type: 'success', message: 'Password berhasil diubah! Silakan login kembali dengan password baru.' });

        // Auto logout setelah 2 detik
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        setAlert({ type: 'error', message: result.error });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Terjadi kesalahan: ' + error.message });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleLogout = async () => {
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
        userRole={userRole}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userRole={userRole}
        onLogout={handleLogout}
      />

      <div className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <SettingsIcon className="w-8 h-8 text-slate-600" />
              <h1 className="text-3xl font-bold text-slate-800">Pengaturan</h1>
            </div>
            <p className="text-slate-600">Kelola profil dan keamanan akun Anda</p>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Profil Saya</h2>
                <p className="text-sm text-slate-500">Perbarui informasi profil Anda</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-500"
                />
                <p className="text-xs text-slate-500 mt-1">Email tidak dapat diubah</p>
              </div>

              {/* Role (readonly) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Role
                </label>
                <input
                  type="text"
                  value={userRole === 'owner' ? 'Owner' : 'Admin'}
                  disabled
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-500 capitalize"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoadingProfile}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoadingProfile ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Ubah Password</h2>
                <p className="text-sm text-slate-500">Pastikan password Anda aman</p>
              </div>
            </div>

            {/* Security Warning */}
            <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 text-sm">Perhatian!</p>
                  <p className="text-amber-700 text-xs mt-1">
                    Setelah mengubah password, Anda akan logout otomatis dan harus login kembali dengan password baru.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                  placeholder="Masukkan password saat ini"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                  placeholder="Minimal 6 karakter"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Password harus minimal 6 karakter
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all outline-none"
                  placeholder="Ketik ulang password baru"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoadingPassword}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoadingPassword ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mengubah Password...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Ubah Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}