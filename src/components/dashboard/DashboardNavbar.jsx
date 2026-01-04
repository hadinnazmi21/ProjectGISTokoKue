// src/components/dashboard/DashboardNavbar.jsx
import { Menu, User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardNavbar({ onMenuClick, userEmail, userRole }) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-slate-200 shadow-md z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Menu Button untuk mobile */}
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>

          {/* Logo & Title */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
              🍰
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-slate-800">Toko Kue Dashboard</h1>
              <p className="text-xs text-slate-500">Kota Pekanbaru</p>
            </div>
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notification Bell (placeholder) */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{userEmail || 'User'}</p>
              <p className="text-xs text-slate-500 capitalize">{userRole || 'Admin'}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}