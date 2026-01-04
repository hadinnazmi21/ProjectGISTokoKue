// src/pages/NotFound.jsx
import { Home, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative text-center max-w-2xl">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[200px] font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </div>

        {/* Emoji */}
        <div className="text-7xl mb-6 animate-bounce">
          🍰
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Halaman Tidak Ditemukan
        </h2>

        {/* Description */}
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak ditemukan. Mungkin halaman telah dipindahkan atau dihapus.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>

          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Ke Beranda
          </button>

          <button
            onClick={() => navigate('/map')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Lihat Peta
          </button>
        </div>

        {/* Fun Message */}
        <div className="mt-12 p-6 bg-white/80 backdrop-blur rounded-2xl border-2 border-slate-200 shadow-lg">
          <p className="text-sm text-slate-600">
            💡 <strong>Tip:</strong> Gunakan menu navigasi untuk menemukan halaman yang Anda butuhkan
          </p>
        </div>
      </div>
    </div>
  );
}