// src/pages/dashboard/Settings.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, User, Mail, Shield, Save, Key } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import CustomAlert from '../../components/dashboard/CustomAlert';
import { logoutUser } from '../../lib/SupabaseClient';

export default function Settings() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [alert, setAlert] = useState(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('userRole');

    if (!user) {
      navigate('/login');
      return;
    }

    setUserEmail(user.email);
    setUserRole(role);
    
    // Load user data if exists
    const savedName = localStorage.getItem('fullName');
    if (savedName) setFullName(savedName);
  }, [navigate]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    
    // Simple save to localStorage (untuk demo)
    localStorage.setItem('fullName', fullName);
    
    setAlert({ type: 'success', message: 'Profil berhasil diperbarui!' });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    // Validasi
    if (newPassword.length < 6) {
      setAlert({ type: 'error', message: 'Password minimal 6 karakter!' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'Konfirmasi password tidak cocok!' });
      return;
    }

    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setAlert({ type: 'success', message: 'Password berhasil diubah!' });
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
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Simpan Perubahan
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
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-5 h-5" />
                Ubah Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}