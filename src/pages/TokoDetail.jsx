// src/pages/TokoDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Calendar, Phone, Award } from 'lucide-react';
import { getTokoById } from '../lib/SupabaseClient';

export default function TokoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toko, setToko] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadToko();
  }, [id]);

  const loadToko = async () => {
    setIsLoading(true);
    try {
      const result = await getTokoById(id);
      if (result.success) {
        setToko(result.data);
      } else {
        console.error('Toko tidak ditemukan');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!toko) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Toko Tidak Ditemukan</h2>
          <button
            onClick={() => navigate('/map')}
            className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg"
          >
            Kembali ke Peta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with back button */}
      <div className="bg-white border-b-2 border-slate-200 sticky top-0 z-10">
        <div className="container py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/map')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Detail Toko</h1>
            <p className="text-sm text-slate-500">Informasi lengkap toko kue</p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="relative h-96">
              {toko.gambar ? (
                <img
                  src={`/images/${toko.gambar}`}
                  alt={toko.nama}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-9xl bg-gradient-to-br from-rose-100 to-pink-100">🍰</div>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl bg-gradient-to-br from-rose-100 to-pink-100">
                  {toko.produk === 'Kue' ? '🍰' : '🍫'}
                </div>
              )}

              {/* Rating Badge */}
              <div className="absolute top-6 right-6 px-4 py-2 bg-white/95 backdrop-blur rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xl font-bold text-slate-800">{toko.rating}</span>
                  <span className="text-slate-500">/5</span>
                </div>
              </div>

              {/* Produk Badge */}
              <div className="absolute top-6 left-6 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl shadow-lg">
                <span className="font-bold">{toko.produk}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Title */}
              <h1 className="text-4xl font-bold text-slate-800 mb-6">
                {toko.nama}
              </h1>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Lokasi */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Alamat</p>
                    <p className="text-slate-800 font-medium">{toko.jalan}</p>
                    <p className="text-sm text-slate-500">{toko.kelurahan}, {toko.kecamatan}</p>
                  </div>
                </div>

                {/* Jam Buka */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Jam Operasional</p>
                    <p className="text-slate-800 font-medium text-lg">{toko.jam_buka || toko.jamBuka}</p>
                    <p className="text-sm text-slate-500">Setiap hari</p>
                  </div>
                </div>

                {/* Tahun Berdiri */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Tahun Berdiri</p>
                    <p className="text-slate-800 font-medium text-lg">{toko.tahun_berdiri || toko.tahunBerdiri}</p>
                    <p className="text-sm text-slate-500">
                      {new Date().getFullYear() - (toko.tahun_berdiri || toko.tahunBerdiri)} tahun beroperasi
                    </p>
                  </div>
                </div>

                {/* Telepon */}
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Kontak</p>
                    <a
                      href={`tel:${toko.telp}`}
                      className="text-slate-800 font-medium text-lg hover:text-rose-600 transition-colors"
                    >
                      {toko.telp}
                    </a>
                    <p className="text-sm text-slate-500">Klik untuk menelepon</p>
                  </div>
                </div>
              </div>

              {/* Menu Favorit */}
              <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border-2 border-rose-100">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-6 h-6 text-rose-600" />
                  <h3 className="text-lg font-bold text-slate-800">Menu Favorit</h3>
                </div>
                <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text">
                  {toko.menu_favorit || toko.menuFavorit}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => window.open(`https://www.google.com/maps?q=${toko.lat},${toko.lng}`, '_blank')}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Lihat di Google Maps
                </button>
                <button
                  onClick={() => navigate('/map')}
                  className="flex-1 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Kembali ke Peta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}